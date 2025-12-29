'use client';

import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  weekDates: Date[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function CalendarHeader({
  weekDates,
  selectedDate,
  onDateChange,
}: CalendarHeaderProps) {
  const handlePreviousWeek = () => {
    const newDate = subWeeks(selectedDate, 1);
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = addWeeks(selectedDate, 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const isCurrentWeek = isSameWeek(selectedDate, new Date(), { weekStartsOn: 1 });

  return (
    <div className="border-b border-border bg-background-alt">
      <div className="flex items-center justify-between p-4">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-border-light rounded-md transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-border-light rounded-md transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={handleToday}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              isCurrentWeek
                ? 'bg-accent text-accent-foreground'
                : 'text-foreground hover:bg-border-light'
            )}
          >
            Today
          </button>
        </div>

        {/* Week Display */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-foreground-muted" />
          <span className="text-sm font-medium text-foreground">
            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-t border-border">
        {weekDates.map((date, index) => {
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          const dayName = format(date, 'EEE');
          const dayNumber = format(date, 'd');

          return (
            <div
              key={index}
              className={cn(
                'p-3 text-center border-r border-border last:border-r-0',
                isToday && 'bg-accent/5'
              )}
            >
              <div className="text-xs font-medium text-foreground-muted mb-1">
                {dayName}
              </div>
              <div
                className={cn(
                  'text-sm font-semibold',
                  isToday
                    ? 'text-accent'
                    : 'text-foreground'
                )}
              >
                {dayNumber}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

