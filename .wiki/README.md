# Gravity Wallet Wiki

This directory contains the source files for the Gravity Wallet GitHub Wiki.

## Structure

```
.wiki/
├── Home.md                      # Main wiki homepage (multilingual)
├── Getting-Started.md           # English getting started guide
├── Getting-Started-ES.md        # Spanish getting started guide
├── Getting-Started-FR.md        # French getting started guide
├── Getting-Started-DE.md        # German getting started guide
├── Getting-Started-IT.md        # Italian getting started guide
├── User-Guide.md                # English user guide
├── User-Guide-ES.md             # Spanish user guide
├── User-Guide-FR.md             # French user guide
├── User-Guide-DE.md             # German user guide
├── User-Guide-IT.md             # Italian user guide
├── Advanced-Features.md         # English advanced features
├── Advanced-Features-ES.md      # Spanish advanced features
├── Advanced-Features-FR.md      # French advanced features
├── Advanced-Features-DE.md      # German advanced features
├── Advanced-Features-IT.md      # Italian advanced features
├── Troubleshooting.md           # English troubleshooting
├── Troubleshooting-ES.md        # Spanish troubleshooting
├── Troubleshooting-FR.md        # French troubleshooting
├── Troubleshooting-DE.md        # German troubleshooting
├── Troubleshooting-IT.md        # Italian troubleshooting
├── Developer-Guide.md           # English developer guide
├── Developer-Guide-ES.md        # Spanish developer guide
├── Developer-Guide-FR.md        # French developer guide
├── Developer-Guide-DE.md        # German developer guide
└── Developer-Guide-IT.md        # Italian developer guide
```

## Supported Languages

- 🇬🇧 **English** (en)
- 🇪🇸 **Español** (es)
- 🇫🇷 **Français** (fr)
- 🇩🇪 **Deutsch** (de)
- 🇮🇹 **Italiano** (it)

## Publishing to GitHub Wiki

To publish these files to the GitHub wiki:

1. **Clone the wiki repository**:
   ```bash
   git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.wiki.git
   ```

2. **Copy wiki files**:
   ```bash
   cp -r .wiki/* w3-multi-chain-wallet-manager.wiki/
   ```

3. **Commit and push**:
   ```bash
   cd w3-multi-chain-wallet-manager.wiki
   git add .
   git commit -m "Update wiki documentation"
   git push
   ```

## Contributing

When contributing to the wiki:

1. **Maintain consistency** across all language versions
2. **Update all languages** when making changes
3. **Follow markdown best practices**
4. **Include screenshots** where helpful (store in `images/` folder)
5. **Test all links** before committing

## Translation Guidelines

- Keep technical terms consistent across languages
- Use native speakers for review when possible
- Maintain the same structure and formatting
- Update version numbers simultaneously

## Content Guidelines

### User Guide
- Focus on practical, step-by-step instructions
- Include screenshots for complex operations
- Explain WHY, not just HOW
- Anticipate common questions

### Advanced Features
- Assume technical knowledge
- Provide code examples where relevant
- Link to related documentation
- Include security warnings

### Troubleshooting
- Start with most common issues
- Provide clear diagnostic steps
- Include error messages verbatim
- Link to GitHub issues for known bugs

### Developer Guide
- Include API documentation
- Provide integration examples
- Document all public methods
- Explain architecture decisions

## Maintenance

- Review and update quarterly
- Check for broken links monthly
- Update screenshots after UI changes
- Sync with extension version releases

## Questions?

Open an issue or discussion on the main repository.
