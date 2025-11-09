import { FormField } from "@shared/formTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldRendererProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
}

export function FieldRenderer({
  field,
  value,
  onChange,
  disabled,
}: FieldRendererProps) {
  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            disabled={disabled}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            disabled={disabled}
            rows={4}
          />
        );

      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={handleChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Seleziona..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, idx) => (
                <SelectItem key={idx} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${idx}`}
                  checked={value?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const newValue = value || [];
                    if (checked) {
                      handleChange([...newValue, option]);
                    } else {
                      handleChange(newValue.filter((v: string) => v !== option));
                    }
                  }}
                  disabled={disabled}
                />
                <label
                  htmlFor={`${field.id}-${idx}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={handleChange}
            disabled={disabled}
          >
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${idx}`} />
                <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            disabled={disabled}
          />
        );

      case "file":
        return (
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleChange(file);
              }
            }}
            required={field.required}
            disabled={disabled}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
}
