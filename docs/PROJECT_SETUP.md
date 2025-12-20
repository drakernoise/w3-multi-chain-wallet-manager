# 🏗️ Gravity Wallet - Configuración de Gestión de Proyecto

Esta guía define la estructura y flujos de trabajo para el proyecto **Gravity Wallet QA & Tracking** en GitHub. Utiliza esta configuración para monitorizar bugs, rastrear el desarrollo de funciones y gestionar ciclos de pruebas de manera efectiva.

## 📊 Estructura del Tablero

**Nombre del Proyecto:** `Gravity Wallet QA & Tracking`
**Plantilla:** Board (Kanban)

### 1. Columnas de Estado (Workflow)

| Estado | Descripción |
|--------|-------------|
| **🆕 New Issues / Triage** | Bugs recién reportados o ideas. Pendiente de revisión inicial. |
| **📋 To Do / Backlog** | Tareas confirmadas y priorizadas esperando desarrollo. |
| **🏗️ In Progress** | Desarrollo activo en curso. |
| **🧪 Ready for Testing** | Corrección implementada. Listo para verificación manual (QA). |
| **✅ Done** | Verificado, arreglado y cerrado. |

### 2. Campos Personalizados (Custom Fields)

Configura estos campos para categorizar issues efectivamente:

#### **Severity** (Single Select)
- 🔴 **Critical**: Rompe la app, pérdida de fondos, vulnerabilidad de seguridad.
- 🟠 **Major**: Funcionalidad principal rota (ej. transferencias fallan).
- 🟡 **Minor**: Glitch de UI, erratas, errores no bloqueantes.
- 🟢 **Enhancement**: Solicitudes de nueva función.

#### **Chain** (Single Select)
- 🟥 **Hive**
- 🟦 **Steem**
- 🟧 **Blurt**
- 🌐 **Global** (Todas las chains afectadas)

#### **Frontend** (Text)
- DApp específica donde ocurre el error (ej. `PeakD`, `BeBlurt`, `Steemit`).

### 3. Vistas Recomendadas (Views)

Crea estas pestañas en tu Proyecto para organizar el trabajo:

**1. 📋 Kanban Board (Principal)**
- **Layout:** Board
- **Group by:** Status
- **Filter:** Open issues only

**2. 🐛 Bugs por Chain**
- **Layout:** Table
- **Group by:** Chain
- **Sort:** Severity (Desc)
- **Filter:** `label:bug`
- *Útil para ver salud específica de cada blockchain.*

**3. 🧪 Testing Queue (Cola de Pruebas)**
- **Layout:** Table
- **Filter:** `Status:"Ready for Testing"`
- **Campos Visibles:** Title, Chain, Frontend, Severity
- *Usa esta vista junto con tus Excels de control para validar arreglos.*

## 🤖 Automatización (Workflows)

Configura estos workflows integrados de GitHub:

1.  **Auto-add (Añadir ítems):**
    - Cuando se crea issue con label `bug` → Estado: **🆕 New Issues**.
    - Cuando se crea issue con label `enhancement` → Estado: **🆕 New Issues**.

2.  **Auto-close (Cierre):**
    - Cuando un issue se cierra → Estado: **✅ Done**.

3.  **PR vinculada:**
    - Cuando se abre un PR vinculado → Estado: **🏗️ In Progress**.

## 📝 Guía de Uso

1.  **Reporte:** Crear issue usando los templates correspondientes.
2.  **Triaje:** Asignar `Severity` y `Chain`. Mover a `To Do` si es válido.
3.  **Desarrollo:** Mover a `In Progress` al empezar a trabajar.
4.  **Ciclo de QA:**
    - Desarrollador mueve ítem a `Ready for Testing`.
    - QA (usando Excels de referencia) verifica el arreglo.
    - Si arreglado → Cerrar issue (Mueve autom. a `Done`).
    - Si falla → Comentar en issue y devolver a `In Progress`.
