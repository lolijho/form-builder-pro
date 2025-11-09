import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@shared/formTypes";
import { FieldRenderer } from "./FieldRenderer";
import { Button } from "@/components/ui/button";
import { GripVertical, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableFieldProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  isSelected?: boolean;
}

export function DraggableField({
  field,
  onEdit,
  onDelete,
  isSelected,
}: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group bg-card border rounded-lg p-4 mb-3",
        isDragging && "opacity-50",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          className="cursor-grab active:cursor-grabbing mt-2 text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <FieldRenderer field={field} disabled />
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(field)}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(field.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
