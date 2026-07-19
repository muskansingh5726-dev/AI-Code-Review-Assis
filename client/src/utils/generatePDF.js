import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePDF(data) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AI Code Review Report", 14, 18);

  doc.setFontSize(12);

  doc.text(`Language: ${data.language}`, 14, 32);
  doc.text(`AI Review Status: Completed`, 14, 40);
  doc.text(`Score: ${data.score}/100`, 14, 48);

  autoTable(doc, {
    startY: 60,
    head: [["Category", "Suggestion"]],
    body:
      data.suggestions?.length > 0
        ? data.suggestions.map((item) => [
            item.category,
            item.message,
          ])
        : [["AI", "No Suggestions"]],
  });

  doc.save("AI_Code_Review_Report.pdf");
}