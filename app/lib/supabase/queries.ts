import { supabase } from './client';
import type { Staff, Appointment, Service, Settings, StaffWorkingHours } from '@/lib/types/database';

// Staff Queries
export async function getStaffBySalon(salonId: string): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createStaff(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> {
  const { data, error } = await supabase
    .from('staff')
    .insert(staff)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStaff(id: string, updates: Partial<Staff>): Promise<Staff> {
  const { data, error } = await supabase
    .from('staff')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStaff(id: string): Promise<void> {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Appointments Queries
export async function getAppointmentsByDateRange(
  salonId: string,
  startDate: string,
  endDate: string
): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)
    .gte('appointment_date', startDate)
    .lte('appointment_date', endDate)
    .in('status', ['pending', 'confirmed'])
    .order('appointment_date')
    .order('appointment_time');

  if (error) throw error;
  return data || [];
}

export async function getAppointmentsByStaffAndDate(
  staffId: string,
  date: string
): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .eq('appointment_date', date)
    .in('status', ['pending', 'confirmed'])
    .order('appointment_time');

  if (error) throw error;
  return data || [];
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'cancellation_token'>): Promise<Appointment> {
  // cancellation_token wird automatisch von der Datenbank generiert (DEFAULT gen_random_uuid())
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointment)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelAppointmentByToken(token: string): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('cancellation_token', token)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Services Queries
export async function getServicesBySalon(salonId: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('category')
    .order('name');

  if (error) throw error;
  return data || [];
}

// Settings Queries
export async function getSettingsBySalon(salonId: string): Promise<Settings | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('salon_id', salonId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
}

export async function updateSettings(salonId: string, updates: Partial<Settings>): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .update(updates)
    .eq('salon_id', salonId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Working Hours Queries
export async function getWorkingHoursByStaff(staffId: string): Promise<StaffWorkingHours[]> {
  const { data, error } = await supabase
    .from('staff_working_hours')
    .select('*')
    .eq('staff_id', staffId)
    .eq('is_available', true)
    .order('day_of_week');

  if (error) throw error;
  return data || [];
}

