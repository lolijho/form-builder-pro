import { FormStyles } from "@shared/formTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StyleCustomizerProps {
  styles: FormStyles;
  onChange: (styles: FormStyles) => void;
}

const fontFamilies = [
  { value: "Inter, system-ui, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Verdana, sans-serif", label: "Verdana" },
];

export function StyleCustomizer({ styles, onChange }: StyleCustomizerProps) {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(
    null
  );

  const ColorPickerButton = ({
    label,
    color,
    onChange: onColorChange,
  }: {
    label: string;
    color: string;
    onChange: (color: string) => void;
  }) => (
    <div>
      <Label>{label}</Label>
      <Popover
        open={activeColorPicker === label}
        onOpenChange={(open) => setActiveColorPicker(open ? label : null)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            type="button"
          >
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-sm">{color}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker color={color} onChange={onColorChange} />
          <Input
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="mt-2 font-mono"
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Colori</h3>
        <div className="space-y-4">
          <ColorPickerButton
            label="Colore di sfondo"
            color={styles.backgroundColor}
            onChange={(color) =>
              onChange({ ...styles, backgroundColor: color })
            }
          />
          <ColorPickerButton
            label="Colore del testo"
            color={styles.textColor}
            onChange={(color) => onChange({ ...styles, textColor: color })}
          />
          <ColorPickerButton
            label="Colore primario"
            color={styles.primaryColor}
            onChange={(color) => onChange({ ...styles, primaryColor: color })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Tipografia</h3>
        <div>
          <Label>Font</Label>
          <Select
            value={styles.fontFamily}
            onValueChange={(value) => onChange({ ...styles, fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Layout</h3>
        <div className="space-y-4">
          <div>
            <Label>Arrotondamento bordi: {styles.borderRadius}px</Label>
            <Slider
              value={[styles.borderRadius]}
              onValueChange={([value]) =>
                onChange({ ...styles, borderRadius: value })
              }
              min={0}
              max={24}
              step={2}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Spaziatura: {styles.spacing}px</Label>
            <Slider
              value={[styles.spacing]}
              onValueChange={([value]) =>
                onChange({ ...styles, spacing: value })
              }
              min={8}
              max={32}
              step={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Posizione etichette</Label>
            <Select
              value={styles.labelPosition}
              onValueChange={(value: any) =>
                onChange({ ...styles, labelPosition: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Sopra</SelectItem>
                <SelectItem value="left">Sinistra</SelectItem>
                <SelectItem value="inline">In linea</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Stile pulsante</Label>
            <Select
              value={styles.buttonStyle}
              onValueChange={(value: any) =>
                onChange({ ...styles, buttonStyle: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solido</SelectItem>
                <SelectItem value="outline">Contorno</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
