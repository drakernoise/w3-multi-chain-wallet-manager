# Reporte Técnico: Habilitación de Chat en Hetzner

## Estado Actual
- **Plataforma**: Render.com (Plan Free).
- **Limitaciones**:
  - **Latencia de inicio**: El servidor "se duerme" tras 15 min de inactividad, tardando ~40s en despertar.
  - **Efimeridad**: Los datos (mensajes/usuarios) se pierden en cada despliegue o reinicio del contenedor.
  - **Ubicación**: Frankfurt (Alemania), pero en infraestructura compartida.

## Propuesta: Migración a Hetzner AX42
El servidor AX42 del usuario (`136.243.80.162`) es ideal por su potencia y control total.

### Beneficios
1. **Sin Spin-down**: Disponibilidad 24/7 sin esperas.
2. **Persistencia Total**: Uso de volúmenes de Docker para que los mensajes nunca se borren.
3. **Consolidación**: Menos dependencias externas (Render).

### Requerimientos Críticos
- **Dominio y SSL**: Las extensiones de Chrome bloquean conexiones HTTP/WS a servidores externos. Necesitamos un subdominio y un certificado SSL (Let's Encrypt).
- **Docker**: El servidor ya usa Docker para Blurt Witness, por lo que integrar el chat es trivial.

## Acciones Inmediatas
He preparado el plan de implementación para:
1. Crear el `Dockerfile`.
2. Preparar el servidor para recibir variables de entorno.
3. Actualizar la extensión con la nueva URL.

## Guía de Despliegue en Hetzner (AX42)

Sigue estos pasos dentro de tu servidor AX42:

### 1. Clonar/Actualizar Repositorio
```bash
cd /opt/
# Si no está clonado (aunque parece que ya tienes cosas de Blurt allí):
# git clone https://github.com/tu-usuario/web3-multi-chain-wallet.git
cd web3-multi-chain-wallet/chat-server
git pull origin main
```

### 2. Configurar y Lanzar el Contenedor
```bash
docker compose up -d --build
```
*Esto levantará el servidor en el puerto 3030.*

### Server URL
The new production chat server is located at:
`https://chat.gravitywallet.drakernoise.com` (Hetzner production server)

### 3. Configurar Nginx y Let's Encrypt
```bash
# Crear configuración
sudo nano /etc/nginx/sites-available/chat.gravitywallet.drakernoise.com

# (Pega la configuración que te di en REVERSE_PROXY_DETAILS.md)

# Activar sitio
sudo ln -s /etc/nginx/sites-available/chat.gravitywallet.drakernoise.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Obtener certificado SSL
sudo certbot --nginx -d chat.gravitywallet.drakernoise.com
```

### 4. Verificar Conexión
Una vez Nginx esté listo, la extensión debería conectar automáticamente. Puedes verificar logs con:
```bash
docker logs -f gravity-chat-server
```

**¿Deseas que prepare un script automatizado `deploy_chat.sh` para simplificar esto?**


**¿Deseas que proceda con la creación de los archivos de configuración localmente antes de desplegar?**
