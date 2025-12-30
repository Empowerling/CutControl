# Aktueller Stand der CutControl-Anwendung

**Stand:** Dezember 2024  
**Repository:** https://github.com/Empowerling/CutControl

---

## 🏗️ Architektur-Überblick

Das Repository enthält **zwei separate Anwendungen**:

1. **Next.js App** (`app/`) - Neue, produktionsbereite Version mit Supabase
2. **Vite App** (`cutflow-pro/`) - Original-Prototyp als Git-Submodule (Referenz)

---

## 📱 1. Next.js 15 App (`app/`) - Hauptanwendung

### Technologie-Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/UI
- **State Management**: TanStack Query (React Query) 5.90.14
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form + Zod

### Routenstruktur

```
/                        → Startseite (Navigation zu Admin/Booking)
/admin                   → Admin Kalender-Ansicht
/admin/settings          → Salon-Einstellungen (Deposits, PayPal)
/book/[salon-id]         → Kundenbuchungsflow
```

### Hauptfunktionen

#### ✅ Implementiert

1. **Admin Dashboard** (`/admin`)
   - Multi-Spalten Kalenderansicht (eine Spalte pro Mitarbeiter)
   - Wochen-Navigation
   - Terminvisualisierung pro Mitarbeiter
   - Zeitslots: 30-Minuten-Intervalle (08:00 - 20:00)
   - Komponenten:
     - `CalendarView` - Hauptkalender-Grid
     - `StaffColumn` - Einzelne Mitarbeiter-Spalte
     - `AppointmentCard` - Termin-Karte
     - `CalendarHeader` - Datum-Navigation

2. **Admin Settings** (`/admin/settings`)
   - Online-Deposits Toggle
   - Manuelle Genehmigung Toggle
   - PayPal Merchant Link Konfiguration
   - Deposit-Betrag Einstellung

3. **Kundenbuchungsflow** (`/book/[salon-id]`)
   - Service-Auswahl mit Kategorie-Filtern
   - Mitarbeiter-Auswahl (gefiltert nach Service)
   - Smart Calendar mit Echtzeit-Verfügbarkeit
   - Gast-Checkout (kein Login erforderlich)
   - Bedingte Deposit-Zahlung basierend auf Settings
   - Komponenten:
     - `BookingFlow` - Hauptbuchungs-Container
     - `ServiceSelection` - Service-Auswahl
     - `StaffSelection` - Mitarbeiter-Auswahl
     - `TimeSlotSelection` - Zeitslot-Auswahl
     - `CheckoutSummary` - Zusammenfassung vor Buchung

### Datenbank-Integration

- **Supabase Client**: `app/lib/supabase/client.ts`
- **Queries**: `app/lib/supabase/queries.ts`
  - Staff-Management (CRUD)
  - Appointments (Erstellen, Abrufen, Filtern)
  - Services (Abrufen)
  - Settings (Abrufen, Aktualisieren)
  - Staff Working Hours

### Projektstruktur

```
app/
├── app/                          # Next.js App Router
│   ├── admin/
│   │   ├── page.tsx             # Kalender-Ansicht
│   │   └── settings/
│   │       └── page.tsx         # Einstellungen
│   ├── book/
│   │   └── [salon-id]/
│   │       └── page.tsx         # Buchungsflow
│   ├── layout.tsx               # Root Layout
│   └── page.tsx                 # Startseite
├── components/
│   ├── admin/                   # Admin-Komponenten
│   ├── booking/                 # Buchungs-Komponenten
│   └── providers/               # React Query Provider
├── lib/
│   ├── supabase/                # Supabase Client & Queries
│   ├── types/                   # TypeScript Types
│   └── utils.ts                 # Utilities
└── supabase-schema.sql          # Datenbank-Schema
```

### Design-System

**Boutique Light Mode:**
- Hintergrund: #FFFFFF / #FBFBFB
- Text: #111111
- Akzent: #0F172A (Midnight Blue)
- Cards: Dünne Borders, weiche Schatten
- Typografie: Geist Sans

### Status & TODO

✅ **Fertiggestellt:**
- Basis-Routing und Layout
- Admin Kalender-Ansicht
- Admin Settings
- Kundenbuchungsflow (Grundfunktionalität)
- Supabase-Integration
- TypeScript Types

⚠️ **Noch nicht implementiert (vs. Vite App):**
- Booking Success Page
- Cancel Booking Page (mit Token)
- Client Management View
- Staff Management UI (nur Backend vorhanden)
- Vollständige Terminverwaltung (Bearbeiten, Löschen)

