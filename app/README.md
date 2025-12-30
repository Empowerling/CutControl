# CutControl - Booking System MVP

High-performance booking system for salons, built with Next.js 15 and Supabase.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + Shadcn/UI
- **Icons**: Lucide React
- **State Management**: TanStack Query (React Query)
- **Database**: Supabase (PostgreSQL)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `../supabase-schema.sql` in your Supabase SQL Editor
3. Copy your Supabase URL and anon key from Project Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file in the `app` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── app/
│   ├── admin/              # Admin dashboard
│   │   └── page.tsx        # Calendar view
│   ├── book/
│   │   └── [salon-id]/     # Customer booking flow
│   └── layout.tsx          # Root layout
├── components/
│   ├── admin/              # Admin components
│   │   ├── calendar-view.tsx
│   │   ├── staff-column.tsx
│   │   └── appointment-card.tsx
│   └── providers/          # React Query provider
├── lib/
│   ├── supabase/           # Supabase client & queries
│   ├── types/               # TypeScript types
│   └── utils.ts            # Utility functions
└── supabase-schema.sql      # Database schema
```

## Features

### Admin Dashboard (`/admin`)
- Multi-column staff calendar view
- Week navigation
- Appointment visualization
- Staff management (coming soon)

### Customer Booking Flow (`/book/[salon-id]`)
- Service selection with category filters
- Staff selection (filtered by service)
- Smart calendar with real-time availability
- Guest checkout
- Conditional deposit payment

### Settings
- Online deposits toggle
- Manual approval toggle
- PayPal merchant link configuration

## Design System

**Boutique Light Mode:**
- Background: #FFFFFF / #FBFBFB
- Text: #111111
- Accent: #0F172A (Midnight Blue)
- Cards: Thin borders, soft shadows
- Typography: Geist Sans

## Database Schema

See `../supabase-schema.sql` for complete schema including:
- Salons
- Settings
- Services
- Staff
- Staff Services (junction table)
- Staff Working Hours
- Appointments

## Next Steps

1. Set up Supabase and run the schema
2. Add staff members via admin interface
3. Configure salon settings
4. Test booking flow
