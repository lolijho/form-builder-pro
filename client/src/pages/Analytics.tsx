import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { exportAnalyticsPDF } from "@/utils/pdfExport";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import { Link } from "wouter";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

export default function Analytics() {
  const [, params] = useRoute("/analytics/:id");
  const formId = params?.id ? parseInt(params.id) : null;
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const { data: form, isLoading: formLoading } = trpc.forms.getById.useQuery(
    { id: formId! },
    { enabled: !!formId }
  );

  const { data: stats, isLoading: statsLoading } = trpc.analytics.getStats.useQuery(
    { formId: formId! },
    { enabled: !!formId }
  );

  const { data: timeline, isLoading: timelineLoading } = trpc.analytics.getTimeline.useQuery(
    { formId: formId!, days: dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365 },
    { enabled: !!formId }
  );

  if (formLoading || statsLoading || timelineLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Caricamento analytics...</p>
        </div>
      </div>
    );
  }

  if (!form || !stats) {
    return (
      <div className="container py-8">
        <p>Form non trovato</p>
      </div>
    );
  }

  const conversionRate = stats.views > 0 ? ((stats.submissions / stats.views) * 100).toFixed(1) : "0.0";
  const completionRate = stats.starts > 0 ? ((stats.submissions / stats.starts) * 100).toFixed(1) : "0.0";

  const handleExportPDF = async () => {
    try {
      await exportAnalyticsPDF(
        {
          formTitle: form.title,
          totalViews: stats.views,
          totalSubmissions: stats.submissions,
          conversionRate: parseFloat(conversionRate),
          avgCompletionTime: 0, // We don't track this yet
          lastUpdated: new Date().toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        "analytics-charts"
      );
      toast.success("Report PDF scaricato con successo");
    } catch (error) {
      console.error("Failed to export PDF:", error);
      toast.error("Errore durante l'esportazione del PDF");
    }
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const funnelData = [
    { name: "Visualizzazioni", value: stats.views, fill: COLORS[0] },
    { name: "Iniziati", value: stats.starts, fill: COLORS[1] },
    { name: "Completati", value: stats.submissions, fill: COLORS[2] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold">Analytics</h1>
              <p className="text-muted-foreground mt-2">{form.title}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="border rounded-md px-3 py-2"
            >
              <option value="7d">Ultimi 7 giorni</option>
              <option value="30d">Ultimi 30 giorni</option>
              <option value="90d">Ultimi 90 giorni</option>
              <option value="all">Tutto il periodo</option>
            </select>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Esporta PDF
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div id="analytics-charts">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizzazioni</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Numero totale di visualizzazioni del form
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Form Iniziati</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.starts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Utenti che hanno iniziato a compilare
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submission</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.submissions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Form completati e inviati
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasso di Conversione</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Submission / Visualizzazioni
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Andamento nel Tempo</CardTitle>
              <CardDescription>
                Visualizzazioni e submission giornaliere
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeline || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    name="Visualizzazioni"
                  />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke="#10b981"
                    name="Submission"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Funnel Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Funnel di Conversione</CardTitle>
              <CardDescription>
                Percorso dall'arrivo alla submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6">
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Tasso di Completamento</CardTitle>
              <CardDescription>
                Percentuale di form completati rispetto agli iniziati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center py-4">{completionRate}%</div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasso di Abbandono</CardTitle>
              <CardDescription>
                Utenti che hanno iniziato ma non completato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center py-4">
                {stats.starts > 0 ? (100 - parseFloat(completionRate)).toFixed(1) : "0.0"}%
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {stats.starts - stats.submissions} abbandoni su {stats.starts} iniziati
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate</CardTitle>
              <CardDescription>
                Percentuale di utenti che iniziano a compilare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center py-4">
                {stats.views > 0 ? ((stats.starts / stats.views) * 100).toFixed(1) : "0.0"}%
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {stats.starts} iniziati su {stats.views} visualizzazioni
              </p>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}
