import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { FormEditor } from "@/components/FormEditor";
import { StyleCustomizer } from "@/components/StyleCustomizer";
import { FormPreview } from "@/components/FormPreview";
import { EmbedCodeGenerator } from "@/components/EmbedCodeGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField, FormStyles, defaultFormStyles } from "@shared/formTypes";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, Code } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export default function Editor() {
  const [, params] = useRoute("/editor/:id");
  const [, setLocation] = useLocation();
  const formId = params?.id && params.id !== "new" ? parseInt(params.id) : null;

  const [title, setTitle] = useState("Nuovo Form");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [styles, setStyles] = useState<FormStyles>(defaultFormStyles);
  const [published, setPublished] = useState(false);

  const { data: form, isLoading } = trpc.forms.getById.useQuery(
    { id: formId! },
    { enabled: !!formId }
  );

  const utils = trpc.useUtils();

  const createMutation = trpc.forms.create.useMutation({
    onSuccess: () => {
      toast.success("Form creato con successo");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(`Errore: ${error.message}`);
    },
  });

  const updateMutation = trpc.forms.update.useMutation({
    onSuccess: () => {
      toast.success("Form salvato con successo");
      utils.forms.getById.invalidate({ id: formId! });
    },
    onError: (error) => {
      toast.error(`Errore: ${error.message}`);
    },
  });

  const publishMutation = trpc.forms.publish.useMutation({
    onSuccess: () => {
      toast.success(published ? "Form non pubblicato" : "Form pubblicato");
      utils.forms.getById.invalidate({ id: formId! });
    },
    onError: (error) => {
      toast.error(`Errore: ${error.message}`);
    },
  });

  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setDescription(form.description || "");
      setFields(JSON.parse(form.fields));
      setStyles(JSON.parse(form.styles));
      setPublished(form.published === 1);
    }
  }, [form]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Il titolo è obbligatorio");
      return;
    }

    const formData = {
      title,
      description,
      fields: JSON.stringify(fields),
      styles: JSON.stringify(styles),
    };

    if (formId) {
      updateMutation.mutate({ id: formId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handlePublishToggle = () => {
    if (!formId) {
      toast.error("Salva il form prima di pubblicarlo");
      return;
    }
    publishMutation.mutate({ id: formId, published: !published });
    setPublished(!published);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {formId ? "Modifica Form" : "Nuovo Form"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {formId && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="publish-toggle">Pubblicato</Label>
                  <Switch
                    id="publish-toggle"
                    checked={published}
                    onCheckedChange={handlePublishToggle}
                  />
                </div>
              )}
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salva
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="mb-6 space-y-4">
          <div>
            <Label htmlFor="title">Titolo del Form</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es: Contattaci"
            />
          </div>
          <div>
            <Label htmlFor="description">Descrizione (opzionale)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrivi brevemente il form..."
              rows={2}
            />
          </div>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="style">Stile</TabsTrigger>
            <TabsTrigger value="preview">Anteprima</TabsTrigger>
            <TabsTrigger value="embed" disabled={!formId || !published}>
              Embed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-6">
            <FormEditor fields={fields} onChange={setFields} />
          </TabsContent>

          <TabsContent value="style" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <StyleCustomizer styles={styles} onChange={setStyles} />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="border rounded-lg overflow-hidden">
              <FormPreview
                title={title}
                description={description}
                fields={fields}
                styles={styles}
                onSubmit={(data) => {
                  console.log("Preview submit:", data);
                  toast.info("Questa è solo un'anteprima");
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="embed" className="mt-6">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Codice di Integrazione</h2>
                <p className="text-muted-foreground">
                  Usa uno dei metodi seguenti per integrare il form nel tuo sito
                  web.
                </p>
              </div>
              {formId && <EmbedCodeGenerator formId={formId} />}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
