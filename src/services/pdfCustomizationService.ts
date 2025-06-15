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

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number = 8, style: 'F' | 'S' | 'FS' = 'F') {
    // Draw rounded rectangle using path operations
    this.doc.roundedRect(x, y, width, height, radius, radius, style);
  }

  private drawNestedCard(x: number, y: number, width: number, height: number, options: {
    hasHeader?: boolean;
    headerHeight?: number;
    shadow?: boolean;
    innerPadding?: number;
    borderColor?: string;
    backgroundColor?: string;
    headerColor?: string;
  } = {}) {
    const {
      hasHeader = false,
      headerHeight = 35,
      shadow = true,
      innerPadding = 12,
      borderColor = '#e2e8f0',
      backgroundColor = '#ffffff',
      headerColor = '#f8fafc'
    } = options;

    // Outer card shadow (multiple layers for depth)
    if (shadow) {
      for (let i = 3; i >= 1; i--) {
        const shadowOpacity = 0.1 * (4 - i);
        const shadowColor = Math.floor(220 + (i * 8)); // Gradient from darker to lighter
        this.doc.setFillColor(shadowColor, shadowColor, shadowColor);
        this.drawRoundedRect(x + i, y + i, width, height, 8, 'F');
      }
    }
    
    // Main card background
    this.doc.setFillColor(backgroundColor);
    this.drawRoundedRect(x, y, width, height, 8, 'F');
    
    // Card border
    this.doc.setDrawColor(borderColor);
    this.doc.setLineWidth(0.5);
    this.drawRoundedRect(x, y, width, height, 8, 'S');
    
    // Header section with rounded top corners
    if (hasHeader) {
      this.doc.setFillColor(headerColor);
      this.drawRoundedRect(x, y, width, headerHeight, 8, 'F');
      
      // Fill the bottom corners of header to make them square
      this.doc.rect(x, y + headerHeight - 8, width, 8, 'F');
      
      // Header bottom border
      this.doc.setDrawColor(borderColor);
      this.doc.setLineWidth(0.5);
      this.doc.line(x + 8, y + headerHeight, x + width - 8, y + headerHeight);
    }

    return { contentStartY: y + (hasHeader ? headerHeight : 0) + innerPadding };
  }

  private drawInnerCard(x: number, y: number, width: number, height: number, color: string = '#f1f5f9') {
    // Inner nested card with subtle styling
    this.doc.setFillColor(color);
    this.drawRoundedRect(x, y, width, height, 6, 'F');
    
    this.doc.setDrawColor('#e2e8f0');
    this.doc.setLineWidth(0.3);
    this.drawRoundedRect(x, y, width, height, 6, 'S');
  }

  private addIconPlaceholder(x: number, y: number, size: number, iconType: string) {
    // Create modern icon placeholders with rounded backgrounds
    const iconBgSize = size + 8;
    
    // Icon background circle
    this.doc.setFillColor(this.customization.colors.accent);
    this.doc.circle(x + iconBgSize/2, y + iconBgSize/2, iconBgSize/2, 'F');
    
    // White icon shape
    this.doc.setFillColor('#ffffff');
    
    switch (iconType) {
      case 'calendar':
        // Modern calendar icon
        this.drawRoundedRect(x + 4, y + 6, size, size - 4, 2, 'F');
        this.doc.setFillColor(this.customization.colors.accent);
        this.drawRoundedRect(x + 6, y + 2, 2, 6, 1, 'F');
        this.drawRoundedRect(x + size - 2, y + 2, 2, 6, 1, 'F');
        this.doc.setFillColor('#ffffff');
        // Calendar grid
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.doc.circle(x + 7 + j * 3, y + 12 + i * 3, 0.8, 'F');
          }
        }
        break;
        
      case 'location':
        // Modern location pin
        const pinX = x + iconBgSize/2;
        const pinY = y + 6;
        this.doc.circle(pinX, pinY + 4, 6, 'F');
        this.doc.circle(pinX, pinY + 4, 3, 'F');
        this.doc.setFillColor(this.customization.colors.accent);
        this.doc.circle(pinX, pinY + 4, 2, 'F');
        // Pin point
        this.doc.setFillColor('#ffffff');
        const points = [[pinX, pinY + 10], [pinX - 3, pinY + 6], [pinX + 3, pinY + 6]];
        this.doc.triangle(points[0][0], points[0][1], points[1][0], points[1][1], points[2][0], points[2][1], 'F');
        break;
        
      case 'users':
        // Modern users icon
        this.doc.circle(x + 6, y + 7, 3, 'F');
        this.doc.circle(x + 12, y + 7, 3, 'F');
        this.drawRoundedRect(x + 4, y + 12, 12, 6, 3, 'F');
        break;
        
      case 'clock':
        // Modern clock icon
        this.doc.circle(x + iconBgSize/2, y + iconBgSize/2, size/2 - 1, 'F');
        this.doc.setFillColor(this.customization.colors.accent);
        this.doc.circle(x + iconBgSize/2, y + iconBgSize/2, size/2 - 3, 'F');
        this.doc.setFillColor('#ffffff');
        // Clock hands
        this.doc.setLineWidth(2);
        this.doc.setDrawColor('#ffffff');
        this.doc.line(x + iconBgSize/2, y + iconBgSize/2, x + iconBgSize/2, y + 6);
        this.doc.line(x + iconBgSize/2, y + iconBgSize/2, x + iconBgSize/2 + 4, y + iconBgSize/2);
        break;
    }
  }

  private addGradientHeader(y: number): number {
    // Modern gradient header with multiple color stops
    const headerHeight = 100;
    const steps = 30;
    
    for (let i = 0; i < steps; i++) {
      const progress = i / (steps - 1);
      // Create a sand-to-white gradient
      const r = Math.floor(248 - (progress * 20)); // Start from light sand
      const g = Math.floor(250 - (progress * 15));
      const b = Math.floor(252 - (progress * 10));
      
      this.doc.setFillColor(r, g, b);
      this.doc.rect(0, y + (i * headerHeight / steps), this.pageWidth, Math.ceil(headerHeight / steps) + 1, 'F');
    }
    
    return y + headerHeight;
  }

  private async addHeader(callsheet: CallsheetData): Promise<number> {
    let y = this.customization.layout.margins.top;

    // Add gradient header background
    const headerY = y - 30;
    this.addGradientHeader(headerY);

    // Add logo if configured
    if (this.customization.branding.logo) {
      y = await this.addLogo(y);
    }

    // Company name in a subtle card
    if (this.customization.branding.companyName) {
      const companyCardWidth = 200;
      const companyCardX = this.customization.layout.headerStyle === 'centered' 
        ? (this.pageWidth - companyCardWidth) / 2 
        : this.customization.layout.margins.left;
      
      this.drawInnerCard(companyCardX, y - 5, companyCardWidth, 25, '#ffffff');
      
      this.setFont('small');
      this.setColor('secondary');
      
      const textAlign = this.customization.layout.headerStyle === 'centered' ? 'center' : 'left';
      const textX = textAlign === 'center' ? this.pageWidth / 2 : companyCardX + 10;
      
      this.doc.text(this.customization.branding.companyName, textX, y + 8, { align: textAlign });
      y += 35;
    }

    // Main title with enhanced card background
    const titleAlign = this.customization.layout.headerStyle === 'centered' ? 'center' : 'left';
    const titleX = titleAlign === 'center' ? this.pageWidth / 2 : this.customization.layout.margins.left;
    
    // Title card background
    const titleWidth = this.doc.getTextWidth('CALL SHEET') * 1.2;
    const titleCardX = titleAlign === 'center' ? titleX - titleWidth/2 - 20 : titleX - 15;
    
    // Outer title card with shadow
    this.drawNestedCard(
      titleCardX, 
      y - 10, 
      titleWidth + 40, 
      this.customization.typography.fontSize.title + 25,
      { shadow: true, backgroundColor: this.customization.colors.accent }
    );
    
    this.setFont('title');
    this.doc.setTextColor('#ffffff');
    this.doc.text('CALL SHEET', titleX, y + this.customization.typography.fontSize.title - 5, { align: titleAlign });
    y += this.customization.typography.fontSize.title + 25;

    // Project title in elegant card
    const projectCardWidth = this.pageWidth - 2 * this.customization.layout.margins.left;
    const { contentStartY } = this.drawNestedCard(
      this.customization.layout.margins.left, 
      y, 
      projectCardWidth, 
      50,
      { hasHeader: false, shadow: true, backgroundColor: '#ffffff' }
    );
    
    this.setFont('header');
    this.setColor('primary');
    this.doc.text(callsheet.projectTitle, titleX, contentStartY + 8, { align: titleAlign });
    y += 70;
    
    return y + this.customization.layout.spacing.sectionGap;
  }

  private addBasicInfo(callsheet: CallsheetData, startY: number): number {
    let y = startY;
    const margin = this.customization.layout.margins.left;
    const cardWidth = (this.pageWidth - 2 * margin - 30) / 2;
    
    // Left card - Date and Call Time with nested design
    const leftCard = this.drawNestedCard(margin, y, cardWidth, 140, {
      hasHeader: true,
      headerHeight: 40,
      shadow: true,
      backgroundColor: '#ffffff',
      headerColor: '#f8fafc'
    });
    
    // Calendar icon in header
    this.addIconPlaceholder(margin + 15, y + 8, 16, 'calendar');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('SHOOT DETAILS', margin + 45, y + 25);
    
    // Date in inner card
    this.drawInnerCard(margin + 15, leftCard.contentStartY + 5, cardWidth - 30, 30, '#fef7ed');
    this.setFont('body');
    this.setColor('secondary');
    this.doc.text('Date:', margin + 25, leftCard.contentStartY + 18);
    
    this.setFont('body');
    this.setColor('text');
    this.doc.text(new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    }), margin + 25, leftCard.contentStartY + 28);
    
    // Call time in inner card
    this.drawInnerCard(margin + 15, leftCard.contentStartY + 45, cardWidth - 30, 30, '#f0f9ff');
    this.setFont('body');
    this.setColor('secondary');
    this.doc.text('General Call:', margin + 25, leftCard.contentStartY + 58);
    
    this.setFont('body');
    this.setColor('text');
    this.doc.text(callsheet.generalCallTime, margin + 25, leftCard.contentStartY + 68);

    // Right card - Location with enhanced styling
    const rightCardX = margin + cardWidth + 30;
    const rightCard = this.drawNestedCard(rightCardX, y, cardWidth, 140, {
      hasHeader: true,
      headerHeight: 40,
      shadow: true,
      backgroundColor: '#ffffff', 
      headerColor: '#f8fafc'
    });
    
    // Location icon in header
    this.addIconPlaceholder(rightCardX + 15, y + 8, 16, 'location');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('LOCATION', rightCardX + 45, y + 25);
    
    // Location text in styled inner card
    this.drawInnerCard(rightCardX + 15, rightCard.contentStartY + 5, cardWidth - 30, 80, '#f0fdf4');
    this.setFont('body');
    this.setColor('text');
    const locationLines = this.doc.splitTextToSize(callsheet.location, cardWidth - 50);
    this.doc.text(locationLines, rightCardX + 25, rightCard.contentStartY + 20);
    
    return y + 160 + this.customization.layout.spacing.sectionGap;
  }

  private addLocationDetails(callsheet: CallsheetData, startY: number): number {
    let y = startY;
    const margin = this.customization.layout.margins.left;
    
    // Location details card with nested style
    const cardHeight = 150;
    const card = this.drawNestedCard(margin, y, this.pageWidth - 2 * margin, cardHeight, {
      hasHeader: true,
      headerHeight: 40,
      shadow: true,
      backgroundColor: '#ffffff',
      headerColor: '#f8fafc'
    });
    
    // Location icon in header
    this.addIconPlaceholder(margin + 15, y + 8, 16, 'location');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('LOCATION DETAILS', margin + 45, y + 25);
    
    y = card.contentStartY;
    
    // Address with improved formatting in inner card
    this.drawInnerCard(margin + 15, y, this.pageWidth - 2 * margin - 30, 40, '#fef7ed');
    this.setFont('body');
    this.setColor('secondary');
    this.doc.text('Address:', margin + 25, y + 15);
    
    this.setFont('body');
    this.setColor('text');
    const addressLines = this.doc.splitTextToSize(callsheet.locationAddress, this.pageWidth - 2 * margin - 80);
    this.doc.text(addressLines, margin + 80, y + 15);
    
    y += 50;
    
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
    
    const card = this.drawNestedCard(margin, y, this.pageWidth - 2 * margin, cardHeight, {
      hasHeader: true,
      headerHeight: 40,
      shadow: true,
      backgroundColor: '#ffffff',
      headerColor: '#f8fafc'
    });
    
    // Users icon in header
    this.addIconPlaceholder(margin + 15, y + 8, 16, 'users');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text(title, margin + 45, y + 25);
    
    y = card.contentStartY;
    
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
        this.drawRoundedRect(margin + 15, y - 5, this.pageWidth - 2 * margin - 30, 30, 6, 'F');
        this.doc.setDrawColor('#e2e8f0');
        this.doc.setLineWidth(0.5);
        this.drawRoundedRect(margin + 15, y - 5, this.pageWidth - 2 * margin - 30, 30, 6, 'S');

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
    
    const card = this.drawNestedCard(margin, y, this.pageWidth - 2 * margin, cardHeight, {
      hasHeader: true,
      headerHeight: 40,
      shadow: true,
      backgroundColor: '#ffffff',
      headerColor: '#f8fafc'
    });
    
    // Clock icon in header
    this.addIconPlaceholder(margin + 15, y + 8, 16, 'clock');
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('SHOOTING SCHEDULE', margin + 45, y + 25);
    
    y = card.contentStartY;
    
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
      this.drawRoundedRect(margin + 15, y - 8, 50, 16, 4, 'F');
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
    
    const card = this.drawNestedCard(margin, y, this.pageWidth - 2 * margin, cardHeight, {
      hasHeader: true,
      headerHeight: 40,
      shadow: true,
      backgroundColor: '#ffffff',
      headerColor: '#f8fafc'
    });
    
    this.setFont('header');
    this.setColor('accent');
    this.doc.text('SPECIAL NOTES', margin + 15, y + 25);
    
    y = card.contentStartY;
    
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
