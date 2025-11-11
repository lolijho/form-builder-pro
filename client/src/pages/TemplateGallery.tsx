import { useState } from "react";
import { useLocation } from "wouter";
import { formTemplates, FormTemplate } from "@shared/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, MessageSquare, TrendingUp, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const categoryIcons = {
  business: FileText,
  event: Calendar,
  feedback: MessageSquare,
  marketing: TrendingUp,
};

const categoryLabels = {
  business: "Business",
  event: "Eventi",
  feedback: "Feedback",
  marketing: "Marketing",
};

export default function TemplateGallery() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const createMutation = trpc.forms.create.useMutation({
    onSuccess: (data) => {
      toast.success("Form creato da template!");
      setLocation(`/editor/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Errore: ${error.message}`);
    },
  });

  const handleUseTemplate = (template: FormTemplate) => {
    createMutation.mutate({
      title: template.name,
      description: template.description,
      fields: JSON.stringify(template.fields),
      styles: JSON.stringify(template.styles),
    });
  };

  const filteredTemplates = selectedCategory
    ? formTemplates.filter((t) => t.category === selectedCategory)
    : formTemplates;

  const categories = Array.from(new Set(formTemplates.map((t) => t.category)));

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Galleria Template</h1>
              <p className="text-muted-foreground">
                Scegli un template e personalizzalo secondo le tue esigenze
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            Tutti
          </Button>
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {categoryLabels[category]}
              </Button>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = categoryIcons[template.category];
            return (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: template.styles.primaryColor + "20" }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: template.styles.primaryColor }}
                      />
                    </div>
                    <Badge variant="secondary">{categoryLabels[template.category]}</Badge>
                  </div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{template.fields.length} campi</span>
                    </div>

                    {/* Preview of first 3 fields */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Campi inclusi:
                      </p>
                      <ul className="text-sm space-y-0.5">
                        {template.fields.slice(0, 3).map((field) => (
                          <li key={field.id} className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                            {field.label}
                          </li>
                        ))}
                        {template.fields.length > 3 && (
                          <li className="text-muted-foreground italic">
                            +{template.fields.length - 3} altri campi
                          </li>
                        )}
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleUseTemplate(template)}
                      disabled={createMutation.isPending}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Usa questo Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nessun template trovato in questa categoria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
