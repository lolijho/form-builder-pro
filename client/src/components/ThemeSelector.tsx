import { predefinedThemes, Theme, getCategoryDisplayName } from "@shared/themes";
import { FormStyles } from "@shared/formTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Palette } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThemeSelectorProps {
  currentStyles: FormStyles;
  onApplyTheme: (styles: FormStyles) => void;
}

export function ThemeSelector({ currentStyles, onApplyTheme }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  const handleApplyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    onApplyTheme(theme.styles);
    setOpen(false);
  };

  const categories: Theme["category"][] = ["professional", "modern", "elegant", "minimal"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="h-4 w-4 mr-2" />
          Temi Predefiniti
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Scegli un Tema</DialogTitle>
          <DialogDescription>
            Seleziona un tema predefinito per applicare uno stile professionale al tuo form
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="professional" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {getCategoryDisplayName(category)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <ScrollArea className="h-[450px] pr-4">
                <div className="grid grid-cols-2 gap-4">
                  {predefinedThemes
                    .filter((theme) => theme.category === category)
                    .map((theme) => (
                      <ThemeCard
                        key={theme.id}
                        theme={theme}
                        onSelect={() => handleApplyTheme(theme)}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface ThemeCardProps {
  theme: Theme;
  onSelect: () => void;
}

function ThemeCard({ theme, onSelect }: ThemeCardProps) {
  const { styles } = theme;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{theme.name}</CardTitle>
        <CardDescription className="text-xs">{theme.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Theme Preview */}
        <div
          className="rounded-lg p-4 space-y-2 border"
          style={{
            backgroundColor: styles.backgroundColor,
            color: styles.textColor,
            borderRadius: `${styles.borderRadius}px`,
          }}
        >
          <div
            className="text-xs font-medium"
            style={{ fontFamily: styles.fontFamily }}
          >
            Titolo Form
          </div>
          <div
            className="h-8 rounded border"
            style={{
              borderRadius: `${styles.borderRadius}px`,
              borderColor: styles.primaryColor,
              backgroundColor: styles.backgroundColor,
            }}
          />
          <button
            className="w-full h-8 rounded text-xs font-medium"
            style={{
              backgroundColor:
                styles.buttonStyle === "solid"
                  ? styles.primaryColor
                  : "transparent",
              color:
                styles.buttonStyle === "solid"
                  ? styles.backgroundColor
                  : styles.primaryColor,
              border:
                styles.buttonStyle === "outline"
                  ? `1px solid ${styles.primaryColor}`
                  : "none",
              borderRadius: `${styles.borderRadius}px`,
            }}
          >
            Invia
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <Check className="h-4 w-4 mr-2" />
          Applica Tema
        </Button>
      </CardContent>
    </Card>
  );
}
