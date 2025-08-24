import jsPDF from 'jspdf';

export interface ReportHeader {
  title: string;
  subtitle: string;
  generatedDate: string;
  userEmail?: string;
}

export interface ReportSection {
  title: string;
  content: Array<{
    type: 'text' | 'table' | 'chart';
    data: any;
  }>;
}

export class PDFTemplate {
  private pdf: jsPDF;
  private currentY: number = 0;
  private pageHeight: number = 297; // A4 height in mm
  private pageWidth: number = 210; // A4 width in mm
  private margin: number = 20;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.currentY = this.margin;
  }

  addHeader(header: ReportHeader): void {
    // Logo placeholder (you can replace with actual logo)
    this.pdf.setFillColor(79, 70, 229); // Primary color
    this.pdf.rect(this.margin, this.margin, 40, 15, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('AI STUDIO', this.margin + 2, this.margin + 9);

    // Title
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(header.title, this.margin, this.margin + 30);

    // Subtitle
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(128, 128, 128);
    this.pdf.text(header.subtitle, this.margin, this.margin + 40);

    // Generated date and user info
    this.pdf.setFontSize(10);
    this.pdf.text(`Generated: ${header.generatedDate}`, this.pageWidth - 60, this.margin + 10);
    if (header.userEmail) {
      this.pdf.text(`User: ${header.userEmail}`, this.pageWidth - 60, this.margin + 16);
    }

    // Horizontal line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, this.margin + 50, this.pageWidth - this.margin, this.margin + 50);

    this.currentY = this.margin + 60;
  }

  addSection(title: string): void {
    this.checkPageBreak(20);
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(79, 70, 229);
    this.pdf.text(title, this.margin, this.currentY);
    
    this.currentY += 15;
  }

  addText(text: string, fontSize: number = 12, color: [number, number, number] = [0, 0, 0]): void {
    this.checkPageBreak(10);
    
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(color[0], color[1], color[2]);
    
    // Handle text wrapping
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - (this.margin * 2));
    this.pdf.text(lines, this.margin, this.currentY);
    
    this.currentY += lines.length * (fontSize * 0.5);
  }

  addTable(headers: string[], rows: string[][]): void {
    const colWidth = (this.pageWidth - (this.margin * 2)) / headers.length;
    const rowHeight = 8;
    
    this.checkPageBreak((rows.length + 1) * rowHeight + 10);

    // Headers
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), rowHeight, 'F');
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    
    headers.forEach((header, index) => {
      this.pdf.text(header, this.margin + (index * colWidth) + 2, this.currentY + 5);
    });

    this.currentY += rowHeight;

    // Rows
    this.pdf.setFont('helvetica', 'normal');
    rows.forEach((row, rowIndex) => {
      if (rowIndex % 2 === 1) {
        this.pdf.setFillColor(252, 252, 252);
        this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), rowHeight, 'F');
      }
      
      row.forEach((cell, colIndex) => {
        this.pdf.text(cell, this.margin + (colIndex * colWidth) + 2, this.currentY + 5);
      });
      
      this.currentY += rowHeight;
    });

    this.currentY += 10;
  }

  addMetricCard(title: string, value: string, description?: string): void {
    this.checkPageBreak(25);
    
    // Card background
    this.pdf.setFillColor(249, 250, 251);
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 20, 'F');
    
    // Card border
    this.pdf.setDrawColor(229, 231, 235);
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 20);
    
    // Title
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(75, 85, 99);
    this.pdf.text(title, this.margin + 5, this.currentY + 8);
    
    // Value
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(79, 70, 229);
    this.pdf.text(value, this.margin + 5, this.currentY + 16);
    
    // Description (if provided)
    if (description) {
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(107, 114, 128);
      this.pdf.text(description, this.pageWidth - 80, this.currentY + 12);
    }
    
    this.currentY += 30;
  }

  addFooter(): void {
    const footerY = this.pageHeight - 15;
    
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);
    
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(128, 128, 128);
    this.pdf.text('AI Studio - Professional Training Platform', this.margin, footerY);
    
    // Page number
    const pageNum = this.pdf.getCurrentPageInfo().pageNumber;
    this.pdf.text(`Page ${pageNum}`, this.pageWidth - 30, footerY);
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.addFooter();
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  save(filename: string): void {
    this.addFooter();
    this.pdf.save(filename);
  }

  getPDF(): jsPDF {
    this.addFooter();
    return this.pdf;
  }
}