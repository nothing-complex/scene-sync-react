
import jsPDF from 'jspdf';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';

export class PDFCustomizationService {
  private doc: jsPDF;
  private customization: PDFCustomization;
  private pageWidth: number;
  private pageHeight: number;

  constructor(customization: Partial<PDFCustomization> = {}) {
    this.customization = { ...DEFAULT_PDF_CUSTOMIZATION, ...customization };
    this.doc = new jsPDF({
      orientation: this.customization.layout.pageOrientation,
      unit: 'pt',
      format: 'a4'
    });
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
  }

  private setFont(type: 'title' | 'header' | 'body' | 'small') {
    const { fontFamily, fontSize, fontWeight } = this.customization.typography;
    
    this.doc.setFont(fontFamily, fontWeight[type] || 'normal');
    this.doc.setFontSize(fontSize[type]);
  }

  private setColor(colorType: 'primary' | 'secondary' | 'text' | 'accent') {
    this.doc.setTextColor(this.customization.colors[colorType]);
  }

  private addWatermark() {
    // TODO: Implement watermarking system based on user subscription
    // For now, this is commented out
    /*
    if (this.isFreeTier) {
      this.doc.setGState(new this.doc.GState({ opacity: 0.15 }));
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(48);
      this.doc.setTextColor('#cccccc');
      
      // Diagonal watermark
      this.doc.text(
        'Created with CallTi.me Free Plan',
        this.pageWidth / 2,
        this.pageHeight / 2,
        { 
          align: 'center',
          angle: -45
        }
      );
      
      this.doc.setGState(new this.doc.GState({ opacity: 1 }));
    }
    */
  }

  private addHeader(callsheet: CallsheetData): number {
    let y = this.customization.layout.margins.top;

    // Add logo if configured
    if (this.customization.branding.logo) {
      // TODO: Implement logo loading and positioning
      y += 40; // Reserve space for logo
    }

    // Company name
    if (this.customization.branding.companyName) {
      this.setFont('small');
      this.setColor('secondary');
      
      const textAlign = this.customization.layout.headerStyle === 'centered' ? 'center' : 'left';
      const x = textAlign === 'center' ? this.pageWidth / 2 : this.customization.layout.margins.left;
      
      this.doc.text(this.customization.branding.companyName, x, y, { align: textAlign });
      y += 20;
    }

    // Main title
    this.setFont('title');
    this.setColor('primary');
    
    const titleAlign = this.customization.layout.headerStyle === 'centered' ? 'center' : 'left';
    const titleX = titleAlign === 'center' ? this.pageWidth / 2 : this.customization.layout.margins.left;
    
    this.doc.text('CALL SHEET', titleX, y, { align: titleAlign });
    y += this.customization.typography.fontSize.title + 10;

    // Project title
    this.setFont('header');
    this.setColor('accent');
    this.doc.text(callsheet.projectTitle, titleX, y, { align: titleAlign });
    
    return y + this.customization.layout.spacing.sectionGap;
  }

  private addBasicInfo(callsheet: CallsheetData, startY: number): number {
    let y = startY;
    const leftColumn = this.customization.layout.margins.left;
    const rightColumn = this.pageWidth / 2 + 10;

    this.setFont('body');
    this.setColor('text');

    // Left column
    this.setFont('header');
    this.setColor('primary');
    this.doc.text('SHOOT DATE:', leftColumn, y);
    
    this.setFont('body');
    this.setColor('text');
    this.doc.text(new Date(callsheet.shootDate).toLocaleDateString(), leftColumn + 80, y);
    
    y += this.customization.layout.spacing.itemGap + 5;
    
    this.setFont('header');
    this.setColor('primary');
    this.doc.text('CALL TIME:', leftColumn, y);
    
    this.setFont('body');
    this.setColor('text');
    this.doc.text(callsheet.generalCallTime, leftColumn + 80, y);

    // Right column - location
    let rightY = startY;
    this.setFont('header');
    this.setColor('primary');
    this.doc.text('LOCATION:', rightColumn, rightY);
    
    this.setFont('body');
    this.setColor('text');
    const locationLines = this.doc.splitTextToSize(callsheet.location, 150);
    this.doc.text(locationLines, rightColumn + 70, rightY);
    
    return Math.max(y, rightY + locationLines.length * 12) + this.customization.layout.spacing.sectionGap;
  }

