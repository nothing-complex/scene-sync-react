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
    switch (fontFamily) {
      case 'inter':
        return '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      case 'helvetica':
        return '"Helvetica Neue", Helvetica, Arial, sans-serif';
      case 'poppins':
        return '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      case 'montserrat':
        return '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      default:
        return '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    }
  }

  private getCardStyles(): string {
    const { cardStyle, cornerRadius, shadowIntensity } = this.customization.visual;
    
    let styles = `border-radius: ${cornerRadius}px;`;
    
    switch (cardStyle) {
      case 'elevated':
        if (shadowIntensity === 'subtle') {
          styles += 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);';
        } else if (shadowIntensity === 'medium') {
          styles += 'box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
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
    
    switch (headerBackground) {
      case 'subtle':
        return `background-color: ${this.customization.colors.surface}; padding: 24px; margin: -32px -32px 32px -32px;`;
      case 'solid':
        return `background-color: ${this.customization.colors.primary}; color: ${this.customization.colors.background}; padding: 24px; margin: -32px -32px 32px -32px;`;
      case 'gradient':
        if (this.customization.colors.gradient) {
          const { from, to, direction } = this.customization.colors.gradient;
          const gradientDirection = direction === 'to-r' ? 'to right' :
                                  direction === 'to-br' ? 'to bottom right' : 'to bottom';
          return `background: linear-gradient(${gradientDirection}, ${from}, ${to}); color: ${this.customization.colors.background}; padding: 24px; margin: -32px -32px 32px -32px;`;
        }
        return '';
      default:
        return '';
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
        return 'display: table; width: 100%; border-collapse: collapse;';
      case 'cards':
        return 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;';
      case 'compact':
        return 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;';
      case 'list':
      default:
        return 'display: flex; flex-direction: column; gap: 12px;';
    }
  }

  private getContactItemStyles(): string {
    const { contactLayout } = this.customization.sections.formatting;
    
    switch (contactLayout) {
      case 'table':
        return 'display: table-row; border-bottom: 1px solid ' + this.customization.colors.border + ';';
      case 'cards':
      case 'compact':
        return this.getCardStyles() + ' padding: 12px; border: 1px solid ' + this.customization.colors.border + ';';
      case 'list':
      default:
        return this.getCardStyles() + ' padding: 12px; border: 1px solid ' + this.customization.colors.border + ';';
    }
  }

  private renderEmoji(emoji: string): string {
    return this.customization.sections.formatting.showSectionIcons ? emoji : '';
  }

  private async renderPDFContent(callsheet: CallsheetData): Promise<HTMLElement> {
    console.log('Rendering PDF content for:', callsheet.projectTitle);
    
    // Create a temporary container with proper page dimensions and margins
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    
    // Set proper page dimensions with consistent margins
    const pageWidth = this.customization.layout.pageOrientation === 'landscape' ? '11in' : '8.5in';
    const pageHeight = this.customization.layout.pageOrientation === 'landscape' ? '8.5in' : '11in';
    const marginSize = `${this.customization.layout.margins.top}px`;
    
    container.style.width = pageWidth;
    container.style.minHeight = pageHeight;
    container.style.backgroundColor = this.customization.colors.background;
    container.style.color = this.customization.colors.text;
    container.style.padding = marginSize;
    container.style.boxSizing = 'border-box';
    container.style.fontFamily = this.getFontFamily();
    container.style.fontSize = `${this.customization.typography.fontSize.body}px`;
    container.style.lineHeight = this.customization.typography.lineHeight.body.toString();
    container.id = 'temp-pdf-content';
    
    // Add CSS for page breaks and consistent margins across all pages
    const style = document.createElement('style');
    style.textContent = `
      #temp-pdf-content {
        page-break-inside: avoid;
      }
      #temp-pdf-content .page-break {
        page-break-before: always;
        margin-top: ${marginSize};
        padding-top: ${marginSize};
      }
      #temp-pdf-content .section-break {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      @media print {
        #temp-pdf-content {
          margin: ${marginSize};
          padding: ${marginSize};
        }
        #temp-pdf-content .page-content {
          margin-top: ${marginSize};
          margin-bottom: ${marginSize};
        }
      }
    `;
    document.head.appendChild(style);
    
    // Generate the HTML content
    container.innerHTML = this.generateHTMLContent(callsheet);
    
    // Append to body temporarily
    document.body.appendChild(container);
    
    // Wait for images to load
    const images = container.querySelectorAll('img');
    if (images.length > 0) {
      await Promise.all(
        Array.from(images).map(img => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            }
          });
        })
      );
    }
    
    return container;
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
    const isHeaderWithBackground = headerBackgroundStyles.includes('background');

    // Fix professional theme title color issue
    const getTitleColor = () => {
      if (this.customization.theme.name === 'Professional' && isHeaderWithBackground) {
        return this.customization.colors.background; // Use background color (white) for better contrast
      }
      return isHeaderWithBackground ? this.customization.colors.background : this.customization.colors.primary;
    };

    const getSubtitleColor = () => {
      if (this.customization.theme.name === 'Professional' && isHeaderWithBackground) {
        return this.customization.colors.background; // Use background color (white) for better contrast
      }
      return isHeaderWithBackground ? this.customization.colors.background : this.customization.colors.secondary;
    };

    return `
      <div class="page-content" style="font-family: ${this.getFontFamily()}; font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text}; line-height: ${this.customization.typography.lineHeight.body};">
        <!-- Header -->
        <div class="section-break" style="margin-bottom: 32px; text-align: ${isHeaderCentered ? 'center' : 'left'}; ${headerBackgroundStyles}">
          ${this.customization.branding.logo ? `
            <div style="margin-bottom: 16px;">
              <img src="${typeof this.customization.branding.logo === 'string' ? this.customization.branding.logo : this.customization.branding.logo.url}" 
                   alt="Company Logo" 
                   style="height: ${this.customization.branding.logo && typeof this.customization.branding.logo === 'object' ? 
                     this.customization.branding.logo.size === 'small' ? '48px' :
                     this.customization.branding.logo.size === 'large' ? '80px' : '64px'
                   : '64px'}; width: auto; ${isHeaderCentered ? 'display: block; margin: 0 auto;' : 'display: inline-block;'}" />
            </div>
          ` : ''}
          <h1 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.title)}; margin-bottom: 8px; color: ${getTitleColor()}; line-height: ${this.customization.typography.lineHeight.title};">
            ${callsheet.projectTitle}
          </h1>
          <h2 style="font-size: ${this.customization.typography.fontSize.header}px; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; color: ${getSubtitleColor()}; line-height: ${this.customization.typography.lineHeight.header};">
            CALL SHEET
          </h2>
        </div>

        <!-- Basic Information -->
        <div class="section-break" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; ${sectionDividerStyles}">
          <div>
            <div style="display: flex; align-items: center; margin-bottom: 16px; ${cardStyles} padding: 12px;">
              <div style="margin-right: 8px;">${this.renderEmoji('📅')}</div>
              <div>
                <div style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.header}px;">Shoot Date</div>
                <div style="font-size: ${this.customization.typography.fontSize.body}px;">${formatDate(callsheet.shootDate)}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; ${cardStyles} padding: 12px;">
              <div style="margin-right: 8px;">${this.renderEmoji('🕐')}</div>
              <div>
                <div style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.header}px;">General Call Time</div>
                <div style="font-size: ${this.customization.typography.fontSize.body}px;">${callsheet.generalCallTime}</div>
              </div>
            </div>
          </div>
          <div>
            <div style="display: flex; align-items: center; ${cardStyles} padding: 12px;">
              <div style="margin-right: 8px;">${this.renderEmoji('📍')}</div>
              <div>
                <div style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.header}px;">Location</div>
                <div style="font-size: ${this.customization.typography.fontSize.body}px;">${callsheet.location}</div>
                ${callsheet.locationAddress ? `<div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight};">${callsheet.locationAddress}</div>` : ''}
              </div>
            </div>
          </div>
        </div>

        ${callsheet.schedule.length > 0 && this.customization.sections.visibility.schedule ? `
        <!-- Schedule -->
        <div class="section-break" style="${sectionDividerStyles}">
          <h3 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.title)}; margin-bottom: 16px; color: ${this.customization.colors.primary}; display: flex; align-items: center;">
            <span style="margin-right: 8px;">${this.renderEmoji('📋')}</span>
            SCHEDULE
          </h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid ${this.customization.colors.border}; ${cardStyles}">
            <thead>
              <tr style="background-color: ${this.customization.colors.surface};">
                <th style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Scene</th>
                <th style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Int/Ext</th>
                <th style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Description</th>
                <th style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Location</th>
                <th style="padding: 8px; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Time</th>
              </tr>
            </thead>
            <tbody>
              ${callsheet.schedule.map((item, index) => `
                <tr style="background-color: ${this.customization.sections.formatting.alternateRowColors ? 
                  (index % 2 === 0 ? this.customization.colors.background : this.customization.colors.surface) : 
                  this.customization.colors.background};">
                  <td style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-weight: 500; font-size: ${this.customization.typography.fontSize.body}px;">${item.sceneNumber}</td>
                  <td style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-size: ${this.customization.typography.fontSize.body}px;">${item.intExt}</td>
                  <td style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-size: ${this.customization.typography.fontSize.body}px;">${item.description}</td>
                  <td style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-size: ${this.customization.typography.fontSize.body}px;">${item.location}</td>
                  <td style="padding: 8px; font-size: ${this.customization.typography.fontSize.body}px;">${item.estimatedTime}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${callsheet.cast.length > 0 ? `
        <!-- Cast -->
        <div class="section-break" style="${sectionDividerStyles}">
          <h3 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.title)}; margin-bottom: 16px; color: ${this.customization.colors.primary}; display: flex; align-items: center;">
            <span style="margin-right: 8px;">${this.renderEmoji('🎭')}</span>
            CAST
          </h3>
          <div style="${contactLayoutStyles}">
            ${callsheet.cast.map(member => `
              <div style="${contactItemStyles}">
                <div style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.body}px;">${member.name}</div>
                ${member.character ? `<div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; margin-bottom: 4px;">as ${member.character}</div>` : ''}
                <div style="font-size: ${this.customization.typography.fontSize.small}px; margin-bottom: 4px;">${this.renderEmoji('📞 ')}${member.phone}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px;">${this.renderEmoji('📧 ')}${member.email}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${callsheet.crew.length > 0 ? `
        <!-- Crew -->
        <div class="section-break" style="${sectionDividerStyles}">
          <h3 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.title)}; margin-bottom: 16px; color: ${this.customization.colors.primary}; display: flex; align-items: center;">
            <span style="margin-right: 8px;">${this.renderEmoji('🎬')}</span>
            CREW
          </h3>
          <div style="${contactLayoutStyles}">
            ${callsheet.crew.map(member => `
              <div style="${contactItemStyles}">
                <div style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.body}px;">${member.name}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; margin-bottom: 4px;">${member.role}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; margin-bottom: 4px;">${this.renderEmoji('📞 ')}${member.phone}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px;">${this.renderEmoji('📧 ')}${member.email}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${callsheet.emergencyContacts.length > 0 && this.customization.sections.visibility.emergencyContacts ? `
        <!-- Emergency Contacts -->
        <div class="section-break" style="${sectionDividerStyles}">
          <h3 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.title)}; margin-bottom: 16px; color: ${this.customization.sections.formatting.emergencyProminent ? '#dc2626' : this.customization.colors.primary}; display: flex; align-items: center;">
            <span style="margin-right: 8px;">${this.renderEmoji('⚠️')}</span>
            EMERGENCY CONTACTS
          </h3>
          <div style="${contactLayoutStyles}">
            ${callsheet.emergencyContacts.map(contact => `
              <div style="${contactItemStyles} border: ${this.customization.sections.formatting.emergencyProminent ? '2px solid #fca5a5' : `1px solid ${this.customization.colors.border}`}; background-color: ${this.customization.sections.formatting.emergencyProminent ? '#fef2f2' : this.customization.colors.surface};">
                <div style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; font-size: ${this.customization.typography.fontSize.body}px;">${contact.name}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; margin-bottom: 4px;">${contact.role}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; font-weight: 500;">${this.renderEmoji('📞 ')}${contact.phone}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Additional Information -->
        <div class="section-break">
          ${callsheet.parkingInstructions ? `
            <div style="margin-bottom: 16px; ${cardStyles} padding: 12px;">
              <h4 style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; margin-bottom: 8px; font-size: ${this.customization.typography.fontSize.header}px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">${this.renderEmoji('🅿️')}</span>
                Parking Instructions
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text};">${callsheet.parkingInstructions}</p>
            </div>
          ` : ''}
          
          ${callsheet.basecampLocation ? `
            <div style="margin-bottom: 16px; ${cardStyles} padding: 12px;">
              <h4 style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; margin-bottom: 8px; font-size: ${this.customization.typography.fontSize.header}px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">${this.renderEmoji('🏕️')}</span>
                Basecamp Location
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text};">${callsheet.basecampLocation}</p>
            </div>
          ` : ''}
          
          ${callsheet.weather && this.customization.sections.visibility.weather ? `
            <div style="margin-bottom: 16px; ${cardStyles} padding: 12px;">
              <h4 style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; margin-bottom: 8px; font-size: ${this.customization.typography.fontSize.header}px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">${this.renderEmoji('🌤️')}</span>
                Weather
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text};">${callsheet.weather}</p>
            </div>
          ` : ''}
          
          ${callsheet.specialNotes && this.customization.sections.visibility.notes ? `
            <div style="margin-bottom: 16px; ${cardStyles} padding: 12px;">
              <h4 style="font-weight: ${this.getFontWeight(this.customization.typography.fontWeight.header)}; margin-bottom: 8px; font-size: ${this.customization.typography.fontSize.header}px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">${this.renderEmoji('📝')}</span>
                Special Notes
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text};">${callsheet.specialNotes}</p>
            </div>
          ` : ''}
        </div>

        ${this.customization.branding.footer?.text ? `
        <!-- Footer -->
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid ${this.customization.colors.border}; text-align: ${this.customization.branding.footer.position}; font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight};">
          ${this.customization.branding.footer.text}
        </div>
        ` : ''}
      </div>
    `;
  }

  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    console.log('Generating PDF for callsheet:', callsheet.projectTitle);
    
    try {
      // Render the PDF content
      const element = await this.renderPDFContent(callsheet);
      
      console.log('Capturing PDF content as canvas...');
      
      // Configure html2canvas options for better quality and consistent margins
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: this.customization.colors.background,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      console.log('Canvas captured successfully');

      // Create PDF with proper dimensions and margins
      const pdf = new jsPDF({
        orientation: this.customization.layout.pageOrientation,
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit the page with proper margins
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // Increased margin to 15mm for better spacing
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);
      
      const canvasAspectRatio = canvas.height / canvas.width;
      let imgWidth = contentWidth;
      let imgHeight = contentWidth * canvasAspectRatio;

      // If the image is taller than the available content area, split into pages
      if (imgHeight > contentHeight) {
        const pages = Math.ceil(imgHeight / contentHeight);
        const pageContentHeight = contentHeight; // Use full content height per page
        
        for (let i = 0; i < pages; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          // Calculate the portion of the canvas for this page
          const sourceY = (canvas.height * i * contentHeight) / imgHeight;
          const sourceHeight = Math.min(canvas.height * contentHeight / imgHeight, canvas.height - sourceY);
          
          // Create a canvas for this page section
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          
          if (pageCtx) {
            pageCanvas.width = canvas.width;
            pageCanvas.height = sourceHeight;
            
            // Fill with background color first
            pageCtx.fillStyle = this.customization.colors.background;
            pageCtx.fillRect(0, 0, canvas.width, sourceHeight);
            
            // Draw the content section
            pageCtx.drawImage(
              canvas,
              0, sourceY, canvas.width, sourceHeight,
              0, 0, canvas.width, sourceHeight
            );
            
            const pageImgData = pageCanvas.toDataURL('image/png');
            // Add image with proper margins - use pageContentHeight for consistent spacing
            pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, pageContentHeight);
          }
        }
      } else {
        // Single page with margins
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      }

      // Clean up the temporary element
      const tempElement = document.getElementById('temp-pdf-content');
      if (tempElement) {
        document.body.removeChild(tempElement);
      }

      // Clean up the style element
      const styleElements = document.querySelectorAll('style');
      styleElements.forEach(style => {
        if (style.textContent?.includes('#temp-pdf-content')) {
          document.head.removeChild(style);
        }
      });

      const blob = pdf.output('blob');
      console.log('PDF generated successfully');
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
      
      // Clean up the URL after a short delay
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
      
      // Clean up the URL after a delay to allow the browser to load it
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

// Helper function for direct PDF generation
export const generateHTMLToPDF = async (callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}) => {
  const service = new HTMLToPDFService(customization);
  return service.savePDF(callsheet);
};
