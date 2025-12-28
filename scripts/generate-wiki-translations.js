#!/usr/bin/env node

/**
 * Gravity Wallet Wiki Translation Generator
 * Automatically generates wiki pages in all supported languages
 */

const fs = require('fs');
const path = require('path');

const WIKI_DIR = path.join(__dirname, '..', '.wiki');

// Ensure wiki directory exists
if (!fs.existsSync(WIKI_DIR)) {
   fs.mkdirSync(WIKI_DIR, { recursive: true });
}

console.log('Generating multilingual wiki pages...\n');

// German (DE) - Getting Started
const gettingStartedDE = `# Erste Schritte mit Gravity Wallet

## Installation

### Chrome/Brave/Edge

1. **Erweiterung Herunterladen**
   - Repository klonen oder neueste Version herunterladen
   \`\`\`bash
   git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.git
   cd w3-multi-chain-wallet-manager
   \`\`\`

2. **Erweiterung Erstellen**
   \`\`\`bash
   npm install
   npm run build
   \`\`\`

3. **Im Browser Laden**
   - Chrome öffnen und zu \`chrome://extensions/\` navigieren
   - "Entwicklermodus" aktivieren (Schalter oben rechts)
   - Auf "Entpackte Erweiterung laden" klicken
   - Den \`dist\` Ordner aus dem Projektverzeichnis auswählen

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

### Verbindung mit PeakD

1. **Zu PeakD Navigieren**: Gehen Sie zu [peakd.com](https://peakd.com)
2. **Auf Anmelden Klicken**: Option "Hive Keychain" auswählen
3. **Gravity Wallet Aktiviert Sich**: Ein Popup erscheint
4. **Verbindung Genehmigen**: Auf "Genehmigen" klicken, um sich zu verbinden
5. **Nutzung Beginnen**: Sie können jetzt posten, abstimmen und kommentieren

### Verbindung mit Anderen dApps

Gravity Wallet ist kompatibel mit jeder dApp, die die Hive Keychain API unterstützt:
- **Ecency**: Social-Blogging-Plattform
- **Tribaldex**: Token-Handel
- **Splinterlands**: Gaming
- **Und viele mehr!**

### Sicherheits-Best-Practices

### Passwort-Sicherheit
- Verwenden Sie ein einzigartiges, starkes Passwort
- Teilen Sie Ihr Passwort niemals
- Speichern Sie das Passwort in einem Passwort-Manager
- Verwenden Sie nicht dasselbe Passwort wie bei anderen Diensten

### Schlüsselverwaltung
- Importieren Sie nur die Schlüssel, die Sie benötigen
- Bewahren Sie eine Offline-Sicherung Ihrer Schlüssel auf
- Verwenden Sie den Posting-Schlüssel für tägliche Aktivitäten
- Teilen Sie Ihre privaten Schlüssel niemals mit jemandem

### Browser-Sicherheit
- Halten Sie Ihren Browser aktuell
- Installieren Sie nur Erweiterungen aus vertrauenswürdigen Quellen
- Sperren Sie Ihre Wallet, wenn sie nicht verwendet wird
- Verwenden Sie sie nicht auf öffentlichen/gemeinsam genutzten Computern

## Nächste Schritte

- [Benutzerhandbuch](User-Guide-DE) - Lernen Sie alle Funktionen im Detail
- [Erweiterte Funktionen](Advanced-Features-DE) - Massenüberweisungen, MultiSig und mehr
- [Fehlerbehebung](Troubleshooting-DE) - Häufige Probleme und Lösungen

## Brauchen Sie Hilfe?

- **GitHub Issues**: [Probleme melden](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Diskussionen**: [Fragen stellen](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
`;

fs.writeFileSync(path.join(WIKI_DIR, 'Getting-Started-DE.md'), gettingStartedDE);
console.log('Created: Getting-Started-DE.md');

