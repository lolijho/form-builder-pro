import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { FormEditor } from "@/components/FormEditor";
import { StyleCustomizer } from "@/components/StyleCustomizer";
import { ThemeSelector } from "@/components/ThemeSelector";
import { FormPreview } from "@/components/FormPreview";
import { MultiStepFormPreview } from "@/components/MultiStepFormPreview";
import { EmbedCodeGenerator } from "@/components/EmbedCodeGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField, FormStyles, defaultFormStyles } from "@shared/formTypes";
import { toast } from "sonner";
import { useAutoSave } from "@/hooks/useAutoSave";
import { ArrowLeft, Save, Eye, Code, Check, AlertCircle } from "lucide-react";
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
  const [autoResponderEnabled, setAutoResponderEnabled] = useState(false);
  const [autoResponderSubject, setAutoResponderSubject] = useState("Grazie per la tua richiesta");
  const [autoResponderMessage, setAutoResponderMessage] = useState(
    "Ciao {{nome}},\n\nGrazie per aver compilato il nostro form. Abbiamo ricevuto la tua richiesta e ti risponderemo al più presto.\n\nCordiali saluti"
  );
  const [multiStep, setMultiStep] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("editor");

  // Auto-save functionality
  const { status: autoSaveStatus, lastSaved, resetTimer } = useAutoSave({
    onSave: async () => {
      if (!formId || !title.trim()) return;
      
      return new Promise<void>((resolve, reject) => {
        updateMutation.mutate(
          { 
            id: formId, 
            title,
            description,
            fields: JSON.stringify(fields),
            styles: JSON.stringify(styles),
            emailNotifications: emailNotifications ? 1 : 0,
            webhookUrl: webhookUrl || undefined,
            autoResponderEnabled: autoResponderEnabled ? 1 : 0,
            autoResponderSubject: autoResponderEnabled ? autoResponderSubject : undefined,
            autoResponderMessage: autoResponderEnabled ? autoResponderMessage : undefined,
          },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      });
    },
    delay: 30000, // 30 seconds
    enabled: !!formId && !!title.trim(),
  });

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
      setAutoResponderEnabled(!!form.autoResponderEnabled);
      setAutoResponderSubject(form.autoResponderSubject || "Grazie per la tua richiesta");
      setAutoResponderMessage(
        form.autoResponderMessage ||
          "Ciao {{nome}},\n\nGrazie per aver compilato il nostro form. Abbiamo ricevuto la tua richiesta e ti risponderemo al più presto.\n\nCordiali saluti"
      );
      // Check if form has multi-step fields
      const hasMultiStep = JSON.parse(form.fields).some((f: FormField) => f.step && f.step > 1);
      setMultiStep(hasMultiStep);
    }
  }, [form]);

  // Reset auto-save timer when data changes
  useEffect(() => {
    if (formId) {
      resetTimer();
    }
  }, [title, description, fields, styles, emailNotifications, webhookUrl, autoResponderEnabled, autoResponderSubject, autoResponderMessage, resetTimer, formId]);

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
              {/* Auto-save indicator */}
              {formId && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {autoSaveStatus === "saving" && (
                    <>
                      <Save className="h-4 w-4 animate-pulse" />
                      <span>Salvataggio...</span>
                    </>
                  )}
                  {autoSaveStatus === "saved" && (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Salvato</span>
                    </>
                  )}
                  {autoSaveStatus === "error" && (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>Errore</span>
                    </>
                  )}
                  {autoSaveStatus === "idle" && lastSaved && (
                    <span>
                      {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
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
                  <div className="flex items-center gap-2">
                    <Label htmlFor="auto-responder-toggle">Auto-Responder Email</Label>
                    <Switch
                      id="auto-responder-toggle"
                      checked={autoResponderEnabled}
                      onCheckedChange={setAutoResponderEnabled}
                    />
                  </div>
                  {autoResponderEnabled && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="auto-responder-subject">Oggetto Email</Label>
                        <Input
                          id="auto-responder-subject"
                          value={autoResponderSubject}
                          onChange={(e) => setAutoResponderSubject(e.target.value)}
                          placeholder="Grazie per la tua richiesta"
                        />
                      </div>
                      <div>
                        <Label htmlFor="auto-responder-message">Messaggio Email</Label>
                        <Textarea
                          id="auto-responder-message"
                          value={autoResponderMessage}
                          onChange={(e) => setAutoResponderMessage(e.target.value)}
                          placeholder="Ciao {{nome}},\n\nGrazie per aver compilato il nostro form..."
                          rows={6}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Usa variabili come {'{{'}nome{'}}'}, {'{{'}email{'}}'}, ecc. per personalizzare il messaggio con i dati del form.
                        </p>
                      </div>
                    </div>
                  )}
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
                <div className="mb-4 flex items-center gap-2">
                  <Switch
                    id="multi-step-toggle"
                    checked={multiStep}
                    onCheckedChange={setMultiStep}
                  />
                  <Label htmlFor="multi-step-toggle">Abilita Form Multi-Step</Label>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  {multiStep ? (
                    <MultiStepFormPreview
                      title={title}
                      description={description}
                      fields={fields}
                      styles={styles}
                      onSubmit={(data) => {
                        console.log("Preview submit:", data);
                        toast.info("Questa è solo un'anteprima");
                      }}
                    />
                  ) : (
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
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