---

## 📱 2. Vite + React App (`cutflow-pro/`) - Original-Prototyp

### Technologie-Stack
- **Framework**: Vite 5.4.19
- **React**: 18.3.1
- **TypeScript**: 5.8.3
- **Routing**: React Router DOM 6.30.1
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: TanStack Query 5.83.0 + React Hook Form
- **Database**: Supabase (bereits integriert!)
- **Animation**: Framer Motion 12.23.26
- **Icons**: Lucide React

### Routenstruktur

```
/                     → Hauptansicht (Tab-basiert)
  ├── calendar        → Kalender-Ansicht (Tab)
  ├── booking         → Buchungsflow (Tab)
  ├── clients         → Kundenverwaltung (Tab)
  └── settings        → Einstellungen (Tab)

/book                 → Separater Buchungsflow (öffentlich)
/booking-success      → Buchungserfolg (mit State)
/cancel/:token        → Buchung stornieren (mit Token)
/*                    → 404 Seite
```

### Hauptfunktionen

#### ✅ Vollständig implementiert

1. **Hauptansicht** (`/`)
   - Tab-basierte Navigation (Bottom Navigation)
   - 4 Haupttabs: Calendar, Booking, Clients, Settings
   - Header mit Logo und heutigem Datum
   - Framer Motion Animationen für Tab-Wechsel

2. **Kalender-Ansicht** (`CalendarView`)
   - Multi-Spalten Ansicht (eine pro Mitarbeiter)
   - Tägliche Pulse/KPI-Anzeige
   - Termin-Menü (Bearbeiten, Stornieren)
   - Wochen-Navigation
   - Drag & Drop (möglicherweise)

3. **Buchungsflow** (`Book.tsx`)
   - 4-stufiger Flow: Service → Stylist → Termin → Kontakt
   - Service-Kategorien (Cut, Color, Style, Treatment)
   - Mitarbeiter-Filterung nach Service
   - Echtzeit-Verfügbarkeitsprüfung
   - Deposit-Zahlung (PayPal Link)
   - Gast-Checkout mit Kontaktdaten
   - Vollständige Buchungserstellung

4. **Booking Success** (`/booking-success`)
   - Erfolgsbestätigung mit Termindetails
   - Stornierungs-Link (mit Token)
   - PayPal-Deposit-Link (falls erforderlich)
   - Kalender-Export-Optionen

5. **Cancel Booking** (`/cancel/:token`)
   - Stornierung mit Token-Authentifizierung
   - Bestätigungs-Dialog
   - Erfolgsmeldung nach Stornierung

6. **Client Management** (`ClientsView`)
   - Kundenliste
   - Kunden-Details
   - Buchungshistorie

7. **Settings** (`SettingsView`)
   - Salon-Einstellungen
   - Staff Management (vollständig)
   - Service-Management
   - Arbeitszeiten-Verwaltung

### Supabase-Integration

**Vollständig implementiert:**
- `src/integrations/supabase/client.ts` - Supabase Client
- `src/integrations/supabase/types.ts` - Generated Types
- Custom Hooks für alle Daten-Operationen:
  - `useServices` - Services abrufen
  - `useStaff` - Mitarbeiter abrufen & verwalten
  - `useSalonSettings` - Settings abrufen & aktualisieren
  - `useAvailableSlots` - Verfügbare Zeitslots berechnen
  - `useAppointments` - Termine abrufen, erstellen, aktualisieren, stornieren
  - `useStaffWorkingHours` - Arbeitszeiten

### Projektstruktur

```
cutflow-pro/
├── src/
│   ├── pages/                    # Routen-Komponenten
│   │   ├── Index.tsx            # Hauptansicht (Tabs)
│   │   ├── Book.tsx             # Separater Buchungsflow
│   │   ├── BookingSuccess.tsx   # Erfolgsseite
│   │   ├── CancelBooking.tsx    # Stornierungsseite
│   │   └── NotFound.tsx         # 404 Seite
│   ├── components/
│   │   ├── booking/             # Buchungs-Komponenten
│   │   ├── calendar/            # Kalender-Komponenten
│   │   ├── clients/             # Kunden-Komponenten
│   │   ├── navigation/          # Navigation
│   │   ├── settings/            # Einstellungs-Komponenten
│   │   └── ui/                  # shadcn/ui Komponenten (vollständig)
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useAppointments.ts   # Termin-Hooks
│   │   ├── useAvailableSlots.ts # Verfügbarkeits-Logik
│   │   ├── useSalonSettings.ts  # Settings-Hooks
│   │   ├── useServices.ts       # Service-Hooks
│   │   └── useStaff.ts          # Mitarbeiter-Hooks
│   └── integrations/
│       └── supabase/            # Supabase Client & Types
├── supabase/
│   └── migrations/              # Datenbank-Migrationen
└── .env                         # Environment Variables
```

