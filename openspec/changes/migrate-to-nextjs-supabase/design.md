# Design: Next.js 14 + Supabase Migration

## Context
CutControl currently exists as a Vite + React application with mock data. To become a production-ready SaaS booking system, we need to migrate to Next.js 14 with Supabase backend. This enables server-side rendering, real-time updates, persistent data storage, and scalable architecture.

**Stakeholders:**
- Salon owners (end users managing bookings)
- Customers (booking appointments)
- Developers (maintaining and extending the platform)

**Constraints:**
- Must maintain existing UI/UX patterns where possible
- Commission-free model requires direct merchant payment integration
- Mobile-first design is critical (fat finger friendly)
- Real-time availability is essential for user trust

## Goals / Non-Goals

### Goals
- Migrate to Next.js 14 App Router for better SEO and performance
- Integrate Supabase for authentication, database, and real-time capabilities
- Implement production-ready booking flow with real data
- Create admin control center for salon settings
- Apply boutique light mode design system
- Ensure mobile-optimized, accessible user experience

### Non-Goals
- Multi-tenant architecture (single salon per instance for MVP)
- Payment gateway integration (using direct PayPal links)
- Email/SMS notifications (future enhancement)
- Client accounts/login (guest checkout only for MVP)
- Advanced analytics/reporting (future enhancement)

## Decisions

### Decision: Next.js 14 App Router over Vite + React Router
**Rationale:**
- Server-side rendering improves SEO for public booking page
- Built-in API routes simplify backend integration
- Better performance with automatic code splitting
- Native support for React Server Components
- Easier deployment on Vercel

**Alternatives Considered:**
- Keep Vite + add Express backend: More complex setup, requires separate deployment
- Remix: Similar benefits but smaller ecosystem
- Next.js Pages Router: App Router is the future, better performance

### Decision: Supabase over Custom Backend
**Rationale:**
- Rapid development with built-in Auth, Database, and Realtime
- PostgreSQL provides robust relational data model
- Row Level Security (RLS) handles access control
- Real-time subscriptions for live availability updates
- Generous free tier for MVP
- Easy migration path if scaling requires

**Alternatives Considered:**
- Firebase: Less flexible querying, vendor lock-in concerns
- Custom Node.js + PostgreSQL: More development time, infrastructure overhead
- Prisma + separate auth: More setup complexity

### Decision: Guest Checkout (No Required Login)
**Rationale:**
- Reduces friction in booking process
- Common pattern for appointment booking systems
- Email/phone sufficient for appointment management
- Can add client accounts later if needed

**Alternatives Considered:**
- Required account creation: Higher abandonment rate
- Social login only: Additional complexity, privacy concerns

### Decision: Direct PayPal Link (Not Payment Gateway)
**Rationale:**
- Commission-free model requires direct merchant payment
- Simpler implementation (no payment processor integration)
- Lower transaction fees for salon owners
- PayPal.me links are standard for small businesses

**Alternatives Considered:**
- Stripe integration: Would charge commission, more complex
- Square: Similar to Stripe, requires merchant account setup

### Decision: Boutique Light Mode Design System
**Rationale:**
- Premium, clean aesthetic for high-end salons
- Light mode reduces eye strain for extended use
- Gold accents convey luxury brand positioning
- High contrast improves accessibility

**Alternatives Considered:**
- Dark mode: Less common for booking systems, harder to read forms
- Multiple themes: Unnecessary complexity for MVP

### Decision: 30-Minute Time Slot Increments
**Rationale:**
- Standard industry practice for salon bookings
- Balances granularity with usability
- Easy to calculate with date-fns
- Sufficient for most service types

**Alternatives Considered:**
- 15-minute increments: Too granular, cluttered UI
- Variable increments: More complex logic, harder UX

## Architecture

### Frontend Structure
```
app/
├── (public)/
│   └── book/
│       └── page.tsx          # Customer booking flow
├── (admin)/
│   └── admin/
│       └── settings/
│           └── page.tsx      # Admin control center
├── api/
│   ├── services/
│   ├── staff/
│   ├── appointments/
│   └── settings/
└── layout.tsx                # Root layout with providers
```

### Data Flow
1. **Booking Flow**: Client → Next.js API Route → Supabase → Real-time Update → UI
2. **Admin Settings**: Admin → Auth Check → API Route → Supabase → Settings Table
3. **Availability**: Calendar → API Route → Supabase Query (appointments + staff hours) → Available Slots

### Database Schema Relationships
```
services (1) ──< (many) staff_services (many) >── (1) staff
appointments (many) ──< (1) services
appointments (many) ──< (1) staff
settings (1 row, singleton)
```

## Risks / Trade-offs

### Risk: Real-time Availability Race Conditions
**Mitigation:** Use Supabase Realtime subscriptions to update UI immediately when appointments are created. Consider optimistic locking for appointment creation.

### Risk: Supabase Free Tier Limitations
**Mitigation:** Monitor usage, plan upgrade path. Free tier supports 500MB database and 2GB bandwidth, sufficient for MVP.

### Risk: PayPal Link Security/Validation
**Mitigation:** Validate URL format, use HTTPS only, add admin verification step.

### Trade-off: Guest Checkout vs. User Accounts
**Benefit:** Lower friction, faster bookings
**Cost:** Harder to track repeat customers, no booking history for clients
**Decision:** Start with guest checkout, add accounts later if needed

### Trade-off: Direct PayPal vs. Payment Gateway
**Benefit:** Commission-free, simpler implementation
**Cost:** Manual reconciliation, no automatic deposit tracking
**Decision:** Acceptable for MVP, can enhance later

## Migration Plan

### Phase 1: Infrastructure Setup
1. Create Next.js 14 project
2. Set up Supabase project and database schema
3. Configure environment variables
4. Set up authentication (admin only initially)

### Phase 2: Data Migration
1. Seed services and staff data into Supabase
2. Configure RLS policies
3. Test data access patterns

### Phase 3: Feature Implementation
1. Implement booking flow with real data
2. Build admin settings page
3. Apply light mode design system

### Phase 4: Testing & Deployment
1. End-to-end testing
2. Performance optimization
3. Deploy to production

### Rollback Plan
- Keep Vite version in separate branch
- Database migrations are reversible
- Can revert to previous deployment on Vercel

## Open Questions
- Should we support multiple time zones? (Defer to future)
- How to handle appointment cancellations? (Admin-only for MVP)
- Should we add appointment reminders? (Future enhancement)
- How to handle no-shows? (Manual admin process for MVP)

