'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAppointment } from '@/lib/supabase/queries';
import { supabase } from '@/lib/supabase/client';
import type { Service, Settings } from '@/lib/types/database';
import { ExternalLink, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutSummaryProps {
  salonId: string;
  service: Service;
  staffId: string;
  date: Date;
  time: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  settings: Settings | null;
}

export function CheckoutSummary({
  salonId,
  service,
  staffId,
  date,
  time,
  customerInfo,
  settings,
}: CheckoutSummaryProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get staff name
  const { data: staff } = useQuery({
    queryKey: ['staff', salonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('name')
        .eq('id', staffId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      const appointment = {
        salon_id: salonId,
        service_id: service.id,
        staff_id: staffId,
        client_name: customerInfo.name,
        client_email: customerInfo.email || null,
        client_phone: customerInfo.phone || null,
        appointment_date: format(date, 'yyyy-MM-dd'),
        appointment_time: time,
        duration_minutes: service.duration_minutes,
        status: settings?.manual_approval_enabled ? 'pending' : 'confirmed',
        deposit_paid: false,
        deposit_amount: settings?.online_deposits_enabled ? settings.deposit_amount || 0 : 0,
        total_price: service.price,
        notes: null,
      };

      return createAppointment(appointment);
    },
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Navigate to success page with appointment ID
      router.push(`/booking-success?id=${appointment.id}`);
    },
  });

  const handleConfirmBooking = () => {
    createBookingMutation.mutate();
  };

  const handlePayDeposit = () => {
    if (settings?.paypal_link) {
      window.open(settings.paypal_link, '_blank', 'noopener,noreferrer');
      // Create booking after opening PayPal
      handleConfirmBooking();
    }
  };


  const requiresDeposit = settings?.online_deposits_enabled && (settings.deposit_amount || 0) > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Confirm Your Booking</h2>

      {/* Booking Summary */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-foreground border-b border-border pb-2">
          Booking Details
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-muted">Service</span>
            <span className="font-medium text-foreground">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">Duration</span>
            <span className="text-foreground">{service.duration_minutes} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">Stylist</span>
            <span className="font-medium text-foreground">{staff?.name || 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">Date & Time</span>
            <span className="font-medium text-foreground">
              {format(date, 'MMM d, yyyy')} at {time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">Name</span>
            <span className="text-foreground">{customerInfo.name}</span>
          </div>
          {customerInfo.email && (
            <div className="flex justify-between">
              <span className="text-foreground-muted">Email</span>
              <span className="text-foreground">{customerInfo.email}</span>
            </div>
          )}
          {customerInfo.phone && (
            <div className="flex justify-between">
              <span className="text-foreground-muted">Phone</span>
              <span className="text-foreground">{customerInfo.phone}</span>
            </div>
          )}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-accent">€{service.price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Deposit Payment Section */}
      {requiresDeposit && (
        <div className="bg-accent/5 border border-accent/30 rounded-lg p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">Deposit Required</h4>
              <p className="text-sm text-foreground-muted mb-4">
                To secure your appointment, please pay a deposit of{' '}
                <span className="font-bold text-accent">€{settings.deposit_amount?.toFixed(2)}</span>{' '}
                via PayPal. The deposit will be deducted from your total on the day of service.
              </p>
              {settings.paypal_link && (
                <button
                  onClick={handlePayDeposit}
                  disabled={createBookingMutation.isPending}
                  className={cn(
                    'w-full h-11 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2',
                    'bg-accent text-accent-foreground hover:bg-accent/90',
                    createBookingMutation.isPending && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Pay €{settings.deposit_amount?.toFixed(2)} via PayPal
                    </>
                  )}
                </button>
              )}
              <p className="text-xs text-foreground-muted mt-3">
                Note: The deposit is non-refundable if you don't show up for your appointment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Button (if no deposit required) */}
      {!requiresDeposit && (
        <button
          onClick={handleConfirmBooking}
          disabled={createBookingMutation.isPending}
          className={cn(
            'w-full h-11 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2',
            'bg-accent text-accent-foreground hover:bg-accent/90',
            createBookingMutation.isPending && 'opacity-50 cursor-not-allowed'
          )}
        >
          {createBookingMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Confirming...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
      )}

      {createBookingMutation.isError && (
        <div className="p-4 rounded-md bg-error/10 border border-error/30 text-error text-sm">
          Failed to create booking. Please try again.
        </div>
      )}
    </div>
  );
}

