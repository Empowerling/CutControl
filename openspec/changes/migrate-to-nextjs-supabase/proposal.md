# Change: Migrate to Next.js 14 with Supabase Integration

## Why
The current CutControl application is built with Vite + React and uses mock data. To create a production-ready, commission-free booking system, we need to:
1. Migrate to Next.js 14 (App Router) for better SEO, performance, and server-side capabilities
2. Integrate Supabase for authentication, database persistence, and real-time updates
3. Implement a complete booking flow with real-time availability checking
4. Add admin controls for deposit management and merchant settings
5. Apply a boutique light mode design system for a premium user experience

This change transforms CutControl from a prototype into a fully functional SaaS booking platform.

## What Changes

### **BREAKING** - Architecture Migration
- Migrate from Vite + React Router to Next.js 14 App Router
- Replace mock data with Supabase PostgreSQL database
- Implement Supabase Auth for admin authentication
- Add Supabase Realtime subscriptions for live availability updates

### New Features
- **Customer Booking Flow (/book)**: Multi-step booking with service selection, staff filtering, smart calendar, and guest checkout
- **Admin Settings (/admin/settings)**: Control center for online deposits, deposit amounts, and PayPal merchant links
- **Database Schema**: Services, staff, appointments, settings, and client tables
- **Design System**: Boutique Light Mode theme (Background: #F9F9F9, Cards: #FFFFFF, Accents: #1A1A1A & Gold)

### Enhanced Features
- Real-time availability calculation based on staff working hours and existing appointments
- Service category filtering (Cut, Color, Specials)
- Staff filtering by service assignment
- Conditional deposit payment flow based on salon settings
- Skeleton loaders for improved UX during data fetching
- Framer Motion animations for step transitions

## Impact

### Affected Specs
- **booking-flow**: New capability for customer booking process
- **admin-settings**: New capability for admin configuration
- **database-schema**: New capability for data persistence
- **design-system**: New capability for UI theming

### Affected Code
- **Migration**: Entire codebase structure changes from Vite to Next.js
- **New Routes**: `/book` (customer booking), `/admin/settings` (admin control center)
- **New Components**: Booking flow steps, admin settings forms, smart calendar
- **New Infrastructure**: Supabase client setup, database migrations, API routes
- **Styling**: Complete theme overhaul to Boutique Light Mode

### Dependencies
- Next.js 14+ (App Router)
- Supabase client libraries (@supabase/supabase-js, @supabase/auth-helpers-nextjs)
- React Query (TanStack Query) for server state management
- Shadcn UI components (existing, but styled for light mode)
- date-fns for time slot generation
- Framer Motion for animations

