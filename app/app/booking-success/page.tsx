'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { format, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Scissors,
  ExternalLink,
  MessageCircle,
  X,
  ArrowLeft,
} from 'lucide-react';
import type { Appointment, Service, Staff, Settings } from '@/lib/types/database';
import { cn } from '@/lib/utils';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('id');

  // Fetch appointment data
  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      if (!appointmentId) return null;

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (error) throw error;
      return data as Appointment;
    },
    enabled: !!appointmentId,
  });

  // Fetch service data
  const { data: service } = useQuery({
    queryKey: ['service', appointment?.service_id],
    queryFn: async () => {
      if (!appointment?.service_id) return null;

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', appointment.service_id)
        .single();

      if (error) throw error;
      return data as Service;
    },
    enabled: !!appointment?.service_id,
  });

  // Fetch staff data
  const { data: staff } = useQuery({
    queryKey: ['staff', appointment?.staff_id],
    queryFn: async () => {
      if (!appointment?.staff_id) return null;

      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', appointment.staff_id)
        .single();

      if (error) throw error;
      return data as Staff;
    },
    enabled: !!appointment?.staff_id,
  });

  // Fetch settings
  const { data: settings } = useQuery({
    queryKey: ['settings', appointment?.salon_id],
    queryFn: async () => {
      if (!appointment?.salon_id) return null;

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('salon_id', appointment.salon_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Settings | null;
    },
    enabled: !!appointment?.salon_id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground-muted">Loading...</div>
      </div>
    );
  }

  if (!appointment || !service || !staff) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-foreground mb-4">Buchung nicht gefunden</h1>
          <Link
            href="/"
            className="inline-block h-11 px-6 rounded-md bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = format(parse(appointment.appointment_date, 'yyyy-MM-dd', new Date()), 'EEEE, d. MMMM yyyy', { locale: de });
  const depositRequired = settings?.online_deposits_enabled && (settings.deposit_amount || 0) > 0;

  // Generate calendar URLs
  const eventTitle = `${service.name} bei ${staff.name}`;
  const eventStart = `${appointment.appointment_date.replace(/-/g, '')}T${appointment.appointment_time.replace(':', '')}00`;
  const endMinutes = parseInt(appointment.appointment_time.split(':')[0]) * 60 + parseInt(appointment.appointment_time.split(':')[1]) + service.duration_minutes;
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}${String(endMinutes % 60).padStart(2, '0')}00`;
  const eventEnd = `${appointment.appointment_date.replace(/-/g, '')}T${endTime}`;

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventStart}/${eventEnd}&details=${encodeURIComponent('Dein Termin wurde erfolgreich gebucht.')}`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${eventStart}
DTEND:${eventEnd}
SUMMARY:${eventTitle}
DESCRIPTION:Dein Termin wurde erfolgreich gebucht.
END:VEVENT
END:VCALENDAR`;

  const icsBlob = new Blob([icsContent], { type: 'text/calendar' });
  const icsUrl = URL.createObjectURL(icsBlob);

  const cancellationLink = `/cancel/${appointment.cancellation_token}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/20">
              <Scissors className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground tracking-tight">Buchung bestätigt</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-4 py-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Vielen Dank, {appointment.client_name}!
          </h2>
          <p className="text-foreground-muted">
            Dein Termin wurde erfolgreich gebucht.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4 border-b border-border pb-2">
            Deine Buchung
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">{service.name}</p>
                <p className="text-sm text-foreground-muted">{service.duration_minutes} Min • €{service.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">{staff.name}</p>
                <p className="text-sm text-foreground-muted">Dein Stylist</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">{formattedDate}</p>
                <p className="text-sm text-foreground-muted">Datum</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">{appointment.appointment_time} Uhr</p>
                <p className="text-sm text-foreground-muted">Uhrzeit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Payment (if required) */}
        {depositRequired && settings?.paypal_link && (
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Anzahlung sichern</h4>
                <p className="text-sm text-foreground-muted mb-4">
                  Um deinen Termin zu sichern, sende bitte <span className="text-accent font-bold">€{settings.deposit_amount.toFixed(2)}</span> via PayPal.
                </p>
                <a href={settings.paypal_link} target="_blank" rel="noopener noreferrer">
                  <button className="w-full h-11 px-4 rounded-md bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Jetzt €{settings.deposit_amount.toFixed(2)} via PayPal senden
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Message */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Bestätigung gesendet</h4>
              <p className="text-sm text-foreground-muted">
                Wir haben dir eine Bestätigung per WhatsApp/E-Mail gesendet. Überprüfe dein Postfach!
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Actions */}
        <div className="space-y-3 mb-6">
          <p className="font-medium text-foreground text-center mb-2">Zum Kalender hinzufügen</p>
          <div className="flex gap-3">
            <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full h-11 px-4 rounded-md border border-border bg-card text-foreground font-medium hover:bg-background-alt transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Google
              </button>
            </a>
            <a href={icsUrl} download="termin.ics" className="flex-1">
              <button className="w-full h-11 px-4 rounded-md border border-border bg-card text-foreground font-medium hover:bg-background-alt transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Apple/iCal
              </button>
            </a>
          </div>
        </div>

        {/* Cancellation Link */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5 text-error" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">Termin stornieren?</h4>
              <p className="text-sm text-foreground-muted mb-3">
                Kostenlose Stornierung bis 24h vor dem Termin.
              </p>
              <Link href={cancellationLink}>
                <button className="h-9 px-4 rounded-md border border-error/30 bg-card text-error font-medium hover:bg-error/5 transition-colors text-sm">
                  Termin stornieren
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Booking */}
        <div className="text-center">
          <Link href={`/book/${appointment.salon_id}`}>
            <button className="h-11 px-6 rounded-md border border-border bg-card text-foreground font-medium hover:bg-background-alt transition-colors inline-flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Neue Buchung
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

