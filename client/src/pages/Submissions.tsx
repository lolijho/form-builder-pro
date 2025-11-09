import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
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

export default function Submissions() {
  const [, params] = useRoute("/submissions/:formId");
  const [, setLocation] = useLocation();
  const formId = params?.formId ? parseInt(params.formId) : null;
  const [deleteSubmissionId, setDeleteSubmissionId] = useState<number | null>(null);

  const { data: form } = trpc.forms.getById.useQuery(
    { id: formId! },
    { enabled: !!formId }
  );

  const { data: submissions, isLoading } = trpc.submissions.list.useQuery(
    { formId: formId! },
    { enabled: !!formId }
  );

  const utils = trpc.useUtils();

  const deleteMutation = trpc.submissions.delete.useMutation({
    onSuccess: () => {
      toast.success("Submission eliminata con successo");
      utils.submissions.list.invalidate({ formId: formId! });
      setDeleteSubmissionId(null);
    },
    onError: (error) => {
      toast.error(`Errore: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0) {
      toast.error("Nessuna submission da esportare");
      return;
    }

    const fields = form ? JSON.parse(form.fields) : [];
    const headers = ["ID", "Data", ...fields.map((f: any) => f.label)];

    const rows = submissions.map((sub) => {
      const data = JSON.parse(sub.data);
      return [
        sub.id,
        new Date(sub.submittedAt).toLocaleString("it-IT"),
        ...fields.map((f: any) => data[f.id] || ""),
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `submissions-${formId}-${Date.now()}.csv`;
    link.click();

    toast.success("Export CSV completato");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Risposte</h1>
              <p className="text-muted-foreground mt-2">
                {form?.title || "Form"}
              </p>
            </div>
          </div>
          {submissions && submissions.length > 0 && (
            <Button onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Esporta CSV
            </Button>
          )}
        </div>

        {!submissions || submissions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Nessuna risposta ricevuta
                </h3>
                <p className="text-muted-foreground">
                  Le risposte al form appariranno qui una volta inviate
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Risposte ricevute ({submissions.length})</CardTitle>
              <CardDescription>
                Visualizza e gestisci tutte le risposte al tuo form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Dati</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => {
                    const data = JSON.parse(submission.data);
                    return (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          #{submission.id}
                        </TableCell>
                        <TableCell>
                          {formatDate(submission.submittedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <pre className="text-xs overflow-x-auto">
                              {JSON.stringify(data, null, 2)}
                            </pre>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteSubmissionId(submission.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog
        open={deleteSubmissionId !== null}
        onOpenChange={(open) => !open && setDeleteSubmissionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questa submission? Questa azione non
              può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteSubmissionId && handleDelete(deleteSubmissionId)
              }
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
