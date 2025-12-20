# Sicherheitsrichtlinie

**Sprachen:** [🇬🇧 English](SECURITY.md) | [🇪🇸 Español](SECURITY.es.md) | [🇫🇷 Français](SECURITY.fr.md) | [🇩🇪 Deutsch](SECURITY.de.md) | [🇮🇹 Italiano](SECURITY.it.md)

---

## 🔐 Sicherheitsübersicht

Gravity Wallet ist eine Browser-Erweiterung, die sensible kryptografische Operationen und private Schlüssel verwaltet. Wir nehmen Sicherheit sehr ernst und schätzen die Bemühungen der Sicherheitsforschungsgemeinschaft, unsere Benutzer zu schützen.

## 📋 Unterstützte Versionen

| Version | Unterstützt        | Status |
| ------- | ------------------ | ------ |
| 1.0.x   | ✅ Ja | Aktuelle stabile Version |
| < 1.0   | ❌ Nein  | Alte Versionen - bitte aktualisieren |

**Empfehlung:** Verwenden Sie immer die neueste stabile Version aus dem [Releases](https://github.com/drakernoise/w3-multi-chain-wallet-manager/releases)-Bereich.

## 🚨 Eine Sicherheitslücke Melden

### Wo Melden

Erstellen Sie **KEINE** öffentlichen GitHub-Issues für Sicherheitslücken. Stattdessen:

1. **E-Mail:** Senden Sie Details an `drakernoise@protonmail.com`
2. **Betreff:** `[SECURITY] Gravity Wallet - [Kurze Beschreibung]`
3. **Verschlüsselung:** Für sensible Informationen fordern Sie unseren PGP-Schlüssel an

### Was Einschließen

Bitte geben Sie an:

- **Beschreibung:** Klare Erklärung der Sicherheitslücke
- **Auswirkung:** Was könnte ein Angreifer mit dieser Sicherheitslücke tun?
- **Schritte zur Reproduktion:** Detaillierte Schritte zur Reproduktion des Problems
- **Betroffene Versionen:** Welche Versionen sind betroffen?
- **Proof of Concept:** Code, Screenshots oder Video (falls zutreffend)

### Reaktionszeit

- **Erste Antwort:** Innerhalb von 48 Stunden
- **Statusaktualisierung:** Alle 7 Tage bis zur Lösung
- **Behebungszeit:** 
  - Kritisch: 7 Tage
  - Hoch: 14 Tage
  - Mittel: 30 Tage
  - Niedrig: 60 Tage

## 🛡️ Sicherheits-Best-Practices

### Sicherheit Privater Schlüssel

⚠️ **KRITISCH:** Gravity Wallet speichert Ihre privaten Schlüssel lokal im verschlüsselten Speicher Ihres Browsers.

**Best Practices:**
1. ✅ **Teilen Sie niemals Ihre privaten Schlüssel** mit jemandem
2. ✅ **Sichern Sie Ihre Schlüssel** sicher offline
3. ✅ **Verwenden Sie starke Passwörter**
4. ✅ **Halten Sie Ihren Browser aktuell**
5. ✅ **Laden Sie nur** von offiziellen Quellen herunter
6. ❌ **Geben Sie niemals Schlüssel** auf verdächtigen Websites ein
7. ❌ **Machen Sie keine Screenshots** Ihrer Schlüssel

### Phishing-Schutz

⚠️ **Häufige Phishing-Taktiken:**
- Gefälschte Websites, die legitimen Frontends ähneln
- E-Mails, die nach Ihren privaten Schlüsseln fragen
- Browser-Erweiterungen, die Gravity Wallet imitieren

**Schutz:**
- ✅ Überprüfen Sie immer die URL, bevor Sie Anmeldeinformationen eingeben
- ✅ Setzen Sie vertrauenswürdige Frontends als Lesezeichen
- ✅ Aktivieren Sie den Phishing-Schutz des Browsers
- ❌ Klicken Sie niemals auf verdächtige Links

## 🔍 Sicherheitsfunktionen

### Aktuelle Sicherheitsmaßnahmen

- ✅ **Nur Lokale Speicherung:** Schlüssel verlassen niemals Ihr Gerät
- ✅ **Browser-Verschlüsselung:** Verwendet verschlüsselte Speicher-API
- ✅ **Keine Analytik:** Kein Tracking oder Datenerfassung
- ✅ **Open Source:** Code ist öffentlich prüfbar
- ✅ **Whitelist-System:** Kontrollieren Sie, welche Websites automatisch signieren können
- ✅ **Manuelle Bestätigung:** Finanzoperationen erfordern explizite Genehmigung

## 🔗 Kontakt

- **Sicherheitsprobleme:** drakernoise@protonmail.com
- **Allgemeiner Support:** [GitHub Issues](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Diskussionen:** [GitHub Discussions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)

---

**Letzte Aktualisierung:** 20. Dezember 2025  
**Version:** 1.0

Vielen Dank, dass Sie helfen, Gravity Wallet und unsere Benutzer sicher zu halten! 🙏
