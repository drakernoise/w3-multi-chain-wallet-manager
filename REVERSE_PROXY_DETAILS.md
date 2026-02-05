# Detalle Técnico: Proxy Inverso y WSS (Secure WebSockets)

Para que el chat funcione en una extensión de Chrome de forma segura, el navegador exige que todas las conexiones sean cifradas. Aquí explicamos por qué y cómo configurarlo en el servidor AX42.

## El Flujo de Conexión
Sin un proxy, la extensión intentaría conectar a `http://136.243.80.162:3030`. Chrome bloquearía esto por no ser seguro. Con el proxy, el flujo es:

1. **Extensión**: Solicita conexión a `wss://chat.gravitywallet.drakernoise.com` (Puerto 443).
2. **Nginx (Hetzner)**: Recibe la conexión cifrada, valida el certificado SSL.
3. **Nginx**: "Desencripta" internamente y pasa la comunicación al contenedor Docker en `http://localhost:3030`.
4. **Respuesta**: El camino de vuelta se cifra de nuevo antes de salir del servidor.

## ¿Qué es WSS y por qué es especial?
WSS es el equivalente a HTTPS para WebSockets. A diferencia de una web normal, los WebSockets empiezan como una petición HTTP y luego se "elevan" (Upgrade) a una conexión persistente.

Nginx necesita reglas específicas para no cortar esta conexión.

### Ejemplo de Configuración Nginx (`/etc/nginx/sites-available/chat.gravitywallet.drakernoise.com`)

```bash
sudo nano /etc/nginx/sites-available/chat.gravitywallet.drakernoise.com
```

```nginx
# (Pega la configuración que te di en REVERSE_PROXY_DETAILS.md)

server {
    listen 80;
    server_name chat.gravitywallet.drakernoise.com;
    return 301 https://$host$request_uri; # Redirigir todo a HTTPS
}

server {
    listen 443 ssl;
    server_name chat.gravitywallet.drakernoise.com;

    # Certificados gestionados por Certbot (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/chat.tunombre.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.tunombre.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3030; # Dirección interna del contenedor Docker
        
        # CABECERAS CRÍTICAS PARA WSS
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Cabeceras para que el servidor Node sepa la IP real del usuario
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## El Rol de Certbot (Let's Encrypt)
Certbot es una herramienta gratuita que:
1. Se comunica con Let's Encrypt para validar que eres el dueño del dominio.
2. Genera los certificados SSL automáticamente.
3. Modifica tu configuración de Nginx para activarlos.
4. **Lo mejor**: Se programa para renovar los certificados cada 3 meses automáticamente, por lo que nunca caducan.

## Beneficios para Gravity Wallet
- **Seguridad**: Los mensajes viajan cifrados desde el ordenador del usuario hasta tu servidor.
- **Compatibilidad**: Cumple con las políticas de seguridad de Chrome (Content Security Policy).
- **Escalabilidad**: Si mañana quieres añadir otro servicio, solo creas otro archivo de configuración en Nginx sin tocar el chat.

## ¿Por qué abrir el Puerto 80? (Tu pregunta)
Sí, el puerto 80 debe estar abierto en el firewall del servidor por dos razones principales:

1.  **Redirección Automática**: Para que si alguien (o un servicio) intenta conectar por `http`, el servidor le diga "vete a `https`" inmediatamente. Así evitamos errores de conexión.
2.  **Validación de Certbot**: Cuando Let's Encrypt va a renovar tu certificado SSL cada 3 meses, hace una "llamada de control" a través del puerto 80 para confirmar que el servidor sigue bajo tu control. Si el puerto 80 está cerrado, la renovación fallará y el chat dejará de funcionar cuando el certificado caduque.

**Nota de Seguridad**: Abrir el puerto 80 **no** hace que tu servidor sea inseguro, ya que Nginx solo tiene una instrucción: redirigir. No hay datos sensibles viajando por ese puerto; solo sirve de puente hacia el puerto seguro (443).

## Requerimientos del Subdominio

La respuesta corta es: **El subdominio es estándar a nivel de DNS, pero la configuración es "especial" dentro de Nginx.**

### 1. A nivel de DNS (Dominio)
No necesitas nada especial. Solo tienes que crear un registro tipo **A** que apunte a la IP de tu servidor Hetzner.
*   **Nombre**: `chat` (o el que elijas)
*   **Tipo**: `A`
*   **Valor**: `136.243.80.162`
*   **TTL**: Estándar (ej: 3600)

### 2. A nivel de Nginx (Servidor)
Aquí es donde reside la diferencia. Como el chat usa WebSockets (Socket.io), la configuración de Nginx debe incluir las cabeceras de "Upgrade" que mencionamos arriba:
```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```
Sin estas líneas, una web normal funcionaría, pero el chat daría error de conexión constante.

### 3. Certificado SSL
Certbot tratará este subdominio como cualquier otro. No hay costes extra ni procesos diferentes por ser un servidor de chat.

**En resumen**: Elige el nombre que quieras, apunta el registro A en tu panel de dominio (Cloudflare, GoDaddy, etc.) y Nginx se encargará del resto.

**¿Tienes ya un subdominio apuntando a la IP de Hetzner o necesitas ayuda para decidir cuál usar?**
