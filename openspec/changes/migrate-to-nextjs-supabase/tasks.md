## 1. Project Setup & Migration
- [ ] 1.1 Initialize Next.js 14 project with App Router and TypeScript
- [ ] 1.2 Install and configure Supabase client libraries
- [ ] 1.3 Set up environment variables for Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] 1.4 Configure Tailwind CSS with Boutique Light Mode design tokens
- [ ] 1.5 Migrate existing shadcn/ui components to Next.js project
- [ ] 1.6 Set up React Query (TanStack Query) provider
- [ ] 1.7 Configure Framer Motion for animations

## 2. Database Schema & Supabase Setup
- [ ] 2.1 Create Supabase project and database
- [ ] 2.2 Design and create `services` table (id, name, category, duration_minutes, price, description, created_at)
- [ ] 2.3 Design and create `staff` table (id, name, role, avatar_url, email, created_at)
- [ ] 2.4 Design and create `staff_services` junction table (staff_id, service_id)
- [ ] 2.5 Design and create `appointments` table (id, service_id, staff_id, client_name, client_email, client_phone, appointment_date, appointment_time, status, deposit_paid, created_at)
- [ ] 2.6 Design and create `settings` table (id, salon_name, online_deposit_enabled, deposit_amount, paypal_link, created_at, updated_at)
- [ ] 2.7 Set up Row Level Security (RLS) policies for public read access to services/staff, admin write access
- [ ] 2.8 Create database functions for availability calculation
- [ ] 2.9 Set up Supabase Realtime subscriptions for appointments table

## 3. Booking Flow Implementation (/book)
- [ ] 3.1 Create `/app/book/page.tsx` route
- [ ] 3.2 Implement Service Selection step:
  - [ ] 3.2.1 Fetch services from Supabase using React Query
  - [ ] 3.2.2 Create ServiceCard component with price and duration display
  - [ ] 3.2.3 Implement category filter (Cut, Color, Specials) with filter buttons
  - [ ] 3.2.4 Add skeleton loaders for service fetching
- [ ] 3.3 Implement Staff Selection step:
  - [ ] 3.3.1 Fetch staff members assigned to selected service (via junction table)
  - [ ] 3.3.2 Create StaffCard component with avatar display
  - [ ] 3.3.3 Add "First Available" option that auto-selects staff with earliest availability
  - [ ] 3.3.4 Add skeleton loaders for staff fetching
- [ ] 3.4 Implement Smart Calendar step:
  - [ ] 3.4.1 Create calendar grid component with date selection
  - [ ] 3.4.2 Fetch existing appointments for selected staff and date
  - [ ] 3.4.3 Calculate available time slots using date-fns (30-minute increments)
  - [ ] 3.4.4 Cross-reference staff working hours with appointments to show real-time availability
  - [ ] 3.4.5 Display unavailable slots as disabled
  - [ ] 3.4.6 Add skeleton loaders for calendar data
- [ ] 3.5 Implement Guest Checkout step:
  - [ ] 3.5.1 Create form with Name (required), Email, Phone fields
  - [ ] 3.5.2 Add form validation using Zod schema
  - [ ] 3.5.3 Fetch salon settings to check `online_deposit_enabled`
  - [ ] 3.5.4 Conditionally show "Confirm & Pay Deposit" screen if deposit enabled
  - [ ] 3.5.5 Display booking summary (service, staff, time, customer info, total price)
  - [ ] 3.5.6 Create PayPal payment button using stored `paypal_link` from settings
  - [ ] 3.5.7 Implement appointment creation API route
  - [ ] 3.5.8 Handle success/error states with toast notifications
- [ ] 3.6 Add step navigation with Framer Motion animations
- [ ] 3.7 Ensure all touch targets are minimum 44px (fat finger friendly)
- [ ] 3.8 Add mobile-responsive design for all booking steps

## 4. Admin Settings Implementation (/admin/settings)
- [ ] 4.1 Set up Supabase Auth for admin authentication
- [ ] 4.2 Create `/app/admin/settings/page.tsx` route with auth protection
- [ ] 4.3 Implement settings form:
  - [ ] 4.3.1 Toggle switch for `online_deposit_enabled` (Boolean)
  - [ ] 4.3.2 Number input for `deposit_amount` (validated, min: 0)
  - [ ] 4.3.3 Text input for `paypal_link` (URL validation)
  - [ ] 4.3.4 Optional: Salon name input
- [ ] 4.4 Create API route for updating settings (POST /api/admin/settings)
- [ ] 4.5 Implement form submission with React Hook Form + Zod validation
- [ ] 4.6 Add success/error toast notifications
- [ ] 4.7 Add loading states during save operation

## 5. Dashboard Light Mode Migration
- [ ] 5.1 Update existing dashboard components to use Boutique Light Mode colors
- [ ] 5.2 Replace dark mode styles with light mode equivalents
- [ ] 5.3 Update color tokens in Tailwind config (Background: #F9F9F9, Cards: #FFFFFF, Accents: #1A1A1A & Gold)
- [ ] 5.4 Test all existing components in light mode
- [ ] 5.5 Ensure contrast ratios meet accessibility standards

## 6. API Routes & Server Functions
- [ ] 6.1 Create `/app/api/services/route.ts` for fetching services
- [ ] 6.2 Create `/app/api/staff/route.ts` for fetching staff (with service filtering)
- [ ] 6.3 Create `/app/api/appointments/route.ts` for creating appointments
- [ ] 6.4 Create `/app/api/appointments/availability/route.ts` for availability calculation
- [ ] 6.5 Create `/app/api/settings/route.ts` for fetching/updating salon settings
- [ ] 6.6 Create `/app/api/admin/settings/route.ts` for admin settings updates (protected)
- [ ] 6.7 Add error handling and validation to all API routes

## 7. Testing & Validation
- [ ] 7.1 Test complete booking flow end-to-end
- [ ] 7.2 Test admin settings update flow
- [ ] 7.3 Verify real-time availability updates work correctly
- [ ] 7.4 Test mobile responsiveness on various screen sizes
- [ ] 7.5 Verify all touch targets meet 44px minimum
- [ ] 7.6 Test form validations and error states
- [ ] 7.7 Verify skeleton loaders display during data fetching
- [ ] 7.8 Test conditional deposit flow (enabled/disabled)
- [ ] 7.9 Verify PayPal link integration works correctly

## 8. Documentation & Deployment
- [ ] 8.1 Update README with new setup instructions
- [ ] 8.2 Document environment variables required
- [ ] 8.3 Document database schema and relationships
- [ ] 8.4 Create deployment guide for Vercel/Next.js
- [ ] 8.5 Document Supabase setup and RLS policies

