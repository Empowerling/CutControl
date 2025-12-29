'use client';

import { format, parseISO } from 'date-fns';
import type { Appointment } from '@/lib/types/database';
import { cn } from '@/lib/utils';

interface AppointmentCardProps {
  appointment: Appointment;
  style: { top: string; height: string };
}

export function AppointmentCard({ appointment, style }: AppointmentCardProps) {
  const statusColors = {
    pending: 'bg-warning/10 border-warning/30 text-warning-foreground',
    confirmed: 'bg-success/10 border-success/30 text-success-foreground',
    cancelled: 'bg-error/10 border-error/30 text-error-foreground',
    completed: 'bg-foreground-muted/10 border-foreground-muted/30',
  };

  const time = format(parseISO(`2000-01-01T${appointment.appointment_time}`), 'HH:mm');
  const endTime = format(
    parseISO(`2000-01-01T${appointment.appointment_time}`).setMinutes(
      parseISO(`2000-01-01T${appointment.appointment_time}`).getMinutes() +
        appointment.duration_minutes
    ),
    'HH:mm'
  );

  return (
    <div
      className={cn(
        'absolute left-0 right-0 mx-1 rounded-md border p-1.5 text-xs shadow-sm',
        'hover:shadow-md transition-shadow cursor-pointer',
        statusColors[appointment.status]
      )}
      style={style}
      title={`${appointment.client_name} - ${time}-${endTime}`}
    >
      <div className="font-medium truncate">{appointment.client_name}</div>
      <div className="text-[10px] opacity-75 truncate">
        {time} - {endTime}
      </div>
    </div>
  );
}

