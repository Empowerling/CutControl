export type Salon = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type Settings = {
  id: string;
  salon_id: string;
  online_deposits_enabled: boolean;
  manual_approval_enabled: boolean;
  deposit_amount: number;
  paypal_link: string | null;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  salon_id: string;
  name: string;
  category: 'cut' | 'color' | 'style' | 'treatment' | 'special';
  duration_minutes: number;
  price: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Staff = {
  id: string;
  salon_id: string;
  name: string;
  role: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type StaffService = {
  id: string;
  staff_id: string;
  service_id: string;
  created_at: string;
};

export type StaffWorkingHours = {
  id: string;
  staff_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
};

export type Appointment = {
  id: string;
  salon_id: string;
  service_id: string;
  staff_id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  deposit_paid: boolean;
  deposit_amount: number;
  total_price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

