# Iniziare con Gravity Wallet

## Installazione

### Chrome/Brave/Edge

1. **Scaricare l'Estensione**
   - Clona il repository o scarica l'ultima versione
   ```bash
   git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.git
   cd w3-multi-chain-wallet-manager
   ```

2. **Compilare l'Estensione**
   ```bash
   npm install
   npm run build
   ```

3. **Caricare nel Browser**
   - Apri Chrome e naviga su `chrome://extensions/`
   - Attiva la "Modalità sviluppatore" (interruttore in alto a destra)
   - Clicca su "Carica estensione non pacchettizzata"
   - Seleziona la cartella `dist` dalla directory del progetto

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

Gravity Wallet è compatibile con **tutti i frontend** che supportano l'API Hive Keychain sulle blockchain Blurt, Hive e Steem.

### Frontend Blurt

1. **Navigare su qualsiasi frontend Blurt**:
   - [blurt.blog](https://blurt.blog) - Frontend ufficiale di Blurt
   - [blurt.world](https://blurt.world) - Frontend della comunità
   - [blurt.one](https://blurt.one) - Frontend alternativo

2. **Cliccare su Accedi**: Seleziona l'opzione "Hive Keychain" o "Keychain"
3. **Gravity Wallet si Attiva**: Apparirà un popup
4. **Approvare la Connessione**: Clicca su "Approva" per connetterti
5. **Iniziare a Usare**: Ora puoi postare, votare e commentare

### Frontend Hive

Compatibile con tutte le principali dApp di Hive:
- **[PeakD](https://peakd.com)**: Piattaforma di blogging completa
- **[Ecency](https://ecency.com)**: Piattaforma sociale ottimizzata per mobile
- **[Hive.blog](https://hive.blog)**: Frontend ufficiale di Hive
- **[LeoFinance](https://leofinance.io)**: Comunità focalizzata sulla finanza
- **[Tribaldex](https://tribaldex.com)**: Piattaforma di scambio token
- **[Splinterlands](https://splinterlands.com)**: Gioco di carte collezionabili
- **E molte altre!**

### Frontend Steem

Funziona perfettamente con le piattaforme Steem:
- **[Steemit](https://steemit.com)**: Frontend ufficiale di Steem
- **[SteemPeak](https://steempeak.com)**: Piattaforma della comunità
- **[Busy](https://busy.org)**: Interfaccia alternativa di Steem

### Come Funziona

Gravity Wallet emula l'**API Hive Keychain**, rendendolo compatibile con qualsiasi dApp che supporti Keychain. Quando una dApp richiede un'azione:

1. **Rilevamento Automatico**: La dApp rileva Gravity Wallet come Keychain
2. **Popup Appare**: Vedi i dettagli della richiesta
3. **Rivedere e Approvare**: Verifica l'operazione e approva
4. **Trasmissione Transazione**: Gravity Wallet firma e trasmette alla blockchain corretta

**Nota**: Verifica sempre di essere sulla blockchain corretta prima di approvare le transazioni!

## Migliori Pratiche di Sicurezza

### Sicurezza della Password
- ✅ Usa una password unica e forte
- ✅ Non condividere mai la tua password
- ✅ Conserva la password in un gestore di password
- ❌ Non usare la stessa password di altri servizi

### Gestione delle Chiavi
- ✅ Importa solo le chiavi di cui hai bisogno
- ✅ Mantieni un backup delle tue chiavi offline
- ✅ Usa la chiave di posting per attività quotidiane
- ❌ Non condividere mai le tue chiavi private con nessuno

### Sicurezza del Browser
- ✅ Mantieni il tuo browser aggiornato
- ✅ Installa solo estensioni da fonti affidabili
- ✅ Blocca il tuo portafoglio quando non lo usi
- ❌ Non usare su computer pubblici/condivisi

## Prossimi Passi

- [Guida Utente](User-Guide-IT) - Impara tutte le funzionalità in dettaglio
- [Funzionalità Avanzate](Advanced-Features-IT) - Trasferimenti di massa, MultiSig e altro
- [Risoluzione Problemi](Troubleshooting-IT) - Problemi comuni e soluzioni

## Hai Bisogno di Aiuto?

- **GitHub Issues**: [Segnala problemi](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Discussioni**: [Fai domande](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
