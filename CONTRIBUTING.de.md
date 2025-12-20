# Zu Gravity Wallet Beitragen

**Sprachen:** [🇬🇧 English](CONTRIBUTING.md) | [🇪🇸 Español](CONTRIBUTING.es.md) | [🇫🇷 Français](CONTRIBUTING.fr.md) | [🇩🇪 Deutsch](CONTRIBUTING.de.md) | [🇮🇹 Italiano](CONTRIBUTING.it.md)

---

Zunächst einmal, vielen Dank, dass Sie erwägen, zu Gravity Wallet beizutragen! 🎉

## 📋 Inhaltsverzeichnis

- [Verhaltenskodex](#verhaltenskodex)
- [Wie Kann Ich Beitragen](#wie-kann-ich-beitragen)
- [Entwicklungssetup](#entwicklungssetup)
- [Pull Request Prozess](#pull-request-prozess)
- [Code-Standards](#code-standards)

## 📜 Verhaltenskodex

### Unsere Standards

**Positives Verhalten:**
- ✅ Einladende und inklusive Sprache verwenden
- ✅ Unterschiedliche Standpunkte respektieren
- ✅ Konstruktive Kritik würdevoll annehmen
- ✅ Sich auf das Beste für die Gemeinschaft konzentrieren

**Inakzeptables Verhalten:**
- ❌ Trolling, beleidigende Kommentare und persönliche Angriffe
- ❌ Öffentliche oder private Belästigung
- ❌ Veröffentlichung privater Informationen ohne Erlaubnis

## 🤝 Wie Kann Ich Beitragen

### Bugs Melden

**Beim Melden eines Bugs, fügen Sie hinzu:**
- 📝 Klarer und beschreibender Titel
- 🔍 Schritte zur Reproduktion des Verhaltens
- 💡 Erwartetes vs. tatsächliches Verhalten
- 📸 Screenshots (falls zutreffend)
- 🖥️ Umgebungsdetails (Browser, OS, Version)

### Verbesserungen Vorschlagen

**Beim Vorschlagen einer Verbesserung, fügen Sie hinzu:**
- 📝 Klarer und beschreibender Titel
- 💡 Detaillierte Beschreibung der vorgeschlagenen Funktion
- 🎯 Anwendungsfälle und Vorteile

### Sicherheitslücken

**⚠️ WICHTIG:** Erstellen Sie KEINE öffentlichen Issues für Sicherheitslücken.

Bitte melden Sie Sicherheitsprobleme privat an: `drakernoise@protonmail.com`

Siehe unsere [Sicherheitsrichtlinie](SECURITY.de.md) für weitere Details.

## 🛠️ Entwicklungssetup

### Voraussetzungen

- **Node.js**: v16 oder höher
- **npm**: v8 oder höher
- **Git**: Neueste Version
- **Browser**: Chrome, Brave oder Edge

### Installation

```bash
# Klonen Sie Ihren Fork
git clone https://github.com/IHR_NAME/w3-multi-chain-wallet-manager.git
cd w3-multi-chain-wallet-manager

# Abhängigkeiten installieren
npm install

# Extension bauen
npm run build
```

### Extension Laden

1. Öffnen Sie Chrome/Brave/Edge
2. Navigieren Sie zu `chrome://extensions`
3. Aktivieren Sie den "Entwicklermodus"
4. Klicken Sie auf "Entpackte Erweiterung laden"
5. Wählen Sie den `dist` Ordner

## 🔄 Pull Request Prozess

### Vor dem Einreichen

- ✅ **Testen Sie Ihre Änderungen** gründlich
- ✅ **Aktualisieren Sie die Dokumentation** falls nötig
- ✅ **Folgen Sie den Code-Standards**
- ✅ **Schreiben Sie aussagekräftige Commit-Nachrichten**
- ✅ **Stellen Sie sicher, dass keine Konsolenfehler auftreten**

### PR-Richtlinien

1. **Titel**: Verwenden Sie einen klaren, beschreibenden Titel
2. **Beschreibung**: Fügen Sie hinzu, was geändert wurde, warum und wie man testet
3. **Größe**: Halten Sie PRs fokussiert und angemessen groß

## 💻 Code-Standards

### TypeScript/JavaScript

```typescript
// ✅ Gut
export const transferFunds = async (
    chain: Chain,
    from: string,
    to: string,
    amount: string
): Promise<TransferResult> => {
    // Klare, beschreibende Funktion
    // Richtige Typisierung
};

// ❌ Schlecht
function transfer(a, b, c) {
    // Keine Typen
    // Unklare Parameter
}
```

### Namenskonventionen

- **Dateien**: `camelCase.ts` oder `PascalCase.tsx`
- **Komponenten**: `PascalCase`
- **Funktionen**: `camelCase`
- **Konstanten**: `UPPER_SNAKE_CASE`

## 📝 Commit-Nachrichten Leitfaden

Wir folgen der [Conventional Commits](https://www.conventionalcommits.org/) Spezifikation.

### Typen

- `feat`: Neue Funktion
- `fix`: Fehlerbehebung
- `docs`: Dokumentationsänderungen
- `style`: Code-Stiländerungen
- `refactor`: Code-Refactoring

### Beispiele

```bash
feat(wallet): Hive Resource Credits Unterstützung hinzufügen
fix(transfer): Memo-Kodierungsproblem auf Blurt beheben
docs(readme): Installationsanweisungen aktualisieren
```

## 🧪 Tests

### Manuelle Test-Checkliste

- [ ] Extension lädt ohne Fehler
- [ ] Alle bestehenden Funktionen funktionieren weiterhin
- [ ] Neue Funktion funktioniert wie erwartet
- [ ] Keine Konsolen-Fehler oder Warnungen
- [ ] Funktioniert auf verschiedenen Chains (Hive, Steem, Blurt)

## 🏆 Anerkennung

Mitwirkende werden:
- In den Release-Notes aufgeführt
- Im README erwähnt
- Zur Mitwirkenden-Liste hinzugefügt

## 📞 Hilfe Erhalten

- **Fragen**: Verwenden Sie [GitHub Discussions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
- **Bugs**: Erstellen Sie ein [Issue](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)

## 📄 Lizenz

Durch Beiträge stimmen Sie zu, dass Ihre Beiträge unter der MIT-Lizenz lizenziert werden.

---

**Vielen Dank für Ihren Beitrag zu Gravity Wallet!** 🙏

Viel Spaß beim Programmieren! 💻✨
