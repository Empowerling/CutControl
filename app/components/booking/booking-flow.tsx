'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import type { Service, Settings } from '@/lib/types/database';
import { ServiceSelection } from './service-selection';
import { StaffSelection } from './staff-selection';
import { TimeSlotSelection } from './time-slot-selection';
import { CheckoutSummary } from './checkout-summary';
import { cn } from '@/lib/utils';

interface BookingFlowProps {
  salonId: string;
  services: Service[];
  settings: Settings | null;
  selectedServiceId: string | null;
  onServiceSelect: (serviceId: string | null) => void;
}

const steps = ['Service', 'Staff', 'Time', 'Confirm'];

export function BookingFlow({
  salonId,
  services,
  settings,
  selectedServiceId,
  onServiceSelect,
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const canProceed = () => {
    if (currentStep === 0) return selectedServiceId !== null;
    if (currentStep === 1) return selectedStaffId !== null;
    if (currentStep === 2) return selectedDate !== null && selectedTime !== null && customerInfo.name.trim() !== '';
    return true;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-foreground">Book Appointment</h1>
          <p className="text-sm text-foreground-muted mt-0.5">Select your service and time</p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    index < currentStep && 'bg-accent text-accent-foreground',
                    index === currentStep && 'bg-accent text-accent-foreground ring-4 ring-accent/20',
                    index > currentStep && 'bg-border-light text-foreground-muted'
                  )}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'text-xs mt-1.5',
                    index === currentStep ? 'text-accent font-medium' : 'text-foreground-muted'
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 mt-[-20px]',
                    index < currentStep ? 'bg-accent' : 'bg-border-light'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4">
        <div className="min-h-[60vh]">
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {currentStep === 0 && (
                <ServiceSelection
                  services={services}
                  selectedServiceId={selectedServiceId}
                  onSelect={onServiceSelect}
                />
              )}

              {currentStep === 1 && selectedServiceId && (
                <StaffSelection
                  salonId={salonId}
                  serviceId={selectedServiceId}
                  selectedStaffId={selectedStaffId}
                  onSelect={setSelectedStaffId}
                />
              )}

              {currentStep === 2 && selectedServiceId && selectedStaffId && selectedService && (
                <TimeSlotSelection
                  salonId={salonId}
                  staffId={selectedStaffId}
                  service={selectedService}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  customerInfo={customerInfo}
                  onDateSelect={setSelectedDate}
                  onTimeSelect={setSelectedTime}
                  onCustomerInfoChange={setCustomerInfo}
                />
              )}

              {currentStep === 3 && selectedServiceId && selectedStaffId && selectedDate && selectedTime && selectedService && (
                <CheckoutSummary
                  salonId={salonId}
                  service={selectedService}
                  staffId={selectedStaffId}
                  date={selectedDate}
                  time={selectedTime}
                  customerInfo={customerInfo}
                  settings={settings}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 h-11 px-4 rounded-md border border-border bg-card text-foreground font-medium hover:bg-background-alt transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                'flex-1 h-11 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2',
                canProceed()
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : 'bg-border-light text-foreground-muted cursor-not-allowed'
              )}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

