import { FormStyles } from "./formTypes";

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: "professional" | "modern" | "elegant" | "minimal";
  styles: FormStyles;
  preview?: string; // Optional preview image URL
}

export const predefinedThemes: Theme[] = [
  {
    id: "business-professional",
    name: "Business Professional",
    description: "Elegante e professionale, perfetto per aziende e servizi B2B",
    category: "professional",
    styles: {
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
      primaryColor: "#2563eb",
      fontFamily: "Inter, system-ui, sans-serif",
      spacing: 20,
      borderRadius: 8,
      labelPosition: "top",
      buttonStyle: "solid",
    },
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Design minimalista e pulito, ideale per form semplici ed eleganti",
    category: "minimal",
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      primaryColor: "#000000",
      fontFamily: "Inter, system-ui, sans-serif",
      spacing: 24,
      borderRadius: 0,
      labelPosition: "top",
      buttonStyle: "outline",
    },
  },
  {
    id: "dark-elegant",
    name: "Dark Elegant",
    description: "Tema scuro sofisticato con accenti dorati, per un look premium",
    category: "elegant",
    styles: {
      backgroundColor: "#0f172a",
      textColor: "#f1f5f9",
      primaryColor: "#f59e0b",
      fontFamily: "Playfair Display, serif",
      spacing: 22,
      borderRadius: 12,
      labelPosition: "top",
      buttonStyle: "solid",
    },
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Colori freschi e rilassanti ispirati al mare",
    category: "modern",
    styles: {
      backgroundColor: "#ecfeff",
      textColor: "#164e63",
      primaryColor: "#0891b2",
      fontFamily: "Poppins, sans-serif",
      spacing: 20,
      borderRadius: 16,
      labelPosition: "top",
      buttonStyle: "solid",
    },
  },
  {
    id: "sunset-warm",
    name: "Sunset Warm",
    description: "Tonalità calde e accoglienti per un'esperienza amichevole",
    category: "modern",
    styles: {
      backgroundColor: "#fff7ed",
      textColor: "#7c2d12",
      primaryColor: "#ea580c",
      fontFamily: "Poppins, sans-serif",
      spacing: 20,
      borderRadius: 12,
      labelPosition: "top",
      buttonStyle: "solid",
    },
  },
  {
    id: "forest-natural",
    name: "Forest Natural",
    description: "Verde naturale e rilassante, perfetto per temi eco-friendly",
    category: "modern",
    styles: {
      backgroundColor: "#f0fdf4",
      textColor: "#14532d",
      primaryColor: "#16a34a",
      fontFamily: "Inter, system-ui, sans-serif",
      spacing: 20,
      borderRadius: 10,
      labelPosition: "top",
      buttonStyle: "solid",
    },
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    description: "Viola regale e sofisticato per un look distintivo",
    category: "elegant",
    styles: {
      backgroundColor: "#faf5ff",
      textColor: "#581c87",
      primaryColor: "#9333ea",
      fontFamily: "Playfair Display, serif",
      spacing: 22,
      borderRadius: 14,
      labelPosition: "top",
      buttonStyle: "solid",
    },
  },
  {
    id: "tech-modern",
    name: "Tech Modern",
    description: "Design moderno e tech-savvy con accenti blu elettrico",
    category: "modern",
    styles: {
      backgroundColor: "#f0f9ff",
      textColor: "#0c4a6e",
      primaryColor: "#0284c7",
      fontFamily: "Inter, system-ui, sans-serif",
      spacing: 18,
      borderRadius: 8,
      labelPosition: "top",
      buttonStyle: "solid",
    },
  },
  {
    id: "monochrome-bold",
    name: "Monochrome Bold",
    description: "Bianco e nero audace per massimo contrasto e leggibilità",
    category: "minimal",
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#0a0a0a",
      primaryColor: "#171717",
      fontFamily: "Inter, system-ui, sans-serif",
      spacing: 24,
      borderRadius: 4,
      labelPosition: "top",
      buttonStyle: "solid",
    },
  },
  {
    id: "soft-pastel",
    name: "Soft Pastel",
    description: "Colori pastello delicati per un look dolce e accogliente",
    category: "modern",
    styles: {
      backgroundColor: "#fdf4ff",
      textColor: "#701a75",
      primaryColor: "#c026d3",
      fontFamily: "Poppins, sans-serif",
      spacing: 20,
      borderRadius: 20,
      labelPosition: "top",
      buttonStyle: "solid",
    },
  },
];

/**
 * Get a theme by its ID
 */
export function getThemeById(id: string): Theme | undefined {
  return predefinedThemes.find((theme) => theme.id === id);
}

/**
 * Get all themes in a specific category
 */
export function getThemesByCategory(
  category: Theme["category"]
): Theme[] {
  return predefinedThemes.filter((theme) => theme.category === category);
}

/**
 * Get all available theme categories
 */
export function getThemeCategories(): Theme["category"][] {
  return ["professional", "modern", "elegant", "minimal"];
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: Theme["category"]): string {
  const names: Record<Theme["category"], string> = {
    professional: "Professionale",
    modern: "Moderno",
    elegant: "Elegante",
    minimal: "Minimalista",
  };
  return names[category];
}
