'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getAppointmentsByStaffAndDate } from '@/lib/supabase/queries';
import type { Service } from '@/lib/types/database';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface TimeSlotSelectionProps {
  salonId: string;
  staffId: string;
  service: Service;
  selectedDate: Date | null;
  selectedTime: string | null;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onCustomerInfoChange: (info: { name: string; email: string; phone: string }) => void;
}

// Generate time slots (30-minute increments from 8:00 to 20:00)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    slots.push(`${String(hour).padStart(2, '0')}:30`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export function TimeSlotSelection({
  salonId,
  staffId,
  service,
  selectedDate,
  selectedTime,
  customerInfo,
  onDateSelect,
  onTimeSelect,
  onCustomerInfoChange,
}: TimeSlotSelectionProps) {
  const [localDate, setLocalDate] = useState<Date>(selectedDate || new Date());
  const weekStart = startOfWeek(localDate, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', staffId, dateStr],
    queryFn: () => getAppointmentsByStaffAndDate(staffId, dateStr!),
    enabled: !!dateStr,
  });

  // Calculate booked time slots
  const bookedSlots = new Set(
    appointments.map((apt) => {
      const [hours, minutes] = apt.appointment_time.split(':').map(Number);
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    })
  );

  // Check if a time slot is available
  const isSlotAvailable = (time: string) => {
    if (!selectedDate) return false;
    if (bookedSlots.has(time)) return false;

    // Check if slot + duration would conflict with existing appointments
    const [slotHour, slotMin] = time.split(':').map(Number);
    const slotStartMinutes = slotHour * 60 + slotMin;
    const slotEndMinutes = slotStartMinutes + service.duration_minutes;

    for (const apt of appointments) {
      const [aptHour, aptMin] = apt.appointment_time.split(':').map(Number);
      const aptStartMinutes = aptHour * 60 + aptMin;
      const aptEndMinutes = aptStartMinutes + apt.duration_minutes;

      // Check for overlap
      if (
        (slotStartMinutes < aptEndMinutes && slotEndMinutes > aptStartMinutes)
      ) {
        return false;
      }
    }

    return true;
  };

  const handleDateClick = (date: Date) => {
    setLocalDate(date);
    onDateSelect(date);
    onTimeSelect(''); // Reset time when date changes
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Select Date & Time</h2>

      {/* Date Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-foreground-muted" />
          <span className="text-sm font-medium text-foreground">Choose a date</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                className={cn(
                  'aspect-square rounded-lg border text-sm font-medium transition-all',
                  isSelected
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-card border-border text-foreground hover:bg-background-alt',
                  isToday && !isSelected && 'border-accent/50'
                )}
              >
                <div className="text-xs text-foreground-muted mb-0.5">
                  {format(date, 'EEE')}
                </div>
                <div>{format(date, 'd')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <div>
          <div className="mb-3">
            <span className="text-sm font-medium text-foreground">
              Available times for {format(selectedDate, 'EEEE, MMMM d')}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => {
              const isAvailable = isSlotAvailable(time);
              const isSelected = selectedTime === time;

              return (
                <button
                  key={time}
                  onClick={() => isAvailable && onTimeSelect(time)}
                  disabled={!isAvailable}
                  className={cn(
                    'h-11 rounded-md border text-sm font-medium transition-all',
                    isSelected
                      ? 'bg-accent text-accent-foreground border-accent'
                      : isAvailable
                      ? 'bg-card border-border text-foreground hover:bg-background-alt hover:border-accent/50'
                      : 'bg-background-alt border-border-light text-foreground-muted cursor-not-allowed opacity-50'
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Information Form */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-semibold text-foreground">Your Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) =>
                onCustomerInfoChange({ ...customerInfo, name: e.target.value })
              }
              placeholder="Your full name"
              className="w-full h-11 px-3 rounded-md border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) =>
                onCustomerInfoChange({ ...customerInfo, email: e.target.value })
              }
              placeholder="your@email.com"
              className="w-full h-11 px-3 rounded-md border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) =>
                onCustomerInfoChange({ ...customerInfo, phone: e.target.value })
              }
              placeholder="+49 123 456 789"
              className="w-full h-11 px-3 rounded-md border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