  private addLocationDetails(callsheet: CallsheetData, startY: number): number {
    let y = startY;
    const margin = this.customization.layout.margins.left;
    
    this.setFont('header');
    this.setColor('primary');
    this.doc.text('LOCATION DETAILS', margin, y);
    
    y += this.customization.layout.spacing.itemGap + 10;
    
    this.setFont('body');
    this.setColor('text');
    
    // Address
    this.setFont('header');
    this.setColor('secondary');
    this.doc.text('Address:', margin, y);
    
    this.setFont('body');
    this.setColor('text');
    const addressLines = this.doc.splitTextToSize(callsheet.locationAddress, this.pageWidth - 2 * margin - 60);
    this.doc.text(addressLines, margin + 60, y);
    
    y += addressLines.length * 12 + this.customization.layout.spacing.itemGap;
    
    // Weather (if enabled)
    if (this.customization.sections.visibility.weather && callsheet.weather) {
      this.setFont('header');
      this.setColor('secondary');
      this.doc.text('Weather:', margin, y);
      
      this.setFont('body');
      this.setColor('text');
      this.doc.text(callsheet.weather, margin + 60, y);
      y += this.customization.layout.spacing.itemGap + 5;
    }
    
    // Parking
    if (callsheet.parkingInstructions) {
      this.setFont('header');
      this.setColor('secondary');
      this.doc.text('Parking:', margin, y);
      
      this.setFont('body');
      this.setColor('text');
      const parkingLines = this.doc.splitTextToSize(callsheet.parkingInstructions, this.pageWidth - 2 * margin - 60);
      this.doc.text(parkingLines, margin + 60, y);
      y += parkingLines.length * 12 + this.customization.layout.spacing.itemGap;
    }
    
    // Basecamp
    if (callsheet.basecampLocation) {
      this.setFont('header');
      this.setColor('secondary');
      this.doc.text('Basecamp:', margin, y);
      
      this.setFont('body');
      this.setColor('text');
      const basecampLines = this.doc.splitTextToSize(callsheet.basecampLocation, this.pageWidth - 2 * margin - 60);
      this.doc.text(basecampLines, margin + 60, y);
      y += basecampLines.length * 12;
    }
    
    return y + this.customization.layout.spacing.sectionGap;
  }

  private addContactSection(title: string, contacts: any[], startY: number): number {
    let y = startY;
    const margin = this.customization.layout.margins.left;
    
    this.setFont('header');
    this.setColor('primary');
    this.doc.text(title, margin, y);
    
    y += this.customization.layout.spacing.itemGap + 10;
    
    if (contacts.length === 0) {
      this.setFont('body');
      this.setColor('secondary');
      this.doc.text('No contacts added', margin, y);
      return y + this.customization.layout.spacing.sectionGap;
    }

    this.setFont('small');
    
    if (this.customization.sections.formatting.contactLayout === 'table') {
      // Table format
      contacts.forEach((contact, index) => {
        if (y > this.pageHeight - 60) {
          this.doc.addPage();
          y = this.customization.layout.margins.top;
        }

        this.setColor('text');
        this.doc.text(contact.name, margin, y);
        this.doc.text(contact.role + (contact.character ? ` (${contact.character})` : ''), margin + 120, y);
        this.doc.text(contact.phone, margin + 250, y);
        
        y += 14;
      });
    } else {
      // List format
      contacts.forEach((contact, index) => {
        if (y > this.pageHeight - 60) {
          this.doc.addPage();
          y = this.customization.layout.margins.top;
        }

        this.setColor('text');
        this.doc.text(`${contact.name} - ${contact.role}${contact.character ? ` (${contact.character})` : ''}`, margin, y);
        y += 10;
        this.setColor('secondary');
        this.doc.text(contact.phone, margin + 10, y);
        y += 16;
      });
    }
    
    return y + this.customization.layout.spacing.sectionGap;
  }

