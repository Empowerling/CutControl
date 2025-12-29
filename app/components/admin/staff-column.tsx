'use client';

import { format, parseISO } from 'date-fns';
import type { Staff, Appointment } from '@/lib/types/database';
import { AppointmentCard } from './appointment-card';
import { cn } from '@/lib/utils';

interface StaffColumnProps {
  staff: Staff;
  weekDates: Date[];
  timeSlots: string[];
  appointments: Record<string, Appointment[]>;
}

export function StaffColumn({
  staff,
  weekDates,
  timeSlots,
  appointments,
}: StaffColumnProps) {
  // Calculate appointment positions and heights
  const getAppointmentStyle = (appointment: Appointment, dateStr: string) => {
    const appointmentStart = parseISO(`${dateStr}T${appointment.appointment_time}`);
    const startMinutes = appointmentStart.getHours() * 60 + appointmentStart.getMinutes();
    const slotStartMinutes = 8 * 60; // 8:00 AM
    const slotHeight = 32; // 16px per 30-minute slot (h-16 = 64px / 2)
    const top = ((startMinutes - slotStartMinutes) / 30) * slotHeight;
    const height = (appointment.duration_minutes / 30) * slotHeight;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  return (
    <div className="flex-1 min-w-[200px] border-r border-border last:border-r-0">
      {/* Staff Header */}
      <div className="h-12 border-b border-border bg-background-alt flex items-center justify-center p-2">
        <div className="flex flex-col items-center gap-1">
          {staff.avatar_url ? (
            <img
              src={staff.avatar_url}
              alt={staff.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xs font-medium text-accent">
                {staff.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-xs font-medium text-foreground truncate max-w-full">
            {staff.name}
          </span>
        </div>
      </div>

      {/* Time Slots Grid - One column per day */}
      <div className="grid grid-cols-7 relative" style={{ height: `${timeSlots.length * 64}px` }}>
        {weekDates.map((date, dateIndex) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayAppointments = appointments[dateStr] || [];

          return (
            <div key={dateIndex} className="relative border-r border-border-light last:border-r-0">
              {/* Time Slot Background */}
              {timeSlots.map((time, timeIndex) => (
                <div
                  key={timeIndex}
                  className="h-16 border-b border-border-light hover:bg-background-alt/50 transition-colors"
                />
              ))}

              {/* Appointments */}
              {dayAppointments.map((appointment) => {
                const style = getAppointmentStyle(appointment, dateStr);
                return (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    style={style}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

