-- CutControl MVP Database Schema
-- Supabase PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SALONS TABLE
-- ============================================
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SETTINGS TABLE (Per Salon)
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  online_deposits_enabled BOOLEAN DEFAULT false,
  manual_approval_enabled BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10, 2) DEFAULT 0,
  paypal_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(salon_id)
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cut', 'color', 'style', 'treatment', 'special')),
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STAFF TABLE
-- ============================================
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STAFF SERVICES JUNCTION TABLE
-- ============================================
CREATE TABLE staff_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(staff_id, service_id)
);

-- ============================================
-- STAFF WORKING HOURS TABLE
-- ============================================
CREATE TABLE staff_working_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(staff_id, day_of_week)
);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  deposit_paid BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10, 2) DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  cancellation_token UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_services_salon_id ON services(salon_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_staff_salon_id ON staff(salon_id);
CREATE INDEX idx_staff_services_staff_id ON staff_services(staff_id);
CREATE INDEX idx_staff_services_service_id ON staff_services(service_id);
CREATE INDEX idx_appointments_salon_id ON appointments(salon_id);
CREATE INDEX idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_staff_date ON appointments(staff_id, appointment_date);
CREATE INDEX idx_appointments_cancellation_token ON appointments(cancellation_token);
CREATE INDEX idx_staff_working_hours_staff_id ON staff_working_hours(staff_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Salons: Public read access
CREATE POLICY "Salons are publicly readable"
  ON salons FOR SELECT
  USING (true);

-- Settings: Public read access (needed for booking flow)
CREATE POLICY "Settings are publicly readable"
  ON settings FOR SELECT
  USING (true);

-- Services: Public read access for active services
CREATE POLICY "Active services are publicly readable"
  ON services FOR SELECT
  USING (is_active = true);

-- Staff: Public read access for active staff
CREATE POLICY "Active staff are publicly readable"
  ON staff FOR SELECT
  USING (is_active = true);

-- Staff Services: Public read access
CREATE POLICY "Staff services are publicly readable"
  ON staff_services FOR SELECT
  USING (true);

-- Staff Working Hours: Public read access
CREATE POLICY "Staff working hours are publicly readable"
  ON staff_working_hours FOR SELECT
  USING (true);

-- Appointments: Public read access (for availability checking)
CREATE POLICY "Appointments are publicly readable"
  ON appointments FOR SELECT
  USING (true);

-- Appointments: Public insert (for booking flow)
CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Admin policies (authenticated users can manage all data)
-- Note: In production, you'll want to add proper admin role checks
CREATE POLICY "Admins can manage salons"
  ON salons FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage settings"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage staff"
  ON staff FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage staff services"
  ON staff_services FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage staff working hours"
  ON staff_working_hours FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage appointments"
  ON appointments FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS FOR AVAILABILITY CALCULATION
-- ============================================

-- Function to check if a time slot is available
CREATE OR REPLACE FUNCTION is_time_slot_available(
  p_staff_id UUID,
  p_date DATE,
  p_time TIME,
  p_duration_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_day_of_week INTEGER;
  v_start_time TIME;
  v_end_time TIME;
  v_slot_end_time TIME;
  v_has_conflict BOOLEAN;
BEGIN
  -- Get day of week (0 = Sunday, 6 = Saturday)
  v_day_of_week := EXTRACT(DOW FROM p_date);
  
  -- Check if staff has working hours for this day
  SELECT start_time, end_time INTO v_start_time, v_end_time
  FROM staff_working_hours
  WHERE staff_id = p_staff_id
    AND day_of_week = v_day_of_week
    AND is_available = true;
  
  -- If no working hours, slot is not available
  IF v_start_time IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if requested time is within working hours
  IF p_time < v_start_time OR p_time >= v_end_time THEN
    RETURN false;
  END IF;
  
  -- Calculate slot end time
  v_slot_end_time := p_time + (p_duration_minutes || ' minutes')::INTERVAL;
  
  -- Check if slot end time exceeds working hours
  IF v_slot_end_time > v_end_time THEN
    RETURN false;
  END IF;
  
  -- Check for conflicting appointments
  SELECT EXISTS(
    SELECT 1
    FROM appointments
    WHERE staff_id = p_staff_id
      AND appointment_date = p_date
      AND status IN ('pending', 'confirmed')
      AND (
        (appointment_time <= p_time AND appointment_time + (duration_minutes || ' minutes')::INTERVAL > p_time)
        OR
        (appointment_time < v_slot_end_time AND appointment_time + (duration_minutes || ' minutes')::INTERVAL >= v_slot_end_time)
        OR
        (appointment_time >= p_time AND appointment_time + (duration_minutes || ' minutes')::INTERVAL <= v_slot_end_time)
      )
  ) INTO v_has_conflict;
  
  RETURN NOT v_has_conflict;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_salons_updated_at BEFORE UPDATE ON salons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert a sample salon
INSERT INTO salons (id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'CutControl Demo Salon', 'demo-salon')
ON CONFLICT DO NOTHING;

-- Insert sample settings
INSERT INTO settings (salon_id, online_deposits_enabled, manual_approval_enabled, deposit_amount, paypal_link) VALUES
  ('00000000-0000-0000-0000-000000000001', false, false, 20.00, 'https://paypal.me/demosalon')
ON CONFLICT DO NOTHING;

