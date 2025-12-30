'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { cancelAppointmentByToken } from '@/lib/supabase/queries';
import { Scissors, AlertTriangle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function CancelBookingPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [cancelled, setCancelled] = useState(false);

  const cancelAppointment = useMutation({
    mutationFn: cancelAppointmentByToken,
    onSuccess: () => {
      setCancelled(true);
    },
  });

  const handleCancel = async () => {
    if (!token) return;
    try {
      await cancelAppointment.mutateAsync(token);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (cancelled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Termin storniert</h1>
          <p className="text-foreground-muted mb-6">
            Dein Termin wurde erfolgreich storniert. Wir hoffen, dich bald wieder zu sehen!
          </p>
          <Link href="/">
            <button className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Neuen Termin buchen
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-foreground tracking-tight">Termin stornieren</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Termin wirklich stornieren?
          </h2>
          <p className="text-foreground-muted mb-8">
            Bist du sicher, dass du deinen Termin stornieren möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>

          {cancelAppointment.isError && (
            <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6">
              <p className="text-error text-sm">
                Termin konnte nicht gefunden werden oder wurde bereits storniert.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCancel}
              disabled={cancelAppointment.isPending}
              className="w-full h-11 px-4 rounded-md bg-error text-white font-medium hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {cancelAppointment.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Ja, Termin stornieren
            </button>
            <Link href="/" className="w-full">
              <button className="w-full h-11 px-4 rounded-md border border-border bg-card text-foreground font-medium hover:bg-background-alt transition-colors">
                Abbrechen
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

