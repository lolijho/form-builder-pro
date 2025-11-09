/**
 * Shared types for form builder
 */

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "file";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormStyles {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  fontFamily: string;
  borderRadius: number;
  spacing: number;
  labelPosition: "top" | "left" | "inline";
  buttonStyle: "solid" | "outline" | "ghost";
}

export const defaultFormStyles: FormStyles = {
  backgroundColor: "#ffffff",
  textColor: "#000000",
  primaryColor: "#3b82f6",
  fontFamily: "Inter, system-ui, sans-serif",
  borderRadius: 8,
  spacing: 16,
  labelPosition: "top",
  buttonStyle: "solid",
};

export interface FormData {
  title: string;
  description?: string;
  fields: FormField[];
  styles: FormStyles;
}
