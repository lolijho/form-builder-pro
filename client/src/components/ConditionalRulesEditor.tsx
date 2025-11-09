import { ConditionalRule, ConditionOperator, FormField } from "@shared/formTypes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ConditionalRulesEditorProps {
  field: FormField;
  allFields: FormField[];
  onChange: (rules: ConditionalRule[]) => void;
}

const operatorLabels: Record<ConditionOperator, string> = {
  equals: "è uguale a",
  not_equals: "è diverso da",
  contains: "contiene",
  not_contains: "non contiene",
  is_empty: "è vuoto",
  is_not_empty: "non è vuoto",
};

export function ConditionalRulesEditor({
  field,
  allFields,
  onChange,
}: ConditionalRulesEditorProps) {
  const rules = field.conditionalRules || [];

  // Only show fields that come before this field
  const availableFields = allFields.filter((f) => f.id !== field.id);

  const addRule = () => {
    const newRule: ConditionalRule = {
      fieldId: availableFields[0]?.id || "",
      operator: "equals",
      value: "",
    };
    onChange([...rules, newRule]);
  };

  const updateRule = (index: number, updates: Partial<ConditionalRule>) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...updates };
    onChange(newRules);
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  const needsValue = (operator: ConditionOperator) => {
    return operator !== "is_empty" && operator !== "is_not_empty";
  };

  const getFieldById = (fieldId: string) => {
    return allFields.find((f) => f.id === fieldId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Logica Condizionale</CardTitle>
        <CardDescription>
          Mostra questo campo solo quando le seguenti condizioni sono soddisfatte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nessuna condizione impostata. Il campo sarà sempre visibile.
          </p>
        ) : (
          <div className="space-y-4">
            {rules.map((rule, index) => {
              const targetField = getFieldById(rule.fieldId);
              const showValueInput = needsValue(rule.operator);

              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Condizione {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRule(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <Label className="text-xs">Campo</Label>
                      <Select
                        value={rule.fieldId}
                        onValueChange={(value) =>
                          updateRule(index, { fieldId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona campo" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFields.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Operatore</Label>
                      <Select
                        value={rule.operator}
                        onValueChange={(value: ConditionOperator) =>
                          updateRule(index, { operator: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(operatorLabels).map(([op, label]) => (
                            <SelectItem key={op} value={op}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {showValueInput && (
                      <div>
                        <Label className="text-xs">Valore</Label>
                        {targetField?.type === "select" ||
                        targetField?.type === "radio" ? (
                          <Select
                            value={rule.value || ""}
                            onValueChange={(value) =>
                              updateRule(index, { value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona valore" />
                            </SelectTrigger>
                            <SelectContent>
                              {targetField.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={rule.value || ""}
                            onChange={(e) =>
                              updateRule(index, { value: e.target.value })
                            }
                            placeholder="Inserisci valore"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={addRule}
          disabled={availableFields.length === 0}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Condizione
        </Button>

        {availableFields.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Aggiungi altri campi al form per poter creare condizioni
          </p>
        )}

        {rules.length > 1 && (
          <p className="text-xs text-muted-foreground">
            ℹ️ Tutte le condizioni devono essere soddisfatte (logica AND)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
