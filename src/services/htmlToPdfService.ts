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
    container.style.padding = '48px'; // Increased padding for better margins
    
    // Updated CSS for proper page breaking with better margin handling
    const style = document.createElement('style');
    style.textContent = `
      .pdf-page-content {
        page-break-inside: auto;
        break-inside: auto;
        margin: 0;
        padding: 0;
      }
      
      /* Allow sections to break naturally but keep headers with content */
      .pdf-section {
        margin-bottom: 28px;
        position: relative;
        page-break-inside: auto;
        break-inside: auto;
      }
      
      /* Keep section headers with their first item */
      .pdf-section-header {
        page-break-after: avoid;
        break-after: avoid;
        margin-bottom: 18px;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      /* Protect individual items from breaking internally - this is crucial */
      .pdf-contact-item, .pdf-schedule-row, .pdf-info-card {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 14px;
        position: relative;
        overflow: visible;
        /* Ensure borders and backgrounds are preserved */
        box-decoration-break: slice;
        -webkit-box-decoration-break: slice;
      }
      
      /* Allow grids and containers to break between items */
      .pdf-contact-grid, .pdf-basic-info, .pdf-schedule-table {
        page-break-inside: auto;
        break-inside: auto;
        display: block; /* Change from grid to block for better breaking */
      }
      
      /* Style contact items as blocks instead of grid items */
      .pdf-contact-grid .pdf-contact-item {
        display: block;
        width: 100%;
        margin-bottom: 14px;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Encourage keeping section headers with at least one item */
      .pdf-section-header + .pdf-contact-item:first-of-type,
      .pdf-section-header + .pdf-contact-grid .pdf-contact-item:first-child,
      .pdf-section-header + .pdf-schedule-table .pdf-schedule-row:first-child {
        page-break-before: avoid;
        break-before: avoid;
      }
      
      /* Prevent orphaning of last items */
      .pdf-contact-item:nth-last-child(1) {
        page-break-before: avoid;
        break-before: avoid;
      }
      
      /* Better table handling */
      .pdf-schedule-table {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
        display: table;
      }
      
      .pdf-schedule-row {
        display: table-row;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Keep table header visible when breaking */
      .pdf-schedule-header {
        page-break-after: avoid;
        break-after: avoid;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      /* Improved spacing to reduce white space */
      .pdf-section + .pdf-section {
        margin-top: 24px;
      }
      
      /* Ensure proper margin handling at page boundaries */
      .pdf-page-content > *:first-child {
        margin-top: 0;
      }
      
      .pdf-page-content > *:last-child {
        margin-bottom: 0;
      }
      
      /* Better handling of borders at page breaks */
      .pdf-contact-item {
        border-style: solid;
        border-width: 1px 1px 1px 4px;
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(style);
    
    container.id = 'temp-pdf-content';
    container.className = 'pdf-page-content';
    container.innerHTML = this.generateHTMLContent(callsheet);
    
    document.body.appendChild(container);
    await this.waitForResourcesLoaded(container);
    
    // Clean up style
    document.head.removeChild(style);
    
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
          page-break-inside: avoid;
          break-inside: avoid;
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
          page-break-inside: avoid;
          break-inside: avoid;
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
        <div class="pdf-section" style="margin-bottom: 32px; page-break-inside: avoid; break-inside: avoid;">
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
          page-break-inside: avoid;
          break-inside: avoid;
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
        page-break-inside: avoid;
        break-inside: avoid;
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
    return `
      <!-- ${title} -->
      <div class="pdf-section" style="margin-bottom: 24px;">
        <h3 class="pdf-section-header" style="
          font-size: ${this.customization.typography.fontSize.header + 4}px; 
          font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
          margin-bottom: 16px; 
          color: ${type === 'emergency' && this.customization.sections.formatting.emergencyProminent ? '#dc2626' : this.customization.colors.primary};
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          ${this.customization.sections.formatting.showSectionIcons ? `<span style="font-size: 20px;">${icon}</span>` : ''}
          ${title}
        </h3>
        <div class="pdf-contact-grid">
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
        margin-bottom: 14px;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        box-sizing: border-box;
        overflow: visible;
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
            grid-template-columns: 80px 100px 1fr 120px;
            gap: 0;
            background-color: ${this.customization.colors.surfaceHover};
            font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)};
            font-size: ${this.customization.typography.fontSize.header}px;
            border-bottom: 2px solid ${this.customization.colors.border};
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          ">
            <div style="padding: 16px 12px; border-right: 1px solid ${this.customization.colors.border};">Scene</div>
            <div style="padding: 16px 12px; border-right: 1px solid ${this.customization.colors.border};">Int/Ext</div>
            <div style="padding: 16px 12px; border-right: 1px solid ${this.customization.colors.border};">Description</div>
            <div style="padding: 16px 12px;">Time</div>
          </div>
          ${schedule.map((item, index) => `
            <div class="pdf-schedule-row" style="
              display: grid;
              grid-template-columns: 80px 100px 1fr 120px;
              gap: 0;
              background-color: ${this.customization.sections.formatting.alternateRowColors ? 
                (index % 2 === 0 ? this.customization.colors.background : this.customization.colors.surface) : 
                this.customization.colors.background};
              border-bottom: 1px solid ${this.customization.colors.borderLight};
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            ">
              <div style="padding: 14px 12px; font-weight: 500; font-size: ${this.customization.typography.fontSize.body}px; border-right: 1px solid ${this.customization.colors.borderLight}; word-wrap: break-word;">${item.sceneNumber}</div>
              <div style="padding: 14px 12px; font-size: ${this.customization.typography.fontSize.body}px; border-right: 1px solid ${this.customization.colors.borderLight}; word-wrap: break-word;">${item.intExt}</div>
              <div style="padding: 14px 12px; font-size: ${this.customization.typography.fontSize.body}px; border-right: 1px solid ${this.customization.colors.borderLight}; word-wrap: break-word;">${item.description}</div>
              <div style="padding: 14px 12px; font-size: ${this.customization.typography.fontSize.body}px; word-wrap: break-word;">${item.estimatedTime}</div>
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
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      console.log('PDF dimensions:', pdfWidth, 'x', pdfHeight);
      console.log('Content dimensions:', imgWidth, 'x', imgHeight);

      const imgData = canvas.toDataURL('image/png', 0.95);
      
      if (imgHeight <= pdfHeight) {
        // Single page - simple case
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multi-page - use simpler approach that allows natural breaking
        await this.addPages(pdf, canvas, pdfWidth, pdfHeight);
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

  private async addPages(
    pdf: jsPDF, 
    canvas: HTMLCanvasElement, 
    pdfWidth: number, 
    pdfHeight: number
  ): Promise<void> {
    console.log('Creating multi-page PDF with natural breaking');

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdfHeight;
    
    // Calculate how many pages we need
    const totalPages = Math.ceil(imgHeight / pageHeight);
    console.log('Total pages needed:', totalPages);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      // Calculate the portion of the canvas for this page
      const sourceY = (page * pageHeight * canvas.height) / imgHeight;
      const sourceHeight = Math.min(
        (pageHeight * canvas.height) / imgHeight,
        canvas.height - sourceY
      );

      // Create a canvas for this page section
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      
      const pageCtx = pageCanvas.getContext('2d');
      if (pageCtx) {
        // Fill with background color
        pageCtx.fillStyle = this.customization.colors.background;
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        
        // Draw the portion of the original canvas
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );
        
        const pageImgData = pageCanvas.toDataURL('image/png', 0.95);
        const pageImgHeight = (sourceHeight * pdfWidth) / canvas.width;
        
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageImgHeight);
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