### Aktueller Commit-Stand

**Neuester Commit:** `3723ca9` - "Add light boutique booking flow"

**Kürzliche Änderungen:**
- Supabase-Integration hinzugefügt
- Vollständiger Buchungsflow mit Supabase
- Booking Success & Cancel Booking Seiten
- Staff Management
- Hooks für alle Daten-Operationen

### Status

✅ **Vollständig funktionsfähig:**
- Komplette Buchungs-Funktionalität
- Admin-Dashboard mit Kalender
- Kundenverwaltung
- Einstellungen & Staff-Management
- Stornierungs-Flow
- Supabase-Integration (vollständig)

---

## 🔄 Vergleich: Next.js vs. Vite App

### Feature-Vergleich

| Feature | Next.js App (`app/`) | Vite App (`cutflow-pro/`) |
|---------|---------------------|---------------------------|
| Admin Kalender | ✅ Implementiert | ✅ Implementiert |
| Buchungsflow | ✅ Grundfunktionalität | ✅ Vollständig |
| Booking Success | ❌ Nicht vorhanden | ✅ Implementiert |
| Cancel Booking | ❌ Nicht vorhanden | ✅ Mit Token |
| Kundenverwaltung | ❌ Nicht vorhanden | ✅ Implementiert |
| Staff Management UI | ❌ Nur Backend | ✅ Vollständig |
| Settings | ✅ Basis-Settings | ✅ Vollständig |
| Supabase Integration | ✅ Implementiert | ✅ Vollständig |

### Architektur-Unterschiede

**Next.js App:**
- Server-Side Rendering (SSR) möglich
- App Router mit Server Components
- Bessere SEO für öffentliche Buchungsseite
- Vercel-optimiert
- Neueres React 19

**Vite App:**
- Client-Side Rendering (SPA)
- React Router für Navigation
- Schnellere Development-Erfahrung
- Mehr Features bereits implementiert
- Vollständige UI-Komponentenbibliothek

---

## 📊 Datenbank-Schema

Beide Apps verwenden dasselbe Supabase-Schema (`supabase-schema.sql`):

- `salons` - Salon-Informationen
- `settings` - Salon-Einstellungen (Deposits, PayPal, etc.)
- `services` - Services/Kategorien
- `staff` - Mitarbeiter
- `staff_services` - Zuordnung Mitarbeiter ↔ Services
- `staff_working_hours` - Arbeitszeiten
- `appointments` - Termine
- `clients` - Kunden (optional)

---

## 🎯 Nächste Schritte

### Für die Next.js App (Empfehlung)

1. **Booking Success Page** hinzufügen
   - Nach erfolgreicher Buchung weiterleiten
   - Termindetails anzeigen
   - Stornierungs-Link generieren

2. **Cancel Booking Route** implementieren
   - `/cancel/[token]` Route
   - Token-basierte Stornierung
   - Bestätigungsseite

3. **Client Management** migrieren
   - Kundenliste aus Vite App übernehmen
   - Kunden-Details-Seite

4. **Staff Management UI** vervollständigen
   - Backend ist vorhanden, UI fehlt
   - Aus Vite App übernehmen

5. **Feature-Parität** erreichen
   - Alle Features der Vite App übernehmen
   - Vorteile von Next.js nutzen (SSR, SEO)

---

## 💡 Empfehlung

Die **Vite App** ist aktuell funktional vollständiger und kann als **Referenz-Implementation** dienen. Die **Next.js App** ist die zukünftige Produktions-Version und sollte Schritt für Schritt die Features der Vite App übernehmen, während die Vorteile von Next.js (SSR, SEO, Performance) genutzt werden.

**Migration-Strategie:**
1. Feature für Feature aus Vite App in Next.js App migrieren
2. Vite App als Git-Submodule behalten (für Referenz)
3. Best Practices aus beiden Apps kombinieren
4. Next.js-spezifische Verbesserungen (SSR, Server Actions) hinzufügen

