## ADDED Requirements

### Requirement: Boutique Light Mode Color Palette
The application SHALL use a boutique light mode design system with specific color tokens.

#### Scenario: Light mode colors are applied throughout the application
- **WHEN** the application is rendered
- **THEN** background color is #F9F9F9 (light gray)
- **AND** card backgrounds are #FFFFFF (white)
- **AND** primary accent color is #1A1A1A (near black)
- **AND** secondary accent color is gold (#D4AF37 or similar)
- **AND** all text maintains sufficient contrast ratios (WCAG AA minimum)

#### Scenario: Color tokens are defined in Tailwind config
- **WHEN** Tailwind CSS is configured
- **THEN** custom color tokens are defined for background, card, primary, and gold accents
- **AND** components use these tokens via Tailwind utility classes
- **AND** color tokens are consistent across all components

### Requirement: Fat Finger Friendly Touch Targets
All interactive elements SHALL meet minimum touch target size requirements.

#### Scenario: Buttons and interactive elements are accessible
- **WHEN** interactive elements are rendered
- **THEN** all buttons, links, and selectable items have minimum 44px x 44px touch target
- **AND** touch targets have adequate spacing between them (minimum 8px)
- **AND** visual hit area matches or exceeds touch target size

#### Scenario: Form inputs are accessible
- **WHEN** form inputs are rendered
- **THEN** input fields have minimum 44px height
- **AND** labels and inputs are clearly associated
- **AND** error states are visually distinct

### Requirement: Skeleton Loaders for Data Fetching
The application SHALL display skeleton loaders during data fetching operations.

#### Scenario: Services are loading
- **WHEN** services are being fetched from Supabase
- **THEN** skeleton loader cards are displayed in place of service cards
- **AND** skeleton loaders match the layout of actual content
- **AND** skeleton loaders are removed when data is loaded

#### Scenario: Staff members are loading
- **WHEN** staff members are being fetched from Supabase
- **THEN** skeleton loader cards are displayed in place of staff cards
- **AND** skeleton loaders animate with a shimmer effect
- **AND** skeleton loaders are removed when data is loaded

#### Scenario: Calendar availability is loading
- **WHEN** availability data is being calculated
- **THEN** skeleton loaders are displayed in place of time slot buttons
- **AND** skeleton loaders indicate loading state clearly
- **AND** skeleton loaders are removed when availability is calculated

### Requirement: Framer Motion Animations
The application SHALL use Framer Motion for smooth transitions between booking steps.

#### Scenario: Step transitions are animated
- **WHEN** user navigates between booking flow steps
- **THEN** the current step animates out (fade/slide)
- **AND** the next step animates in smoothly
- **AND** animation duration is between 200-400ms for perceived performance
- **AND** animations do not block user interaction

#### Scenario: Component mount animations
- **WHEN** components are mounted (service cards, staff cards, etc.)
- **THEN** components animate in with fade or scale effects
- **AND** animations are subtle and do not distract from content
- **AND** animations respect user's motion preferences (prefers-reduced-motion)

### Requirement: Mobile-First Responsive Design
The application SHALL be optimized for mobile devices with responsive layouts.

#### Scenario: Application is viewed on mobile device
- **WHEN** application is accessed on a mobile device (viewport < 768px)
- **THEN** layout adapts to single column
- **AND** touch targets remain minimum 44px
- **AND** text is readable without zooming
- **AND** navigation is thumb-friendly (bottom placement where appropriate)

#### Scenario: Application is viewed on tablet/desktop
- **WHEN** application is accessed on larger screens (viewport >= 768px)
- **THEN** layout adapts to multi-column where appropriate
- **AND** maximum content width is constrained for readability
- **AND** spacing and sizing scale appropriately

### Requirement: Typography and Spacing
The application SHALL use consistent typography and spacing throughout.

#### Scenario: Typography is consistent
- **WHEN** text is rendered
- **THEN** font family is Outfit (or system fallback)
- **AND** heading sizes follow a clear hierarchy
- **AND** body text is readable (minimum 16px on mobile)
- **AND** line height provides comfortable reading (1.5-1.6)

#### Scenario: Spacing is consistent
- **WHEN** components are laid out
- **THEN** spacing follows 4px or 8px grid system
- **AND** consistent padding and margins are applied
- **AND** visual rhythm is maintained across pages

