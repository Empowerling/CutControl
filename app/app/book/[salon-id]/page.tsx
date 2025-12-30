'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getServicesBySalon, getSettingsBySalon } from '@/lib/supabase/queries';
import { BookingFlow } from '@/components/booking/booking-flow';
import { useState } from 'react';

export default function BookPage() {
  const params = useParams();
  const salonId = params['salon-id'] as string;
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services', salonId],
    queryFn: () => getServicesBySalon(salonId),
    enabled: !!salonId,
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings', salonId],
    queryFn: () => getSettingsBySalon(salonId),
    enabled: !!salonId,
  });

  if (servicesLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground-muted">Loading...</div>
      </div>
    );
  }

  if (!salonId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Invalid salon ID</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BookingFlow
        salonId={salonId}
        services={services}
        settings={settings}
        selectedServiceId={selectedServiceId}
        onServiceSelect={setSelectedServiceId}
      />
    </div>
  );
}

