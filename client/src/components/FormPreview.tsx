import { FormField, FormStyles } from "@shared/formTypes";
import { FieldRenderer } from "./FieldRenderer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FormPreviewProps {
  title: string;
  description?: string;
  fields: FormField[];
  styles: FormStyles;
  onSubmit?: (data: Record<string, any>) => void;
}

export function FormPreview({
  title,
  description,
  fields,
  styles,
  onSubmit,
}: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const getButtonVariant = () => {
    switch (styles.buttonStyle) {
      case "outline":
        return "outline";
      case "ghost":
        return "ghost";
      default:
        return "default";
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        fontFamily: styles.fontFamily,
      }}
    >
      <div
        className="w-full max-w-2xl bg-white shadow-lg p-8"
        style={{
          borderRadius: `${styles.borderRadius}px`,
        }}
      >
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: styles.textColor }}
          >
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="space-y-6"
            style={{
              gap: `${styles.spacing}px`,
            }}
          >
            {fields.map((field) => (
              <div key={field.id}>
                <FieldRenderer
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              </div>
            ))}
          </div>

          {fields.length > 0 && (
            <Button
              type="submit"
              variant={getButtonVariant()}
              className="mt-8 w-full"
              style={{
                backgroundColor:
                  styles.buttonStyle === "solid"
                    ? styles.primaryColor
                    : undefined,
                borderColor: styles.primaryColor,
                color:
                  styles.buttonStyle === "solid" ? "#ffffff" : styles.primaryColor,
              }}
            >
              Invia
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
