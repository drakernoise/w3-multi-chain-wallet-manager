# Mejoras de Chat (2026-02-07)

## Resumen
Se aplicaron correcciones y mejoras de estabilidad en el chat de la extensión para:
- Evitar cierres inesperados de DMs.
- Corregir renderizado de mensajes propios cifrados.
- Asegurar selección estable de nodo RPC Blurt.
- Actualizar configuración de WebSocket/Offscreen.
- Reducir logs ruidosos en consola.

## Cambios principales

### 1) DMs: cierre inesperado y estados obsoletos
- Se añadió un **grace period** para evitar cierre del DM durante refrescos de rooms.
- Se usa un `ref` para evitar cierres por closures obsoletas (`activeRoomIdRef`).
- Se limpia `activeRoomId` al cargar si la room ya no existe.
- Resultado: cuando el otro usuario cierra el DM, el chat vuelve a la lista correctamente.

### 2) Mensajes propios cifrados
- Ahora se usa `contentForSender` cuando existe para desencriptar mensajes propios.
- Resultado: desaparece el texto "Encrypted Message - Cannot Decrypt" en mensajes propios.

### 3) Selección de nodo RPC Blurt
- Se prioriza el nodo primario `https://rpc.drakernoise.com` si responde.
- Solo si falla, se elige otro nodo de fallback.

### 4) Offscreen + CSP
- Se añadió permiso `offscreen` en manifest.
- Se actualizó CSP para permitir `https://chat.gravitywallet.drakernoise.com` y `wss://chat.gravitywallet.drakernoise.com`.
- Se protegió el uso de `chrome.offscreen` con guardas.

### 5) Correcciones UI menores
- Se eliminó el margen derecho en la vista del chat.
- Se evitó renderizar `0` en nombres de rooms cuando `unreadCount` es 0.

### 6) Logs
- Se redujo un log de error a `warn` para claves de cifrado faltantes del remitente.

## Archivos impactados
- `packages/shared/components/ChatView.tsx`
- `packages/shared/services/chatService.ts`
- `packages/shared/services/nodeService.ts`
- `apps/extension/src/background/index.ts`
- `apps/extension/public/manifest.json`
- `apps/extension/src/content/provider.ts`

## Notas
Si el chat vuelve a quedarse en "connecting", revisar:
- Identidad local (`gravity_chat_username`, `gravity_chat_priv`).
- CSP y permisos del manifest.
- Disponibilidad de `chat.gravitywallet.drakernoise.com`.
