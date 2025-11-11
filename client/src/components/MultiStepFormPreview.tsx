import { useState } from "react";
import { FormField, FormStyles } from "@shared/formTypes";
import { Button } from "./ui/button";
import { StepIndicator } from "./StepIndicator";
import { FieldRenderer } from "./FieldRenderer";
import { shouldShowField } from "@shared/conditionalLogic";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MultiStepFormPreviewProps {
  title: string;
  description?: string;
  fields: FormField[];
  styles: FormStyles;
  onSubmit: (data: Record<string, any>) => void;
}

export function MultiStepFormPreview({
  title,
  description,
  fields,
  styles,
  onSubmit,
}: MultiStepFormPreviewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Group fields by step
  const totalSteps = Math.max(...fields.map((f) => f.step || 1), 1);
  const fieldsByStep = Array.from({ length: totalSteps }, (_, i) => {
    const stepNumber = i + 1;
    return fields.filter((f) => (f.step || 1) === stepNumber);
  });

  // Get visible fields for current step
  const currentStepFields = fieldsByStep[currentStep - 1].filter((field) => {
    if (!field.conditionalRules || field.conditionalRules.length === 0) {
      return true;
    }
    return shouldShowField(field, formData);
  });

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    currentStepFields.forEach((field) => {
      const value = formData[field.id];
      
      // Check required
      if (field.required && (!value || value === "")) {
        newErrors[field.id] = "Questo campo è obbligatorio";
        return;
      }

      // Check validation rules
      if (value && field.validation) {
        const { pattern, message, minLength, maxLength, min, max } = field.validation;

        if (pattern && typeof value === "string") {
          const regex = new RegExp(pattern);
          if (!regex.test(value)) {
            newErrors[field.id] = message || "Formato non valido";
            return;
          }
        }

        if (minLength && typeof value === "string" && value.length < minLength) {
          newErrors[field.id] = `Minimo ${minLength} caratteri`;
          return;
        }

        if (maxLength && typeof value === "string" && value.length > maxLength) {
          newErrors[field.id] = `Massimo ${maxLength} caratteri`;
          return;
        }

        if (min !== undefined && typeof value === "number" && value < min) {
          newErrors[field.id] = `Valore minimo: ${min}`;
          return;
        }

        if (max !== undefined && typeof value === "number" && value > max) {
          newErrors[field.id] = `Valore massimo: ${max}`;
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      // Remove hidden fields from submission
      const visibleFields = fields.filter((field) => {
        if (!field.conditionalRules || field.conditionalRules.length === 0) {
          return true;
        }
        return shouldShowField(field, formData);
      });

      const cleanedData: Record<string, any> = {};
      visibleFields.forEach((field) => {
        if (formData[field.id] !== undefined) {
          cleanedData[field.id] = formData[field.id];
        }
      });

      onSubmit(cleanedData);
    }
  };

  const containerStyle = {
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    fontFamily: styles.fontFamily,
    borderRadius: `${styles.borderRadius}px`,
    padding: `${styles.spacing * 2}px`,
  };

  const isLastStep = currentStep === totalSteps;

  return (
    <div style={containerStyle} className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {currentStepFields.map((field) => (
          <div key={field.id}>
            <FieldRenderer
              field={field}
              value={formData[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500 mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Indietro
          </Button>

          {isLastStep ? (
            <Button
              type="submit"
              style={{
                backgroundColor: styles.primaryColor,
                color: "#ffffff",
              }}
            >
              Invia
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              style={{
                backgroundColor: styles.primaryColor,
                color: "#ffffff",
              }}
            >
              Avanti
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
