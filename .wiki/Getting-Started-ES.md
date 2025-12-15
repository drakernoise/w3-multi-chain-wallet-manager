# Primeros Pasos con Gravity Wallet

## Instalación

### Chrome/Brave/Edge

1. **Descargar la Extensión**
   - Clona el repositorio o descarga la última versión
   ```bash
   git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.git
   cd w3-multi-chain-wallet-manager
   ```

2. **Compilar la Extensión**
   ```bash
   npm install
   npm run build
   ```

3. **Cargar en el Navegador**
   - Abre Chrome y navega a `chrome://extensions/`
   - Activa el "Modo de desarrollador" (interruptor en la esquina superior derecha)
   - Haz clic en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta `dist` del directorio del proyecto

4. **Anclar la Extensión**
   - Haz clic en el icono de puzzle en la barra de herramientas
   - Encuentra "Gravity Wallet" y haz clic en el icono de pin

## Configuración Inicial

### Creando Tu Primera Billetera

1. **Iniciar Gravity Wallet**
   - Haz clic en el icono de Gravity Wallet en la barra de herramientas
   - Verás la pantalla de bienvenida

2. **Establecer una Contraseña Maestra**
   - Elige una contraseña fuerte (mínimo 8 caracteres)
   - Esta contraseña cifra los datos de tu billetera
   - **Importante**: Guarda esta contraseña de forma segura - ¡no se puede recuperar!

3. **Importar Tu Primera Cuenta**
   - Haz clic en el botón "+ Añadir"
   - Selecciona la blockchain (Hive, Steem o Blurt)
   - Introduce los detalles de tu cuenta:
     - **Usuario**: Tu nombre de usuario en la blockchain
     - **Clave de Publicación**: Para acciones sociales (posts, votos, comentarios)
     - **Clave Activa**: Para transacciones financieras (transferencias, power up/down)
     - **Clave de Memo**: Para mensajes cifrados (opcional)

4. **Verificar Importación**
   - La billetera validará tus claves contra la blockchain
   - Si tiene éxito, verás el saldo de tu cuenta

## Entendiendo los Tipos de Claves

### Clave de Publicación (Posting Key)
- **Usada para**: Crear posts, votar, comentar, seguir
- **Nivel de Seguridad**: Medio
- **Recomendación**: Segura para guardar en la billetera para uso diario

### Clave Activa (Active Key)
- **Usada para**: Transferencias, power up/down, delegaciones
- **Nivel de Seguridad**: Alto
- **Recomendación**: Solo importar si necesitas hacer transferencias

### Clave de Memo (Memo Key)
- **Usada para**: Cifrar/descifrar mensajes privados
- **Nivel de Seguridad**: Bajo
- **Recomendación**: Opcional, importar solo si es necesario

## Guía de Inicio Rápido

### Ver Tu Saldo

1. Haz clic en el nombre de tu cuenta en la billetera
2. Verás:
   - **Saldo Principal**: HIVE/STEEM/BLURT
   - **Saldo Secundario**: HBD/SBD (para Hive/Steem)
   - **Powered Up**: Tokens invertidos (HP/SP/BP)

### Enviar Tu Primera Transferencia

1. **Seleccionar Cuenta**: Haz clic en la cuenta desde la que quieres enviar
2. **Clic en "Enviar"**: Abre el modal de transferencia
3. **Introducir Detalles**:
   - **Para**: Nombre de usuario del destinatario (sin @)
   - **Cantidad**: Número de tokens a enviar
   - **Token**: Selecciona HIVE/HBD o STEEM/SBD
   - **Memo**: Mensaje opcional (cifrado si empieza con #)
4. **Confirmar**: Revisa y haz clic en "Enviar"
5. **Aprobar**: Confirma en la ventana emergente

### Recibir Fondos

1. Haz clic en el botón "Recibir"
2. Se muestra tu nombre de usuario con un código QR
3. Comparte tu nombre de usuario con el remitente
4. Los fondos aparecerán automáticamente en tu saldo

## Usar con dApps

### Conectar con PeakD

1. **Navegar a PeakD**: Ve a [peakd.com](https://peakd.com)
2. **Clic en Iniciar Sesión**: Selecciona la opción "Hive Keychain"
3. **Gravity Wallet se Activa**: Aparecerá una ventana emergente
4. **Aprobar Conexión**: Haz clic en "Aprobar" para conectar
5. **Empezar a Usar**: Ahora puedes publicar, votar y comentar

### Conectar con Otras dApps

Gravity Wallet es compatible con cualquier dApp que soporte la API de Hive Keychain:
- **Ecency**: Plataforma de blogging social
- **Tribaldex**: Intercambio de tokens
- **Splinterlands**: Juegos
- **¡Y muchas más!**

## Mejores Prácticas de Seguridad

### Seguridad de Contraseña
- ✅ Usa una contraseña única y fuerte
- ✅ Nunca compartas tu contraseña
- ✅ Guarda la contraseña en un gestor de contraseñas
- ❌ No uses la misma contraseña que otros servicios

### Gestión de Claves
- ✅ Solo importa las claves que necesites
- ✅ Mantén una copia de seguridad de tus claves offline
- ✅ Usa la clave de publicación para actividades diarias
- ❌ No compartas tus claves privadas con nadie

### Seguridad del Navegador
- ✅ Mantén tu navegador actualizado
- ✅ Solo instala extensiones de fuentes confiables
- ✅ Bloquea tu billetera cuando no la uses
- ❌ No uses en ordenadores públicos/compartidos

## Próximos Pasos

- [Guía de Usuario](User-Guide-ES) - Aprende todas las características en detalle
- [Características Avanzadas](Advanced-Features-ES) - Transferencias masivas, MultiSig y más
- [Solución de Problemas](Troubleshooting-ES) - Problemas comunes y soluciones

## ¿Necesitas Ayuda?

- **GitHub Issues**: [Reportar problemas](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Discusiones**: [Hacer preguntas](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
