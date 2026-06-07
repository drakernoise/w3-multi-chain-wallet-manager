# Gravity Wallet

**La Primera Billetera Web3 Multi-Cadena con IA Integrada para Blurt, Hive y Steem.**

<div align="center">
  <img src="apps/extension/public/logowallet_big.png" alt="Gravity Wallet Banner" width="300" />
</div>

Gravity Wallet es una extensión de navegador de última generación diseñada para el ecosistema Graphene. No es solo una billetera; es tu copiloto inteligente para la Web3. Con soporte nativo para **Blurt**, **Hive** y **Steem**, Gravity elimina la necesidad de tener múltiples extensiones instaladas.

## Características Principales

### Multi-Cadena Real
*   Administra tus cuentas de **Blurt**, **Hive** y **Steem** desde una única interfaz unificada.
*   **Detección Inteligente:** La billetera detecta automáticamente en qué dApp estás (ej. PeakD, Steemit, BlurtBlog) y selecciona la cuenta y red correctas por ti.

### Seguridad de Grado Militar
*   **Cifrado Local:** Tus claves privadas (Posting, Active, Memo) se almacenan cifradas localmente en tu navegador usando AES-256. **Nunca salen de tu dispositivo.**
*   **Firma Offline:** Las transacciones se firman en tu ordenador antes de transmitirse a la red.
*   ** Auditoría de Seguridad:** Código protegido contra ataques XSS, Phishing y Flood. Cumple con los estándares más estrictos de Manifest V3.

### Potenciado por IA (Experimental)
*   **Análisis de Transacciones:** ¿Vas a firmar una operación compleja? Gravity te explica en lenguaje natural qué estás firmando exactamente.
*   **Detección de Fraude:** Alertas inteligentes ante comportamientos sospechosos o transacciones inusuales.

### Herramientas Avanzadas
*   **Messenger Seguro:** Chat en cadena para Blurt, Hive y Steem con notificaciones en tiempo real.
*   **Configuración Sin Contraseña:** Crea tu billetera sin complicaciones usando Google OAuth o llaves de hardware (Device).
*   **Power Up / Power Down:** Gestiona tu stake directamente desde la extensión.
*   **Delegaciones:** Delega poder de voto a otros usuarios fácilmente.
*   **Transferencias Masivas:** Envía fondos a múltiples destinatarios en una sola operación (ideal para airdrops o pagos recurrentes).
*   **Gestión de Claves:** Importa y exporta tus cuentas de forma segura.

## Instalación

### Desde la Chrome Web Store (Recomendado)
*(Enlace pendiente de aprobación - ¡Próximamente!)*

### Instalación Manual (Modo Desarrollador)
1.  Descarga la última versión desde la sección [Releases](https://github.com/drakernoise/gravity-wallet/releases).
2.  Descomprime el archivo ZIP.
3.  Abre Chrome y ve a `chrome://extensions`.
4.  Activa el **"Modo de desarrollador"** (esquina superior derecha).
5.  Haz clic en **"Cargar descomprimida"** y selecciona la carpeta `dist` extraída.

## Desarrollo

Si eres desarrollador y quieres contribuir:

1.  Clona este repositorio:
    ```bash
    git clone https://github.com/drakernoise/gravity-wallet.git
    cd gravity-wallet
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Compila para producción (elige tu navegador):
    ```bash
    cd apps/extension
    npm run build:chrome  # Para Chrome (Genera /dist-chrome)
    npm run build:firefox # Para Firefox (Genera /dist-firefox)
    npm run build:edge    # Para Edge (Genera /dist-edge)
    ```

## Privacidad

En Gravity, tu privacidad es sagrada:
*   **Cero Rastreo:** No utilizamos Google Analytics ni scripts de seguimiento.
*   **Cero Datos:** No recopilamos información personal. Tus claves son tuyas.
*   **Open Source:** Todo el código es auditable por la comunidad.

## Guía y Documentación

- [Guía de Autenticación y 2FA](docs/AUTHENTICATION_GUIDE.md) | [English Version](docs/AUTHENTICATION_GUIDE.en.md)
- [Guía del Mensajero](docs/MESSENGER_GUIDE.md) | [English Version](docs/MESSENGER_GUIDE.en.md)
- [Verificación de Firma (Avanzado)](docs/SIGNATURE_VERIFICATION.md) | [FR](docs/SIGNATURE_VERIFICATION.fr.md) | [DE](docs/SIGNATURE_VERIFICATION.de.md) | [IT](docs/SIGNATURE_VERIFICATION.it.md)
- [Guía de Instalación del Proyecto](docs/PROJECT_SETUP.md)

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un "Issue" para discutir cambios mayores antes de enviar un "Pull Request".

## Licencia

Este proyecto está bajo la licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

---
*Hecho con amor para la comunidad Web3.*
