import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const stepTitle = stepTitles?.[step - 1] || `Step ${step}`;

            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    transition-all duration-300 border-2
                    ${
                      isCompleted
                        ? "bg-primary text-primary-foreground border-primary"
                        : isCurrent
                        ? "bg-background text-primary border-primary"
                        : "bg-background text-muted-foreground border-muted"
                    }
                  `}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step}
                </div>
                <span
                  className={`
                    mt-2 text-sm font-medium
                    ${isCurrent ? "text-primary" : "text-muted-foreground"}
                  `}
                >
                  {stepTitle}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
