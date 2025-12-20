# Contribuire a Gravity Wallet

**Lingue:** [🇬🇧 English](CONTRIBUTING.md) | [🇪🇸 Español](CONTRIBUTING.es.md) | [🇫🇷 Français](CONTRIBUTING.fr.md) | [🇩🇪 Deutsch](CONTRIBUTING.de.md) | [🇮🇹 Italiano](CONTRIBUTING.it.md)

---

Prima di tutto, grazie per aver considerato di contribuire a Gravity Wallet! 🎉

## 📋 Indice

- [Codice di Condotta](#codice-di-condotta)
- [Come Posso Contribuire](#come-posso-contribuire)
- [Configurazione di Sviluppo](#configurazione-di-sviluppo)
- [Processo di Pull Request](#processo-di-pull-request)
- [Standard di Codice](#standard-di-codice)

## 📜 Codice di Condotta

### I Nostri Standard

**Comportamento positivo:**
- ✅ Usare un linguaggio accogliente e inclusivo
- ✅ Rispettare punti di vista diversi
- ✅ Accettare con grazia le critiche costruttive
- ✅ Concentrarsi su ciò che è meglio per la comunità

**Comportamento inaccettabile:**
- ❌ Trolling, commenti offensivi e attacchi personali
- ❌ Molestie pubbliche o private
- ❌ Pubblicazione di informazioni private senza permesso

## 🤝 Come Posso Contribuire

### Segnalare Bug

**Quando segnali un bug, includi:**
- 📝 Titolo chiaro e descrittivo
- 🔍 Passaggi per riprodurre il comportamento
- 💡 Comportamento atteso vs comportamento effettivo
- 📸 Screenshot (se applicabile)
- 🖥️ Dettagli dell'ambiente (browser, OS, versione)

### Suggerire Miglioramenti

**Quando suggerisci un miglioramento, includi:**
- 📝 Titolo chiaro e descrittivo
- 💡 Descrizione dettagliata della funzionalità proposta
- 🎯 Casi d'uso e benefici

### Vulnerabilità di Sicurezza

**⚠️ IMPORTANTE:** NON creare issue pubblici per vulnerabilità di sicurezza.

Si prega di segnalare i problemi di sicurezza privatamente a: `drakernoise@protonmail.com`

Vedi la nostra [Politica di Sicurezza](SECURITY.it.md) per maggiori dettagli.

## 🛠️ Configurazione di Sviluppo

### Prerequisiti

- **Node.js**: v16 o superiore
- **npm**: v8 o superiore
- **Git**: Ultima versione
- **Browser**: Chrome, Brave o Edge

### Installazione

```bash
# Clona il tuo fork
git clone https://github.com/TUO_NOME/w3-multi-chain-wallet-manager.git
cd w3-multi-chain-wallet-manager

# Installa le dipendenze
npm install

# Compila l'estensione
npm run build
```

### Caricare l'Estensione

1. Apri Chrome/Brave/Edge
2. Naviga su `chrome://extensions`
3. Attiva la "Modalità sviluppatore"
4. Clicca su "Carica estensione non pacchettizzata"
5. Seleziona la cartella `dist`

## 🔄 Processo di Pull Request

### Prima di Inviare

- ✅ **Testa le tue modifiche** accuratamente
- ✅ **Aggiorna la documentazione** se necessario
- ✅ **Segui gli standard di codice**
- ✅ **Scrivi messaggi di commit significativi**
- ✅ **Assicurati che non ci siano errori nella console**

### Linee Guida PR

1. **Titolo**: Usa un titolo chiaro e descrittivo
2. **Descrizione**: Includi cosa è cambiato, perché e come testare
3. **Dimensione**: Mantieni i PR focalizzati e di dimensioni ragionevoli

## 💻 Standard di Codice

### TypeScript/JavaScript

```typescript
// ✅ Buono
export const transferFunds = async (
    chain: Chain,
    from: string,
    to: string,
    amount: string
): Promise<TransferResult> => {
    // Funzione chiara e descrittiva
    // Tipizzazione appropriata
};

// ❌ Cattivo
function transfer(a, b, c) {
    // Nessun tipo
    // Parametri poco chiari
}
```

### Convenzioni di Denominazione

- **File**: `camelCase.ts` o `PascalCase.tsx`
- **Componenti**: `PascalCase`
- **Funzioni**: `camelCase`
- **Costanti**: `UPPER_SNAKE_CASE`

## 📝 Guida ai Messaggi di Commit

Seguiamo la specifica [Conventional Commits](https://www.conventionalcommits.org/).

### Tipi

- `feat`: Nuova funzionalità
- `fix`: Correzione di bug
- `docs`: Modifiche alla documentazione
- `style`: Modifiche allo stile del codice
- `refactor`: Refactoring del codice

### Esempi

```bash
feat(wallet): Aggiungere supporto per Resource Credits Hive
fix(transfer): Risolvere problema di codifica memo su Blurt
docs(readme): Aggiornare istruzioni di installazione
```

## 🧪 Test

### Lista di Controllo Test Manuali

- [ ] L'estensione si carica senza errori
- [ ] Tutte le funzionalità esistenti funzionano ancora
- [ ] La nuova funzionalità funziona come previsto
- [ ] Nessun errore o avviso nella console
- [ ] Funziona su diverse chain (Hive, Steem, Blurt)

## 🏆 Riconoscimento

I contributori saranno:
- Elencati nelle note di rilascio
- Menzionati nel README
- Aggiunti alla lista dei contributori

## 📞 Ottenere Aiuto

- **Domande**: Usa [GitHub Discussions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
- **Bug**: Crea un [Issue](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)

## 📄 Licenza

Contribuendo, accetti che i tuoi contributi saranno concessi in licenza sotto la Licenza MIT.

---

**Grazie per aver contribuito a Gravity Wallet!** 🙏

Buona programmazione! 💻✨
