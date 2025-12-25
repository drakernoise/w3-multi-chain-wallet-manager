# Verifica della Firma - Gravity Messenger

## Panoramica

Gravity Messenger ora supporta la **verifica della firma crittografica** per una sicurezza avanzata. Questa funzionalità opzionale consente agli utenti di dimostrare la proprietà della loro identità di chat utilizzando firme ECDSA, prevenendo attacchi di impersonificazione.

## Come funziona

Il flusso di autenticazione utilizza un **protocollo challenge-response**:

1. **Il client richiede una challenge** dal server fornendo il proprio ID utente
2. **Il server genera una challenge casuale di 32 byte** e la invia al client
3. **Il client firma la challenge** utilizzando la propria chiave privata (ECDSA con SHA-256)
4. **Il server verifica la firma** utilizzando la chiave pubblica memorizzata
5. **Se valida**, l'utente viene autenticato e ottiene l'accesso alle proprie stanze

## Vantaggi di sicurezza

- **Previene attacchi replay**: Ogni challenge è unica e scade dopo 5 minuti
- **Prova crittografica dell'identità**: Solo il possessore della chiave privata può autenticarsi
- **Nessuna trasmissione di password**: La chiave privata non lascia mai il client
- **Retrocompatibile**: La registrazione basata sul nome utente funziona ancora

## Considerazioni sulla sicurezza

### Scadenza della challenge
Le challenge scadono dopo **5 minuti** per prevenire attacchi replay. Se una challenge scade, richiedine una nuova.

### Archiviazione delle chiavi
- **Le chiavi pubbliche** sono memorizzate sul server per la verifica
- **Le chiavi private** devono essere archiviate in modo sicuro sul client (vault crittografato)
- Non trasmettere mai le chiavi private sulla rete

---

**Nota sulla sicurezza**: Questa funzionalità è opzionale e complementa il sistema di autenticazione esistente. Per la massima sicurezza, combina la verifica della firma con altre misure di sicurezza come la limitazione della velocità, la whitelist IP e il monitoraggio delle attività sospette.
