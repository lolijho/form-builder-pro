import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { FormEditor } from "@/components/FormEditor";
import { StyleCustomizer } from "@/components/StyleCustomizer";
import { ThemeSelector } from "@/components/ThemeSelector";
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
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [activeTab, setActiveTab] = useState<string>("editor");

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
      setEmailNotifications(form.emailNotifications === 1);
      setWebhookUrl(form.webhookUrl || "");
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
      updateMutation.mutate({ 
        id: formId, 
        ...formData, 
        emailNotifications: emailNotifications ? 1 : 0,
        webhookUrl: webhookUrl || undefined,
      });
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

  const handleEmailNotificationsToggle = () => {
    if (!formId) {
      toast.error("Salva il form prima di modificare le notifiche");
      return;
    }
    const newValue = !emailNotifications;
    updateMutation.mutate({ id: formId, emailNotifications: newValue ? 1 : 0 });
    setEmailNotifications(newValue);
    toast.success(newValue ? "Notifiche email attivate" : "Notifiche email disattivate");
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
                <>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="publish-toggle">Pubblicato</Label>
                    <Switch
                      id="publish-toggle"
                      checked={published}
                      onCheckedChange={handlePublishToggle}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="email-toggle">Notifiche Email</Label>
                    <Switch
                      id="email-toggle"
                      checked={emailNotifications}
                      onCheckedChange={handleEmailNotificationsToggle}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="url"
                      placeholder="Webhook URL (opzionale)"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </>
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

            <div className="flex items-center gap-2 mb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="style">Stile</TabsTrigger>
                  <TabsTrigger value="preview">Anteprima</TabsTrigger>
                </TabsList>
              </Tabs>
              <ThemeSelector
                currentStyles={styles}
                onApplyTheme={(newStyles) => {
                  setStyles(newStyles);
                  toast.success("Tema applicato con successo");
                }}
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsContent value="editor" className="mt-6">
                <FormEditor fields={fields} onChange={setFields} />
              </TabsContent>

              <TabsContent value="style" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personalizza Stile</h3>
                    <StyleCustomizer styles={styles} onChange={setStyles} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Anteprima Live</h3>
                    <div className="border rounded-lg overflow-hidden bg-muted/20">
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
                  </div>
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
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
