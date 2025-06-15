
import jsPDF from 'jspdf';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomizationService } from './pdfCustomizationService';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';

// Legacy service for backward compatibility
export class CallsheetPDFService {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
  }

  private addHeader(callsheet: CallsheetData) {
    // Title
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CALL SHEET', this.pageWidth / 2, 30, { align: 'center' });
    
    // Project title
    this.doc.setFontSize(16);
    this.doc.text(callsheet.projectTitle, this.pageWidth / 2, 45, { align: 'center' });
    
    return 60;
  }

  private addBasicInfo(callsheet: CallsheetData, startY: number) {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    
    const leftColumn = this.margin;
    const rightColumn = this.pageWidth / 2 + 10;
    let y = startY;

    // Left column
    this.doc.text('SHOOT DATE:', leftColumn, y);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(new Date(callsheet.shootDate).toLocaleDateString(), leftColumn + 35, y);
    
    y += 15;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CALL TIME:', leftColumn, y);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(callsheet.generalCallTime, leftColumn + 35, y);

    // Right column
    y = startY;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('LOCATION:', rightColumn, y);
    this.doc.setFont('helvetica', 'normal');
    const locationLines = this.doc.splitTextToSize(callsheet.location, 80);
    this.doc.text(locationLines, rightColumn + 30, y);
    
    return startY + Math.max(30, locationLines.length * 5 + 15);
  }

  private addLocationDetails(callsheet: CallsheetData, startY: number) {
    let y = startY + 10;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('LOCATION DETAILS', this.margin, y);
    
    y += 15;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Address:', this.margin, y);
    this.doc.setFont('helvetica', 'normal');
    const addressLines = this.doc.splitTextToSize(callsheet.locationAddress, this.pageWidth - 2 * this.margin - 25);
    this.doc.text(addressLines, this.margin + 25, y);
    
    y += addressLines.length * 5 + 10;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Parking:', this.margin, y);
    this.doc.setFont('helvetica', 'normal');
    const parkingLines = this.doc.splitTextToSize(callsheet.parkingInstructions, this.pageWidth - 2 * this.margin - 25);
    this.doc.text(parkingLines, this.margin + 25, y);
    
    y += parkingLines.length * 5 + 10;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Basecamp:', this.margin, y);
    this.doc.setFont('helvetica', 'normal');
    const basecampLines = this.doc.splitTextToSize(callsheet.basecampLocation, this.pageWidth - 2 * this.margin - 25);
    this.doc.text(basecampLines, this.margin + 25, y);
    
    return y + basecampLines.length * 5 + 20;
  }

  private addContactSection(title: string, contacts: any[], startY: number) {
    let y = startY;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, y);
    
    y += 15;
    this.doc.setFontSize(9);
    
    if (contacts.length === 0) {
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('No contacts added', this.margin, y);
      return y + 20;
    }

    contacts.forEach((contact, index) => {
      if (y > this.pageHeight - 40) {
        this.doc.addPage();
        y = 30;
      }

      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${contact.name}`, this.margin, y);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`${contact.role}${contact.character ? ` (${contact.character})` : ''}`, this.margin + 60, y);
      this.doc.text(contact.phone, this.margin + 120, y);
      
      y += 12;
    });
    
    return y + 10;
  }

  private addSchedule(callsheet: CallsheetData, startY: number) {
    let y = startY;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('SHOOTING SCHEDULE', this.margin, y);
    
    y += 15;
    this.doc.setFontSize(9);
    
    if (callsheet.schedule.length === 0) {
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('No schedule items added', this.margin, y);
      return y + 20;
    }

    callsheet.schedule.forEach((item, index) => {
      if (y > this.pageHeight - 50) {
        this.doc.addPage();
        y = 30;
      }

      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`Scene ${item.sceneNumber}`, this.margin, y);
      this.doc.text(item.intExt, this.margin + 40, y);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(item.estimatedTime, this.margin + 60, y);
      this.doc.text(`${item.pageCount} pgs`, this.margin + 100, y);
      
      y += 10;
      const descLines = this.doc.splitTextToSize(item.description, this.pageWidth - 2 * this.margin - 10);
      this.doc.text(descLines, this.margin + 5, y);
      
      y += descLines.length * 4 + 8;
    });
    
    return y + 10;
  }

  private addNotes(callsheet: CallsheetData, startY: number) {
    if (!callsheet.specialNotes.trim()) return startY;
    
    let y = startY;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('SPECIAL NOTES', this.margin, y);
    
    y += 15;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const notesLines = this.doc.splitTextToSize(callsheet.specialNotes, this.pageWidth - 2 * this.margin);
    this.doc.text(notesLines, this.margin, y);
    
    return y + notesLines.length * 5 + 20;
  }

  generatePDF(callsheet: CallsheetData): void {
    let currentY = this.addHeader(callsheet);
    currentY = this.addBasicInfo(callsheet, currentY);
    currentY = this.addLocationDetails(callsheet, currentY);
    
    // Check if we need a new page
    if (currentY > this.pageHeight - 100) {
      this.doc.addPage();
      currentY = 30;
    }
    
    currentY = this.addContactSection('CAST', callsheet.cast, currentY);
    
    if (currentY > this.pageHeight - 60) {
      this.doc.addPage();
      currentY = 30;
    }
    
    currentY = this.addContactSection('CREW', callsheet.crew, currentY);
    
    if (currentY > this.pageHeight - 60) {
      this.doc.addPage();
      currentY = 30;
    }
    
    currentY = this.addContactSection('EMERGENCY CONTACTS', callsheet.emergencyContacts, currentY);
    
    if (currentY > this.pageHeight - 60) {
      this.doc.addPage();
      currentY = 30;
    }
    
    currentY = this.addSchedule(callsheet, currentY);
    currentY = this.addNotes(callsheet, currentY);

    // Save the PDF
    const fileName = `${callsheet.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_callsheet.pdf`;
    this.doc.save(fileName);
  }
}

// Enhanced service with customization
export const generateCustomCallsheetPDF = (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  const pdfService = new PDFCustomizationService(customization);
  pdfService.savePDF(callsheet);
};

// Keep the original function for backward compatibility
export const generateCallsheetPDF = (callsheet: CallsheetData) => {
  const pdfService = new CallsheetPDFService();
  pdfService.generatePDF(callsheet);
};
