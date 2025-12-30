import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">CutControl</h1>
          <p className="text-foreground-muted">High-performance booking system</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-foreground mb-2">Admin</h2>
            <div className="space-y-2">
              <Link
                href="/admin"
                className="block w-full h-11 px-4 rounded-md bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors flex items-center justify-center"
              >
                View Calendar
              </Link>
              <Link
                href="/admin/settings"
                className="block w-full h-11 px-4 rounded-md border border-border bg-card text-foreground font-medium hover:bg-background-alt transition-colors flex items-center justify-center"
              >
                Merchant Settings
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-foreground mb-2">Customer Booking</h2>
            <Link
              href="/book/00000000-0000-0000-0000-000000000001"
              className="block w-full h-11 px-4 rounded-md bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors flex items-center justify-center"
            >
              Book Appointment
            </Link>
          </div>
        </div>

        <p className="text-xs text-foreground-muted text-center">
          Replace the salon ID in the booking URL with your actual salon ID
        </p>
      </main>
    </div>
  );
}