  private addSchedule(callsheet: CallsheetData, startY: number): number {
    if (!this.customization.sections.visibility.schedule) return startY;
    
    let y = startY;
    const margin = this.customization.layout.margins.left;
    
    this.setFont('header');
    this.setColor('primary');
    this.doc.text('SHOOTING SCHEDULE', margin, y);
    
    y += this.customization.layout.spacing.itemGap + 10;
    
    if (callsheet.schedule.length === 0) {
      this.setFont('body');
      this.setColor('secondary');
      this.doc.text('No schedule items added', margin, y);
      return y + this.customization.layout.spacing.sectionGap;
    }

    this.setFont('small');
    
    callsheet.schedule.forEach((item, index) => {
      if (y > this.pageHeight - 80) {
        this.doc.addPage();
        y = this.customization.layout.margins.top;
      }

      this.setColor('text');
      
      if (this.customization.sections.formatting.scheduleCompact) {
        // Compact format
        this.doc.text(`Scene ${item.sceneNumber} - ${item.intExt} - ${item.description}`, margin, y);
        y += 10;
        this.setColor('secondary');
        this.doc.text(`${item.pageCount} pgs | ${item.estimatedTime}`, margin + 10, y);
        y += 16;
      } else {
        // Detailed format
        this.setFont('body');
        this.doc.text(`Scene ${item.sceneNumber}`, margin, y);
        this.doc.text(item.intExt, margin + 60, y);
        this.doc.text(item.estimatedTime, margin + 100, y);
        this.doc.text(`${item.pageCount} pgs`, margin + 200, y);
        
        y += 12;
        this.setFont('small');
        const descLines = this.doc.splitTextToSize(item.description, this.pageWidth - 2 * margin - 20);
        this.doc.text(descLines, margin + 10, y);
        
        y += descLines.length * 10 + 12;
      }
    });
    
    return y + this.customization.layout.spacing.sectionGap;
  }

  private addNotes(callsheet: CallsheetData, startY: number): number {
    if (!this.customization.sections.visibility.notes || !callsheet.specialNotes.trim()) {
      return startY;
    }
    
    let y = startY;
    const margin = this.customization.layout.margins.left;
    
    this.setFont('header');
    this.setColor('primary');
    this.doc.text('SPECIAL NOTES', margin, y);
    
    y += this.customization.layout.spacing.itemGap + 10;
    
    this.setFont('body');
    this.setColor('text');
    
    const notesLines = this.doc.splitTextToSize(callsheet.specialNotes, this.pageWidth - 2 * margin);
    this.doc.text(notesLines, margin, y);
    
    return y + notesLines.length * 12 + this.customization.layout.spacing.sectionGap;
  }

  private addFooter(): void {
    if (this.customization.branding.footer?.text) {
      const y = this.pageHeight - this.customization.layout.margins.bottom + 10;
      
      this.setFont('small');
      this.setColor('secondary');
      
      const footerX = this.customization.branding.footer.position === 'center' 
        ? this.pageWidth / 2 
        : this.customization.branding.footer.position === 'right'
        ? this.pageWidth - this.customization.layout.margins.right
        : this.customization.layout.margins.left;
      
      this.doc.text(
        this.customization.branding.footer.text, 
        footerX, 
        y, 
        { align: this.customization.branding.footer.position }
      );
    }
  }

  generatePDF(callsheet: CallsheetData): jsPDF {
    let currentY = this.addHeader(callsheet);
    
    // Add watermark on each page
    this.addWatermark();
    
    // Process sections in configured order
    for (const section of this.customization.sections.order) {
      if (currentY > this.pageHeight - 100) {
        this.doc.addPage();
        this.addWatermark();
        currentY = this.customization.layout.margins.top;
      }
      
      switch (section) {
        case 'basic':
          currentY = this.addBasicInfo(callsheet, currentY);
          break;
        case 'location':
          currentY = this.addLocationDetails(callsheet, currentY);
          break;
        case 'cast':
          currentY = this.addContactSection('CAST', callsheet.cast, currentY);
          break;
        case 'crew':
          currentY = this.addContactSection('CREW', callsheet.crew, currentY);
          break;
        case 'emergency':
          if (this.customization.sections.visibility.emergencyContacts) {
            currentY = this.addContactSection('EMERGENCY CONTACTS', callsheet.emergencyContacts, currentY);
          }
          break;
        case 'schedule':
          currentY = this.addSchedule(callsheet, currentY);
          break;
        case 'notes':
          currentY = this.addNotes(callsheet, currentY);
          break;
      }
    }
    
    // Add footer to all pages
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.addFooter();
    }
    
    return this.doc;
  }

  savePDF(callsheet: CallsheetData, filename?: string): void {
    const doc = this.generatePDF(callsheet);
    const fileName = filename || `${callsheet.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_callsheet.pdf`;
    doc.save(fileName);
  }
}
