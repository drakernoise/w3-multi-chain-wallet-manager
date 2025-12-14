# 🌌 Gravity Wallet

**La Primera Billetera Web3 Multi-Cadena con IA Integrada para Hive, Steem y Blurt.**

![Gravity Wallet Banner](public/logowallet_big.png)

Gravity Wallet es una extensión de navegador de última generación diseñada para el ecosistema Graphene. No es solo una billetera; es tu copiloto inteligente para la Web3. Con soporte nativo para **Hive**, **Steem** y **Blurt**, Gravity elimina la necesidad de tener múltiples extensiones instaladas.

## ✨ Características Principales

### 🔗 Multi-Cadena Real
*   Administra tus cuentas de **Hive**, **Steem** y **Blurt** desde una única interfaz unificada.
*   **Detección Inteligente:** La billetera detecta automáticamente en qué dApp estás (ej. PeakD, Steemit, BlurtBlog) y selecciona la cuenta y red correctas por ti.

### 🛡️ Seguridad de Grado Militar
*   **Cifrado Local:** Tus claves privadas (Posting, Active, Memo) se almacenan cifradas localmente en tu navegador usando AES-256. **Nunca salen de tu dispositivo.**
*   **Firma Offline:** Las transacciones se firman en tu ordenador antes de transmitirse a la red.
*   ** Auditoría de Seguridad:** Código protegido contra ataques XSS, Phishing y Flood. Cumple con los estándares más estrictos de Manifest V3.

### 🤖 Potenciado por IA (Experimental)
*   **Análisis de Transacciones:** ¿Vas a firmar una operación compleja? Gravity te explica en lenguaje natural qué estás firmando exactamente.
*   **Detección de Fraude:** Alertas inteligentes ante comportamientos sospechosos o transacciones inusuales.

### ⚡ Herramientas Avanzadas
*   **Power Up / Power Down:** Gestiona tu stake directamente desde la extensión.
*   **Delegaciones:** Delega poder de voto a otros usuarios fácilmente.
*   **Transferencias Masivas:** Envía fondos a múltiples destinatarios en una sola operación (ideal para airdrops o pagos recurrentes).
*   **Gestión de Claves:** Importa y exporta tus cuentas de forma segura.

## 📥 Instalación

### Desde la Chrome Web Store (Recomendado)
*(Enlace pendiente de aprobación - ¡Próximamente!)*

### Instalación Manual (Modo Desarrollador)
1.  Descarga la última versión desde la sección [Releases](https://github.com/drakernoise/gravity-wallet/releases).
2.  Descomprime el archivo ZIP.
3.  Abre Chrome y ve a `chrome://extensions`.
4.  Activa el **"Modo de desarrollador"** (esquina superior derecha).
5.  Haz clic en **"Cargar descomprimida"** y selecciona la carpeta `dist` extraída.

## 🛠️ Desarrollo

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
4.  Compila para producción:
    ```bash
    npm run build
    ```

## 🔐 Privacidad

En Gravity, tu privacidad es sagrada:
*   **Cero Rastreo:** No utilizamos Google Analytics ni scripts de seguimiento.
*   **Cero Datos:** No recopilamos información personal. Tus claves son tuyas.
*   **Open Source:** Todo el código es auditable por la comunidad.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un "Issue" para discutir cambios mayores antes de enviar un "Pull Request".

## 📄 Licencia

Este proyecto está bajo la licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

---
*Hecho con ❤️ para la comunidad Web3.*
