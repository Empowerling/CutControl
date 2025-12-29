'use client';

import { useQuery } from '@tanstack/react-query';
import { getStaffBySalon, getAppointmentsByDateRange } from '@/lib/supabase/queries';
import { CalendarView } from '@/components/admin/calendar-view';
import { format, startOfWeek, addDays } from 'date-fns';
import { useState } from 'react';

// TODO: Replace with actual salon ID from auth/context
const DEMO_SALON_ID = '00000000-0000-0000-0000-000000000001';

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const startDate = format(weekDates[0], 'yyyy-MM-dd');
  const endDate = format(weekDates[6], 'yyyy-MM-dd');

  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryKey: ['staff', DEMO_SALON_ID],
    queryFn: () => getStaffBySalon(DEMO_SALON_ID),
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', DEMO_SALON_ID, startDate, endDate],
    queryFn: () => getAppointmentsByDateRange(DEMO_SALON_ID, startDate, endDate),
  });

  if (staffLoading || appointmentsLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-border-light rounded w-64" />
            <div className="h-96 bg-border-light rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-foreground">CutControl Admin</h1>
          <p className="text-sm text-foreground-muted mt-1">Staff Calendar</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4">
        <CalendarView
          staff={staff}
          appointments={appointments}
          weekDates={weekDates}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </div>
  );
}

