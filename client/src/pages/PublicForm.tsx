import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { FormPreview } from "@/components/FormPreview";
import { FormField, FormStyles } from "@shared/formTypes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PublicForm() {
  const [, params] = useRoute("/form/:id");
  const formId = params?.id ? parseInt(params.id) : null;

  const { data: form, isLoading } = trpc.public.getForm.useQuery(
    { id: formId! },
    { enabled: !!formId }
  );

  const submitMutation = trpc.public.submit.useMutation({
    onSuccess: () => {
      toast.success("Form inviato con successo!");
    },
    onError: (error) => {
      toast.error(`Errore: ${error.message}`);
    },
  });

  const handleSubmit = (data: Record<string, any>) => {
    if (!formId) return;

    submitMutation.mutate({
      formId,
      data: JSON.stringify(data),
      userAgent: navigator.userAgent,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Form non trovato</h1>
          <p className="text-muted-foreground">
            Il form richiesto non esiste o non è pubblicato.
          </p>
        </div>
      </div>
    );
  }

  const fields: FormField[] = JSON.parse(form.fields);
  const styles: FormStyles = JSON.parse(form.styles);

  return (
    <FormPreview
      title={form.title}
      description={form.description || undefined}
      fields={fields}
      styles={styles}
      onSubmit={handleSubmit}
    />
  );
}
