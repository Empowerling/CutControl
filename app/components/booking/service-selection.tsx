'use client';

import { useState } from 'react';
import type { Service } from '@/lib/types/database';
import { Scissors, Palette, Sparkles, Droplets, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceSelectionProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (serviceId: string) => void;
}

const categoryIcons = {
  cut: Scissors,
  color: Palette,
  style: Sparkles,
  treatment: Droplets,
  special: Star,
};

const categoryLabels = {
  cut: 'Cut',
  color: 'Color',
  style: 'Style',
  treatment: 'Treatment',
  special: 'Specials',
};

export function ServiceSelection({
  services,
  selectedServiceId,
  onSelect,
}: ServiceSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(services.map((s) => s.category)));
  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-4">Select a Service</h2>

      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              selectedCategory === null
                ? 'bg-accent text-accent-foreground'
                : 'bg-card border border-border text-foreground hover:bg-background-alt'
            )}
          >
            All
          </button>
          {categories.map((category) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                  selectedCategory === category
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card border border-border text-foreground hover:bg-background-alt'
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {categoryLabels[category as keyof typeof categoryLabels] || category}
              </button>
            );
          })}
        </div>
      )}

      {/* Service Cards */}
      <div className="space-y-3">
        {filteredServices.length === 0 ? (
          <p className="text-foreground-muted text-center py-8">No services available</p>
        ) : (
          filteredServices.map((service) => {
            const Icon = categoryIcons[service.category];
            const isSelected = selectedServiceId === service.id;

            return (
              <button
                key={service.id}
                onClick={() => onSelect(service.id)}
                className={cn(
                  'w-full p-4 rounded-lg border text-left transition-all',
                  'hover:shadow-md min-h-[88px] flex items-center gap-4',
                  isSelected
                    ? 'border-accent bg-accent/5 shadow-sm'
                    : 'border-border bg-card hover:bg-background-alt'
                )}
              >
                {Icon && (
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                      isSelected ? 'bg-accent text-accent-foreground' : 'bg-background-alt text-foreground-muted'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-foreground-muted">
                    <span>{service.duration_minutes} min</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">€{service.price.toFixed(2)}</span>
                  </div>
                  {service.description && (
                    <p className="text-xs text-foreground-muted mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">✓</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

