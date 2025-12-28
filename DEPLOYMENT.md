# Despliegue de Gravity Chat Server

He preparado este repositorio para que puedas desplegar el servidor de chat en la nube de forma sencilla. El servidor es un servicio independiente de Node.js que vive en la carpeta `/chat-server`.

## Opción Recomendada: Render.com (Gratis/Free Tier)

Render es excelente porque detectará automáticamente el archivo `render.yaml` que he creado en la raíz.

### Pasos para el primer despliegue:

1.  **Sube este código a GitHub**: Asegúrate de haber hecho `push` de los últimos cambios (incluyendo `render.yaml` y la carpeta `dist`).
2.  **Crea una cuenta en [Render.com](https://render.com)**.
3.  **Nuevo Blueprint**: En el panel de Render, haz clic en **"New +"** y selecciona **"Blueprint"**.
4.  **Conecta GitHub**: Selecciona tu repositorio de Gravity Wallet.
5.  **Aprobar**: Render leerá el archivo `render.yaml` y te mostrará que va a crear un servicio llamado `gravity-chat-server`. Dale a **"Apply"**.
6.  **Espera a que termine**: Una vez que el estado sea "Live", Render te dará una URL (ej: `https://gravity-chat-server.onrender.com`).

## Vincular la Extensión con la Nube

Una vez que tengas tu URL de Render:

1.  Abre `services/chatService.ts` en tu editor.
2.  Busca la línea donde definimos `BACKEND_URL` (alrededor de la línea 48).
3.  Cambia `'http://localhost:3030'` por tu nueva URL de Render (con `https://`).
4.  Ejecuta `npm run build` en la raíz del proyecto para generar el nuevo `/dist`.
5.  Recarga la extensión en Chrome.

---

### Notas sobre el plan gratuito de Render:
- **Spin-down**: Si no hay actividad, el servidor entra en "reposo". El primer usuario que entre al chat tardará unos 30-50 segundos en conectar mientras el servidor "despierta".
- **Persistencia**: En el plan gratuito, los mensajes y usuarios se borrarán si el servidor se reinicia (cada vez que subas código nuevo). Para evitarlo, Render ofrece "Disks" (discos persistentes) por un pequeño precio mensual.
