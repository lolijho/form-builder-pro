import { ConditionalRule, FormField } from "./formTypes";

/**
 * Evaluate if a single conditional rule matches
 */
export function evaluateRule(
  rule: ConditionalRule,
  fieldValue: any
): boolean {
  const { operator, value } = rule;

  // Handle empty checks
  if (operator === "is_empty") {
    return (
      fieldValue === undefined ||
      fieldValue === null ||
      fieldValue === "" ||
      (Array.isArray(fieldValue) && fieldValue.length === 0)
    );
  }

  if (operator === "is_not_empty") {
    return (
      fieldValue !== undefined &&
      fieldValue !== null &&
      fieldValue !== "" &&
      (!Array.isArray(fieldValue) || fieldValue.length > 0)
    );
  }

  // For other operators, we need a value to compare
  if (value === undefined) return false;

  switch (operator) {
    case "equals":
      // Handle array values (checkbox)
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value);
      }
      return String(fieldValue) === String(value);

    case "not_equals":
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(value);
      }
      return String(fieldValue) !== String(value);

    case "contains":
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((v) =>
          String(v).toLowerCase().includes(String(value).toLowerCase())
        );
      }
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());

    case "not_contains":
      if (Array.isArray(fieldValue)) {
        return !fieldValue.some((v) =>
          String(v).toLowerCase().includes(String(value).toLowerCase())
        );
      }
      return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());

    default:
      return false;
  }
}

/**
 * Check if a field should be visible based on its conditional rules
 * Returns true if field should be shown, false if hidden
 */
export function shouldShowField(
  field: FormField,
  formData: Record<string, any>
): boolean {
  // If no conditional rules, always show
  if (!field.conditionalRules || field.conditionalRules.length === 0) {
    return true;
  }

  // All rules must match (AND logic)
  return field.conditionalRules.every((rule) => {
    const fieldValue = formData[rule.fieldId];
    return evaluateRule(rule, fieldValue);
  });
}

/**
 * Get list of fields that should be visible given current form data
 */
export function getVisibleFields(
  fields: FormField[],
  formData: Record<string, any>
): FormField[] {
  return fields.filter((field) => shouldShowField(field, formData));
}
