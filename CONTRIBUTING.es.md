# Contribuir a Gravity Wallet

**Idiomas:** [English](CONTRIBUTING.md) | [Español](CONTRIBUTING.es.md) | [Français](CONTRIBUTING.fr.md) | [Deutsch](CONTRIBUTING.de.md) | [Italiano](CONTRIBUTING.it.md)

---

Antes que nada, ¡gracias por considerar contribuir a Gravity Wallet!

Son personas como tú las que hacen de Gravity Wallet una gran herramienta para la comunidad de blockchains Graphene.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Configuración de Desarrollo](#configuración-de-desarrollo)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Estándares de Código](#estándares-de-código)
- [Guía de Mensajes de Commit](#guía-de-mensajes-de-commit)

## Código de Conducta

Este proyecto se rige por nuestro compromiso de proporcionar una comunidad acogedora e inspiradora para todos.

### Nuestros Estándares

**Comportamiento positivo incluye:**
- Usar lenguaje acogedor e inclusivo
- Ser respetuoso con diferentes puntos de vista
- Aceptar con gracia la crítica constructiva
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

**Comportamiento inaceptable incluye:**
- Trolling, comentarios insultantes y ataques personales
- Acoso público o privado
- Publicar información privada de otros sin permiso
- Otra conducta que razonablemente se considere inapropiada

## ¿Cómo Puedo Contribuir?

### Reportar Bugs

Antes de crear reportes de bugs, por favor verifica los issues existentes para evitar duplicados.

**Al reportar un bug, incluye:**
- Título claro y descriptivo
- Pasos para reproducir el comportamiento
- Comportamiento esperado vs comportamiento actual
- Capturas de pantalla (si aplica)
- Detalles del entorno (navegador, SO, versión de extensión)
- Logs de consola o mensajes de error

### Sugerir Mejoras

Las sugerencias de mejoras se rastrean como issues de GitHub.

**Al sugerir una mejora, incluye:**
- Título claro y descriptivo
- Descripción detallada de la función propuesta
- Casos de uso y beneficios
- Mockups o ejemplos (si aplica)

### Vulnerabilidades de Seguridad

**IMPORTANTE:** NO crees issues públicos para vulnerabilidades de seguridad.

Por favor reporta problemas de seguridad de forma privada a: `drakernoise@protonmail.com`

Ver nuestra [Política de Seguridad](SECURITY.es.md) para más detalles.

## Configuración de Desarrollo

### Requisitos Previos

- **Node.js**: v16 o superior
- **npm**: v8 o superior
- **Git**: Última versión
- **Navegador**: Chrome, Brave o Edge (para pruebas)

### Instalación

```bash
# Clona tu fork
git clone https://github.com/TU_USUARIO/w3-multi-chain-wallet-manager.git
cd w3-multi-chain-wallet-manager

# Instala dependencias
npm install

# Compila la extensión
npm run build

# Para desarrollo con auto-recompilación
npm run dev
```

### Cargar la Extensión

1. Abre Chrome/Brave/Edge
2. Navega a `chrome://extensions`
3. Activa "Modo de desarrollador"
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `dist`

## Proceso de Pull Request

### Antes de Enviar

- **Prueba tus cambios** exhaustivamente
- **Actualiza la documentación** si es necesario
- **Sigue los estándares de código**
- **Escribe mensajes de commit significativos**
- **Asegúrate de que no haya errores en consola**
- **Verifica errores de TypeScript** (`npm run build`)

### Guías de PR

1. **Título**: Usa un título claro y descriptivo
   - Bueno: `feat: Agregar soporte para delegación de RC en Hive`
   - Malo: `Actualizar código`

2. **Descripción**: Incluye:
   - Qué cambios se hicieron
   - Por qué los cambios fueron necesarios
   - Cómo probar los cambios
   - Capturas de pantalla (para cambios de UI)
   - Issues relacionados (si los hay)

3. **Tamaño**: Mantén los PRs enfocados y de tamaño razonable
   - Prefiere múltiples PRs pequeños sobre uno grande
   - Cada PR debe abordar una función/corrección

## Estándares de Código

### TypeScript/JavaScript

```typescript
// Bueno
export const transferFunds = async (
    chain: Chain,
    from: string,
    to: string,
    amount: string
): Promise<TransferResult> => {
    // Función clara y descriptiva
    // Tipado apropiado
    // Patrón async/await
};

// Malo
function transfer(a, b, c) {
    // Sin tipos
    // Parámetros poco claros
    // Sin tipo de retorno
}
```

### Convenciones de Nombres

- **Archivos**: `camelCase.ts` o `PascalCase.tsx` (para componentes)
- **Componentes**: `PascalCase`
- **Funciones**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Interfaces/Tipos**: `PascalCase`

## Guía de Mensajes de Commit

Seguimos la especificación [Conventional Commits](https://www.conventionalcommits.org/).

### Tipos

- `feat`: Nueva función
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de estilo de código
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Agregar/actualizar tests
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
# Función
feat(wallet): Agregar soporte para Resource Credits de Hive

# Corrección de bug
fix(transfer): Resolver problema de codificación de memo en Blurt

# Documentación
docs(readme): Actualizar instrucciones de instalación
```

## Pruebas

### Lista de Verificación de Pruebas Manuales

Antes de enviar un PR, prueba:

- [ ] La extensión carga sin errores
- [ ] Todas las funciones existentes siguen funcionando
- [ ] La nueva función funciona como se espera
- [ ] No hay errores o advertencias en consola
- [ ] Funciona en diferentes chains (Hive, Steem, Blurt)
- [ ] UI responsiva (si aplica)
- [ ] El manejo de errores funciona correctamente

### Pruebas en Diferentes Frontends

Prueba tus cambios en:
- **Hive**: PeakD, Ecency, Hive.blog
- **Steem**: Steemit
- **Blurt**: BeBlurt, Blurt.blog, BlurtWallet

## Documentación

### Documentación de Código

```typescript
/**
 * Transfiere fondos entre cuentas en una blockchain específica
 * 
 * @param chain - La blockchain a usar (HIVE, STEEM o BLURT)
 * @param from - Nombre de cuenta del remitente
 * @param to - Nombre de cuenta del destinatario
 * @param amount - Cantidad a transferir (ej: "10.000 HIVE")
 * @param memo - Mensaje memo opcional
 * @returns Promise que resuelve al resultado de la transferencia
 * @throws {Error} Si la transferencia falla o saldo insuficiente
 */
```

## Reconocimiento

Los contribuyentes serán:
- Listados en las notas de versión
- Mencionados en el README (para contribuciones significativas)
- Agregados a la lista de contribuyentes

## Obtener Ayuda

- **Preguntas**: Usa [GitHub Discussions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
- **Bugs**: Crea un [Issue](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)

## Licencia

Al contribuir, aceptas que tus contribuciones se licenciarán bajo la Licencia MIT.

---

**¡Gracias por contribuir a Gravity Wallet!**

Cada contribución, sin importar cuán pequeña, hace la diferencia. Apreciamos tu tiempo y esfuerzo en hacer este proyecto mejor para todos.

¡Feliz codificación!
