import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePDF(data) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AI Code Review Report", 14, 18);

  doc.setFontSize(12);

  doc.text(`Language: ${data.language}`, 14, 32);
  doc.text(`Score: ${data.score}/100`, 14, 40);
  doc.text(`Compiler Status: ${data.compilerStatus}`, 14, 48);
  doc.text(`Execution Time: ${data.executionTime}`, 14, 56);
  doc.text(`Memory: ${data.memory}`, 14, 64);

  autoTable(doc, {
    startY: 75,
    head: [["Section", "Content"]],
    body: [
      ["Program Output", data.stdout || "No Output"],
      ["Compilation Errors", data.compileOutput || "None"],
      ["Runtime Errors", data.stderr || "None"],
    ],
  });

  let y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(15);
  doc.text("AI Suggestions", 14, y);

  y += 10;

  if (data.suggestions?.length) {
    data.suggestions.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. ${item.category}`,
        14,
        y
      );

      y += 7;

      doc.text(
        item.message,
        18,
        y,
        {
          maxWidth: 170,
        }
      );

      y += 15;
    });
  } else {
    doc.text("No Suggestions", 14, y);
  }

  doc.save("AI_Code_Review_Report.pdf");
}