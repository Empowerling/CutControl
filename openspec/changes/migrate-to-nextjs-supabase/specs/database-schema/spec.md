## ADDED Requirements

### Requirement: Services Table
The database SHALL store service information for the salon.

#### Scenario: Services are stored and retrieved
- **WHEN** services are created in the database
- **THEN** each service has: id (UUID, primary key), name (text), category (text: 'cut', 'color', 'style', 'treatment'), duration_minutes (integer), price (decimal), description (text, nullable), created_at (timestamp)
- **AND** services can be queried by category
- **AND** services are publicly readable (RLS policy allows SELECT for all)

### Requirement: Staff Table
The database SHALL store staff member information.

#### Scenario: Staff members are stored and retrieved
- **WHEN** staff members are created in the database
- **THEN** each staff member has: id (UUID, primary key), name (text), role (text), avatar_url (text, nullable), email (text, nullable), created_at (timestamp)
- **AND** staff members can be queried
- **AND** staff members are publicly readable (RLS policy allows SELECT for all)

### Requirement: Staff Services Junction Table
The database SHALL maintain many-to-many relationships between staff and services.

#### Scenario: Staff-service assignments are stored
- **WHEN** a staff member is assigned to a service
- **THEN** a record is created in staff_services table with: staff_id (UUID, foreign key to staff), service_id (UUID, foreign key to services), created_at (timestamp)
- **AND** queries can filter staff by service assignment
- **AND** queries can filter services by staff assignment

### Requirement: Appointments Table
The database SHALL store appointment bookings with all relevant information.

#### Scenario: Appointments are created and stored
- **WHEN** a customer completes a booking
- **THEN** an appointment record is created with: id (UUID, primary key), service_id (UUID, foreign key to services), staff_id (UUID, foreign key to staff), client_name (text), client_email (text, nullable), client_phone (text, nullable), appointment_date (date), appointment_time (time), status (text: 'confirmed', 'pending', 'cancelled'), deposit_paid (boolean, default false), created_at (timestamp)
- **AND** appointments can be queried by staff, date, and service
- **AND** appointments are used to calculate availability

#### Scenario: Appointments support real-time updates
- **WHEN** an appointment is created, updated, or deleted
- **THEN** Supabase Realtime subscription triggers update events
- **AND** connected clients receive real-time notifications
- **AND** availability calculations update automatically

### Requirement: Settings Table
The database SHALL store salon configuration settings as a singleton.

#### Scenario: Settings are stored and retrieved
- **WHEN** settings are created or updated
- **THEN** the settings table has: id (UUID, primary key), salon_name (text), online_deposit_enabled (boolean, default false), deposit_amount (decimal, nullable), paypal_link (text, nullable), created_at (timestamp), updated_at (timestamp)
- **AND** only one settings row should exist (singleton pattern)
- **AND** settings are publicly readable for booking flow
- **AND** settings are writable only by authenticated admins (RLS policy)

### Requirement: Row Level Security Policies
The database SHALL enforce access control using Supabase Row Level Security.

#### Scenario: Public read access to services and staff
- **WHEN** unauthenticated users query services or staff tables
- **THEN** SELECT operations are allowed
- **AND** INSERT, UPDATE, DELETE operations are denied

#### Scenario: Admin write access to all tables
- **WHEN** authenticated admin users perform write operations
- **THEN** INSERT, UPDATE, DELETE operations are allowed on all tables
- **AND** admin authentication is verified via Supabase Auth

#### Scenario: Public read access to settings
- **WHEN** unauthenticated users query settings table
- **THEN** SELECT operations are allowed (needed for booking flow)
- **AND** write operations are denied

### Requirement: Availability Calculation
The database SHALL support queries that calculate available time slots.

#### Scenario: Available slots are calculated
- **WHEN** availability is queried for a specific staff member and date
- **THEN** the query excludes time slots that conflict with existing appointments
- **AND** the query considers staff working hours (if stored)
- **AND** time slots are generated in 30-minute increments
- **AND** results are returned efficiently for real-time display

