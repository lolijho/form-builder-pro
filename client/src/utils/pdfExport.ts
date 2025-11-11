import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface AnalyticsData {
  formTitle: string;
  totalViews: number;
  totalSubmissions: number;
  conversionRate: number;
  avgCompletionTime: number;
  lastUpdated: string;
}

/**
 * Export analytics report to PDF
 */
export async function exportAnalyticsPDF(
  data: AnalyticsData,
  chartsContainerId: string
): Promise<void> {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  let yPosition = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(37, 99, 235); // Blue
  pdf.text("Form Analytics Report", pageWidth / 2, yPosition, { align: "center" });
  
  yPosition += 15;
  
  // Form title
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text(data.formTitle, pageWidth / 2, yPosition, { align: "center" });
  
  yPosition += 15;
  
  // Date
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generato il: ${data.lastUpdated}`, pageWidth / 2, yPosition, { align: "center" });
  
  yPosition += 20;
  
  // Metrics section
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Metriche Principali", 20, yPosition);
  
  yPosition += 10;
  
  // Metrics table
  const metrics = [
    { label: "Visualizzazioni Totali", value: data.totalViews.toString() },
    { label: "Submissions Totali", value: data.totalSubmissions.toString() },
    { label: "Tasso di Conversione", value: `${data.conversionRate.toFixed(1)}%` },
    { label: "Tempo Medio Completamento", value: `${data.avgCompletionTime.toFixed(0)}s` },
  ];
  
  pdf.setFontSize(11);
  metrics.forEach((metric, index) => {
    const y = yPosition + (index * 10);
    pdf.setTextColor(60, 60, 60);
    pdf.text(metric.label, 25, y);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text(metric.value, 120, y);
    pdf.setFont("helvetica", "normal");
  });
  
  yPosition += (metrics.length * 10) + 15;
  
  // Charts section
  pdf.setFontSize(14);
  pdf.text("Grafici e Statistiche", 20, yPosition);
  
  yPosition += 10;
  
  // Capture charts as image
  try {
    const chartsElement = document.getElementById(chartsContainerId);
    if (chartsElement) {
      const canvas = await html2canvas(chartsElement, {
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if we need a new page
      if (yPosition + imgHeight > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);
    }
  } catch (error) {
    console.error("Failed to capture charts:", error);
  }
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    "Form Builder Pro - Report Analytics",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );
  
  // Save PDF
  pdf.save(`analytics-${data.formTitle.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`);
}
