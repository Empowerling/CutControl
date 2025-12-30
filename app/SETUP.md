# Setup-Anleitung für CutControl

## Supabase Umgebungsvariablen einrichten

Die App benötigt Supabase-Credentials, um zu funktionieren. So richten Sie sie ein:

### 1. Supabase Projekt erstellen (falls noch nicht vorhanden)

1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie ein neues Projekt
3. Warten Sie, bis das Projekt initialisiert ist

### 2. Datenbank-Schema importieren

1. Gehen Sie in Ihrem Supabase-Dashboard zu "SQL Editor"
2. Öffnen Sie die Datei `../supabase-schema.sql` 
3. Kopieren Sie den gesamten Inhalt
4. Fügen Sie ihn in den SQL Editor ein
5. Führen Sie das Script aus

**WICHTIG:** Falls Sie bereits eine Datenbank haben, müssen Sie das `cancellation_token` Feld hinzufügen:

```sql
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS cancellation_token UUID NOT NULL DEFAULT uuid_generate_v4();

CREATE INDEX IF NOT EXISTS idx_appointments_cancellation_token ON appointments(cancellation_token);
```

### 3. API-Credentials abrufen

1. In Ihrem Supabase-Dashboard gehen Sie zu **Settings** > **API**
2. Kopieren Sie die folgenden Werte:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **anon public** Key (ein langer String)

### 4. .env.local Datei konfigurieren

Die Datei `.env.local` wurde bereits erstellt, aber Sie müssen Ihre echten Credentials eintragen:

1. Öffnen Sie `app/.env.local` in Ihrem Editor
2. Ersetzen Sie die Platzhalter:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ihr-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-echter-anon-key-hier
```

3. Speichern Sie die Datei

### 5. Development Server neu starten

Nach dem Ändern der .env.local Datei müssen Sie den Server neu starten:

```bash
# Server stoppen (Ctrl+C)
# Dann neu starten:
npm run dev
```

### Troubleshooting

**Fehler: "Missing Supabase environment variables"**
- Stellen Sie sicher, dass `.env.local` im `app/` Verzeichnis existiert
- Überprüfen Sie, dass die Variablennamen korrekt sind (mit `NEXT_PUBLIC_` Präfix)
- Starten Sie den Development Server neu nach Änderungen

**Fehler bei Datenbank-Queries**
- Überprüfen Sie, dass das Schema korrekt importiert wurde
- Stellen Sie sicher, dass RLS (Row Level Security) Policies korrekt gesetzt sind
- Überprüfen Sie in Supabase unter "Table Editor", ob Daten vorhanden sind
