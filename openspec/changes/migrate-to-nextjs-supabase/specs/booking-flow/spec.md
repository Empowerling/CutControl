## ADDED Requirements

### Requirement: Service Selection Step
The booking flow SHALL allow customers to select a service from available services fetched from Supabase.

#### Scenario: Customer views available services
- **WHEN** customer navigates to `/book`
- **THEN** services are fetched from Supabase and displayed as cards
- **AND** each service card shows name, price, and duration
- **AND** skeleton loaders are displayed while data is fetching

#### Scenario: Customer filters services by category
- **WHEN** customer selects a category filter (Cut, Color, Specials)
- **THEN** only services matching that category are displayed
- **AND** filter buttons are clearly visible and accessible (minimum 44px touch target)

#### Scenario: Customer selects a service
- **WHEN** customer clicks on a service card
- **THEN** the service is highlighted as selected
- **AND** the "Next" button becomes enabled
- **AND** the selection persists when navigating between steps

### Requirement: Staff Selection Step
The booking flow SHALL allow customers to select a staff member, filtered by the selected service.

#### Scenario: Customer views available staff for selected service
- **WHEN** customer has selected a service and proceeds to staff selection
- **THEN** only staff members assigned to that service (via staff_services junction table) are displayed
- **AND** each staff card shows name, role, and avatar
- **AND** skeleton loaders are displayed while data is fetching

#### Scenario: Customer selects "First Available" option
- **WHEN** customer selects the "First Available" option
- **THEN** the system automatically selects the staff member with the earliest available time slot
- **AND** the selection is highlighted

#### Scenario: Customer selects a specific staff member
- **WHEN** customer clicks on a staff card
- **THEN** the staff member is highlighted as selected
- **AND** the "Next" button becomes enabled

### Requirement: Smart Calendar with Real-Time Availability
The booking flow SHALL display an interactive calendar with time slots that reflect real-time availability based on staff working hours and existing appointments.

#### Scenario: Customer views available time slots
- **WHEN** customer has selected service and staff, and proceeds to calendar step
- **THEN** a calendar grid is displayed with date selection
- **AND** time slots are generated in 30-minute increments using date-fns
- **AND** available slots are displayed as selectable (minimum 44px touch target)
- **AND** unavailable slots (due to existing appointments or outside working hours) are displayed as disabled
- **AND** skeleton loaders are displayed while availability is calculated

#### Scenario: Real-time availability updates
- **WHEN** an appointment is created by another customer
- **THEN** the availability display updates in real-time via Supabase Realtime subscription
- **AND** previously available slots become unavailable if they conflict

#### Scenario: Customer selects a time slot
- **WHEN** customer clicks on an available time slot
- **THEN** the time slot is highlighted as selected
- **AND** the selection is stored for the booking

### Requirement: Guest Checkout Form
The booking flow SHALL collect customer information without requiring account creation.

#### Scenario: Customer enters contact information
- **WHEN** customer proceeds to checkout step
- **THEN** a form is displayed with Name (required), Email (optional), and Phone (optional) fields
- **AND** form validation ensures Name is not empty
- **AND** Email format is validated if provided
- **AND** all form fields are accessible with minimum 44px touch targets

#### Scenario: Customer submits invalid form
- **WHEN** customer attempts to proceed without required fields
- **THEN** validation errors are displayed
- **AND** the form cannot be submitted

### Requirement: Conditional Deposit Payment Flow
The booking flow SHALL conditionally show a deposit payment screen based on salon settings.

#### Scenario: Deposit is enabled
- **WHEN** salon settings indicate `online_deposit_enabled` is TRUE
- **THEN** a "Confirm & Pay Deposit" screen is displayed after customer information is entered
- **AND** the booking summary shows service, staff, time, customer info, and total price
- **AND** a PayPal payment button is displayed using the `paypal_link` from settings
- **AND** the deposit amount from settings is clearly displayed

#### Scenario: Deposit is disabled
- **WHEN** salon settings indicate `online_deposit_enabled` is FALSE
- **THEN** the booking is confirmed immediately after customer information is submitted
- **AND** no payment screen is shown

#### Scenario: Customer completes booking with deposit
- **WHEN** customer clicks the PayPal payment button
- **THEN** customer is redirected to the PayPal.me link in a new tab
- **AND** the appointment is created in Supabase with `deposit_paid: false`
- **AND** a success message is displayed

### Requirement: Booking Flow Navigation and Animation
The booking flow SHALL provide smooth navigation between steps with animated transitions.

#### Scenario: Customer navigates between steps
- **WHEN** customer clicks "Next" or "Back" buttons
- **THEN** the current step animates out using Framer Motion
- **AND** the next step animates in smoothly
- **AND** step progress indicator updates to show current position

#### Scenario: Customer cannot proceed without selection
- **WHEN** customer attempts to proceed without making required selections
- **THEN** the "Next" button remains disabled
- **AND** visual feedback indicates what is required

