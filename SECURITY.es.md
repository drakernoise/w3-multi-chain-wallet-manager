# Política de Seguridad

**Idiomas:** [🇬🇧 English](SECURITY.md) | [🇪🇸 Español](SECURITY.es.md) | [🇫🇷 Français](SECURITY.fr.md) | [🇩🇪 Deutsch](SECURITY.de.md) | [🇮🇹 Italiano](SECURITY.it.md)

---

## 🔐 Resumen de Seguridad

Gravity Wallet es una extensión de navegador que maneja operaciones criptográficas sensibles y claves privadas. Nos tomamos la seguridad muy en serio y apreciamos los esfuerzos de la comunidad de investigación de seguridad para ayudar a mantener seguros a nuestros usuarios.

## 📋 Versiones Soportadas

Proporcionamos actualizaciones de seguridad para las siguientes versiones:

| Versión | Soportada          | Estado |
| ------- | ------------------ | ------ |
| 1.0.x   | ✅ Sí | Versión estable actual |
| < 1.0   | ❌ No  | Versiones antiguas - por favor actualiza |

**Recomendación:** Usa siempre la última versión estable disponible en la sección de [Releases](https://github.com/drakernoise/w3-multi-chain-wallet-manager/releases).

## 🚨 Reportar una Vulnerabilidad

### Dónde Reportar

**NO** crees issues públicos en GitHub para vulnerabilidades de seguridad. En su lugar:

1. **Email:** Envía los detalles a `drakernoise@protonmail.com`
2. **Asunto:** `[SECURITY] Gravity Wallet - [Breve Descripción]`
3. **Encriptación:** Para información sensible, solicita nuestra clave PGP

### Qué Incluir

Por favor proporciona:

- **Descripción:** Explicación clara de la vulnerabilidad
- **Impacto:** ¿Qué podría hacer un atacante con esta vulnerabilidad?
- **Pasos para Reproducir:** Pasos detallados para reproducir el problema
- **Versiones Afectadas:** ¿Qué versiones están afectadas?
- **Prueba de Concepto:** Código, capturas de pantalla o video (si aplica)
- **Solución Sugerida:** Si tienes ideas para mitigar el problema

### Cronograma de Respuesta

- **Respuesta Inicial:** Dentro de 48 horas
- **Actualización de Estado:** Cada 7 días hasta resolverse
- **Cronograma de Corrección:** 
  - Crítico: 7 días
  - Alto: 14 días
  - Medio: 30 días
  - Bajo: 60 días

### Qué Esperar

**Si se Acepta:**
- Trabajaremos contigo para entender y validar el problema
- Desarrollaremos y probaremos una solución
- Te acreditaremos en el aviso de seguridad (a menos que prefieras permanecer anónimo)
- Publicaremos un aviso de seguridad después de que se publique la corrección

**Si se Rechaza:**
- Explicaremos por qué no lo consideramos un problema de seguridad
- Aún podríamos abordarlo como un error regular o mejora

## 🛡️ Mejores Prácticas de Seguridad para Usuarios

### Seguridad de Claves Privadas

⚠️ **CRÍTICO:** Gravity Wallet almacena tus claves privadas localmente en el almacenamiento encriptado de tu navegador.

**Mejores Prácticas:**
1. ✅ **Nunca compartas tus claves privadas** con nadie
2. ✅ **Haz copias de seguridad de tus claves** de forma segura offline (papel, USB encriptado)
3. ✅ **Usa contraseñas fuertes** para tu dispositivo y navegador
4. ✅ **Mantén tu navegador actualizado** a la última versión
5. ✅ **Descarga solo** de fuentes oficiales (releases de GitHub)
6. ❌ **Nunca ingreses claves** en sitios web sospechosos
7. ❌ **No hagas capturas de pantalla** de tus claves ni las guardes en servicios en la nube

### Seguridad de la Extensión

1. **Verifica la Extensión:**
   - Siempre descarga de [releases oficiales de GitHub](https://github.com/drakernoise/w3-multi-chain-wallet-manager/releases)
   - Verifica el hash del archivo si se proporciona
   - Comprueba que el número de versión coincida

2. **Whitelist con Cuidado:**
   - Solo añade a la whitelist sitios web de confianza
   - Revisa los permisos antes de auto-firmar
   - Revoca el acceso de sitios no utilizados

3. **Actualizaciones Regulares:**
   - Verifica actualizaciones regularmente
   - Lee las notas de versión para correcciones de seguridad
   - Actualiza rápidamente cuando se publiquen parches de seguridad

### Protección contra Phishing

⚠️ **Tácticas Comunes de Phishing:**
- Sitios web falsos que parecen frontends legítimos
- Emails pidiendo tus claves privadas
- Extensiones de navegador que imitan Gravity Wallet
- Mensajes en redes sociales ofreciendo "soporte"

**Protección:**
- ✅ Siempre verifica la URL antes de ingresar credenciales
- ✅ Guarda en favoritos frontends confiables (PeakD, Ecency, Blurt.blog, etc.)
- ✅ Activa la protección contra phishing del navegador
- ❌ Nunca hagas clic en enlaces sospechosos en emails/mensajes

## 🔍 Características de Seguridad

### Medidas de Seguridad Actuales

- ✅ **Solo Almacenamiento Local:** Las claves nunca salen de tu dispositivo
- ✅ **Encriptación del Navegador:** Usa la API de almacenamiento encriptado del navegador
- ✅ **Sin Analíticas:** Sin seguimiento ni recopilación de datos
- ✅ **Código Abierto:** El código es públicamente auditable
- ✅ **Sistema de Whitelist:** Controla qué sitios pueden auto-firmar
- ✅ **Confirmación Manual:** Las operaciones financieras requieren aprobación explícita

### Mejoras de Seguridad Planificadas

- 🔄 **Soporte para Hardware Wallet:** Integración con Ledger/Trezor
- 🔄 **Autenticación Biométrica:** Soporte para huella digital/Face ID
- 🔄 **Multi-Firma:** Soporte para cuentas multi-sig
- 🔄 **Tiempo de Sesión:** Auto-bloqueo después de inactividad

## 🏆 Salón de la Fama de Seguridad

Reconocemos y agradecemos a los investigadores de seguridad que divulgan vulnerabilidades de manera responsable:

<!-- Los investigadores de seguridad se listarán aquí después de la divulgación responsable -->

*Aún no se han reportado vulnerabilidades.*

## 📚 Recursos Adicionales

- **Auditoría de Código:** Se anima a los miembros de la comunidad a auditar el código
- **Discusiones de Seguridad:** Usa GitHub Discussions para preguntas de seguridad
- **Guía de Mejores Prácticas:** Ver [Wiki - Mejores Prácticas de Seguridad](https://github.com/drakernoise/w3-multi-chain-wallet-manager/wiki)

## ⚖️ Divulgación Responsable

Seguimos prácticas de divulgación responsable:

1. **Divulgación Privada:** Reporta de forma privada primero
2. **Publicación Coordinada:** Coordinaremos la divulgación pública contigo
3. **Crédito:** Te acreditaremos en el aviso (si lo deseas)
4. **Sin Acción Legal:** No tomaremos acciones legales contra investigadores que sigan esta política

## 🔗 Contacto

- **Problemas de Seguridad:** drakernoise@protonmail.com
- **Soporte General:** [GitHub Issues](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Discusiones:** [GitHub Discussions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)

---

**Última Actualización:** 20 de diciembre de 2025  
**Versión:** 1.0

¡Gracias por ayudar a mantener seguros a Gravity Wallet y nuestros usuarios! 🙏
