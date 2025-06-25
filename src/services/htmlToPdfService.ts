import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';

export class HTMLToPDFService {
  private customization: PDFCustomization;

  constructor(customization: Partial<PDFCustomization> = {}) {
    this.customization = { ...DEFAULT_PDF_CUSTOMIZATION, ...customization };
    console.log('HTMLToPDFService initialized with customization:', this.customization);
  }

  private getFontFamily(): string {
    const { fontFamily } = this.customization.typography;
    const fontMap = {
      'inter': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      'helvetica': '"Helvetica Neue", Helvetica, Arial, sans-serif',
      'poppins': '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      'montserrat': '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    };
    return fontMap[fontFamily] || fontMap['inter'];
  }

  private getCardStyles(): string {
    const { cardStyle, cornerRadius, shadowIntensity } = this.customization.visual;
    
    let styles = `border-radius: ${cornerRadius}px;`;
    
    switch (cardStyle) {
      case 'elevated':
        if (shadowIntensity === 'subtle') {
          styles += 'box-shadow: 0 2px 4px rgba(0,0,0,0.05);';
        } else if (shadowIntensity === 'medium') {
          styles += 'box-shadow: 0 4px 8px rgba(0,0,0,0.1);';
        }
        break;
      case 'bordered':
        styles += `border: 1px solid ${this.customization.colors.border};`;
        break;
      case 'gradient':
        if (this.customization.colors.gradient) {
          const { from, to, direction } = this.customization.colors.gradient;
          const gradientDirection = direction === 'to-r' ? 'to right' :
                                  direction === 'to-br' ? 'to bottom right' : 'to bottom';
          styles += `background: linear-gradient(${gradientDirection}, ${from}, ${to});`;
        }
        break;
    }
    
    return styles;
  }

  private getSectionDividerStyles(): string {
    const { sectionDividers } = this.customization.visual;
    
    switch (sectionDividers) {
      case 'line':
        return `border-bottom: 1px solid ${this.customization.colors.border}; padding-bottom: 16px; margin-bottom: 24px;`;
      case 'accent':
        return `border-bottom: 2px solid ${this.customization.colors.accent}; padding-bottom: 16px; margin-bottom: 24px;`;
      case 'space':
        return 'margin-bottom: 32px;';
      default:
        return 'margin-bottom: 24px;';
    }
  }

  private getHeaderBackgroundStyles(): string {
    const { headerBackground } = this.customization.visual;
    const padding = 24;
    
    switch (headerBackground) {
      case 'subtle':
        return `background-color: ${this.customization.colors.surface}; padding: ${padding}px; margin-bottom: 32px; border-radius: ${this.customization.visual.cornerRadius}px;`;
      case 'solid':
        return `background-color: ${this.customization.colors.primary}; color: ${this.customization.colors.background}; padding: ${padding}px; margin-bottom: 32px; border-radius: ${this.customization.visual.cornerRadius}px;`;
      case 'gradient':
        if (this.customization.colors.gradient) {
          const { from, to, direction } = this.customization.colors.gradient;
          const gradientDirection = direction === 'to-r' ? 'to right' :
                                  direction === 'to-br' ? 'to bottom right' : 'to bottom';
          return `background: linear-gradient(${gradientDirection}, ${from}, ${to}); color: ${this.customization.colors.background}; padding: ${padding}px; margin-bottom: 32px; border-radius: ${this.customization.visual.cornerRadius}px;`;
        }
        return '';
      default:
        return 'margin-bottom: 24px;';
    }
  }

  private getFontWeight(weight: string): string {
    switch (weight) {
      case 'normal': return '400';
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return '700';
      default: return '400';
    }
  }

  private getContactLayoutStyles(): string {
    const { contactLayout } = this.customization.sections.formatting;
    
    switch (contactLayout) {
      case 'table':
        return 'display: table; width: 100%; border-collapse: collapse; border-spacing: 0;';
      case 'cards':
        return 'display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;';
      case 'compact':
        return 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;';
      case 'list':
      default:
        return 'display: flex; flex-direction: column; gap: 12px;';
    }
  }

