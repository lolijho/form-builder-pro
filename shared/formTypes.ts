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

export type ConditionOperator = "equals" | "not_equals" | "contains" | "not_contains" | "is_empty" | "is_not_empty";

export interface ConditionalRule {
  /** ID of the field to check */
  fieldId: string;
  /** Operator to use for comparison */
  operator: ConditionOperator;
  /** Value to compare against (not needed for is_empty/is_not_empty) */
  value?: any;
}

export interface FieldValidation {
  /** Regex pattern for validation */
  pattern?: string;
  /** Custom error message */
  message?: string;
  /** Minimum length for text fields */
  minLength?: number;
  /** Maximum length for text fields */
  maxLength?: number;
  /** Minimum value for number fields */
  min?: number;
  /** Maximum value for number fields */
  max?: number;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: FieldValidation;
  /** Conditional rules - field is shown only if ALL rules match */
  conditionalRules?: ConditionalRule[];
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
