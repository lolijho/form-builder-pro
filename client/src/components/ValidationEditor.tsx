import { useState } from "react";
import { FieldValidation } from "@shared/formTypes";
import { validationPatterns, ValidationPattern } from "@shared/validationPatterns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface ValidationEditorProps {
  validation?: FieldValidation;
  fieldType: string;
  onChange: (validation?: FieldValidation) => void;
}

export function ValidationEditor({ validation, fieldType, onChange }: ValidationEditorProps) {
  const [selectedPattern, setSelectedPattern] = useState<string>("");

  const isTextLike = ["text", "email", "textarea"].includes(fieldType);
  const isNumber = fieldType === "number";

  const handleApplyPattern = () => {
    const pattern = validationPatterns.find((p) => p.name === selectedPattern);
    if (pattern) {
      onChange({
        ...validation,
        pattern: pattern.pattern,
        message: pattern.message,
      });
      setSelectedPattern("");
    }
  };

  const handleClearValidation = () => {
    onChange(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Validazione Avanzata</CardTitle>
        <CardDescription>
          Configura regole di validazione personalizzate per questo campo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pattern predefiniti */}
        {isTextLike && (
          <div className="space-y-2">
            <Label>Pattern Predefiniti</Label>
            <div className="flex gap-2">
              <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un pattern..." />
                </SelectTrigger>
                <SelectContent>
                  {validationPatterns.map((pattern) => (
                    <SelectItem key={pattern.name} value={pattern.name}>
                      {pattern.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleApplyPattern}
                disabled={!selectedPattern}
              >
                Applica
              </Button>
            </div>
            {selectedPattern && (
              <p className="text-xs text-muted-foreground">
                {validationPatterns.find((p) => p.name === selectedPattern)?.description}
              </p>
            )}
          </div>
        )}

        {/* Pattern personalizzato */}
        {isTextLike && (
          <div className="space-y-2">
            <Label>Pattern Regex Personalizzato</Label>
            <Input
              value={validation?.pattern || ""}
              onChange={(e) =>
                onChange({ ...validation, pattern: e.target.value || undefined })
              }
              placeholder="^[A-Z0-9]+$"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Inserisci un'espressione regolare JavaScript
            </p>
          </div>
        )}

        {/* Messaggio di errore personalizzato */}
        {validation?.pattern && (
          <div className="space-y-2">
            <Label>Messaggio di Errore</Label>
            <Textarea
              value={validation?.message || ""}
              onChange={(e) =>
                onChange({ ...validation, message: e.target.value || undefined })
              }
              placeholder="Inserisci un valore valido"
              rows={2}
            />
          </div>
        )}

        {/* Lunghezza min/max per campi di testo */}
        {isTextLike && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lunghezza Minima</Label>
              <Input
                type="number"
                value={validation?.minLength || ""}
                onChange={(e) =>
                  onChange({
                    ...validation,
                    minLength: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Lunghezza Massima</Label>
              <Input
                type="number"
                value={validation?.maxLength || ""}
                onChange={(e) =>
                  onChange({
                    ...validation,
                    maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="Illimitata"
                min="0"
              />
            </div>
          </div>
        )}

        {/* Valore min/max per campi numerici */}
        {isNumber && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valore Minimo</Label>
              <Input
                type="number"
                value={validation?.min !== undefined ? validation.min : ""}
                onChange={(e) =>
                  onChange({
                    ...validation,
                    min: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="Nessun limite"
              />
            </div>
            <div className="space-y-2">
              <Label>Valore Massimo</Label>
              <Input
                type="number"
                value={validation?.max !== undefined ? validation.max : ""}
                onChange={(e) =>
                  onChange({
                    ...validation,
                    max: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="Nessun limite"
              />
            </div>
          </div>
        )}

        {/* Riepilogo validazione attiva */}
        {validation && Object.keys(validation).length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Regole Attive</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearValidation}
                className="h-6 text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Rimuovi Tutte
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {validation.pattern && (
                <Badge variant="secondary" className="text-xs">
                  Pattern Regex
                </Badge>
              )}
              {validation.minLength && (
                <Badge variant="secondary" className="text-xs">
                  Min: {validation.minLength} caratteri
                </Badge>
              )}
              {validation.maxLength && (
                <Badge variant="secondary" className="text-xs">
                  Max: {validation.maxLength} caratteri
                </Badge>
              )}
              {validation.min !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  Min: {validation.min}
                </Badge>
              )}
              {validation.max !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  Max: {validation.max}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