  private getContactItemStyles(): string {
    const { contactLayout } = this.customization.sections.formatting;
    const baseStyles = `${this.getCardStyles()} padding: 12px; background-color: ${this.customization.colors.surface}; page-break-inside: avoid;`;
    
    switch (contactLayout) {
      case 'table':
        return `${baseStyles} display: table-row; border-bottom: 1px solid ${this.customization.colors.border};`;
      case 'cards':
      case 'compact':
        return `${baseStyles} border: 1px solid ${this.customization.colors.border};`;
      case 'list':
      default:
        return `${baseStyles} border-left: 3px solid ${this.customization.colors.accent};`;
    }
  }

  private renderEmoji(emoji: string): string {
    return this.customization.sections.formatting.showSectionIcons ? emoji + ' ' : '';
  }

  private getTitleColor(): string {
    const isHeaderWithBackground = this.customization.visual.headerBackground !== 'none';
    
    if (this.customization.layout.headerStyle === 'professional' && isHeaderWithBackground) {
      return this.customization.colors.background;
    }
    
    return isHeaderWithBackground ? this.customization.colors.background : this.customization.colors.primary;
  }

  private getSubtitleColor(): string {
    const isHeaderWithBackground = this.customization.visual.headerBackground !== 'none';
    
    if (this.customization.layout.headerStyle === 'professional' && isHeaderWithBackground) {
      return this.customization.colors.background;
    }
    
    return isHeaderWithBackground ? this.customization.colors.background : this.customization.colors.secondary;
  }

  private async renderPDFContent(callsheet: CallsheetData): Promise<HTMLElement> {
    console.log('Rendering PDF content for:', callsheet.projectTitle);
    
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 width at 96dpi
    container.style.backgroundColor = this.customization.colors.background;
    container.style.color = this.customization.colors.text;
    container.style.fontFamily = this.getFontFamily();
    container.style.fontSize = `${this.customization.typography.fontSize.body}px`;
    container.style.lineHeight = this.customization.typography.lineHeight.body.toString();
    container.style.boxSizing = 'border-box';
    container.style.padding = '36px'; // Increased padding for better margins
    
    container.id = 'temp-pdf-content';
    container.className = 'pdf-page-content';
    container.innerHTML = this.generateHTMLContent(callsheet);
    
    document.body.appendChild(container);
    await this.waitForResourcesLoaded(container);
    
    return container;
  }

