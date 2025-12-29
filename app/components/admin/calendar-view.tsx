'use client';

import { format, isSameDay, parseISO } from 'date-fns';
import type { Staff, Appointment } from '@/lib/types/database';
import { CalendarHeader } from './calendar-header';
import { StaffColumn } from './staff-column';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  staff: Staff[];
  appointments: Appointment[];
  weekDates: Date[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function CalendarView({
  staff,
  appointments,
  weekDates,
  selectedDate,
  onDateChange,
}: CalendarViewProps) {
  // Generate time slots (30-minute increments from 8:00 to 20:00)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });

  // Group appointments by staff and date
  const appointmentsByStaffAndDate = staff.reduce((acc, staffMember) => {
    acc[staffMember.id] = {};
    weekDates.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      acc[staffMember.id][dateStr] = appointments.filter(
        (apt) =>
          apt.staff_id === staffMember.id &&
          apt.appointment_date === dateStr &&
          (apt.status === 'pending' || apt.status === 'confirmed')
      );
    });
    return acc;
  }, {} as Record<string, Record<string, Appointment[]>>);

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      {/* Calendar Header with Date Navigation */}
      <CalendarHeader
        weekDates={weekDates}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block">
          {/* Time Column + Staff Columns */}
          <div className="flex border-t border-border">
            {/* Time Column */}
            <div className="w-20 flex-shrink-0 border-r border-border bg-background-alt">
              <div className="h-12 border-b border-border flex items-center justify-center text-xs font-medium text-foreground-muted">
                Time
              </div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-16 border-b border-border-light flex items-start justify-end pr-2 pt-1"
                >
                  <span className="text-xs text-foreground-muted">{time}</span>
                </div>
              ))}
            </div>

            {/* Staff Columns */}
            {staff.length === 0 ? (
              <div className="flex-1 flex items-center justify-center h-96 text-foreground-muted">
                <p>No staff members. Add staff to see the calendar.</p>
              </div>
            ) : (
              staff.map((staffMember) => (
                <StaffColumn
                  key={staffMember.id}
                  staff={staffMember}
                  weekDates={weekDates}
                  timeSlots={timeSlots}
                  appointments={appointmentsByStaffAndDate[staffMember.id] || {}}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

