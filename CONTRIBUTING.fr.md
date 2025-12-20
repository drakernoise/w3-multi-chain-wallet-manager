# Contribuer à Gravity Wallet

**Langues:** [🇬🇧 English](CONTRIBUTING.md) | [🇪🇸 Español](CONTRIBUTING.es.md) | [🇫🇷 Français](CONTRIBUTING.fr.md) | [🇩🇪 Deutsch](CONTRIBUTING.de.md) | [🇮🇹 Italiano](CONTRIBUTING.it.md)

---

Tout d'abord, merci d'envisager de contribuer à Gravity Wallet! 🎉

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Configuration de Développement](#configuration-de-développement)
- [Processus de Pull Request](#processus-de-pull-request)
- [Standards de Code](#standards-de-code)

## 📜 Code de Conduite

### Nos Standards

**Comportement positif:**
- ✅ Utiliser un langage accueillant et inclusif
- ✅ Respecter les différents points de vue
- ✅ Accepter gracieusement les critiques constructives
- ✅ Se concentrer sur ce qui est le mieux pour la communauté

**Comportement inacceptable:**
- ❌ Trolling, commentaires insultants et attaques personnelles
- ❌ Harcèlement public ou privé
- ❌ Publication d'informations privées sans permission

## 🤝 Comment Contribuer

### Signaler des Bugs

**Lors du signalement d'un bug, incluez:**
- 📝 Titre clair et descriptif
- 🔍 Étapes pour reproduire le comportement
- 💡 Comportement attendu vs comportement réel
- 📸 Captures d'écran (si applicable)
- 🖥️ Détails de l'environnement (navigateur, OS, version)

### Suggérer des Améliorations

**Lors de la suggestion d'une amélioration, incluez:**
- 📝 Titre clair et descriptif
- 💡 Description détaillée de la fonctionnalité proposée
- 🎯 Cas d'utilisation et avantages

### Vulnérabilités de Sécurité

**⚠️ IMPORTANT:** NE créez PAS d'issues publics pour les vulnérabilités de sécurité.

Veuillez signaler les problèmes de sécurité en privé à: `drakernoise@protonmail.com`

Voir notre [Politique de Sécurité](SECURITY.fr.md) pour plus de détails.

## 🛠️ Configuration de Développement

### Prérequis

- **Node.js**: v16 ou supérieur
- **npm**: v8 ou supérieur
- **Git**: Dernière version
- **Navigateur**: Chrome, Brave ou Edge

### Installation

```bash
# Clonez votre fork
git clone https://github.com/VOTRE_NOM/w3-multi-chain-wallet-manager.git
cd w3-multi-chain-wallet-manager

# Installez les dépendances
npm install

# Compilez l'extension
npm run build
```

### Charger l'Extension

1. Ouvrez Chrome/Brave/Edge
2. Naviguez vers `chrome://extensions`
3. Activez le "Mode développeur"
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier `dist`

## 🔄 Processus de Pull Request

### Avant de Soumettre

- ✅ **Testez vos modifications** en profondeur
- ✅ **Mettez à jour la documentation** si nécessaire
- ✅ **Suivez les standards de code**
- ✅ **Écrivez des messages de commit significatifs**
- ✅ **Assurez-vous qu'il n'y a pas d'erreurs de console**

### Directives PR

1. **Titre**: Utilisez un titre clair et descriptif
2. **Description**: Incluez ce qui a changé, pourquoi et comment tester
3. **Taille**: Gardez les PRs ciblés et de taille raisonnable

## 💻 Standards de Code

### TypeScript/JavaScript

```typescript
// ✅ Bon
export const transferFunds = async (
    chain: Chain,
    from: string,
    to: string,
    amount: string
): Promise<TransferResult> => {
    // Fonction claire et descriptive
    // Typage approprié
};

// ❌ Mauvais
function transfer(a, b, c) {
    // Pas de types
    // Paramètres peu clairs
}
```

### Conventions de Nommage

- **Fichiers**: `camelCase.ts` ou `PascalCase.tsx`
- **Composants**: `PascalCase`
- **Fonctions**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`

## 📝 Guide des Messages de Commit

Nous suivons la spécification [Conventional Commits](https://www.conventionalcommits.org/).

### Types

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Modifications de documentation
- `style`: Modifications de style de code
- `refactor`: Refactorisation de code

### Exemples

```bash
feat(wallet): Ajouter le support des Resource Credits Hive
fix(transfer): Résoudre le problème d'encodage du memo sur Blurt
docs(readme): Mettre à jour les instructions d'installation
```

## 🧪 Tests

### Liste de Vérification des Tests Manuels

- [ ] L'extension se charge sans erreurs
- [ ] Toutes les fonctionnalités existantes fonctionnent toujours
- [ ] La nouvelle fonctionnalité fonctionne comme prévu
- [ ] Pas d'erreurs ou d'avertissements dans la console
- [ ] Fonctionne sur différentes chaînes (Hive, Steem, Blurt)

## 🏆 Reconnaissance

Les contributeurs seront:
- Listés dans les notes de version
- Mentionnés dans le README
- Ajoutés à la liste des contributeurs

## 📞 Obtenir de l'Aide

- **Questions**: Utilisez [GitHub Discussions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
- **Bugs**: Créez un [Issue](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

---

**Merci de contribuer à Gravity Wallet!** 🙏

Bonne programmation! 💻✨
