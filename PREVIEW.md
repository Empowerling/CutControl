# 🎬 Vorschau-Anleitung

## Next.js App (Neue Version)

**URL:** http://localhost:3000

### Verfügbare Routen:

1. **Startseite** (`/`)
   - Navigation zu Admin und Booking

2. **Admin Kalender** (`/admin`)
   - Multi-Spalten Kalender-Ansicht
   - Wochen-Navigation
   - Terminvisualisierung

3. **Admin Settings** (`/admin/settings`)
   - Deposit-Einstellungen
   - PayPal-Konfiguration

4. **Buchungsflow** (`/book/[salon-id]`)
   - Service-Auswahl
   - Mitarbeiter-Auswahl
   - Zeitslot-Auswahl
   - Checkout

### Hinweis:
- Für vollständige Funktionalität wird Supabase-Connection benötigt
- `.env.local` mit Supabase-Credentials erforderlich
- Ohne DB-Verbindung sehen Sie die UI, aber keine Daten

## Vite App (Original - Referenz)

**Um die Vite App zu starten:**

```bash
cd cutflow-pro
npm install
npm run dev
```

**URL:** http://localhost:5173 (oder anderer Port)

### Verfügbare Routen:

- `/` - Hauptansicht mit Tabs (Calendar/Booking/Clients/Settings)
- `/book` - Separater Buchungsflow
- `/booking-success` - Erfolgsseite nach Buchung
- `/cancel/:token` - Stornierungsseite

### Vorteile der Vite App:
- ✅ Vollständig funktionsfähig
- ✅ Alle Features implementiert
- ✅ Kann als Referenz dienen

