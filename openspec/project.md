# Project Context

## Purpose
CutControl (CutFlow Pro) is a modern salon and barbershop appointment booking and management system. The application enables salon owners and staff to manage appointments, clients, services, and staff schedules through an intuitive calendar-based interface. The system supports multi-step booking flows, real-time availability checking, and comprehensive client management.

**Key Goals:**
- Streamline appointment booking and management for salons/barbershops
- Provide an intuitive calendar view for staff scheduling
- Enable efficient client relationship management
- Support multiple service types (cuts, coloring, styling, treatments)
- Manage staff availability and assignments

## Tech Stack

### Core Framework
- **Vite 5.4.19** - Build tool and development server
- **React 18.3.1** - UI framework
- **TypeScript 5.8.3** - Type-safe JavaScript
- **React Router DOM 6.30.1** - Client-side routing

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI primitives
- **Radix UI** - Accessible, unstyled UI primitives (accordion, dialog, dropdown, etc.)
- **Framer Motion 12.23.26** - Animation library
- **Lucide React 0.462.0** - Icon library
- **next-themes 0.3.0** - Theme management (dark mode support)

### State Management & Data Fetching
- **TanStack Query (React Query) 5.83.0** - Server state management and data fetching
- **React Hook Form 7.61.1** - Form state management
- **Zod 3.25.76** - Schema validation

### Utilities
- **date-fns 3.6.0** - Date manipulation and formatting
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional class name utilities
- **sonner 1.7.4** - Toast notifications

### Development Tools
- **ESLint 9.32.0** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **@vitejs/plugin-react-swc** - Fast React refresh with SWC
- **lovable-tagger** - Component tagging for Lovable platform

## Project Conventions

### Code Style

**TypeScript Configuration:**
- Relaxed strictness for faster development (`noImplicitAny: false`, `strictNullChecks: false`)
- Path aliases: `@/*` maps to `./src/*`
- Allows JavaScript files (`allowJs: true`)
- Skips library type checking (`skipLibCheck: true`)

**Naming Conventions:**
- Components: PascalCase (e.g., `BookingFlow.tsx`, `ServiceCard.tsx`)
- Files: Match component names exactly
- Hooks: camelCase with `use` prefix (e.g., `use-mobile.tsx`, `use-toast.ts`)
- Utilities: camelCase (e.g., `utils.ts`)

**Import Organization:**
- Use path aliases: `@/components`, `@/lib`, `@/hooks`
- Group imports: external packages → internal components → relative imports
- Example: `import { Button } from "@/components/ui/button"`

**Component Structure:**
- Functional components with hooks
- Prefer arrow function components
- Export default for page components, named exports for reusable components

**Styling:**
- Tailwind CSS utility classes (no inline styles)
- Custom CSS variables for theming (HSL color system)
- Component variants using `class-variance-authority`
- Responsive design with mobile-first approach

### Architecture Patterns

**Project Structure:**
```
src/
├── components/        # Reusable UI components
│   ├── booking/      # Booking flow components
│   ├── calendar/     # Calendar view components
│   ├── clients/      # Client management components
│   ├── navigation/   # Navigation components
│   ├── settings/     # Settings components
│   └── ui/           # shadcn/ui base components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Route pages
└── App.tsx           # Root component with routing
```

**Component Organization:**
- Feature-based grouping (booking, calendar, clients, settings)
- Shared UI components in `components/ui/`
- Page-level components in `pages/`
- Custom hooks in `hooks/`

**Routing:**
- React Router DOM for client-side routing
- Route definitions in `App.tsx`
- Catch-all route (`*`) for 404 handling
- Route order: specific routes before catch-all

**State Management:**
- Local component state with `useState` for UI state
- TanStack Query for server state and data fetching
- React Hook Form for form state
- Context API for theme management (via next-themes)

**Data Flow:**
- Components fetch data using TanStack Query hooks
- Form validation with Zod schemas
- Toast notifications for user feedback (sonner)
- Optimistic updates where appropriate

### Testing Strategy
- **Current Status:** No testing framework configured
- **Recommended:** Add Vitest for unit tests, React Testing Library for component tests
- **TODO:** Implement testing strategy and test coverage requirements

### Git Workflow
- **Repository:** CutControl (parent) with cutflow-pro as git submodule
- **Branching:** Main branch for production-ready code
- **Commits:** Descriptive commit messages following conventional commits
- **Submodule:** cutflow-pro is tracked as a git submodule, maintaining its own git history

## Domain Context

**Salon/Barbershop Management Domain:**

**Services:**
- Service types: Cut, Color, Style, Treatment
- Each service has: duration, price, variant type
- Services are selectable in booking flow

**Staff:**
- Staff members have: name, role (Senior Stylist, Colorist, Stylist), avatar, availability
- Staff can be assigned to appointments
- Next available time slot displayed per staff member

**Appointments:**
- Time slots: 30-minute intervals (e.g., 09:00, 09:30, 10:00)
- Availability status: available/unavailable
- Appointment status: confirmed, pending, cancelled
- Appointments linked to: service, staff member, client, time slot

**Clients:**
- Client management view for tracking customer information
- Client history and preferences

**Booking Flow:**
1. Service selection
2. Staff/stylist selection
3. Time slot selection
4. Confirmation

**Calendar View:**
- Daily/weekly calendar display
- Staff columns for multi-staff scheduling
- Appointment cards with service and client info
- Daily pulse/metrics display

## Important Constraints

**Technical Constraints:**
- TypeScript strictness is relaxed for development speed
- Browser-based application (no server-side rendering)
- Vite development server runs on port 8080
- Path alias `@/` must be used for src imports

**Business Constraints:**
- Mobile-first responsive design required
- German language support (UI text in German)
- Real-time availability updates needed
- Support for multiple staff members and services

**Platform Constraints:**
- Built with Lovable platform integration
- Component tagging enabled in development mode
- Deployment through Lovable platform

## External Dependencies

**UI Component Library:**
- shadcn/ui components (Radix UI primitives)
- All UI components in `src/components/ui/` directory

**Icons & Images:**
- Lucide React for iconography
- Unsplash for placeholder images (staff avatars)

**Fonts:**
- Outfit font family (via @fontsource/outfit)

**No External APIs Currently:**
- Application uses mock/static data
- TODO: Integrate backend API for:
  - Appointment CRUD operations
  - Client management
  - Staff management
  - Availability checking
  - Service catalog

**Future Integration Points:**
- Backend API for data persistence
- Authentication service
- Payment processing (if needed)
- Email/SMS notifications for appointments
