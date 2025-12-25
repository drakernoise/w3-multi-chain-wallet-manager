# Guide de Vérification de Signature - Gravity Messenger

## Aperçu

Gravity Messenger prend désormais en charge la **vérification de signature cryptographique** pour une sécurité renforcée. Cette fonctionnalité optionnelle permet aux utilisateurs de prouver la propriété de leur identité de chat en utilisant des signatures ECDSA, empêchant les attaques d'usurpation d'identité.

## Comment ça fonctionne

Le flux d'authentification utilise un **protocole défi-réponse** :

1. **Le client demande un défi** au serveur en fournissant son ID utilisateur
2. **Le serveur génère un défi aléatoire de 32 octets** et l'envoie au client
3. **Le client signe le défi** en utilisant sa clé privée (ECDSA avec SHA-256)
4. **Le serveur vérifie la signature** en utilisant la clé publique stockée
5. **Si valide**, l'utilisateur est authentifié et accède à ses salons

## Avantages de sécurité

- **Empêche les attaques par rejeu** : Chaque défi est unique et expire après 5 minutes
- **Preuve cryptographique d'identité** : Seul le détenteur de la clé privée peut s'authentifier
- **Aucune transmission de mot de passe** : La clé privée ne quitte jamais le client
- **Rétrocompatible** : L'inscription par nom d'utilisateur fonctionne toujours

## Considérations de sécurité

### Expiration du défi
Les défis expirent après **5 minutes** pour empêcher les attaques par rejeu. Si un défi expire, demandez-en un nouveau.

### Stockage des clés
- **Les clés publiques** sont stockées sur le serveur pour vérification
- **Les clés privées** doivent être stockées en toute sécurité sur le client (coffre-fort chiffré)
- Ne jamais transmettre les clés privées sur le réseau

---

**Note de sécurité** : Cette fonctionnalité est optionnelle et complète le système d'authentification existant. Pour une sécurité maximale, combinez la vérification de signature avec d'autres mesures de sécurité comme la limitation de débit, la liste blanche d'IP et la surveillance des activités suspectes.
