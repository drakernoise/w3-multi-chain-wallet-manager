# Reglas para el Agente

- **Eficiencia**: El agente debe evitar malgastar cuota (tokens) en su operativa, buscando la manera más eficiente de lograr los objetivos y evitando loops innecesarios.
- **Sin Emojis**: Evitar a toda costa el uso de emojis en el código y en los comandos que se ejecutan en terminal.
- **Autorización Previa**: No ejecutar cambios en el código a menos que se haya solicitado explícitamente o figure en un plan de acción previamente autorizado por el usuario.
- **Sin Stubs/Hardcodes**: Evitar siempre stubs y hardcodes en el código, a menos que sea estrictamente necesario y previa aprobación del usuario.
- **Ubicación de Scripts**: Si hay que generar scripts o utilidades, hacerlo en la carpeta adecuada.
- **Limpieza de Raíz**: Evitar siempre que sea posible almacenar archivos innecesarios en la carpeta raíz del proyecto.
- **Directorio Core**: Los archivos del core de la aplicación residirán en la carpeta 'core'.
- **Verificación de Rutas**: Verificar siempre que las rutas son correctas, evitando así que falle el código.


## 4. Sincronización de Código (Git)

### 💾 Persistencia de Cambios
Cualquier cambio que haya sido **probado y validado** en el servidor debe ser persistido inmediatamente en el repositorio.

1. **Pull (Local)**: Antes de empezar, asegurar que el entorno local está actualizado.
   ```bash
   git pull origin main
   ```
2. **Push (Dev -> Repo)**: Tras verificar que el código funciona en el servidor (via `scp`), subirlo al repo.
   ```bash
   git add .
   git commit -m "feat: descripción del cambio validado"
   git push origin main
   ```
3. **Deploy (Repo -> Server)**: Idealmente, el servidor debería actualizarse vía `git pull`, aunque `scp` se acepta para hotfixes rápidos siempre que **luego** se haga el push.
