# Signaturverifizierung - Gravity Messenger

## Überblick

Gravity Messenger unterstützt jetzt die **kryptografische Signaturverifizierung** für erhöhte Sicherheit. Diese optionale Funktion ermöglicht es Benutzern, den Besitz ihrer Chat-Identität mithilfe von ECDSA-Signaturen nachzuweisen und verhindert Identitätsdiebstahl-Angriffe.

## Wie es funktioniert

Der Authentifizierungsablauf verwendet ein **Challenge-Response-Protokoll**:

1. **Der Client fordert eine Challenge** vom Server an, indem er seine Benutzer-ID bereitstellt
2. **Der Server generiert eine zufällige 32-Byte-Challenge** und sendet sie an den Client
3. **Der Client signiert die Challenge** mit seinem privaten Schlüssel (ECDSA mit SHA-256)
4. **Der Server verifiziert die Signatur** mithilfe des gespeicherten öffentlichen Schlüssels
5. **Wenn gültig**, wird der Benutzer authentifiziert und erhält Zugriff auf seine Räume

## Sicherheitsvorteile

- **Verhindert Replay-Angriffe**: Jede Challenge ist einzigartig und läuft nach 5 Minuten ab
- **Kryptografischer Identitätsnachweis**: Nur der Inhaber des privaten Schlüssels kann sich authentifizieren
- **Keine Passwortübertragung**: Der private Schlüssel verlässt niemals den Client
- **Rückwärtskompatibel**: Die reguläre benutzernamenbasierte Registrierung funktioniert weiterhin

## Sicherheitsüberlegungen

### Challenge-Ablauf
Challenges laufen nach **5 Minuten** ab, um Replay-Angriffe zu verhindern. Wenn eine Challenge abläuft, fordern Sie eine neue an.

### Schlüsselspeicherung
- **Öffentliche Schlüssel** werden auf dem Server zur Verifizierung gespeichert
- **Private Schlüssel** müssen sicher auf dem Client gespeichert werden (verschlüsselter Tresor)
- Niemals private Schlüssel über das Netzwerk übertragen

---

**Sicherheitshinweis**: Diese Funktion ist optional und ergänzt das bestehende Authentifizierungssystem. Für maximale Sicherheit kombinieren Sie die Signaturverifizierung mit anderen Sicherheitsmaßnahmen wie Ratenbegrenzung, IP-Whitelisting und Überwachung verdächtiger Aktivitäten.
