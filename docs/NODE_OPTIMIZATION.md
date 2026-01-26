# Optimización de Nodo RPC Blurt

## Análisis Actual

**Tu nodo:** `https://rpc.drakernoise.com`
- Latencia actual: **359ms**
- Ranking: 2º lugar (63ms más lento que el primero)
- Estado: ✅ Funcionando correctamente

**Objetivo:** Reducir la latencia para competir con `rpc.beblurt.com` (296ms)

---

## Optimizaciones Recomendadas

### 1. **Configuración de Nginx (Si usas Nginx como proxy)**

```nginx
# /etc/nginx/sites-available/rpc.drakernoise.com

server {
    listen 443 ssl http2;
    server_name rpc.drakernoise.com;

    # SSL configuration (tu configuración actual)
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # HTTP/2 y compresión
    http2_max_field_size 16k;
    http2_max_header_size 32k;
    
    # Compresión gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Keep-alive para conexiones persistentes
    keepalive_timeout 65;
    keepalive_requests 100;

    # Buffer sizes optimizados
    client_body_buffer_size 128k;
    client_max_body_size 10m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 16k;

    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;

    # Caché para respuestas estáticas (si aplica)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy al backend de Blurt
    location / {
        proxy_pass http://127.0.0.1:8090;  # Ajusta el puerto según tu configuración
        
        # Headers importantes
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Optimizaciones de proxy
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }
}
```

### 2. **Optimización del Servidor Blurt (steemd/blurtd)**

Si tienes acceso a la configuración del nodo Blurt:

```ini
# config.ini optimizado

# Reducir logs innecesarios
log-level = info  # En lugar de debug

# Optimizar conexiones
webserver-thread-pool-size = 4  # Ajustar según CPU
webserver-http-request-timeout-ms = 10000

# Caché de consultas frecuentes
enable-account-history-api = true
account-history-track-account-range = ["", ""]

# Optimización de base de datos
shared-file-size = 54G  # Ajustar según RAM disponible
shared-file-full-threshold = 98
shared-file-scale-rate = 1000
```

### 3. **Optimización del Sistema Operativo**

```bash
# Aumentar límites de conexiones
echo "* soft nofile 65535" >> /etc/security/limits.conf
echo "* hard nofile 65535" >> /etc/security/limits.conf

# Optimizar TCP
cat >> /etc/sysctl.conf << EOF
# Optimización de red TCP
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_keepalive_intvl = 15
EOF

sysctl -p
```

### 4. **Caché de Respuestas Frecuentes**

Implementar caché Redis/Memcached para consultas frecuentes:

```python
# Ejemplo con Redis (si usas un wrapper)
import redis
import json
import time

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cached_get_dynamic_global_properties():
    cache_key = "dgp"
    cached = redis_client.get(cache_key)
    
    if cached:
        return json.loads(cached)
    
    # Obtener de la base de datos
    result = get_dynamic_global_properties_from_db()
    
    # Cachear por 3 segundos (las propiedades cambian frecuentemente)
    redis_client.setex(cache_key, 3, json.dumps(result))
    
    return result
```

### 5. **CDN o Servidor Más Cercano**

Si tu servidor está lejos geográficamente de la mayoría de usuarios:
- Considera usar Cloudflare o similar para CDN
- O mover el servidor a una ubicación más central (Europa, US Este)

### 6. **Monitoreo y Análisis**

```bash
# Instalar herramientas de monitoreo
# 1. nginx status module para ver conexiones activas
# 2. Prometheus + Grafana para métricas
# 3. Logs estructurados para análisis

# Verificar latencia desde diferentes ubicaciones
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://rpc.drakernoise.com
```

### 7. **Optimización de Base de Datos**

Si usas PostgreSQL/MySQL para índices:

```sql
-- Asegurar índices en tablas frecuentemente consultadas
CREATE INDEX IF NOT EXISTS idx_accounts_name ON accounts(name);
CREATE INDEX IF NOT EXISTS idx_blocks_num ON blocks(block_num);
CREATE INDEX IF NOT EXISTS idx_transactions_block_num ON transactions(block_num);
```

---

## Checklist de Implementación

- [ ] Configurar Nginx con HTTP/2 y compresión gzip
- [ ] Habilitar keep-alive en Nginx
- [ ] Optimizar parámetros TCP del sistema
- [ ] Implementar caché Redis para consultas frecuentes
- [ ] Reducir nivel de logs (info en lugar de debug)
- [ ] Verificar índices de base de datos
- [ ] Monitorear latencia después de cada cambio
- [ ] Considerar CDN si la ubicación es el problema

---

## Métricas Esperadas

**Antes de optimización:**
- Latencia: 359ms

**Después de optimización (objetivo):**
- Latencia: < 300ms (competir con el primero)
- Reducción esperada: ~60-100ms

---

## Herramientas de Prueba

```bash
# Probar latencia desde tu servidor
time curl -X POST https://rpc.drakernoise.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"condenser_api.get_dynamic_global_properties","params":[],"id":1}'

# Comparar con otros nodos
for node in rpc.beblurt.com rpc.blurt.world; do
  echo "Testing $node:"
  time curl -X POST https://$node \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"condenser_api.get_dynamic_global_properties","params":[],"id":1}'
done
```

---

## Notas Importantes

1. **Caché con precaución:** Las propiedades globales cambian frecuentemente, usa TTL cortos (3-5 segundos)
2. **Monitoreo continuo:** Implementa alertas si la latencia aumenta
3. **Backup antes de cambios:** Siempre haz backup de configuraciones antes de modificar
4. **Pruebas incrementales:** Implementa cambios uno a la vez y mide el impacto

---

## Soporte

Si necesitas ayuda con alguna configuración específica, comparte:
- Sistema operativo del servidor
- Stack tecnológico (Nginx, Apache, etc.)
- Configuración actual del nodo Blurt
- Logs de rendimiento actuales
