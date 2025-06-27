
import jsPDF from 'jspdf';
import { CallsheetData } from '@/contexts/CallsheetContext';

// Legacy jsPDF-based PDF service (backup implementation)
export class CallsheetPDFService {
  private pdf: jsPDF;

  constructor() {
    this.pdf = new jsPDF();
  }

  generatePDF(callsheet: CallsheetData): void {
    console.log('Using legacy jsPDF service for:', callsheet.projectTitle);
    
    // Basic PDF generation with jsPDF
    this.pdf.setFontSize(20);
    this.pdf.text('CALL SHEET', 20, 30);
    
    this.pdf.setFontSize(16);
    this.pdf.text(callsheet.projectTitle, 20, 50);
    
    this.pdf.setFontSize(12);
    this.pdf.text(`Date: ${callsheet.shootDate}`, 20, 70);
    this.pdf.text(`Call Time: ${callsheet.generalCallTime}`, 20, 85);
    this.pdf.text(`Location: ${callsheet.location}`, 20, 100);
    
    // Add cast section
    let yPos = 120;
    this.pdf.setFontSize(14);
    this.pdf.text('CAST:', 20, yPos);
    yPos += 15;
    
    this.pdf.setFontSize(10);
    callsheet.cast.forEach((member) => {
      this.pdf.text(`${member.name} - ${member.role}`, 25, yPos);
      yPos += 12;
    });
    
    // Add crew section
    yPos += 10;
    this.pdf.setFontSize(14);
    this.pdf.text('CREW:', 20, yPos);
    yPos += 15;
    
    this.pdf.setFontSize(10);
    callsheet.crew.forEach((member) => {
      this.pdf.text(`${member.name} - ${member.role}`, 25, yPos);
      yPos += 12;
    });
    
    // Save the PDF
    const fileName = `${callsheet.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_callsheet.pdf`;
    this.pdf.save(fileName);
  }
}

// Export function for backward compatibility
export const generateLegacyPDF = (callsheet: CallsheetData) => {
  const service = new CallsheetPDFService();
  service.generatePDF(callsheet);
};