  private async waitForResourcesLoaded(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll('img');
    if (images.length > 0) {
      await Promise.all(
        Array.from(images).map(img => {
          return new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
              setTimeout(() => resolve(), 3000);
            }
          });
        })
      );
    }
    
    if (document.fonts) {
      try {
        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.warn('Font loading failed:', error);
      }
    }
  }

  private generateHTMLContent(callsheet: CallsheetData): string {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const isHeaderCentered = this.customization.layout.headerStyle === 'minimal' || 
                            this.customization.layout.headerStyle === 'creative';
    
    const headerBackgroundStyles = this.getHeaderBackgroundStyles();
    const cardStyles = this.getCardStyles();

    return `
      <div class="pdf-page-content" style="
        font-family: ${this.getFontFamily()}; 
        font-size: ${this.customization.typography.fontSize.body}px; 
        color: ${this.customization.colors.text}; 
        line-height: ${this.customization.typography.lineHeight.body};
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      ">
        <!-- Header -->
        <div class="pdf-section pdf-section-header" style="
          text-align: ${isHeaderCentered ? 'center' : 'left'}; 
          ${headerBackgroundStyles}
          padding: 24px;
          margin-bottom: 32px;
          border-radius: ${this.customization.visual.cornerRadius}px;
        ">
          ${this.customization.branding.logo ? `
            <div style="margin-bottom: 16px;">
              <img src="${typeof this.customization.branding.logo === 'string' ? this.customization.branding.logo : this.customization.branding.logo.url}" 
                   alt="Company Logo" 
                   style="
                     height: ${this.customization.branding.logo && typeof this.customization.branding.logo === 'object' ? 
                       this.customization.branding.logo.size === 'small' ? '48px' :
                       this.customization.branding.logo.size === 'large' ? '80px' : '64px'
                     : '64px'}; 
                     width: auto; 
                     max-width: 100%;
                     ${isHeaderCentered ? 'display: block; margin: 0 auto;' : 'display: inline-block;'}
                   " />
            </div>
          ` : ''}
          <h1 style="
            font-size: ${this.customization.typography.fontSize.title}px; 
            font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.title)}; 
            margin: 0 0 12px 0; 
            color: ${this.getTitleColor()}; 
            line-height: ${this.customization.typography.lineHeight.title};
          ">
            ${callsheet.projectTitle}
          </h1>
          <h2 style="
            font-size: ${this.customization.typography.fontSize.header}px; 
            font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
            color: ${this.getSubtitleColor()}; 
            line-height: ${this.customization.typography.lineHeight.header};
            margin: 0;
          ">
            CALL SHEET
          </h2>
        </div>

        <!-- Production Details Grid - moved to top -->
        <div class="pdf-section pdf-basic-info" style="
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 16px; 
          margin-bottom: 32px;
        ">
          ${this.generateInfoCard('📅', 'Shoot Date', formatDate(callsheet.shootDate))}
          ${this.generateInfoCard('🕐', 'Call Time', callsheet.generalCallTime)}
          ${this.generateInfoCard('📍', 'Location', callsheet.location, callsheet.locationAddress)}
          ${callsheet.weather && this.customization.sections.visibility.weather ? 
            this.generateInfoCard('🌤️', 'Weather', callsheet.weather) : ''}
          ${callsheet.parkingInstructions ? 
            this.generateInfoCard('🅿️', 'Parking Instructions', callsheet.parkingInstructions) : ''}
          ${callsheet.basecampLocation ? 
            this.generateInfoCard('🏕️', 'Basecamp Location', callsheet.basecampLocation) : ''}
        </div>

        ${callsheet.specialNotes && this.customization.sections.visibility.notes ? `
        <!-- Special Notes - moved to top but separate from grid -->
        <div class="pdf-section" style="margin-bottom: 32px;">
          <div class="pdf-info-card" style="
            ${cardStyles} 
            padding: 18px; 
            background-color: ${this.customization.colors.surface};
            border-radius: ${this.customization.visual.cornerRadius}px;
            border: 1px solid ${this.customization.colors.border};
            border-left: 4px solid ${this.customization.colors.accent};
          ">
            <h4 style="
              font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
              margin-bottom: 12px; 
              font-size: ${this.customization.typography.fontSize.header}px;
              color: ${this.customization.colors.primary};
              display: flex;
              align-items: center;
              gap: 8px;
            ">
              ${this.customization.sections.formatting.showSectionIcons ? '<span style="font-size: 18px;">📝</span>' : ''}
              Special Notes
            </h4>
            <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text}; margin: 0; line-height: 1.5;">${callsheet.specialNotes}</p>
          </div>
        </div>
        ` : ''}

        ${callsheet.schedule.length > 0 && this.customization.sections.visibility.schedule ? 
          this.generateScheduleSection(callsheet.schedule) : ''}
        ${callsheet.cast.length > 0 ? this.generateContactSection('CAST', callsheet.cast, '🎭', 'cast') : ''}
        ${callsheet.crew.length > 0 ? this.generateContactSection('CREW', callsheet.crew, '🎬', 'crew') : ''}
        ${callsheet.emergencyContacts.length > 0 && this.customization.sections.visibility.emergencyContacts ? 
          this.generateContactSection('EMERGENCY CONTACTS', callsheet.emergencyContacts, '⚠️', 'emergency') : ''}

        ${this.customization.branding.footer?.text ? `
        <!-- Footer -->
        <div class="pdf-section" style="
          margin-top: 32px; 
          padding-top: 20px; 
          border-top: 1px solid ${this.customization.colors.border}; 
          text-align: ${this.customization.branding.footer.position}; 
          font-size: ${this.customization.typography.fontSize.small}px; 
          color: ${this.customization.colors.textLight};
        ">
          ${this.customization.branding.footer.text}
        </div>
        ` : ''}
      </div>
    `;
  }

  private generateInfoCard(icon: string, title: string, value: string, subtitle?: string): string {
    const cardStyles = this.getCardStyles();
    return `
      <div class="pdf-info-card" style="
        ${cardStyles} 
        padding: 16px; 
        background-color: ${this.customization.colors.surface};
        border-radius: ${this.customization.visual.cornerRadius}px;
        border: 1px solid ${this.customization.colors.border};
        display: flex;
        align-items: flex-start;
        gap: 8px;
        box-sizing: border-box;
      ">
        ${this.customization.sections.formatting.showSectionIcons ? `<span style="font-size: 18px; flex-shrink: 0;">${icon}</span>` : ''}
        <div style="flex: 1; min-width: 0;">
          <div style="
            font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
            font-size: ${this.customization.typography.fontSize.header}px;
            color: ${this.customization.colors.primary};
            margin-bottom: 6px;
            word-wrap: break-word;
          ">
            ${title}
          </div>
          <div style="font-size: ${this.customization.typography.fontSize.body}px; word-wrap: break-word; margin-bottom: 4px;">${value}</div>
          ${subtitle ? `<div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; word-wrap: break-word;">${subtitle}</div>` : ''}
        </div>
      </div>
    `;
  }

  private generateContactSection(title: string, contacts: any[], icon: string, type: string): string {
    // Use CSS Grid layout to match the preview
    const gridColumns = this.customization.sections.formatting.contactLayout === 'compact' ? 
      'repeat(3, 1fr)' : 'repeat(2, 1fr)';
    
    return `
      <!-- ${title} -->
      <div class="pdf-section pdf-contact-section" style="
        margin-bottom: 24px;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-before: auto;
        page-break-after: auto;
        display: block;
        position: relative;
      ">
        <h3 class="pdf-section-header" style="
          font-size: ${this.customization.typography.fontSize.header + 4}px; 
          font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
          margin-bottom: 16px; 
          color: ${type === 'emergency' && this.customization.sections.formatting.emergencyProminent ? '#dc2626' : this.customization.colors.primary};
          display: flex;
          align-items: center;
          gap: 8px;
          page-break-after: avoid !important;
        ">
          ${this.customization.sections.formatting.showSectionIcons ? `<span style="font-size: 20px;">${icon}</span>` : ''}
          ${title}
        </h3>
        <div class="pdf-contact-grid" style="
          display: grid;
          grid-template-columns: ${gridColumns};
          gap: 16px;
          width: 100%;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        ">
          ${contacts.map(contact => this.generateContactCard(contact, type)).join('')}
        </div>
      </div>
    `;
  }

  private generateContactCard(contact: any, type: string): string {
    const cardStyles = this.getCardStyles();
    const isEmergency = type === 'emergency';
    
    return `
      <div class="pdf-contact-item" style="
        ${cardStyles}
        padding: 18px;
        background-color: ${isEmergency && this.customization.sections.formatting.emergencyProminent ? '#fef2f2' : this.customization.colors.surface};
        border-radius: ${this.customization.visual.cornerRadius}px;
        border: 1px solid ${isEmergency && this.customization.sections.formatting.emergencyProminent ? '#fca5a5' : this.customization.colors.border};
        border-left: 4px solid ${isEmergency && this.customization.sections.formatting.emergencyProminent ? '#dc2626' : this.customization.colors.accent};
        box-sizing: border-box;
        overflow: visible;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-before: auto;
        page-break-after: auto;
        display: block;
        position: relative;
        min-height: 120px;
        margin-bottom: 8px;
      ">
        <div style="
          font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
          font-size: ${this.customization.typography.fontSize.body}px; 
          margin-bottom: 6px;
          color: ${this.customization.colors.text};
          word-wrap: break-word;
        ">${contact.name}</div>
        ${(contact.character || contact.role) ? `<div style="
          font-size: ${this.customization.typography.fontSize.small}px; 
          color: ${this.customization.colors.textLight}; 
          margin-bottom: 10px;
          font-style: italic;
          word-wrap: break-word;
        ">${contact.character ? `as ${contact.character}` : contact.role}</div>` : ''}
        <div style="
          font-size: ${this.customization.typography.fontSize.small}px; 
          margin-bottom: 4px;
          color: ${this.customization.colors.text};
          ${isEmergency ? 'font-weight: 500;' : ''}
          word-wrap: break-word;
        ">${this.renderEmoji('📞')}${contact.phone}</div>
        ${contact.email && !isEmergency ? `<div style="
          font-size: ${this.customization.typography.fontSize.small}px;
          color: ${this.customization.colors.text};
          word-wrap: break-word;
        ">${this.renderEmoji('📧')}${contact.email}</div>` : ''}
      </div>
    `;
  }

  private generateScheduleSection(schedule: any[]): string {
    const cardStyles = this.getCardStyles();
    
    return `
      <!-- Schedule -->
      <div class="pdf-section" style="margin-bottom: 24px;">
        <h3 class="pdf-section-header" style="
          font-size: ${this.customization.typography.fontSize.header + 4}px; 
          font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
          margin-bottom: 16px; 
          color: ${this.customization.colors.primary};
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          ${this.customization.sections.formatting.showSectionIcons ? '<span style="font-size: 20px;">📋</span>' : ''}
          SCHEDULE
        </h3>
        <div class="pdf-schedule-table" style="
          ${cardStyles} 
          background-color: ${this.customization.colors.surface}; 
          overflow: hidden;
          border-radius: ${this.customization.visual.cornerRadius}px;
          border: 1px solid ${this.customization.colors.border};
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        ">
          <div class="pdf-schedule-row pdf-schedule-header" style="
            display: grid;
            grid-template-columns: 80px 100px 1fr 120px 80px;
            gap: 0;
            background-color: ${this.customization.colors.surfaceHover};
            font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)};
            font-size: ${this.customization.typography.fontSize.header}px;
            border-bottom: 2px solid ${this.customization.colors.border};
          ">
            <div style="padding: 16px 12px; border-right: 1px solid ${this.customization.colors.border};">Scene</div>
            <div style="padding: 16px 12px; border-right: 1px solid ${this.customization.colors.border};">Int/Ext</div>
            <div style="padding: 16px 12px; border-right: 1px solid ${this.customization.colors.border};">Description</div>
            <div style="padding: 16px 12px; border-right: 1px solid ${this.customization.colors.border};">Time</div>
            <div style="padding: 16px 12px;">Pages</div>
          </div>
          ${schedule.map((item, index) => `
            <div class="pdf-schedule-row" style="
              display: grid;
              grid-template-columns: 80px 100px 1fr 120px 80px;
              gap: 0;
              background-color: ${this.customization.sections.formatting.alternateRowColors ? 
                (index % 2 === 0 ? this.customization.colors.background : this.customization.colors.surface) : 
                this.customization.colors.background};
              border-bottom: 1px solid ${this.customization.colors.borderLight};
            ">
              <div style="padding: 14px 12px; font-weight: 500; font-size: ${this.customization.typography.fontSize.body}px; border-right: 1px solid ${this.customization.colors.borderLight}; word-wrap: break-word;">${item.sceneNumber}</div>
              <div style="padding: 14px 12px; font-size: ${this.customization.typography.fontSize.body}px; border-right: 1px solid ${this.customization.colors.borderLight}; word-wrap: break-word;">${item.intExt}</div>
              <div style="padding: 14px 12px; font-size: ${this.customization.typography.fontSize.body}px; border-right: 1px solid ${this.customization.colors.borderLight}; word-wrap: break-word;">${item.description}</div>
              <div style="padding: 14px 12px; font-size: ${this.customization.typography.fontSize.body}px; word-wrap: break-word;">${item.estimatedTime}</div>
              <div style="padding: 14px 12px; font-size: ${this.customization.typography.fontSize.body}px; word-wrap: break-word;">${item.pageCount || '-'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    console.log('Generating PDF for callsheet:', callsheet.projectTitle);
    
    try {
      const element = await this.renderPDFContent(callsheet);
      
      console.log('Capturing PDF content as canvas...');
      
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: this.customization.colors.background,
        logging: false,
        width: 794,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      console.log('Canvas captured successfully, dimensions:', canvas.width, 'x', canvas.height);

      const pdf = new jsPDF({
        orientation: this.customization.layout.pageOrientation,
        unit: 'pt',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Apply proper margins - 36pt = 0.5 inches on each side
      const marginX = 36;
      const marginY = 36;
      const contentWidth = pdfWidth - (marginX * 2);
      const contentHeight = pdfHeight - (marginY * 2);

      console.log('PDF dimensions:', pdfWidth, 'x', pdfHeight);
      console.log('Content area:', contentWidth, 'x', contentHeight);

      const imgData = canvas.toDataURL('image/png', 0.95);
      
      // Calculate scaled dimensions to fit within content area
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      if (imgHeight <= contentHeight) {
        // Single page - fits with margins
        pdf.addImage(imgData, 'PNG', marginX, marginY, imgWidth, imgHeight);
      } else {
        // Multi-page with intelligent breaking
        await this.addPagesWithSmartBreaking(pdf, element, canvas, marginX, marginY, contentWidth, contentHeight);
      }

      document.body.removeChild(element);

      const blob = pdf.output('blob');
      console.log('PDF generated successfully, size:', blob.size);
      return blob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async addPagesWithSmartBreaking(
    pdf: jsPDF,
    element: HTMLElement,
    canvas: HTMLCanvasElement,
    marginX: number,
    marginY: number,
    contentWidth: number,
    contentHeight: number
  ): Promise<void> {
    console.log('Creating multi-page PDF with smart breaking');

    // Get all sections and their positions with enhanced priority for contact elements
    const allSections = element.querySelectorAll('.pdf-section');
    const contactSections = element.querySelectorAll('.pdf-contact-section');
    const contactGrids = element.querySelectorAll('.pdf-contact-grid');
    const contactItems = element.querySelectorAll('.pdf-contact-item');
    
    const sectionPositions: Array<{ 
      element: Element; 
      top: number; 
      height: number; 
      isContactSection?: boolean;
      isContactGrid?: boolean;
      isContactItem?: boolean;
      priority: number;
    }> = [];
    
    // Priority system: contact items get highest priority to avoid splitting
    allSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const isContactSection = section.classList.contains('pdf-contact-section');
      
      sectionPositions.push({
        element: section,
        top: rect.top - elementRect.top,
        height: rect.height,
        isContactSection,
        priority: isContactSection ? 4 : 1
      });
    });

    // Add contact grids as very high priority break points
    contactGrids.forEach(grid => {
      const rect = grid.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      sectionPositions.push({
        element: grid,
        top: rect.top - elementRect.top,
        height: rect.height,
        isContactGrid: true,
        priority: 5
      });
    });

    // Add individual contact items as highest priority to prevent splitting
    contactItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      sectionPositions.push({
        element: item,
        top: rect.top - elementRect.top,
        height: rect.height,
        isContactItem: true,
        priority: 6  // Highest priority to prevent card splitting
      });
    });

    // Sort by position to process in order
    sectionPositions.sort((a, b) => a.top - b.top);

    const scaleFactor = contentWidth / canvas.width;
    const scaledContentHeight = contentHeight / scaleFactor;
    
    let currentPageTop = 0;
    let pageNumber = 0;

    while (currentPageTop < canvas.height) {
      if (pageNumber > 0) {
        pdf.addPage();
      }

      // Determine the bottom of this page
      let pageBottom = currentPageTop + scaledContentHeight;
      
      // If this isn't the last page, find a good break point
      if (pageBottom < canvas.height) {
        // Find sections that would be cut by this page break, prioritizing contact elements
        const problematicSections = sectionPositions.filter(section => {
          const sectionTop = section.top;
          const sectionBottom = section.top + section.height;
          
          // Section would be split across page boundary
          return sectionTop < pageBottom && sectionBottom > pageBottom;
        });

        if (problematicSections.length > 0) {
          // Sort by priority (higher number = higher priority to avoid splitting)
          problematicSections.sort((a, b) => b.priority - a.priority);
          
          const highestPrioritySection = problematicSections[0];
          
          // For contact items (highest priority), be very aggressive about keeping them together
          if (highestPrioritySection.isContactItem) {
            // Always move page break to start of the contact item
            const adjustedBreak = highestPrioritySection.top;
            pageBottom = Math.max(currentPageTop + scaledContentHeight * 0.2, adjustedBreak);
          } else if (highestPrioritySection.isContactGrid || highestPrioritySection.isContactSection) {
            // For contact grids and sections, also be aggressive
            const adjustedBreak = highestPrioritySection.top;
            pageBottom = Math.max(currentPageTop + scaledContentHeight * 0.3, adjustedBreak);
          } else {
            // For other sections, use the original logic
            const adjustedBreak = Math.max(currentPageTop + scaledContentHeight * 0.5, highestPrioritySection.top);
            pageBottom = Math.min(adjustedBreak, canvas.height);
          }
        }
      }

      const pageHeight = Math.min(pageBottom - currentPageTop, canvas.height - currentPageTop);
      
      // Create canvas for this page
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageHeight;
      
      const pageCtx = pageCanvas.getContext('2d');
      if (pageCtx) {
        // Fill with background
        pageCtx.fillStyle = this.customization.colors.background;
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        
        // Draw the content for this page
        pageCtx.drawImage(
          canvas,
          0, currentPageTop, canvas.width, pageHeight,
          0, 0, canvas.width, pageHeight
        );
        
        const pageImgData = pageCanvas.toDataURL('image/png', 0.95);
        const scaledPageHeight = pageHeight * scaleFactor;
        
        pdf.addImage(pageImgData, 'PNG', marginX, marginY, contentWidth, scaledPageHeight);
      }

      currentPageTop = pageBottom;
      pageNumber++;
      
      // Safety check to prevent infinite loop
      if (pageNumber > 50) {
        console.warn('Too many pages generated, breaking loop');
        break;
      }
    }
  }

  async savePDF(callsheet: CallsheetData, filename?: string): Promise<void> {
    console.log('Saving PDF for callsheet:', callsheet.projectTitle);
    try {
      const blob = await this.generatePDF(callsheet);
      const fileName = filename || `${(callsheet.projectTitle || 'callsheet').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_callsheet.pdf`;
      
      console.log('Creating download link for:', fileName);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('PDF download initiated successfully');
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw error;
    }
  }

  async previewPDF(callsheet: CallsheetData): Promise<void> {
    console.log('Previewing PDF for callsheet:', callsheet.projectTitle);
    try {
      const blob = await this.generatePDF(callsheet);
      console.log('Opening PDF preview in new window');
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        console.warn('Popup blocked, trying alternative method');
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      }
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
      
      console.log('PDF preview opened successfully');
    } catch (error) {
      console.error('Error previewing PDF:', error);
      throw error;
    }
  }
}

export const generateHTMLToPDF = async (callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}) => {
  const service = new HTMLToPDFService(customization);
  return service.savePDF(callsheet);
};
