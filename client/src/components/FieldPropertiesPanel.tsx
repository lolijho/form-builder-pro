import { FormField } from "@shared/formTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ConditionalRulesEditor } from "./ConditionalRulesEditor";
import { ValidationEditor } from "./ValidationEditor";
import { Separator } from "@/components/ui/separator";

interface FieldPropertiesPanelProps {
  field: FormField | null;
  allFields: FormField[];
  onSave: (field: FormField) => void;
  onClose: () => void;
}

export function FieldPropertiesPanel({
  field,
  allFields,
  onSave,
  onClose,
}: FieldPropertiesPanelProps) {
  const [editedField, setEditedField] = useState<FormField | null>(field);

  useEffect(() => {
    setEditedField(field);
  }, [field]);

  if (!editedField) return null;

  const handleSave = () => {
    onSave(editedField);
    onClose();
  };

  const needsOptions =
    editedField.type === "select" ||
    editedField.type === "checkbox" ||
    editedField.type === "radio";

  return (
    <div className="w-80 border-l bg-background p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Proprietà Campo</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="label">Etichetta</Label>
          <Input
            id="label"
            value={editedField.label}
            onChange={(e) =>
              setEditedField({ ...editedField, label: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={editedField.placeholder || ""}
            onChange={(e) =>
              setEditedField({ ...editedField, placeholder: e.target.value })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="required">Campo obbligatorio</Label>
          <Switch
            id="required"
            checked={editedField.required || false}
            onCheckedChange={(checked) =>
              setEditedField({ ...editedField, required: checked })
            }
          />
        </div>

        {needsOptions && (
          <div>
            <Label htmlFor="options">
              Opzioni (una per riga)
            </Label>
            <Textarea
              id="options"
              rows={5}
              value={editedField.options?.join("\n") || ""}
              onChange={(e) =>
                setEditedField({
                  ...editedField,
                  options: e.target.value.split("\n").filter((o) => o.trim()),
                })
              }
              placeholder="Opzione 1&#10;Opzione 2&#10;Opzione 3"
            />
          </div>
        )}

        <Separator className="my-6" />

        {/* Validation Section */}
        {(editedField.type === "text" ||
          editedField.type === "email" ||
          editedField.type === "number" ||
          editedField.type === "textarea") && (
          <ValidationEditor
            validation={editedField.validation}
            fieldType={editedField.type}
            onChange={(validation) => {
              setEditedField({
                ...editedField,
                validation,
              });
            }}
          />
        )}

        <Separator className="my-6" />

        <ConditionalRulesEditor
          field={editedField}
          allFields={allFields}
          onChange={(rules) =>
            setEditedField({ ...editedField, conditionalRules: rules })
          }
        />

        <Button onClick={handleSave} className="w-full mt-6">
          Salva modifiche
        </Button>
      </div>
    </div>
  );
}
