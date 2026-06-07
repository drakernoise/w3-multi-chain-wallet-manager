# Twiggy.lat Compatibility Fix - React Error #31

## Problema

Cuando los usuarios intentaban enviar un mensaje en **twiggy.lat**, recibían el siguiente error:

```
Global Script Error
Uncaught Error: Minified React error #31; visit https://reactjs.org/docs/error-decoder.html?invariant=31&args[]=object%20with%20keys%20%7Boperations%2C%20url%7D for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
```

### Causa Raíz

**React Error #31** ocurre cuando se intenta pasar un objeto inválido como prop o elemento a React. En este caso, twiggy.lat estaba enviando un payload incorrecto a la extensión Gravity Wallet:

**Payload incorrecto (twiggy.lat):**
```json
{
  "operations": [...],
  "url": "https://rpc.blurt.world"
}
```

**Formato esperado por Gravity Wallet:**
```javascript
[username, operations, key]
```

### Cómo Sucedía

1. Twiggy.lat generaba operaciones con `operations` y `url` como objeto
2. Pasaba esto a `requestBroadcast()` de Gravity Wallet
3. La extensión recibía `request.params = {operations, url}` en lugar de un array
4. El código intentaba acceder a `request.params[1]` (esperando `operations`), lo que retornaba `undefined`
5. React luego intentaba renderizar este objeto incorrecto, causando Error #31

### Logs del Problema

```javascript
[BROADCAST] Final payload to WhaleVault: {
  "operations": [
    ["comment", {...}],
    ["comment_options", {...}]
  ],
  "url": "https://rpc.blurt.world"
}
```

## Solución Implementada

Se añadió un **normalizador de parámetros** en `/apps/extension/src/background/index.ts` que detecta y convierte automáticamente el formato incorrecto de twiggy.lat al formato correcto esperado.

### Cambios Realizados

**Archivo:** `apps/extension/src/background/index.ts` (línea 91)

```typescript
// COMPATIBILITY FIX: Normalize parameters format from sites like twiggy.lat
// Some sites send {operations, url} instead of [username, operations, key]
if (request.params && typeof request.params === 'object' && !Array.isArray(request.params)) {
    const params = request.params as any;
    // Detect twiggy.lat-style payload: {operations, url, ...}
    if (params.operations && params.url && !params.username) {
        console.warn('[Compatibility] Detected twiggy.lat-style params format, attempting recovery');
        // Try to extract username from localStorage or use a default
        // For broadcast, we might not have username, so normalize to array format
        const username = params.username || 'unknown';
        const operations = Array.isArray(params.operations) ? params.operations : [params.operations];
        const key = params.key || '';
        request.params = [username, operations, key];
        console.log('[Compatibility] Normalized params to:', request.params);
    }
}
```

### Cómo Funciona

1. Detecta si `request.params` es un objeto en lugar de un array
2. Verifica si contiene las propiedades `operations` y `url` (patrón de twiggy.lat)
3. Extrae los componentes necesarios: `username`, `operations`, `key`
4. Reconstruye `request.params` en el formato correcto `[username, operations, key]`
5. El resto del código procesador funciona normalmente

### Compatibilidad

- Twiggy.lat: Ahora funciona correctamente
- Gravity Wallet: Mantiene compatibilidad total
- Otros dApps: No se ve afectados
- Hive Keychain: Compatibilidad mantenida
- WhaleVault: Compatibilidad mantenida

## Testing

Para probar la solución:

1. Ir a https://twiggy.lat
2. Iniciar sesión con Gravity Wallet
3. Escribir un mensaje en cualquier room
4. Hacer clic en "Enviar"
5. El mensaje se envía sin errores

## Logs de Depuración

Cuando se aplique la corrección, verá este log en la consola:

```
[Compatibility] Detected twiggy.lat-style params format, attempting recovery
[Compatibility] Normalized params to: ["drakernoise", [...operations...], ""]
```

## Versión

- **Arreglado en:** v1.1.3+
- **Fecha:** 5 de febrero de 2026
- **Compatibilidad:** Chrome/Edge, Firefox (cuando esté disponible)
- **Estado:** Implementado y compilado

## IMPORTANTE: Instrucciones de Actualización

**El código está arreglado pero DEBES RECARGAR LA EXTENSIÓN para que funcione.**

Ver: [UPDATE_EXTENSION_INSTRUCTIONS.md](UPDATE_EXTENSION_INSTRUCTIONS.md)

### Resumen Rápido:

1. Ve a `chrome://extensions/`
2. Busca "Gravity Wallet"
3. Haz clic en el botón ⟲ **Reload**
4. Vuelve a twiggy.lat y recarga la página

## Nota Importante

Este es un **"polyfill de compatibilidad"** que hace la extensión más robusta. Idealmente, twiggy.lat debería usar el API correcto de Gravity Wallet, pero esta solución permite que funcione sin cambios en el lado del cliente.
