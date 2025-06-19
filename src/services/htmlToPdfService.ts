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
    const { cardStyle } = this.customization.visual;
    const { cornerRadius, shadowIntensity } = this.customization.visual;
    
    let styles = `border-radius: ${cornerRadius}px;`;
    
    switch (cardStyle) {
      case 'elevated':
        styles += shadowIntensity === 'subtle' ? 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);' :
                 shadowIntensity === 'medium' ? 'box-shadow: 0 4px 6px rgba(0,0,0,0.1);' : '';
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

  private async renderPDFContent(callsheet: CallsheetData): Promise<HTMLElement> {
    console.log('Rendering PDF content for:', callsheet.projectTitle);
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '8.5in';
    container.style.minHeight = '11in';
    container.style.backgroundColor = this.customization.colors.background;
    container.style.color = this.customization.colors.text;
    container.style.padding = `${this.customization.layout.margins.top}px`;
    container.style.fontFamily = this.getFontFamily();
    container.style.fontSize = `${this.customization.typography.fontSize.body}px`;
    container.style.lineHeight = this.customization.typography.lineHeight.body.toString();
    container.id = 'temp-pdf-content';
    
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

    return `
      <div style="font-family: ${this.getFontFamily()}; font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text}; line-height: ${this.customization.typography.lineHeight.body};">
        <!-- Header -->
        <div style="margin-bottom: 32px; text-align: ${isHeaderCentered ? 'center' : 'left'}; ${headerBackgroundStyles}">
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
          <h1 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.customization.typography.fontWeight.title === 'normal' ? '400' : this.customization.typography.fontWeight.title === 'medium' ? '500' : this.customization.typography.fontWeight.title === 'semibold' ? '600' : '700'}; margin-bottom: 8px; color: ${headerBackgroundStyles.includes('gradient') || headerBackgroundStyles.includes('solid') ? this.customization.colors.background : this.customization.colors.primary}; line-height: ${this.customization.typography.lineHeight.title};">
            ${callsheet.projectTitle}
          </h1>
          <h2 style="font-size: ${this.customization.typography.fontSize.header}px; font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; color: ${headerBackgroundStyles.includes('gradient') || headerBackgroundStyles.includes('solid') ? this.customization.colors.background : this.customization.colors.secondary}; line-height: ${this.customization.typography.lineHeight.header};">
            CALL SHEET
          </h2>
        </div>

        <!-- Basic Information -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; ${sectionDividerStyles}">
          <div>
            <div style="display: flex; align-items: center; margin-bottom: 16px; ${cardStyles} padding: 12px;">
              ${this.customization.sections.formatting.showSectionIcons ? '<div style="margin-right: 8px;">📅</div>' : ''}
              <div>
                <div style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; font-size: ${this.customization.typography.fontSize.header}px;">Shoot Date</div>
                <div style="font-size: ${this.customization.typography.fontSize.body}px;">${formatDate(callsheet.shootDate)}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; ${cardStyles} padding: 12px;">
              ${this.customization.sections.formatting.showSectionIcons ? '<div style="margin-right: 8px;">🕐</div>' : ''}
              <div>
                <div style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; font-size: ${this.customization.typography.fontSize.header}px;">General Call Time</div>
                <div style="font-size: ${this.customization.typography.fontSize.body}px;">${callsheet.generalCallTime}</div>
              </div>
            </div>
          </div>
          <div>
            <div style="display: flex; align-items: center; ${cardStyles} padding: 12px;">
              ${this.customization.sections.formatting.showSectionIcons ? '<div style="margin-right: 8px;">📍</div>' : ''}
              <div>
                <div style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; font-size: ${this.customization.typography.fontSize.header}px;">Location</div>
                <div style="font-size: ${this.customization.typography.fontSize.body}px;">${callsheet.location}</div>
                ${callsheet.locationAddress ? `<div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight};">${callsheet.locationAddress}</div>` : ''}
              </div>
            </div>
          </div>
        </div>

        ${callsheet.schedule.length > 0 && this.customization.sections.visibility.schedule ? `
        <!-- Schedule -->
        <div style="${sectionDividerStyles}">
          <h3 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.customization.typography.fontWeight.title === 'normal' ? '400' : this.customization.typography.fontWeight.title === 'medium' ? '500' : this.customization.typography.fontWeight.title === 'semibold' ? '600' : '700'}; margin-bottom: 16px; color: ${this.customization.colors.primary}; ${this.customization.sections.formatting.showSectionIcons ? 'display: flex; align-items: center;' : ''}">
            ${this.customization.sections.formatting.showSectionIcons ? '<span style="margin-right: 8px;">📋</span>' : ''}
            SCHEDULE
          </h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid ${this.customization.colors.border}; ${cardStyles}">
            <thead>
              <tr style="background-color: ${this.customization.colors.surface};">
                <th style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Scene</th>
                <th style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Int/Ext</th>
                <th style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Description</th>
                <th style="padding: 8px; border-right: 1px solid ${this.customization.colors.border}; font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' : '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Location</th>
                <th style="padding: 8px; font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; text-align: left; font-size: ${this.customization.typography.fontSize.header}px;">Time</th>
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
        <div style="${sectionDividerStyles}">
          <h3 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.customization.typography.fontWeight.title === 'normal' ? '400' : this.customization.typography.fontWeight.title === 'medium' ? '500' : this.customization.typography.fontWeight.title === 'semibold' ? '600' : '700'}; margin-bottom: 16px; color: ${this.customization.colors.primary}; ${this.customization.sections.formatting.showSectionIcons ? 'display: flex; align-items: center;' : ''}">
            ${this.customization.sections.formatting.showSectionIcons ? '<span style="margin-right: 8px;">🎭</span>' : ''}
            CAST
          </h3>
          <div style="display: grid; grid-template-columns: ${this.customization.sections.formatting.contactLayout === 'compact' ? '1fr 1fr 1fr' : '1fr 1fr'}; gap: 16px;">
            ${callsheet.cast.map(member => `
              <div style="${cardStyles} padding: 12px; border: 1px solid ${this.customization.colors.border};">
                <div style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; font-size: ${this.customization.typography.fontSize.body}px;">${member.name}</div>
                ${member.character ? `<div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; margin-bottom: 4px;">as ${member.character}</div>` : ''}
                <div style="font-size: ${this.customization.typography.fontSize.small}px; margin-bottom: 4px;">${this.customization.sections.formatting.showSectionIcons ? '📞 ' : ''}${member.phone}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px;">${this.customization.sections.formatting.showSectionIcons ? '📧 ' : ''}${member.email}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${callsheet.crew.length > 0 ? `
        <!-- Crew -->
        <div style="${sectionDividerStyles}">
          <h3 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.customization.typography.fontWeight.title === 'normal' ? '400' : this.customization.typography.fontWeight.title === 'medium' ? '500' : this.customization.typography.fontWeight.title === 'semibold' ? '600' : '700'}; margin-bottom: 16px; color: ${this.customization.colors.primary}; ${this.customization.sections.formatting.showSectionIcons ? 'display: flex; align-items: center;' : ''}">
            ${this.customization.sections.formatting.showSectionIcons ? '<span style="margin-right: 8px;">🎬</span>' : ''}
            CREW
          </h3>
          <div style="display: grid; grid-template-columns: ${this.customization.sections.formatting.contactLayout === 'compact' ? '1fr 1fr 1fr' : '1fr 1fr'}; gap: 16px;">
            ${callsheet.crew.map(member => `
              <div style="${cardStyles} padding: 12px; border: 1px solid ${this.customization.colors.border};">
                <div style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; font-size: ${this.customization.typography.fontSize.body}px;">${member.name}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; margin-bottom: 4px;">${member.role}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; margin-bottom: 4px;">${this.customization.sections.formatting.showSectionIcons ? '📞 ' : ''}${member.phone}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px;">${this.customization.sections.formatting.showSectionIcons ? '📧 ' : ''}${member.email}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${callsheet.emergencyContacts.length > 0 && this.customization.sections.visibility.emergencyContacts ? `
        <!-- Emergency Contacts -->
        <div style="${sectionDividerStyles}">
          <h3 style="font-size: ${this.customization.typography.fontSize.title}px; font-weight: ${this.customization.typography.fontWeight.title === 'normal' ? '400' : this.customization.typography.fontWeight.title === 'medium' ? '500' : this.customization.typography.fontWeight.title === 'semibold' ? '600' : '700'}; margin-bottom: 16px; color: ${this.customization.sections.formatting.emergencyProminent ? '#dc2626' : this.customization.colors.primary}; ${this.customization.sections.formatting.showSectionIcons ? 'display: flex; align-items: center;' : ''}">
            ${this.customization.sections.formatting.showSectionIcons ? '<span style="margin-right: 8px;">⚠️</span>' : ''}
            EMERGENCY CONTACTS
          </h3>
          <div style="display: grid; grid-template-columns: ${this.customization.sections.formatting.contactLayout === 'compact' ? '1fr 1fr 1fr' : '1fr 1fr'}; gap: 16px;">
            ${callsheet.emergencyContacts.map(contact => `
              <div style="${cardStyles} padding: 12px; border: ${this.customization.sections.formatting.emergencyProminent ? '2px solid #fca5a5' : `1px solid ${this.customization.colors.border}`}; background-color: ${this.customization.sections.formatting.emergencyProminent ? '#fef2f2' : this.customization.colors.surface};">
                <div style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; font-size: ${this.customization.typography.fontSize.body}px;">${contact.name}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; color: ${this.customization.colors.textLight}; margin-bottom: 4px;">${contact.role}</div>
                <div style="font-size: ${this.customization.typography.fontSize.small}px; font-weight: 500;">${this.customization.sections.formatting.showSectionIcons ? '📞 ' : ''}${contact.phone}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Additional Information -->
        <div>
          ${callsheet.parkingInstructions ? `
            <div style="margin-bottom: 16px; ${cardStyles} padding: 12px;">
              <h4 style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; margin-bottom: 8px; font-size: ${this.customization.typography.fontSize.header}px; ${this.customization.sections.formatting.showSectionIcons ? 'display: flex; align-items: center;' : ''}">
                ${this.customization.sections.formatting.showSectionIcons ? '<span style="margin-right: 8px;">🅿️</span>' : ''}
                Parking Instructions
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text};">${callsheet.parkingInstructions}</p>
            </div>
          ` : ''}
          
          ${callsheet.basecampLocation ? `
            <div style="margin-bottom: 16px; ${cardStyles} padding: 12px;">
              <h4 style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; margin-bottom: 8px; font-size: ${this.customization.typography.fontSize.header}px; ${this.customization.sections.formatting.showSectionIcons ? 'display: flex; align-items: center;' : ''}">
                ${this.customization.sections.formatting.showSectionIcons ? '<span style="margin-right: 8px;">🏕️</span>' : ''}
                Basecamp Location
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text};">${callsheet.basecampLocation}</p>
            </div>
          ` : ''}
          
          ${callsheet.weather && this.customization.sections.visibility.weather ? `
            <div style="margin-bottom: 16px; ${cardStyles} padding: 12px;">
              <h4 style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; margin-bottom: 8px; font-size: ${this.customization.typography.fontSize.header}px; ${this.customization.sections.formatting.showSectionIcons ? 'display: flex; align-items: center;' : ''}">
                ${this.customization.sections.formatting.showSectionIcons ? '<span style="margin-right: 8px;">🌤️</span>' : ''}
                Weather
              </h4>
              <p style="font-size: ${this.customization.typography.fontSize.body}px; color: ${this.customization.colors.text};">${callsheet.weather}</p>
            </div>
          ` : ''}
          
          ${callsheet.specialNotes && this.customization.sections.visibility.notes ? `
            <div style="margin-bottom: 16px; ${cardStyles} padding: 12px;">
              <h4 style="font-weight: ${this.customization.typography.fontWeight.header === 'normal' ? '400' : this.customization.typography.fontWeight.header === 'medium' ? '500' : this.customization.typography.fontWeight.header === 'semibold' ? '600' : '700'}; margin-bottom: 8px; font-size: ${this.customization.typography.fontSize.header}px; ${this.customization.sections.formatting.showSectionIcons ? 'display: flex; align-items: center;' : ''}">
                ${this.customization.sections.formatting.showSectionIcons ? '<span style="margin-right: 8px;">📝</span>' : ''}
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
      
      // Configure html2canvas options for better quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: this.customization.colors.background,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      console.log('Canvas captured successfully');

      // Create PDF with proper dimensions
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: this.customization.layout.pageOrientation,
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit the page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.height / canvas.width;
      
      let imgWidth = pdfWidth;
      let imgHeight = pdfWidth * canvasAspectRatio;

      // If the image is taller than the page, we might need multiple pages
      if (imgHeight > pdfHeight) {
        const pages = Math.ceil(imgHeight / pdfHeight);
        const pageHeight = imgHeight / pages;
        
        for (let i = 0; i < pages; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          // Create a canvas for this page
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          const sourceY = (canvas.height / pages) * i;
          const sourceHeight = canvas.height / pages;
          
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          
          if (pageCtx) {
            pageCtx.drawImage(
              canvas, 
              0, sourceY, canvas.width, sourceHeight,
              0, 0, canvas.width, sourceHeight
            );
            
            const pageImgData = pageCanvas.toDataURL('image/png');
            pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, pageHeight);
          }
        }
      } else {
        // Single page
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      // Clean up the temporary element
      document.body.removeChild(element);

      console.log('PDF generated successfully');
      return pdf.output('blob');
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
