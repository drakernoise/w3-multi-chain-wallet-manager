# Démarrage avec Gravity Wallet

## Installation

### Chrome/Brave/Edge

1. **Télécharger l'Extension**
   - Clonez le dépôt ou téléchargez la dernière version
   ```bash
   git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.git
   cd w3-multi-chain-wallet-manager
   ```

2. **Compiler l'Extension**
   ```bash
   npm install
   npm run build
   ```

3. **Charger dans le Navigateur**
   - Ouvrez Chrome et naviguez vers `chrome://extensions/`
   - Activez le "Mode développeur" (interrupteur en haut à droite)
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `dist` du répertoire du projet

4. **Épingler l'Extension**
   - Cliquez sur l'icône de puzzle dans la barre d'outils
   - Trouvez "Gravity Wallet" et cliquez sur l'icône d'épingle

## Configuration Initiale

### Créer Votre Premier Portefeuille

1. **Lancer Gravity Wallet**
   - Cliquez sur l'icône Gravity Wallet dans la barre d'outils
   - Vous verrez l'écran de bienvenue

2. **Définir un Mot de Passe Principal**
   - Choisissez un mot de passe fort (minimum 8 caractères)
   - Ce mot de passe chiffre les données de votre portefeuille
   - **Important**: Conservez ce mot de passe en sécurité - il ne peut pas être récupéré!

3. **Importer Votre Premier Compte**
   - Cliquez sur le bouton "+ Ajouter"
   - Sélectionnez la blockchain (Hive, Steem ou Blurt)
   - Entrez les détails de votre compte:
     - **Nom d'utilisateur**: Votre nom d'utilisateur blockchain
     - **Clé de Publication**: Pour les actions sociales (posts, votes, commentaires)
     - **Clé Active**: Pour les transactions financières (transferts, power up/down)
     - **Clé Memo**: Pour les messages chiffrés (optionnel)

4. **Vérifier l'Importation**
   - Le portefeuille validera vos clés contre la blockchain
   - En cas de succès, vous verrez le solde de votre compte

## Comprendre les Types de Clés

### Clé de Publication
- **Utilisée pour**: Créer des posts, voter, commenter, suivre
- **Niveau de Sécurité**: Moyen
- **Recommandation**: Sûr de stocker dans le portefeuille pour un usage quotidien

### Clé Active
- **Utilisée pour**: Transferts, power up/down, délégations
- **Niveau de Sécurité**: Élevé
- **Recommandation**: Importer uniquement si vous devez effectuer des transferts

### Clé Memo
- **Utilisée pour**: Chiffrer/déchiffrer les messages privés
- **Niveau de Sécurité**: Faible
- **Recommandation**: Optionnel, importer uniquement si nécessaire

## Guide de Démarrage Rapide

### Voir Votre Solde

1. Cliquez sur le nom de votre compte dans le portefeuille
2. Vous verrez:
   - **Solde Principal**: HIVE/STEEM/BLURT
   - **Solde Secondaire**: HBD/SBD (pour Hive/Steem)
   - **Powered Up**: Jetons investis (HP/SP/BP)

### Envoyer Votre Premier Transfert

1. **Sélectionner le Compte**: Cliquez sur le compte depuis lequel envoyer
2. **Cliquer sur "Envoyer"**: Ouvre la fenêtre de transfert
3. **Entrer les Détails**:
   - **À**: Nom d'utilisateur du destinataire (sans @)
   - **Montant**: Nombre de jetons à envoyer
   - **Jeton**: Sélectionnez HIVE/HBD ou STEEM/SBD
   - **Memo**: Message optionnel (chiffré si commence par #)
4. **Confirmer**: Vérifiez et cliquez sur "Envoyer"
5. **Approuver**: Confirmez dans la fenêtre popup

### Recevoir des Fonds

1. Cliquez sur le bouton "Recevoir"
2. Votre nom d'utilisateur s'affiche avec un code QR
3. Partagez votre nom d'utilisateur avec l'expéditeur
4. Les fonds apparaîtront automatiquement dans votre solde

## Utiliser avec les dApps

### Connexion à PeakD

1. **Naviguer vers PeakD**: Allez sur [peakd.com](https://peakd.com)
2. **Cliquer sur Connexion**: Sélectionnez l'option "Hive Keychain"
3. **Gravity Wallet s'Active**: Une popup apparaîtra
4. **Approuver la Connexion**: Cliquez sur "Approuver" pour vous connecter
5. **Commencer à Utiliser**: Vous pouvez maintenant poster, voter et commenter

### Connexion à d'Autres dApps

Gravity Wallet est compatible avec toute dApp supportant l'API Hive Keychain:
- **Ecency**: Plateforme de blogging social
- **Tribaldex**: Échange de jetons
- **Splinterlands**: Jeux
- **Et bien d'autres!**

## Meilleures Pratiques de Sécurité

### Sécurité du Mot de Passe
- ✅ Utilisez un mot de passe unique et fort
- ✅ Ne partagez jamais votre mot de passe
- ✅ Stockez le mot de passe dans un gestionnaire de mots de passe
- ❌ N'utilisez pas le même mot de passe que d'autres services

### Gestion des Clés
- ✅ Importez uniquement les clés dont vous avez besoin
- ✅ Conservez une sauvegarde de vos clés hors ligne
- ✅ Utilisez la clé de publication pour les activités quotidiennes
- ❌ Ne partagez jamais vos clés privées avec qui que ce soit

### Sécurité du Navigateur
- ✅ Gardez votre navigateur à jour
- ✅ Installez uniquement des extensions de sources fiables
- ✅ Verrouillez votre portefeuille lorsqu'il n'est pas utilisé
- ❌ N'utilisez pas sur des ordinateurs publics/partagés

## Prochaines Étapes

- [Guide Utilisateur](User-Guide-FR) - Apprenez toutes les fonctionnalités en détail
- [Fonctionnalités Avancées](Advanced-Features-FR) - Transferts en masse, MultiSig et plus
- [Dépannage](Troubleshooting-FR) - Problèmes courants et solutions

## Besoin d'Aide?

- **GitHub Issues**: [Signaler des problèmes](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Discussions**: [Poser des questions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