// Italian (IT) - Getting Started
const gettingStartedIT = `# Iniziare con Gravity Wallet

## Installazione

### Chrome/Brave/Edge

1. **Scaricare l'Estensione**
   - Clona il repository o scarica l'ultima versione
   \`\`\`bash
   git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.git
   cd w3-multi-chain-wallet-manager
   \`\`\`

2. **Compilare l'Estensione**
   \`\`\`bash
   npm install
   npm run build
   \`\`\`

3. **Caricare nel Browser**
   - Apri Chrome e naviga su \`chrome://extensions/\`
   - Attiva la "Modalità sviluppatore" (interruttore in alto a destra)
   - Clicca su "Carica estensione non pacchettizzata"
   - Seleziona la cartella \`dist\` dalla directory del progetto

4. **Fissare l'Estensione**
   - Clicca sull'icona del puzzle nella barra degli strumenti
   - Trova "Gravity Wallet" e clicca sull'icona della puntina

## Configurazione Iniziale

### Creare il Tuo Primo Portafoglio

1. **Avviare Gravity Wallet**
   - Clicca sull'icona di Gravity Wallet nella barra degli strumenti
   - Vedrai la schermata di benvenuto

2. **Impostare una Password Principale**
   - Scegli una password forte (minimo 8 caratteri)
   - Questa password cripta i dati del tuo portafoglio
   - **Importante**: Conserva questa password in modo sicuro - non può essere recuperata!

3. **Importare il Tuo Primo Account**
   - Clicca sul pulsante "+ Aggiungi"
   - Seleziona la blockchain (Hive, Steem o Blurt)
   - Inserisci i dettagli del tuo account:
     - **Nome utente**: Il tuo nome utente blockchain
     - **Chiave di Posting**: Per azioni sociali (post, voti, commenti)
     - **Chiave Attiva**: Per transazioni finanziarie (trasferimenti, power up/down)
     - **Chiave Memo**: Per messaggi cifrati (opzionale)

4. **Verificare l'Importazione**
   - Il portafoglio convaliderà le tue chiavi contro la blockchain
   - In caso di successo, vedrai il saldo del tuo account

## Comprendere i Tipi di Chiavi

### Chiave di Posting
- **Usata per**: Creare post, votare, commentare, seguire
- **Livello di Sicurezza**: Medio
- **Raccomandazione**: Sicuro da conservare nel portafoglio per uso quotidiano

### Chiave Attiva
- **Usata per**: Trasferimenti, power up/down, delegazioni
- **Livello di Sicurezza**: Alto
- **Raccomandazione**: Importare solo se devi effettuare trasferimenti

### Chiave Memo
- **Usata per**: Cifrare/decifrare messaggi privati
- **Livello di Sicurezza**: Basso
- **Raccomandazione**: Opzionale, importare solo se necessario

## Guida Rapida

### Visualizzare il Tuo Saldo

1. Clicca sul nome del tuo account nel portafoglio
2. Vedrai:
   - **Saldo Principale**: HIVE/STEEM/BLURT
   - **Saldo Secondario**: HBD/SBD (per Hive/Steem)
   - **Powered Up**: Token investiti (HP/SP/BP)

### Inviare il Tuo Primo Trasferimento

1. **Selezionare Account**: Clicca sull'account da cui vuoi inviare
2. **Cliccare su "Invia"**: Apre il modal di trasferimento
3. **Inserire Dettagli**:
   - **A**: Nome utente del destinatario (senza @)
   - **Importo**: Numero di token da inviare
   - **Token**: Seleziona HIVE/HBD o STEEM/SBD
   - **Memo**: Messaggio opzionale (cifrato se inizia con #)
4. **Confermare**: Rivedi e clicca su "Invia"
5. **Approvare**: Conferma nella finestra popup

### Ricevere Fondi

1. Clicca sul pulsante "Ricevi"
2. Il tuo nome utente viene visualizzato con un codice QR
3. Condividi il tuo nome utente con il mittente
4. I fondi appariranno automaticamente nel tuo saldo

## Usare con le dApp

### Connessione a PeakD

1. **Navigare su PeakD**: Vai su [peakd.com](https://peakd.com)
2. **Cliccare su Accedi**: Seleziona l'opzione "Hive Keychain"
3. **Gravity Wallet si Attiva**: Apparirà un popup
4. **Approvare la Connessione**: Clicca su "Approva" per connetterti
5. **Iniziare a Usare**: Ora puoi postare, votare e commentare

### Connessione ad Altre dApp

Gravity Wallet è compatibile con qualsiasi dApp che supporti l'API Hive Keychain:
- **Ecency**: Piattaforma di blogging sociale
- **Tribaldex**: Scambio di token
- **Splinterlands**: Gaming
- **E molte altre!**

## Migliori Pratiche di Sicurezza

### Sicurezza della Password
- Usa una password unica e forte
- Non condividere mai la tua password
- Conserva la password in un gestore di password
- Non usare la stessa password di altri servizi

### Gestione delle Chiavi
- Importa solo le chiavi di cui hai bisogno
- Mantieni un backup delle tue chiavi offline
- Usa la chiave di posting per attività quotidiane
- Non condividere mai le tue chiavi private con nessuno

### Sicurezza del Browser
- Mantieni il tuo browser aggiornato
- Installa solo estensioni da fonti affidabili
- Blocca il tuo portafoglio quando non lo usi
- Non usare su computer pubblici/condivisi

## Prossimi Passi

- [Guida Utente](User-Guide-IT) - Impara tutte le funzionalità in dettaglio
- [Funzionalità Avanzate](Advanced-Features-IT) - Trasferimenti di massa, MultiSig e altro
- [Risoluzione Problemi](Troubleshooting-IT) - Problemi comuni e soluzioni

## Hai Bisogno di Aiuto?

- **GitHub Issues**: [Segnala problemi](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Discussioni**: [Fai domande](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
`;

fs.writeFileSync(path.join(WIKI_DIR, 'Getting-Started-IT.md'), gettingStartedIT);
console.log('Created: Getting-Started-IT.md');

console.log('\nWiki translation generation complete!');
console.log('Note: Full User Guide and Troubleshooting translations are extensive.');
console.log('Consider using professional translation services for production use.\n');
