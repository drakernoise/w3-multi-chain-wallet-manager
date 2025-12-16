# Erste Schritte mit Gravity Wallet

## Installation

### Chrome/Brave/Edge

1. **Erweiterung Herunterladen**
   - Repository klonen oder neueste Version herunterladen
   ```bash
   git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.git
   cd w3-multi-chain-wallet-manager
   ```

2. **Erweiterung Erstellen**
   ```bash
   npm install
   npm run build
   ```

3. **Im Browser Laden**
   - Chrome öffnen und zu `chrome://extensions/` navigieren
   - "Entwicklermodus" aktivieren (Schalter oben rechts)
   - Auf "Entpackte Erweiterung laden" klicken
   - Den `dist` Ordner aus dem Projektverzeichnis auswählen

4. **Erweiterung Anheften**
   - Auf das Puzzle-Symbol in der Symbolleiste klicken
   - "Gravity Wallet" finden und auf das Pin-Symbol klicken

## Ersteinrichtung

### Ihre Erste Wallet Erstellen

1. **Gravity Wallet Starten**
   - Auf das Gravity Wallet Symbol in der Symbolleiste klicken
   - Sie sehen den Willkommensbildschirm

2. **Master-Passwort Festlegen**
   - Wählen Sie ein starkes Passwort (mindestens 8 Zeichen)
   - Dieses Passwort verschlüsselt Ihre Wallet-Daten
   - **Wichtig**: Bewahren Sie dieses Passwort sicher auf - es kann nicht wiederhergestellt werden!

3. **Ihr Erstes Konto Importieren**
   - Auf die Schaltfläche "+ Hinzufügen" klicken
   - Blockchain auswählen (Hive, Steem oder Blurt)
   - Kontodetails eingeben:
     - **Benutzername**: Ihr Blockchain-Benutzername
     - **Posting-Schlüssel**: Für soziale Aktionen (Posts, Votes, Kommentare)
     - **Aktiver Schlüssel**: Für finanzielle Transaktionen (Überweisungen, Power Up/Down)
     - **Memo-Schlüssel**: Für verschlüsselte Nachrichten (optional)

4. **Import Überprüfen**
   - Die Wallet validiert Ihre Schlüssel gegen die Blockchain
   - Bei Erfolg sehen Sie Ihren Kontostand

## Schlüsseltypen Verstehen

### Posting-Schlüssel
- **Verwendet für**: Posts erstellen, abstimmen, kommentieren, folgen
- **Sicherheitsstufe**: Mittel
- **Empfehlung**: Sicher in der Wallet für den täglichen Gebrauch zu speichern

### Aktiver Schlüssel
- **Verwendet für**: Überweisungen, Power Up/Down, Delegationen
- **Sicherheitsstufe**: Hoch
- **Empfehlung**: Nur importieren, wenn Sie Überweisungen tätigen müssen

### Memo-Schlüssel
- **Verwendet für**: Private Nachrichten verschlüsseln/entschlüsseln
- **Sicherheitsstufe**: Niedrig
- **Empfehlung**: Optional, nur bei Bedarf importieren

## Schnellstart-Anleitung

### Ihr Guthaben Anzeigen

1. Klicken Sie auf Ihren Kontonamen in der Wallet
2. Sie sehen:
   - **Hauptguthaben**: HIVE/STEEM/BLURT
   - **Sekundärguthaben**: HBD/SBD (für Hive/Steem)
   - **Powered Up**: Investierte Token (HP/SP/BP)

### Ihre Erste Überweisung Senden

