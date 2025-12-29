## ADDED Requirements

### Requirement: Admin Authentication
The admin settings page SHALL require authentication before access.

#### Scenario: Unauthenticated user attempts to access admin settings
- **WHEN** user navigates to `/admin/settings` without authentication
- **THEN** user is redirected to login page
- **AND** access is denied

#### Scenario: Authenticated admin accesses settings
- **WHEN** authenticated admin navigates to `/admin/settings`
- **THEN** the settings page is displayed
- **AND** current settings are loaded from Supabase

### Requirement: Online Deposits Toggle
The admin settings SHALL provide a toggle to enable or disable online deposit requirements.

#### Scenario: Admin enables online deposits
- **WHEN** admin toggles the "Online Deposits" switch to enabled
- **THEN** the `online_deposit_enabled` setting is set to TRUE in Supabase
- **AND** the deposit amount and PayPal link fields become visible/required
- **AND** changes are saved immediately or on form submission

#### Scenario: Admin disables online deposits
- **WHEN** admin toggles the "Online Deposits" switch to disabled
- **THEN** the `online_deposit_enabled` setting is set to FALSE in Supabase
- **AND** the deposit amount and PayPal link fields may be hidden or disabled
- **AND** future bookings will not require deposit payment

### Requirement: Deposit Amount Configuration
The admin settings SHALL allow configuration of the deposit amount required for bookings.

#### Scenario: Admin sets deposit amount
- **WHEN** admin enters a number in the "Deposit Amount" field
- **THEN** the value is validated to be a positive number (minimum 0)
- **AND** the `deposit_amount` setting is updated in Supabase
- **AND** the value is displayed in the booking flow when deposits are enabled

#### Scenario: Admin enters invalid deposit amount
- **WHEN** admin enters a negative number or non-numeric value
- **THEN** validation error is displayed
- **AND** the value is not saved

### Requirement: PayPal Merchant Link Configuration
The admin settings SHALL allow configuration of the PayPal.me link for deposit payments.

#### Scenario: Admin sets PayPal link
- **WHEN** admin enters a URL in the "PayPal Link" field
- **THEN** the URL format is validated (must be valid URL, preferably HTTPS)
- **AND** the `paypal_link` setting is updated in Supabase
- **AND** the link is used in the booking flow payment button

#### Scenario: Admin enters invalid PayPal link
- **WHEN** admin enters an invalid URL format
- **THEN** validation error is displayed
- **AND** the value is not saved

### Requirement: Settings Form Submission
The admin settings form SHALL save changes to Supabase with proper error handling.

#### Scenario: Admin successfully saves settings
- **WHEN** admin submits the settings form with valid data
- **THEN** settings are updated in Supabase via API route
- **AND** a success toast notification is displayed
- **AND** form shows loading state during submission

#### Scenario: Admin save fails
- **WHEN** admin attempts to save but Supabase update fails
- **THEN** an error toast notification is displayed
- **AND** form data is preserved
- **AND** admin can retry the save operation

### Requirement: Settings Display
The admin settings page SHALL display current settings values when loaded.

#### Scenario: Admin views settings page
- **WHEN** admin navigates to `/admin/settings`
- **THEN** current settings are fetched from Supabase
- **AND** form fields are populated with current values
- **AND** skeleton loaders are shown while data is fetching

