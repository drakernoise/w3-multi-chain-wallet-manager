# 🗳️ Gravity Wallet - Configuración de Autenticación y 2FA

Esta guía detalla las opciones de autenticación implementadas en la versión 1.0.5+, incluyendo el soporte para múltiples métodos de Segundo Factor (2FA).

## 🔐 Métodos de Autenticación Soportados

La bóveda (Vault) de Gravity Wallet puede desbloquearse mediante:

1.  **Contraseña Maestra:** Método tradicional de desencriptación.
2.  **PIN de Seguridad (6 dígitos):** Método rápido para el día a día.
3.  **Biometría (WebAuthn):** TouchID, FaceID o Windows Hello.
4.  **Autenticador TOTP:** Aegis, Google Authenticator, Authy, etc.
5.  **Sin Contraseña (Google/Dispositivo):** ¡NUEVO! Regístrate y entra sin contraseña maestra usando tu cuenta de Google o llaves de hardware.

---

## 🚀 NUEVO: Flujo Sin Contraseña (Google & Device Key)

A partir de la versión 1.0.6, puedes elegir inicializar tu billetera sin necesidad de una contraseña maestra.

### Cómo funciona:
- **Google Sign-In:** Utiliza Google OAuth para derivar una llave de encriptación segura para tu bóveda local.
- **Device Key:** Utiliza el hardware local (TPM/Secure Enclave) para asegurar una llave maestra generada.

Esto proporciona una experiencia de usuario similar a la "web2" manteniendo la seguridad no-custodia.

---

## 🛡️ Configuración de Autenticador (TOTP)

La funcionalidad TOTP permite desbloquear la extensión utilizando un código temporal de 6 dígitos generado por una app externa. Esto reemplaza la necesidad de escribir la contraseña maestra constantemente.

### Cómo habilitarlo:

1.  Abre la extensión y desbloquéala.
2.  Ve a la pestaña **Manage Accounts** (Icono de engranaje).
3.  Abajo del todo, en la sección **Security**, pulsa **"Authenticator App (2FA)"**.
4.  Se mostrará un código QR y una clave secreta.

### 📱 Uso Multi-Dispositivo (Aegis + Google Auth a la vez)

Puedes configurar múltiples aplicaciones o dispositivos para que generen el mismo código válido.

**Pasos para sincronizar:**

1.  No cierres la ventana del código QR en la extensión.
2.  Abre **Aegis** en tu móvil y escanea el QR.
3.  Abre **Google Authenticator** (o cualquier otra app en otro dispositivo) y escanea **el mismo QR**.
4.  Comprueba que ambas apps generan el mismo código de 6 dígitos.
5.  Introduce el código en la extensión para confirmar y guardar.

> **Nota Técnica:** Al confirmar el código, la extensión migra internamente la encriptación de la bóveda a un sistema de claves de dispositivo (`device_auth`), permitiendo el desbloqueo sin contraseña maestra.

---

## 🚦 Indicador de Fortaleza de Contraseña

Durante la creación de una nueva billetera (o reinicio completo), se incluye un medidor de seguridad:

- **Análisis:** Evalúa longitud (>8, >12), mayúsculas, números y símbolos.
- **Feedback:**
    - 🟥 **Weak:** < 8 caracteres o muy simple.
    - 🟨 **Medium:** Aceptable pero mejorable.
    - 🟩 **Strong:** Buena combinación.
    - 🟩 **Very Strong:** Excelente seguridad.

---

## 🔄 Recuperación y Reseteo

Si olvidas tu PIN o pierdes tu dispositivo 2FA:
1.  En la pantalla de bloqueo, usa la **Contraseña Maestra** para entrar.
2.  Si también has perdido la contraseña maestra, usa el enlace **"Delete all data / Reset Extension"** en la parte inferior de la pantalla de bloqueo.
    - *Advertencia:* Esto borrará todas las cuentas y claves privadas almacenadas localmente. Necesitarás tus claves de respaldo (Owner/Active/Posting) para restaurar la billetera.
