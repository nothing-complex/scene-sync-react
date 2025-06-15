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
    
    // Set background color
    this.doc.setFillColor(this.customization.colors.background);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
  }

  private setFont(type: 'title' | 'header' | 'body' | 'small') {
    const { fontFamily, fontSize, fontWeight } = this.customization.typography;
    
    this.doc.setFont(fontFamily, fontWeight[type] || 'normal');
    this.doc.setFontSize(fontSize[type]);
  }

  private setColor(colorType: 'primary' | 'secondary' | 'text' | 'accent') {
    this.doc.setTextColor(this.customization.colors[colorType]);
  }

  private drawCard(x: number, y: number, width: number, height: number, hasHeader: boolean = false) {
    // Card shadow effect (multiple rectangles with decreasing opacity)
    this.doc.setFillColor('#e2e8f0'); // slate-200
    this.doc.rect(x + 2, y + 2, width, height, 'F');
    
    // Main card background
    this.doc.setFillColor('#ffffff');
    this.doc.rect(x, y, width, height, 'F');
    
    // Card border
    this.doc.setDrawColor('#e2e8f0'); // slate-200
    this.doc.setLineWidth(0.5);
    this.doc.rect(x, y, width, height, 'S');
    
    // Header section if needed
    if (hasHeader) {
      this.doc.setFillColor('#f8fafc'); // slate-50
      this.doc.rect(x, y, width, 30, 'F');
      
      // Header border
      this.doc.setDrawColor('#e2e8f0');
      this.doc.line(x, y + 30, x + width, y + 30);
    }
  }

  private addIconPlaceholder(x: number, y: number, size: number, iconType: string) {
    // Create icon-like shapes using geometric forms
    this.doc.setFillColor(this.customization.colors.accent);
    
    switch (iconType) {
      case 'calendar':
        // Calendar icon
        this.doc.rect(x, y, size, size, 'F');
        this.doc.setFillColor('#ffffff');
        this.doc.rect(x + 2, y + 6, size - 4, size - 8, 'F');
        this.doc.setFillColor(this.customization.colors.accent);
        this.doc.rect(x + 4, y + 2, 2, 4, 'F');
        this.doc.rect(x + size - 6, y + 2, 2, 4, 'F');
        break;
      case 'location':
        // Location pin icon
        this.doc.circle(x + size/2, y + size/2, size/2, 'F');
        this.doc.setFillColor('#ffffff');
        this.doc.circle(x + size/2, y + size/2, size/4, 'F');
        break;
      case 'users':
        // Users icon
        this.doc.circle(x + size/3, y + size/3, size/6, 'F');
        this.doc.circle(x + 2*size/3, y + size/3, size/6, 'F');
        this.doc.rect(x, y + 2*size/3, size, size/3, 'F');
        break;
      case 'clock':
        // Clock icon
        this.doc.circle(x + size/2, y + size/2, size/2, 'F');
        this.doc.setFillColor('#ffffff');
        this.doc.circle(x + size/2, y + size/2, size/2 - 2, 'F');
        this.doc.setDrawColor(this.customization.colors.accent);
        this.doc.setLineWidth(2);
        this.doc.line(x + size/2, y + size/2, x + size/2, y + size/4);
        this.doc.line(x + size/2, y + size/2, x + 3*size/4, y + size/2);
        break;
    }
  }

  private addGradientHeader(y: number): number {
    // Create gradient effect using multiple rectangles
    const headerHeight = 80;
    const steps = 20;
    
    for (let i = 0; i < steps; i++) {
      const opacity = 1 - (i / steps) * 0.8;
      const gray = Math.floor(248 - (i / steps) * 30); // From slate-50 to darker
      this.doc.setFillColor(gray, gray, gray);
      this.doc.rect(0, y + (i * headerHeight / steps), this.pageWidth, headerHeight / steps, 'F');
    }
    
    return y + headerHeight;
  }

  private async addHeader(callsheet: CallsheetData): Promise<number> {
    let y = this.customization.layout.margins.top;

    // Add gradient header background
    const headerY = y - 20;
    this.addGradientHeader(headerY);

    // Add logo if configured
    if (this.customization.branding.logo) {
      y = await this.addLogo(y);
    }

    // Company name with enhanced styling
    if (this.customization.branding.companyName) {
      this.setFont('small');
      this.setColor('secondary');
      
      const textAlign = this.customization.layout.headerStyle === 'centered' ? 'center' : 'left';
      const x = textAlign === 'center' ? this.pageWidth / 2 : this.customization.layout.margins.left;
      
      this.doc.text(this.customization.branding.companyName, x, y, { align: textAlign });
      y += 25;
    }

    // Main title with enhanced styling and background
    this.setFont('title');
    this.setColor('primary');
    
    const titleAlign = this.customization.layout.headerStyle === 'centered' ? 'center' : 'left';
    const titleX = titleAlign === 'center' ? this.pageWidth / 2 : this.customization.layout.margins.left;
    
    // Title background highlight
    const titleWidth = this.doc.getTextWidth('CALL SHEET');
    const titleBgX = titleAlign === 'center' ? titleX - titleWidth/2 - 10 : titleX - 5;
    this.doc.setFillColor(this.customization.colors.accent);
    this.doc.rect(titleBgX, y - this.customization.typography.fontSize.title - 5, titleWidth + 20, this.customization.typography.fontSize.title + 10, 'F');
    
    this.doc.setTextColor('#ffffff');
    this.doc.text('CALL SHEET', titleX, y, { align: titleAlign });
    y += this.customization.typography.fontSize.title + 10;

    // Project title with card background
    const projectCardY = y;
    this.drawCard(
      this.customization.layout.margins.left - 10, 
      projectCardY - 5, 
      this.pageWidth - 2 * this.customization.layout.margins.left + 20, 
      35
    );
    
    this.setFont('header');
    this.setColor('primary');
    this.doc.text(callsheet.projectTitle, titleX, y + 15, { align: titleAlign });
    y += 50;
    
    return y + this.customization.layout.spacing.sectionGap;
  }

  private addBasicInfo(callsheet: CallsheetData, startY: number): number {
    let y = startY;
    const margin = this.customization.layout.margins.left;
    const cardWidth = (this.pageWidth - 2 * margin - 20) / 2;
    
    // Left card - Date and Call Time
    this.drawCard(margin, y, cardWidth, 120, true);
    
    // Calendar icon
    this.addIconPlaceholder(margin + 15, y + 8, 14, 'calendar');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('SHOOT DETAILS', margin + 35, y + 20);
    
    y += 45;
    this.setFont('body');
    this.setColor('secondary');
    this.doc.text('Date:', margin + 15, y);
    
    this.setFont('body');
    this.setColor('text');
    this.doc.text(new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), margin + 15, y + 15);
    
    y += 35;
    this.setFont('body');
    this.setColor('secondary');
    this.doc.text('General Call:', margin + 15, y);
    
    this.setFont('body');
    this.setColor('text');
    this.doc.text(callsheet.generalCallTime, margin + 15, y + 15);

    // Right card - Location
    const rightCardX = margin + cardWidth + 20;
    this.drawCard(rightCardX, startY, cardWidth, 120, true);
    
    // Location icon
    this.addIconPlaceholder(rightCardX + 15, startY + 8, 14, 'location');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('LOCATION', rightCardX + 35, startY + 20);
    
    let locationY = startY + 45;
    this.setFont('body');
    this.setColor('text');
    const locationLines = this.doc.splitTextToSize(callsheet.location, cardWidth - 30);
    this.doc.text(locationLines, rightCardX + 15, locationY);
    
    return startY + 140 + this.customization.layout.spacing.sectionGap;
  }

  private addLocationDetails(callsheet: CallsheetData, startY: number): number {
    let y = startY;
    const margin = this.customization.layout.margins.left;
    
    // Location details card
    const cardHeight = 150;
    this.drawCard(margin, y, this.pageWidth - 2 * margin, cardHeight, true);
    
    // Location icon
    this.addIconPlaceholder(margin + 15, y + 8, 14, 'location');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('LOCATION DETAILS', margin + 35, y + 20);
    
    y += 45;
    
    // Address with improved formatting
    this.setFont('body');
    this.setColor('secondary');
    this.doc.text('Address:', margin + 15, y);
    
    this.setFont('body');
    this.setColor('text');
    const addressLines = this.doc.splitTextToSize(callsheet.locationAddress, this.pageWidth - 2 * margin - 80);
    this.doc.text(addressLines, margin + 80, y);
    
    y += Math.max(addressLines.length * 12, 15) + 10;
    
    // Weather in styled box (if enabled)
    if (this.customization.sections.visibility.weather && callsheet.weather) {
      this.doc.setFillColor('#fef3c7'); // amber-100
      this.doc.rect(margin + 15, y - 5, this.pageWidth - 2 * margin - 30, 25, 'F');
      
      this.setFont('body');
      this.setColor('secondary');
      this.doc.text('Weather:', margin + 20, y + 8);
      
      this.setFont('body');
      this.setColor('text');
      this.doc.text(callsheet.weather, margin + 80, y + 8);
      y += 30;
    }
    
    // Parking and Basecamp in grid layout
    if (callsheet.parkingInstructions || callsheet.basecampLocation) {
      const itemWidth = (this.pageWidth - 2 * margin - 50) / 2;
      
      if (callsheet.parkingInstructions) {
        this.setFont('body');
        this.setColor('secondary');
        this.doc.text('Parking:', margin + 15, y);
        
        this.setFont('small');
        this.setColor('text');
        const parkingLines = this.doc.splitTextToSize(callsheet.parkingInstructions, itemWidth);
        this.doc.text(parkingLines, margin + 15, y + 12);
      }
      
      if (callsheet.basecampLocation) {
        this.setFont('body');
        this.setColor('secondary');
        this.doc.text('Basecamp:', margin + itemWidth + 35, y);
        
        this.setFont('small');
        this.setColor('text');
        const basecampLines = this.doc.splitTextToSize(callsheet.basecampLocation, itemWidth);
        this.doc.text(basecampLines, margin + itemWidth + 35, y + 12);
      }
      
      y += 40;
    }
    
    return startY + cardHeight + 20 + this.customization.layout.spacing.sectionGap;
  }

  private addContactSection(title: string, contacts: any[], startY: number): number {
    let y = startY;
    const margin = this.customization.layout.margins.left;
    
    // Calculate card height based on content
    const baseHeight = 60;
    const contactHeight = this.customization.sections.formatting.contactLayout === 'table' ? 18 : 35;
    const cardHeight = Math.max(baseHeight + (contacts.length * contactHeight), 100);
    
    this.drawCard(margin, y, this.pageWidth - 2 * margin, cardHeight, true);
    
    // Users icon
    this.addIconPlaceholder(margin + 15, y + 8, 14, 'users');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text(title, margin + 35, y + 20);
    
    y += 45;
    
    if (contacts.length === 0) {
      this.setFont('body');
      this.setColor('secondary');
      this.doc.text('No contacts added', margin + 15, y);
      return startY + cardHeight + 20 + this.customization.layout.spacing.sectionGap;
    }

    this.setFont('body');
    
    if (this.customization.sections.formatting.contactLayout === 'table') {
      // Enhanced table format with alternating row colors
      contacts.forEach((contact, index) => {
        if (y > this.pageHeight - 80) {
          this.doc.addPage();
          this.doc.setFillColor(this.customization.colors.background);
          this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
          y = this.customization.layout.margins.top;
        }

        // Alternating row background
        if (index % 2 === 0) {
          this.doc.setFillColor('#f8fafc'); // slate-50
          this.doc.rect(margin + 10, y - 8, this.pageWidth - 2 * margin - 20, 16, 'F');
        }

        this.setColor('text');
        this.doc.text(contact.name, margin + 15, y);
        this.doc.text(contact.role + (contact.character ? ` (${contact.character})` : ''), margin + 180, y);
        this.doc.text(contact.phone, margin + 350, y);
        
        y += 18;
      });
    } else {
      // Enhanced card-style list format
      contacts.forEach((contact, index) => {
        if (y > this.pageHeight - 80) {
          this.doc.addPage();
          this.doc.setFillColor(this.customization.colors.background);
          this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
          y = this.customization.layout.margins.top;
        }

        // Individual contact card
        this.doc.setFillColor('#ffffff');
        this.doc.rect(margin + 15, y - 5, this.pageWidth - 2 * margin - 30, 30, 'F');
        this.doc.setDrawColor('#e2e8f0');
        this.doc.setLineWidth(0.5);
        this.doc.rect(margin + 15, y - 5, this.pageWidth - 2 * margin - 30, 30, 'S');

        this.setColor('text');
        this.setFont('body');
        this.doc.text(`${contact.name} • ${contact.role}${contact.character ? ` (${contact.character})` : ''}`, margin + 25, y + 8);
        
        this.setColor('secondary');
        this.setFont('small');
        this.doc.text(contact.phone + (contact.email ? ` • ${contact.email}` : ''), margin + 25, y + 20);
        y += 40;
      });
    }
    
    return y + this.customization.layout.spacing.sectionGap;
  }

  private addSchedule(callsheet: CallsheetData, startY: number): number {
    if (!this.customization.sections.visibility.schedule) return startY;
    
    let y = startY;
    const margin = this.customization.layout.margins.left;
    
    // Calculate card height
    const baseHeight = 60;
    const scheduleHeight = this.customization.sections.formatting.scheduleCompact ? 25 : 50;
    const cardHeight = Math.max(baseHeight + (callsheet.schedule.length * scheduleHeight), 100);
    
    this.drawCard(margin, y, this.pageWidth - 2 * margin, cardHeight, true);
    
    // Clock icon
    this.addIconPlaceholder(margin + 15, y + 8, 14, 'clock');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('SHOOTING SCHEDULE', margin + 35, y + 20);
    
    y += 45;
    
    if (callsheet.schedule.length === 0) {
      this.setFont('body');
      this.setColor('secondary');
      this.doc.text('No schedule items added', margin + 15, y);
      return startY + cardHeight + 20 + this.customization.layout.spacing.sectionGap;
    }

    callsheet.schedule.forEach((item, index) => {
      if (y > this.pageHeight - 100) {
        this.doc.addPage();
        this.doc.setFillColor(this.customization.colors.background);
        this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        y = this.customization.layout.margins.top;
      }

      // Scene number highlight
      this.doc.setFillColor(this.customization.colors.accent);
      this.doc.rect(margin + 15, y - 8, 50, 16, 'F');
      this.setFont('body');
      this.doc.setTextColor('#ffffff');
      this.doc.text(`${item.sceneNumber}`, margin + 25, y);

      if (this.customization.sections.formatting.scheduleCompact) {
        // Compact format with timeline styling
        this.setFont('body');
        this.setColor('text');
        this.doc.text(`${item.intExt} • ${item.description}`, margin + 75, y);
        
        this.setColor('secondary');
        this.setFont('small');
        this.doc.text(`${item.pageCount} pages • ${item.estimatedTime}`, margin + 75, y + 12);
        y += 25;
      } else {
        // Enhanced detailed format with better layout
        this.setColor('text');
        this.doc.text(item.intExt, margin + 75, y);
        this.doc.text(item.estimatedTime, margin + 200, y);
        this.doc.text(`${item.pageCount} pages`, margin + 350, y);
        
        y += 15;
        this.setFont('body');
        this.setColor('text');
        const descLines = this.doc.splitTextToSize(item.description, this.pageWidth - 2 * margin - 80);
        this.doc.text(descLines, margin + 25, y);
        
        if (item.location) {
          y += descLines.length * 12 + 5;
          this.setFont('small');
          this.setColor('secondary');
          this.doc.text(`📍 ${item.location}`, margin + 25, y);
        }
        
        y += 25;
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
    
    // Notes card with special styling
    const notesLines = this.doc.splitTextToSize(callsheet.specialNotes, this.pageWidth - 2 * margin - 30);
    const cardHeight = Math.max(80 + notesLines.length * 12, 100);
    
    this.drawCard(margin, y, this.pageWidth - 2 * margin, cardHeight, true);
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('SPECIAL NOTES', margin + 15, y + 20);
    
    y += 40;
    
    // Notes background highlight
    this.doc.setFillColor('#fef3c7'); // amber-100
    this.doc.rect(margin + 15, y - 5, this.pageWidth - 2 * margin - 30, notesLines.length * 12 + 15, 'F');
    
    this.setFont('body');
    this.setColor('text');
    this.doc.text(notesLines, margin + 20, y + 8);
    
    return y + notesLines.length * 12 + 30 + this.customization.layout.spacing.sectionGap;
  }

  private addFooter(): void {
    if (this.customization.branding.footer?.text) {
      const y = this.pageHeight - this.customization.layout.margins.bottom + 15;
      
      // Footer background
      this.doc.setFillColor('#f1f5f9'); // slate-100
      this.doc.rect(0, y - 10, this.pageWidth, 25, 'F');
      
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

  private async addLogo(y: number): Promise<number> {
    if (!this.customization.branding.logo) return y;

    const { logo } = this.customization.branding;
    
    // Define logo sizes in points
    const logoSizes = {
      small: 30,
      medium: 50,
      large: 70
    };

    const logoSize = logoSizes[logo.size];
    
    // Calculate position based on logo.position
    let logoX: number;
    switch (logo.position) {
      case 'top-left':
        logoX = this.customization.layout.margins.left;
        break;
      case 'top-center':
        logoX = (this.pageWidth - logoSize) / 2;
        break;
      case 'top-right':
        logoX = this.pageWidth - this.customization.layout.margins.right - logoSize;
        break;
      default:
        logoX = this.customization.layout.margins.left;
    }

    try {
      this.doc.addImage(
        logo.url,
        'PNG',
        logoX,
        y,
        logoSize,
        logoSize,
        undefined,
        'FAST'
      );
      return y + logoSize + 10; // Return new Y position after logo
    } catch (error) {
      console.error('Failed to add logo to PDF:', error);
      return y; // Return original Y if logo fails
    }
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

  async generatePDF(callsheet: CallsheetData): Promise<jsPDF> {
    let currentY = await this.addHeader(callsheet);
    
    // Add watermark on each page
    this.addWatermark();
    
    // Process sections in configured order
    for (const section of this.customization.sections.order) {
      if (currentY > this.pageHeight - 120) {
        this.doc.addPage();
        this.doc.setFillColor(this.customization.colors.background);
        this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
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

  async savePDF(callsheet: CallsheetData, filename?: string): Promise<void> {
    const doc = await this.generatePDF(callsheet);
    const fileName = filename || `${callsheet.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_callsheet.pdf`;
    doc.save(fileName);
  }
}
