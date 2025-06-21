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
    container.style.padding = '40px';
    
    // Add CSS for better page breaking
    const style = document.createElement('style');
    style.textContent = `
      .pdf-section {
        page-break-inside: avoid;
        break-inside: avoid;
        margin-bottom: 24px;
      }
      .pdf-contact-item {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .pdf-schedule-item {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .pdf-page-break {
        page-break-before: always;
        break-before: page;
      }
    `;
    document.head.appendChild(style);
    
    container.id = 'temp-pdf-content';
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
        await new Promise(resolve => setTimeout(resolve, 200));
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
    const sectionDividerStyles = this.getSectionDividerStyles();
    const contactLayoutStyles = this.getContactLayoutStyles();
    const contactItemStyles = this.getContactItemStyles();

    return `
      <div class="page-content" style="
        font-family: ${this.getFontFamily()}; 
        font-size: ${this.customization.typography.fontSize.body}px; 
        color: ${this.customization.colors.text}; 
        line-height: ${this.customization.typography.lineHeight.body};
        width: 100%;
        box-sizing: border-box;
      ">
        <!-- Header -->
        <div class="pdf-section header-section" style="
          margin-bottom: 32px; 
          text-align: ${isHeaderCentered ? 'center' : 'left'}; 
          ${headerBackgroundStyles}
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
            margin: 0 0 8px 0; 
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

        <!-- Basic Information -->
        <div class="pdf-section basic-info" style="
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 24px; 
          ${sectionDividerStyles}
        ">
          <div style="${cardStyles} padding: 16px; background-color: ${this.customization.colors.surface};">
            <div style="margin-bottom: 16px;">
              <div style="
                font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
                font-size: ${this.customization.typography.fontSize.header}px;
                color: ${this.customization.colors.primary};
                margin-bottom: 4px;
              ">
                ${this.renderEmoji('📅')}Shoot Date
              </div>
              <div style="font-size: ${this.customization.typography.fontSize.body}px;">${formatDate(callsheet.shootDate)}</div>
            </div>
            <div>
              <div style="
                font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
                font-size: ${this.customization.typography.fontSize.header}px;
                color: ${this.customization.colors.primary};
                margin-bottom: 4px;
              ">
                ${this.renderEmoji('🕐')}Call Time
              </div>
              <div style="font-size: ${this.customization.typography.fontSize.body}px;">${callsheet.generalCallTime}</div>
            </div>
          </div>
          <div style="${cardStyles} padding: 16px; background-color: ${this.customization.colors.surface};">
            <div style="
              font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
              font-size: ${this.customization.typography.fontSize.header}px;
              color: ${this.customization.colors.primary};
              margin-bottom: 4px;
            ">
              ${this.renderEmoji('📍')}Location
            </div>
            <div style="font-size: ${this.customization.typography.fontSize.body}px; margin-bottom: 4px;">${callsheet.location}</div>
            ${callsheet.locationAddress ? `<div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight};">${callsheet.locationAddress}</div>` : ''}
          </div>
        </div>

        ${callsheet.schedule.length > 0 && this.customization.sections.visibility.schedule ? `
        <!-- Schedule -->
        <div class="pdf-section schedule-section" style="${sectionDividerStyles}">
          <h3 style="
            font-size: ${this.customization.typography.fontSize.header + 2}px; 
            font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
            margin-bottom: 16px; 
            color: ${this.customization.colors.primary};
          ">
            ${this.renderEmoji('📋')}SCHEDULE
          </h3>
          <div style="${cardStyles} background-color: ${this.customization.colors.surface}; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: ${this.customization.colors.surfaceHover};">
                  <th style="padding: 12px; text-align: left; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.header}px; border-bottom: 1px solid ${this.customization.colors.border};">Scene</th>
                  <th style="padding: 12px; text-align: left; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.header}px; border-bottom: 1px solid ${this.customization.colors.border};">Int/Ext</th>
                  <th style="padding: 12px; text-align: left; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.header}px; border-bottom: 1px solid ${this.customization.colors.border};">Description</th>
                  <th style="padding: 12px; text-align: left; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.header}px; border-bottom: 1px solid ${this.customization.colors.border};">Time</th>
                </tr>
              </thead>
              <tbody>
                ${callsheet.schedule.map((item, index) => `
                  <tr class="pdf-schedule-item" style="
                    background-color: ${this.customization.sections.formatting.alternateRowColors ? 
                      (index % 2 === 0 ? this.customization.colors.background : this.customization.colors.surface) : 
                      this.customization.colors.background};
                    page-break-inside: avoid;
                  ">
                    <td style="padding: 12px; font-weight: 500; font-size: ${this.customization.typography.fontSize.body}px; border-bottom: 1px solid ${this.customization.colors.borderLight};">${item.sceneNumber}</td>
                    <td style="padding: 12px; font-size: ${this.customization.typography.fontSize.body}px; border-bottom: 1px solid ${this.customization.colors.borderLight};">${item.intExt}</td>
                    <td style="padding: 12px; font-size: ${this.customization.typography.fontSize.body}px; border-bottom: 1px solid ${this.customization.colors.borderLight};">${item.description}</td>
                    <td style="padding: 12px; font-size: ${this.customization.typography.fontSize.body}px; border-bottom: 1px solid ${this.customization.colors.borderLight};">${item.estimatedTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}

        ${callsheet.cast.length > 0 ? `
        <!-- Cast -->
        <div class="pdf-section cast-section" style="${sectionDividerStyles}">
          <h3 style="
            font-size: ${this.customization.typography.fontSize.header + 2}px; 
            font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
            margin-bottom: 16px; 
            color: ${this.customization.colors.primary};
          ">
            ${this.renderEmoji('🎭')}CAST
          </h3>
          <div style="${contactLayoutStyles}">
            ${callsheet.cast.map(member => `
              <div class="pdf-contact-item" style="${contactItemStyles}">
                <div style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.body}px; margin-bottom: 4px;">${member.name}</div>
                ${member.character ? `<div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; margin-bottom: 6px;">as ${member.character}</div>` : ''}
                <div style="font-size: ${this.customization.typography.fontSize.small}px; margin-bottom: 2px;">${this.renderEmoji('📞')}${member.phone}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px;">${this.renderEmoji('📧')}${member.email}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${callsheet.crew.length > 0 ? `
        <!-- Crew -->
        <div class="pdf-section crew-section" style="${sectionDividerStyles}">
          <h3 style="
            font-size: ${this.customization.typography.fontSize.header + 2}px; 
            font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
            margin-bottom: 16px; 
            color: ${this.customization.colors.primary};
          ">
            ${this.renderEmoji('🎬')}CREW
          </h3>
          <div style="${contactLayoutStyles}">
            ${callsheet.crew.map(member => `
              <div class="pdf-contact-item" style="${contactItemStyles}">
                <div style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.body}px; margin-bottom: 4px;">${member.name}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; margin-bottom: 6px;">${member.role}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; margin-bottom: 2px;">${this.renderEmoji('📞')}${member.phone}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px;">${this.renderEmoji('📧')}${member.email}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${callsheet.emergencyContacts.length > 0 && this.customization.sections.visibility.emergencyContacts ? `
        <!-- Emergency Contacts -->
        <div class="pdf-section emergency-section" style="${sectionDividerStyles}">
          <h3 style="
            font-size: ${this.customization.typography.fontSize.header + 2}px; 
            font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
            margin-bottom: 16px; 
            color: ${this.customization.sections.formatting.emergencyProminent ? '#dc2626' : this.customization.colors.primary};
          ">
            ${this.renderEmoji('⚠️')}EMERGENCY CONTACTS
          </h3>
          <div style="${contactLayoutStyles}">
            ${callsheet.emergencyContacts.map(contact => `
              <div class="pdf-contact-item" style="${contactItemStyles} ${this.customization.sections.formatting.emergencyProminent ? 
                `border: 2px solid #fca5a5; background-color: #fef2f2;` : 
                `border: 1px solid ${this.customization.colors.border};`}">
                <div style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.body}px; margin-bottom: 4px;">${contact.name}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; margin-bottom: 6px;">${contact.role}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; font-weight: 500;">${this.renderEmoji('📞')}${contact.phone}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Additional Information -->
        <div class="pdf-section additional-info">
          ${callsheet.parkingInstructions ? `
            <div class="pdf-section" style="margin-bottom: 16px; ${cardStyles} padding: 16px; background-color: ${this.customization.colors.surface};">
              <h4 style="
                font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
                margin-bottom: 8px; 
                font-size: ${this.customization.typography.fontSize.header}px;
                color: ${this.customization.colors.primary};
              ">
                ${this.renderEmoji('🅿️')}Parking Instructions
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text}; margin: 0;">${callsheet.parkingInstructions}</p>
            </div>
          ` : ''}
          
          ${callsheet.basecampLocation ? `
            <div class="pdf-section" style="margin-bottom: 16px; ${cardStyles} padding: 16px; background-color: ${this.customization.colors.surface};">
              <h4 style="
                font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
                margin-bottom: 8px; 
                font-size: ${this.customization.typography.fontSize.header}px;
                color: ${this.customization.colors.primary};
              ">
                ${this.renderEmoji('🏕️')}Basecamp Location
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text}; margin: 0;">${callsheet.basecampLocation}</p>
            </div>
          ` : ''}
          
          ${callsheet.weather && this.customization.sections.visibility.weather ? `
            <div class="pdf-section" style="margin-bottom: 16px; ${cardStyles} padding: 16px; background-color: ${this.customization.colors.surface};">
              <h4 style="
                font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
                margin-bottom: 8px; 
                font-size: ${this.customization.typography.fontSize.header}px;
                color: ${this.customization.colors.primary};
              ">
                ${this.renderEmoji('🌤️')}Weather
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text}; margin: 0;">${callsheet.weather}</p>
            </div>
          ` : ''}
          
          ${callsheet.specialNotes && this.customization.sections.visibility.notes ? `
            <div class="pdf-section" style="margin-bottom: 16px; ${cardStyles} padding: 16px; background-color: ${this.customization.colors.surface};">
              <h4 style="
                font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; 
                margin-bottom: 8px; 
                font-size: ${this.customization.typography.fontSize.header}px;
                color: ${this.customization.colors.primary};
              ">
                ${this.renderEmoji('📝')}Special Notes
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text}; margin: 0;">${callsheet.specialNotes}</p>
            </div>
          ` : ''}
        </div>

        ${this.customization.branding.footer?.text ? `
        <!-- Footer -->
        <div class="pdf-section" style="
          margin-top: 32px; 
          padding-top: 16px; 
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
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Better multi-page handling with consistent spacing
        let remainingHeight = imgHeight;
        let yPosition = 0;
        let pageNumber = 0;
        
        while (remainingHeight > 0) {
          if (pageNumber > 0) {
            pdf.addPage();
          }
          
          const currentPageHeight = Math.min(pdfHeight, remainingHeight);
          const sourceY = pageNumber * pdfHeight * (canvas.height / imgHeight);
          
          // Create a temporary canvas for this page section
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(canvas.height - sourceY, pdfHeight * (canvas.height / imgHeight));
          
          const pageCtx = pageCanvas.getContext('2d');
          if (pageCtx) {
            pageCtx.drawImage(
              canvas,
              0, sourceY, canvas.width, pageCanvas.height,
              0, 0, canvas.width, pageCanvas.height
            );
            
            const pageImgData = pageCanvas.toDataURL('image/png', 0.95);
            const pageImgHeight = (pageCanvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, pageImgHeight);
          }
          
          remainingHeight -= currentPageHeight;
          pageNumber++;
        }
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
