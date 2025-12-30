'use client';

import { useQuery } from '@tanstack/react-query';
import { getStaffBySalon } from '@/lib/supabase/queries';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface StaffSelectionProps {
  salonId: string;
  serviceId: string;
  selectedStaffId: string | null;
  onSelect: (staffId: string) => void;
}

export function StaffSelection({
  salonId,
  serviceId,
  selectedStaffId,
  onSelect,
}: StaffSelectionProps) {
  // Get all staff for the salon
  const { data: allStaff = [], isLoading: staffLoading } = useQuery({
    queryKey: ['staff', salonId],
    queryFn: () => getStaffBySalon(salonId),
  });

  // Get staff assigned to this service
  const { data: assignedStaffIds = [], isLoading: assignmentLoading } = useQuery({
    queryKey: ['staff-services', serviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_services')
        .select('staff_id')
        .eq('service_id', serviceId);

      if (error) throw error;
      return (data || []).map((item) => item.staff_id);
    },
  });

  const availableStaff = allStaff.filter((staff) =>
    assignedStaffIds.includes(staff.id)
  );

  if (staffLoading || assignmentLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Select Your Stylist</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-border-light rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (availableStaff.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Select Your Stylist</h2>
        <p className="text-foreground-muted text-center py-8">
          No staff available for this service
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-4">Select Your Stylist</h2>
      <div className="space-y-3">
        {availableStaff.map((staff) => {
          const isSelected = selectedStaffId === staff.id;

          return (
            <button
              key={staff.id}
              onClick={() => onSelect(staff.id)}
              className={cn(
                'w-full p-4 rounded-lg border text-left transition-all',
                'hover:shadow-md min-h-[88px] flex items-center gap-4',
                isSelected
                  ? 'border-accent bg-accent/5 shadow-sm'
                  : 'border-border bg-card hover:bg-background-alt'
              )}
            >
              {staff.avatar_url ? (
                <img
                  src={staff.avatar_url}
                  alt={staff.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-semibold text-accent">
                    {staff.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">{staff.name}</h3>
                {staff.role && (
                  <p className="text-sm text-foreground-muted">{staff.role}</p>
                )}
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

