# Instrucciones para Publicar la Wiki en GitHub

## Paso 1: Habilitar la Wiki en GitHub

1. Ve a tu repositorio: https://github.com/drakernoise/w3-multi-chain-wallet-manager
2. Haz clic en **Settings** (Configuración)
3. Desplázate hasta la sección **Features**
4. Marca la casilla **Wikis** para habilitarla
5. Haz clic en **Save changes** (Guardar cambios)

## Paso 2: Crear la Primera Página

1. Ve a la pestaña **Wiki** en tu repositorio
2. Haz clic en **Create the first page**
3. **Título**: Home
4. **Contenido**: Copia y pega el contenido de `.wiki/Home.md`
5. Haz clic en **Save Page**

## Paso 3: Clonar el Repositorio Wiki

Una vez creada la primera página, el repositorio wiki estará disponible:

```bash
cd "C:\Users\pablo\Movistar Cloud\Gravity"
git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.wiki.git
```

## Paso 4: Copiar Todos los Archivos

```bash
# Copiar archivos de la wiki
cp "web3-multi-chain-wallet/.wiki/"* "w3-multi-chain-wallet-manager.wiki/"

# Ir al directorio wiki
cd w3-multi-chain-wallet-manager.wiki
```

## Paso 5: Commit y Push

```bash
# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Add comprehensive multilingual documentation - EN, ES, FR, DE, IT"

# Push a GitHub
git push origin master
```

## Paso 6: Verificar

Visita: https://github.com/drakernoise/w3-multi-chain-wallet-manager/wiki

Deberías ver:
- ✅ Home (página principal multilingüe)
- ✅ Getting Started (EN, ES, FR, DE, IT)
- ✅ User Guide (EN)
- ✅ Troubleshooting (EN)
- ✅ README y WIKI-STATUS

## Notas Importantes

### Nombres de Archivo en GitHub Wiki

GitHub Wiki convierte los nombres de archivo automáticamente:
- `Getting-Started.md` → "Getting Started"
- `Getting-Started-ES.md` → "Getting Started ES"
- `User-Guide.md` → "User Guide"

### Sidebar (Opcional)

Para crear una barra lateral personalizada:

1. Crea un archivo `_Sidebar.md` en el repositorio wiki
2. Añade enlaces a las páginas principales:

```markdown
## 🌍 Languages

- [🇬🇧 English](Home#english)
- [🇪🇸 Español](Home#español)
- [🇫🇷 Français](Home#français)
- [🇩🇪 Deutsch](Home#deutsch)
- [🇮🇹 Italiano](Home#italiano)

## 📚 Documentation

### English
- [Getting Started](Getting-Started)
- [User Guide](User-Guide)
- [Troubleshooting](Troubleshooting)

### Español
- [Primeros Pasos](Getting-Started-ES)

### Français
- [Démarrage](Getting-Started-FR)

### Deutsch
- [Erste Schritte](Getting-Started-DE)

### Italiano
- [Iniziare](Getting-Started-IT)
```

## Alternativa: Publicación Automática con Script

Si prefieres automatizar el proceso después de habilitar la wiki:

```bash
# Ejecutar desde el directorio del proyecto
cd "C:\Users\pablo\Movistar Cloud\Gravity\web3-multi-chain-wallet"

# Ejecutar script de publicación (crear este archivo)
node scripts/publish-wiki.js
```

Contenido de `scripts/publish-wiki.js`:

```javascript
const { execSync } = require('child_process');
const path = require('path');

const WIKI_REPO = 'https://github.com/drakernoise/w3-multi-chain-wallet-manager.wiki.git';
const WIKI_DIR = path.join(__dirname, '..', '..', 'w3-multi-chain-wallet-manager.wiki');
const SOURCE_DIR = path.join(__dirname, '..', '.wiki');

console.log('📚 Publishing Gravity Wallet Wiki...\n');

try {
  // Clone wiki repo
  console.log('1️⃣ Cloning wiki repository...');
  execSync(`git clone ${WIKI_REPO} "${WIKI_DIR}"`, { stdio: 'inherit' });

  // Copy files
  console.log('\n2️⃣ Copying wiki files...');
  execSync(`xcopy "${SOURCE_DIR}\\*" "${WIKI_DIR}\\" /Y /E`, { stdio: 'inherit' });

  // Commit and push
  console.log('\n3️⃣ Committing changes...');
  process.chdir(WIKI_DIR);
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Add comprehensive multilingual documentation"', { stdio: 'inherit' });
  
  console.log('\n4️⃣ Pushing to GitHub...');
  execSync('git push origin master', { stdio: 'inherit' });

  console.log('\n✅ Wiki published successfully!');
  console.log('🌐 Visit: https://github.com/drakernoise/w3-multi-chain-wallet-manager/wiki\n');
} catch (error) {
  console.error('❌ Error publishing wiki:', error.message);
  process.exit(1);
}
```

## Solución de Problemas

### Error: "Repository not found"
- Asegúrate de haber habilitado la wiki en Settings
- Crea al menos una página manualmente primero

### Error: "Permission denied"
- Verifica que tienes permisos de escritura en el repositorio
- Asegúrate de estar autenticado con GitHub

### Los archivos no aparecen
- Verifica que los archivos tengan extensión `.md`
- Asegúrate de hacer push a la rama `master` (no `main`)

## Próximos Pasos Después de Publicar

1. **Anunciar en la comunidad**: Publica en Hive/Steem/Blurt sobre la nueva documentación
2. **Solicitar feedback**: Pide a usuarios que revisen y sugieran mejoras
3. **Traducciones comunitarias**: Invita a hablantes nativos a mejorar las traducciones
4. **Añadir screenshots**: Captura pantallas de la interfaz para las guías
5. **Completar páginas faltantes**: Advanced Features y Developer Guide

---

**¿Necesitas ayuda?** Abre un issue en GitHub o pregunta en las discusiones del repositorio.
