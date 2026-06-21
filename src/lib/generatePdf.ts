import { jsPDF } from 'jspdf';
import type { BuildingLevel, BuildingPlan } from './types';

const LEVELS_PER_PAGE = 8;

interface PdfLabels {
  elevator: string;
  page: string;
}

function chunkLevels(levels: BuildingLevel[]) {
  const pages: BuildingLevel[][] = [];
  for (let index = 0; index < levels.length; index += LEVELS_PER_PAGE) {
    pages.push(levels.slice(index, index + LEVELS_PER_PAGE));
  }
  return pages.length ? pages : [[]];
}

export function generatePdf(plan: BuildingPlan, fallbackTitle: string, labels: PdfLabels) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 24;
  const accent: [number, number, number] = plan.blackAndWhite ? [25, 25, 25] : [23, 79, 54];
  const rowFill: [number, number, number] = plan.blackAndWhite ? [242, 242, 242] : [238, 241, 237];
  const pages = chunkLevels(plan.levels);

  pages.forEach((levels, pageIndex) => {
    if (pageIndex > 0) doc.addPage('a4', 'landscape');

    doc.setTextColor(23, 33, 27);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(27);
    doc.text(plan.title || fallbackTitle, margin, 31);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 110, 104);
    doc.text([plan.street, plan.city].filter(Boolean).join(' · '), margin, 39);
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.8);
    doc.line(margin, 47, pageWidth - margin, 47);

    const top = 62;
    const tableWidth = pageWidth - margin * 2;
    const labelWidth = 61;
    const availableHeight = 112;
    const gap = 2;
    const rowHeight = Math.min(17, (availableHeight - gap * Math.max(0, levels.length - 1)) / Math.max(1, levels.length));

    levels.forEach((level, index) => {
      const y = top + index * (rowHeight + gap);
      doc.setFillColor(...rowFill);
      doc.setTextColor(23, 33, 27);
      doc.roundedRect(margin, y, tableWidth, rowHeight, 1.5, 1.5, 'F');
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.25);
      doc.line(margin + labelWidth, y, margin + labelWidth, y + rowHeight);

      const fontSize = rowHeight < 10 ? 7 : rowHeight < 13 ? 9 : 11;
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'bold');
      doc.text(level.name, margin + 5, y + rowHeight / 2 + fontSize * 0.13, { baseline: 'middle' });
      doc.setFont('helvetica', 'normal');

      const tokens = level.items
        .filter((item) => item.type === 'door' ? item.label : plan.elevatorsEnabled)
        .map((item) => {
          if (item.type === 'door') return item.label;
          return `[${labels.elevator}]`;
        });
      const lines = doc.splitTextToSize(tokens.join('   '), tableWidth - labelWidth - 10);
      doc.text(lines, margin + labelWidth + 5, y + rowHeight / 2 + fontSize * 0.13, { baseline: 'middle' });
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 155, 151);
    doc.text(plan.street, margin, pageHeight - 14);
    if (pages.length > 1) {
      doc.text(`${labels.page} ${pageIndex + 1} / ${pages.length}`, pageWidth / 2, pageHeight - 14, { align: 'center' });
    }
    doc.text(plan.city, pageWidth - margin, pageHeight - 14, { align: 'right' });
  });

  const safeName = (plan.street || 'building-plan')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, '-')
    .replace(/^-|-$/g, '');
  doc.save(`${safeName || 'building-plan'}.pdf`);
}
