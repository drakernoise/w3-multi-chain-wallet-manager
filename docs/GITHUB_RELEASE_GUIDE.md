# Guía: Crear Release en GitHub

## Pasos para crear el Release v1.0.4-blurt-stable

### 1. Ir a la página de Releases
```
https://github.com/drakernoise/w3-multi-chain-wallet-manager/releases
```

O desde el repositorio:
- Click en "Releases" (menú lateral derecho)
- Click en "Create a new release"

### 2. Configurar el Release

**Choose a tag:**
- Selecciona: `v1.0.4-blurt-stable` (ya existe, lo creamos con el script)

**Release title:**
```
v1.0.4 - Blurt Production Ready
```

**Description:**
Copia y pega el contenido de `RELEASE_NOTES.md` (ya está creado en el proyecto)

### 3. Adjuntar archivos

Click en "Attach binaries by dropping them here or selecting them"

Adjunta:
- `gravity-wallet-v1.0.4-blurt-stable.zip` (extensión lista para instalar)

### 4. Opciones adicionales

- **Set as the latest release** (marcado)
- **Set as a pre-release** (desmarcado)
- **Create a discussion for this release** (opcional)

### 5. Publicar

Click en **"Publish release"**

---

## Resultado

Una vez publicado, tendrás:

- **Tag permanente:** `v1.0.4-blurt-stable`
- **Rama de backup:** `backup/production-2025-12-20`
- **Release público:** Con notas y archivo ZIP descargable
- **Código fuente:** Descargable automáticamente (zip/tar.gz)

## Recuperación Rápida en el Futuro

### Opción 1: Desde el Release
1. Ve a Releases
2. Descarga `gravity-wallet-v1.0.4-blurt-stable.zip`
3. Descomprime y carga en Chrome

### Opción 2: Desde el Tag
```bash
git fetch --all --tags
git checkout v1.0.4-blurt-stable
npm install
npm run build
```

### Opción 3: Desde la Rama de Backup
```bash
git fetch --all
git checkout backup/production-2025-12-20
npm install
npm run build
```

---

## Próximos Backups

Para crear un nuevo backup en el futuro:

```powershell
# Backup automático con fecha
.\scripts\backup.ps1

# O con nombre personalizado
.\scripts\backup.ps1 "v1.0.5-hive-stable"
```

El script hará automáticamente:
1. Commit de cambios
2. Crear tag
3. Push a GitHub
4. Crear rama de backup

Solo tendrás que crear el Release manualmente en GitHub siguiendo esta guía.

---

## Notas Importantes

- **Tags son inmutables:** Una vez creados, no se pueden modificar
- **Branches de backup:** Se pueden actualizar si es necesario
- **Releases:** Se pueden editar después de publicar
- **ZIP del dist:** Siempre adjúntalo para instalación rápida

## Automatización Futura (Opcional)

Si quieres automatizar completamente (incluyendo el Release), podemos usar:
- GitHub CLI (`gh release create`)
- GitHub Actions (CI/CD)

Pero por ahora, el proceso manual es suficiente y te da control total.
