import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, Copy, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [deleteFormId, setDeleteFormId] = useState<number | null>(null);

  const { data: forms, isLoading } = trpc.forms.list.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.forms.delete.useMutation({
    onSuccess: () => {
      toast.success("Form eliminato con successo");
      utils.forms.list.invalidate();
      setDeleteFormId(null);
    },
    onError: (error) => {
      toast.error(`Errore: ${error.message}`);
    },
  });

  const duplicateMutation = trpc.forms.duplicate.useMutation({
    onSuccess: (data) => {
      toast.success("Form duplicato con successo");
      utils.forms.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Errore: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const handleDuplicate = (id: number) => {
    duplicateMutation.mutate({ id });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">I miei Form</h1>
            <p className="text-muted-foreground mt-2">
              Gestisci e crea i tuoi form personalizzati
            </p>
          </div>
          <Button onClick={() => setLocation("/editor/new")} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Nuovo Form
          </Button>
        </div>

        {!forms || forms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Nessun form creato
                </h3>
                <p className="text-muted-foreground mb-6">
                  Inizia creando il tuo primo form personalizzato
                </p>
                <Button onClick={() => setLocation("/editor/new")}>
                  <Plus className="h-5 w-5 mr-2" />
                  Crea il primo form
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">
                        {form.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {form.description || "Nessuna descrizione"}
                      </CardDescription>
                    </div>
                    <Badge variant={form.published ? "default" : "secondary"}>
                      {form.published ? "Pubblicato" : "Bozza"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Creato il {formatDate(form.createdAt)}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/editor/${form.id}`)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifica
                      </Button>
                      {form.published && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/form/${form.id}`, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(form.id)}
                        disabled={duplicateMutation.isPending}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteFormId(form.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setLocation(`/submissions/${form.id}`)}
                        className="flex-1"
                      >
                        Risposte
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setLocation(`/analytics/${form.id}`)}
                        className="flex-1"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteFormId !== null}
        onOpenChange={(open) => !open && setDeleteFormId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo form? Questa azione non può
              essere annullata e tutti i dati delle submission verranno persi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFormId && handleDelete(deleteFormId)}
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
