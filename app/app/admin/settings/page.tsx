'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettingsBySalon, updateSettings } from '@/lib/supabase/queries';
import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// TODO: Replace with actual salon ID from auth/context
const DEMO_SALON_ID = '00000000-0000-0000-0000-000000000001';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    online_deposits_enabled: false,
    manual_approval_enabled: false,
    deposit_amount: 0,
    paypal_link: '',
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings', DEMO_SALON_ID],
    queryFn: () => getSettingsBySalon(DEMO_SALON_ID),
    onSuccess: (data) => {
      if (data) {
        setFormData({
          online_deposits_enabled: data.online_deposits_enabled,
          manual_approval_enabled: data.manual_approval_enabled,
          deposit_amount: Number(data.deposit_amount) || 0,
          paypal_link: data.paypal_link || '',
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<typeof formData>) =>
      updateSettings(DEMO_SALON_ID, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', DEMO_SALON_ID] });
      // Show success message (you can add toast notification here)
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-border-light rounded w-64" />
            <div className="h-96 bg-border-light rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Merchant Settings</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Configure booking and payment settings
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Online Deposits Toggle */}
          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Online Deposits</h3>
                <p className="text-sm text-foreground-muted">
                  Require customers to pay a deposit when booking
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.online_deposits_enabled}
                  onChange={(e) =>
                    setFormData({ ...formData, online_deposits_enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
              </label>
            </div>

            {formData.online_deposits_enabled && (
              <div className="space-y-3 pt-3 border-t border-border">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Deposit Amount (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.deposit_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, deposit_amount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full h-11 px-3 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="20.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    PayPal.me Link
                  </label>
                  <input
                    type="url"
                    value={formData.paypal_link}
                    onChange={(e) =>
                      setFormData({ ...formData, paypal_link: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="https://paypal.me/yourname"
                  />
                  <p className="text-xs text-foreground-muted mt-1.5">
                    Your PayPal.me link where customers will send deposits
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Manual Approval Toggle */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Manual Approval</h3>
                <p className="text-sm text-foreground-muted">
                  Require admin approval before confirming appointments
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.manual_approval_enabled}
                  onChange={(e) =>
                    setFormData({ ...formData, manual_approval_enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className={cn(
                'h-11 px-6 rounded-md font-medium transition-colors flex items-center gap-2',
                'bg-accent text-accent-foreground hover:bg-accent/90',
                updateMutation.isPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>

          {updateMutation.isSuccess && (
            <div className="p-4 rounded-md bg-success/10 border border-success/30 text-success text-sm">
              Settings saved successfully!
            </div>
          )}

          {updateMutation.isError && (
            <div className="p-4 rounded-md bg-error/10 border border-error/30 text-error text-sm">
              Failed to save settings. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

