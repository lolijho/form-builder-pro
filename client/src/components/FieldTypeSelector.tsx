import { FieldType } from "@shared/formTypes";
import { Button } from "@/components/ui/button";
import {
  Type,
  Mail,
  Hash,
  AlignLeft,
  List,
  CheckSquare,
  Circle,
  Calendar,
  Upload,
} from "lucide-react";

interface FieldTypeSelectorProps {
  onSelectType: (type: FieldType) => void;
}

const fieldTypes: Array<{ type: FieldType; label: string; icon: any }> = [
  { type: "text", label: "Testo", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "number", label: "Numero", icon: Hash },
  { type: "textarea", label: "Area di testo", icon: AlignLeft },
  { type: "select", label: "Selezione", icon: List },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "radio", label: "Radio", icon: Circle },
  { type: "date", label: "Data", icon: Calendar },
  { type: "file", label: "File", icon: Upload },
];

export function FieldTypeSelector({ onSelectType }: FieldTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {fieldTypes.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => onSelectType(type)}
        >
          <Icon className="h-5 w-5" />
          <span className="text-sm">{label}</span>
        </Button>
      ))}
    </div>
  );
}