1. **Konto Auswählen**: Klicken Sie auf das Konto, von dem Sie senden möchten
2. **Auf "Senden" Klicken**: Öffnet das Überweisungsmodal
3. **Details Eingeben**:
   - **An**: Benutzername des Empfängers (ohne @)
   - **Betrag**: Anzahl der zu sendenden Token
   - **Token**: HIVE/HBD oder STEEM/SBD auswählen
   - **Memo**: Optionale Nachricht (verschlüsselt, wenn mit # beginnt)
4. **Bestätigen**: Überprüfen und auf "Senden" klicken
5. **Genehmigen**: Im Popup-Fenster bestätigen

### Geld Empfangen

1. Auf die Schaltfläche "Empfangen" klicken
2. Ihr Benutzername wird mit einem QR-Code angezeigt
3. Teilen Sie Ihren Benutzernamen mit dem Absender
4. Geld erscheint automatisch in Ihrem Guthaben

## Verwendung mit dApps

Gravity Wallet ist kompatibel mit **allen Frontends**, die die Hive Keychain API auf den Blockchains Blurt, Hive und Steem unterstützen.

### Blurt Frontends

1. **Zu einem beliebigen Blurt Frontend navigieren**:
   - [blurt.blog](https://blurt.blog) - Offizielles Blurt Frontend
   - [blurt.world](https://blurt.world) - Community Frontend
   - [blurt.one](https://blurt.one) - Alternatives Frontend

2. **Auf Anmelden Klicken**: Option "Hive Keychain" oder "Keychain" auswählen
3. **Gravity Wallet Aktiviert Sich**: Ein Popup erscheint
4. **Verbindung Genehmigen**: Auf "Genehmigen" klicken, um sich zu verbinden
5. **Nutzung Beginnen**: Sie können jetzt posten, abstimmen und kommentieren

### Hive Frontends

Kompatibel mit allen wichtigen Hive dApps:
- **[PeakD](https://peakd.com)**: Vollständige Blogging-Plattform
- **[Ecency](https://ecency.com)**: Mobilfreundliche soziale Plattform
- **[Hive.blog](https://hive.blog)**: Offizielles Hive Frontend
- **[LeoFinance](https://leofinance.io)**: Finanzorientierte Community
- **[Tribaldex](https://tribaldex.com)**: Token-Handelsplattform
- **[Splinterlands](https://splinterlands.com)**: Sammelkartenspiel
- **Und viele mehr!**

### Steem Frontends

Funktioniert nahtlos mit Steem-Plattformen:
- **[Steemit](https://steemit.com)**: Offizielles Steem Frontend
- **[SteemPeak](https://steempeak.com)**: Community-Plattform
- **[Busy](https://busy.org)**: Alternative Steem-Oberfläche

### Wie Es Funktioniert

Gravity Wallet emuliert die **Hive Keychain API**, wodurch es mit jeder dApp kompatibel ist, die Keychain unterstützt. Wenn eine dApp eine Aktion anfordert:

1. **Automatische Erkennung**: dApp erkennt Gravity Wallet als Keychain
2. **Popup Erscheint**: Sie sehen die Anforderungsdetails
3. **Überprüfen & Genehmigen**: Überprüfen Sie die Operation und genehmigen Sie
4. **Transaktions-Broadcast**: Gravity Wallet signiert und sendet an die richtige Blockchain

**Hinweis**: Überprüfen Sie immer, dass Sie auf der richtigen Blockchain sind, bevor Sie Transaktionen genehmigen!

## Sicherheits-Best-Practices

### Passwort-Sicherheit
- ✅ Verwenden Sie ein einzigartiges, starkes Passwort
- ✅ Teilen Sie Ihr Passwort niemals
- ✅ Speichern Sie das Passwort in einem Passwort-Manager
- ❌ Verwenden Sie nicht dasselbe Passwort wie bei anderen Diensten

### Schlüsselverwaltung
- ✅ Importieren Sie nur die Schlüssel, die Sie benötigen
- ✅ Bewahren Sie eine Offline-Sicherung Ihrer Schlüssel auf
- ✅ Verwenden Sie den Posting-Schlüssel für tägliche Aktivitäten
- ❌ Teilen Sie Ihre privaten Schlüssel niemals mit jemandem

### Browser-Sicherheit
- ✅ Halten Sie Ihren Browser aktuell
- ✅ Installieren Sie nur Erweiterungen aus vertrauenswürdigen Quellen
- ✅ Sperren Sie Ihre Wallet, wenn sie nicht verwendet wird
- ❌ Verwenden Sie sie nicht auf öffentlichen/gemeinsam genutzten Computern

## Nächste Schritte

- [Benutzerhandbuch](User-Guide-DE) - Lernen Sie alle Funktionen im Detail
- [Erweiterte Funktionen](Advanced-Features-DE) - Massenüberweisungen, MultiSig und mehr
- [Fehlerbehebung](Troubleshooting-DE) - Häufige Probleme und Lösungen

## Brauchen Sie Hilfe?

- **GitHub Issues**: [Probleme melden](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Diskussionen**: [Fragen stellen](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
