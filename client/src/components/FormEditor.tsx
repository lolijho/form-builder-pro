import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FormField, FieldType } from "@shared/formTypes";
import { DraggableField } from "./DraggableField";
import { FieldTypeSelector } from "./FieldTypeSelector";
import { FieldPropertiesPanel } from "./FieldPropertiesPanel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FormEditorProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export function FormEditor({ fields, onChange }: FormEditorProps) {
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      onChange(arrayMove(fields, oldIndex, newIndex));
    }
  };

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `Nuovo campo ${type}`,
      required: false,
      ...(type === "select" || type === "checkbox" || type === "radio"
        ? { options: ["Opzione 1", "Opzione 2"] }
        : {}),
    };
    onChange([...fields, newField]);
    setIsAddDialogOpen(false);
    setSelectedField(newField);
  };

  const handleEditField = (field: FormField) => {
    setSelectedField(field);
  };

  const handleSaveField = (updatedField: FormField) => {
    onChange(fields.map((f) => (f.id === updatedField.id ? updatedField : f)));
  };

  const handleDeleteField = (fieldId: string) => {
    onChange(fields.filter((f) => f.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Campi del Form</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi Campo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Seleziona tipo di campo</DialogTitle>
                </DialogHeader>
                <FieldTypeSelector onSelectType={handleAddField} />
              </DialogContent>
            </Dialog>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">
                Nessun campo aggiunto. Inizia creando il tuo primo campo.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi il primo campo
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field) => (
                  <DraggableField
                    key={field.id}
                    field={field}
                    onEdit={handleEditField}
                    onDelete={handleDeleteField}
                    isSelected={selectedField?.id === field.id}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {selectedField && (
        <FieldPropertiesPanel
          field={selectedField}
          allFields={fields}
          onSave={handleSaveField}
          onClose={() => setSelectedField(null)}
        />
      )}
    </div>
  );
}
