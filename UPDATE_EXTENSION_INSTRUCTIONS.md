# 🔧 Cómo Actualizar Gravity Wallet para Arreglar Twiggy.lat

## 🔴 El Problema Persiste

Si aún ves el error React #31 en twiggy.lat es porque **la extensión compilada no ha sido cargada en tu navegador**.

## ✅ Solución: Recargar la Extensión

### Opción 1: Recargar Extensión en Chrome/Edge (RECOMENDADO)

1. **Abre la página de extensiones:**
   - Ve a: `chrome://extensions/` (Chrome) o `edge://extensions/` (Edge)

2. **Busca "Gravity Wallet"** o similar en la lista

3. **Busca el botón ⟲ (Reload/Recargar)** en la esquina inferior derecha de la extensión

4. **Haz clic en el botón Reload**

5. **Vuelve a twiggy.lat** y recarga la página (`F5` o `Ctrl+Shift+R`)

6. **Intenta enviar un mensaje** - debería funcionar ahora ✅

### Opción 2: Desinstalar y Reinstalar

Si la opción 1 no funciona:

1. Ve a `chrome://extensions/`
2. En "Gravity Wallet", busca el botón **Remove** (Eliminar)
3. Instala nuevamente desde:
   - Chrome Web Store, O
   - Carga desde carpeta local si tienes la compilación

### Opción 3: Desarrollo Local (Si Compilaste Localmente)

Si compilaste la extensión tú mismo:

1. Asegúrate de que ejecutaste:
   ```bash
   cd apps/extension
   npm run build
   ```

2. Recarga desde la carpeta `apps/extension/dist/`

## 📊 Cómo Verificar que la Solución Está Activa

1. **Abre Chrome DevTools** en twiggy.lat:
   - Presiona `F12` o `Ctrl+Shift+I`
   
2. **Busca en la consola** estos logs cuando intentes enviar:
   ```
   [Gravity] Received request - Method: requestBroadcast, Params type: object
   [Compatibility] ⚠️ DETECTED TWIGGY.LAT FORMAT! Converting...
   [Compatibility] ✓ Normalized params: ["unknown_broadcast_user", [...], ""]
   ```

3. **Si VES estos logs** = La corrección está activa ✅

4. **Si NO los ves** = La extensión aún no se recargó. Repite el proceso de recarga.

## 🎯 Testing Manual

Una vez recargues:

1. Ve a https://twiggy.lat
2. Inicia sesión con Gravity Wallet
3. Escribe un mensaje simple como: "Test message"
4. Haz clic en enviar
5. **Resultado esperado:**
   - ✅ El mensaje se envía sin errores
   - ✅ Ves los logs `[Compatibility]` en la consola
   - ✅ No hay React error #31

## 🐛 Si Aún Hay Problemas

Si después de recargar AÚN ves el error:

1. **Vacía el caché de la extensión:**
   - En `chrome://extensions/`, activa "Developer mode" (esquina arriba-derecha)
   - Luego recarga

2. **Verifica que sea la versión correcta:**
   - En `chrome://extensions/`, busca "Gravity Wallet"
   - Debería mostrar versión `1.1.3` o superior
   - Si muestra versión `1.1.2`, necesitas actualizar desde Web Store

3. **Contacta con soporte:**
   - Comparte los logs de consola
   - Especifica tu versión de Chrome/Edge
   - Menciona si es extensión de Web Store o compilada localmente

## 📝 Cambios Técnicos en v1.1.3+

La extensión ahora incluye un **normalizador automático de parámetros** que:

- Detecta cuando twiggy.lat envía `{operations, url}` 
- Convierte automáticamente al formato correcto: `[username, operations, key]`
- Registra los cambios en consola para debugging
- Funciona transparentemente sin que el usuario tenga que hacer nada

## ✨ Resumen

| Paso | Acción | Resultado |
|------|--------|-----------|
| 1 | Recarga la extensión (chrome://extensions) | Extensión actualizada |
| 2 | Recarga twiggy.lat (F5) | Página con nueva extensión |
| 3 | Intenta enviar mensaje | ✅ Funciona sin errores |
| 4 | Verifica consola (F12) | Ver logs `[Compatibility]` |

¡Listo! 🎉
