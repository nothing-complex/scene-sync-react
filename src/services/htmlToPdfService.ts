import { CallsheetData } from '@/types/callsheet';
import { PDFCustomization } from '@/types/pdfTypes';
import { getEmergencyNumberFromLocation } from '@/utils/emergencyNumberUtils';

const generateHeader = (callsheet: CallsheetData, customization: PDFCustomization): string => {
  const isHeaderCentered = customization.layout.headerStyle === 'minimal' ||
    customization.layout.headerStyle === 'creative';

  const headerStyles = {
    textAlign: (isHeaderCentered ? 'center' : 'left') as 'center' | 'left',
    backgroundColor: customization.colors.surface,
    color: customization.colors.text,
    padding: '1.5rem',
    marginBottom: '2rem',
    borderRadius: `${customization.visual.cornerRadius}px`
  };

  const getTitleColor = () => {
    const isHeaderWithBackground = customization.visual.headerBackground !== 'none';

    if (customization.layout.headerStyle === 'professional' && isHeaderWithBackground) {
      return customization.colors.background;
    }

    return isHeaderWithBackground ? customization.colors.background : customization.colors.primary;
  };

  const getSubtitleColor = () => {
    const isHeaderWithBackground = customization.visual.headerBackground !== 'none';

    if (customization.layout.headerStyle === 'professional' && isHeaderWithBackground) {
      return customization.colors.background;
    }

    return isHeaderWithBackground ? customization.colors.background : customization.colors.secondary;
  };

  return `
    <div style="${Object.entries(headerStyles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')}">
      <h1 style="
        font-size: ${customization.typography.fontSize.title}px;
        font-weight: bold;
        color: ${getTitleColor()};
        line-height: ${customization.typography.lineHeight.title};
        margin: 0 0 12px 0;
      ">${callsheet.projectTitle}</h1>
      <h2 style="
        font-size: ${customization.typography.fontSize.header}px;
        font-weight: semibold;
        color: ${getSubtitleColor()};
        line-height: ${customization.typography.lineHeight.header};
        margin: 0;
      ">CALL SHEET</h2>
    </div>
  `;
};

const generateProductionDetails = (callsheet: CallsheetData, customization: PDFCustomization): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cardStyle = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: customization.colors.surface,
    borderColor: customization.colors.border,
    padding: '1rem'
  };

  const showSectionIcons = customization.sections.formatting.showSectionIcons;

  return `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
      <div style="${Object.entries(cardStyle)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ')}">
        ${showSectionIcons ? '<span style="font-size: 1.2rem;">📅</span>' : ''}
        <div>
          <div style="font-weight: medium; color: ${customization.colors.primary}; font-size: ${customization.typography.fontSize.header}px;">Shoot Date</div>
          <div style="font-size: ${customization.typography.fontSize.body}px;">${formatDate(callsheet.shootDate)}</div>
        </div>
      </div>
      <div style="${Object.entries(cardStyle)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ')}">
        ${showSectionIcons ? '<span style="font-size: 1.2rem;">🕐</span>' : ''}
        <div>
          <div style="font-weight: medium; color: ${customization.colors.primary}; font-size: ${customization.typography.fontSize.header}px;">Call Time</div>
          <div style="font-size: ${customization.typography.fontSize.body}px;">${callsheet.generalCallTime}</div>
        </div>
      </div>
      <div style="${Object.entries(cardStyle)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ')}">
        ${showSectionIcons ? '<span style="font-size: 1.2rem;">📍</span>' : ''}
        <div>
          <div style="font-weight: medium; color: ${customization.colors.primary}; font-size: ${customization.typography.fontSize.header}px;">Location</div>
          <div style="font-size: ${customization.typography.fontSize.body}px;">${callsheet.location}</div>
          ${callsheet.locationAddress ? `<div style="font-size: ${customization.typography.fontSize.small}px; color: ${customization.colors.textLight};">${callsheet.locationAddress}</div>` : ''}
        </div>
      </div>
    </div>
  `;
};

const generateSpecialNotes = (callsheet: CallsheetData, customization: PDFCustomization): string => {
  if (!callsheet.specialNotes || !customization.sections.visibility.notes) return '';

  const cardStyle = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: customization.colors.surface,
    borderColor: customization.colors.border,
    borderLeftColor: customization.colors.accent,
    borderLeftWidth: '4px',
    padding: '1.25rem'
  };

  const showSectionIcons = customization.sections.formatting.showSectionIcons;

  return `
    <div style="margin-bottom: 2rem;">
      <div style="${Object.entries(cardStyle)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ')}">
        <h4 style="font-weight: medium; color: ${customization.colors.primary}; font-size: ${customization.typography.fontSize.header}px; margin-bottom: 0.75rem;">
          ${showSectionIcons ? '<span style="font-size: 1.2rem;">📝</span>' : ''}
          Special Notes
        </h4>
        <p style="
          font-size: ${customization.typography.fontSize.body}px;
          color: ${customization.colors.text};
          margin: 0;
          line-height: 1.5;
        ">${callsheet.specialNotes}</p>
      </div>
    </div>
  `;
};

const generateSchedule = (callsheet: CallsheetData, customization: PDFCustomization): string => {
  if (!callsheet.schedule.length || !customization.sections.visibility.schedule) return '';

  const tableStyle = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: customization.colors.surface,
    borderColor: customization.colors.border
  };

  const showSectionIcons = customization.sections.formatting.showSectionIcons;
  const alternateRows = customization.sections.formatting.alternateRowColors;

  return `
    <div style="margin-bottom: 2rem;">
      <h3 style="
        font-size: ${customization.typography.fontSize.header + 4}px;
        font-weight: semibold;
        color: ${customization.colors.primary};
        margin-bottom: 1rem;
      ">
        ${showSectionIcons ? '<span style="font-size: 1.2rem;">📋</span>' : ''}
        SCHEDULE
      </h3>
      <div style="${Object.entries(tableStyle)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ')}">
        <div style="overflow: hidden;">
          <div style="
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0;
            font-weight: medium;
            border-bottom: 2px solid ${customization.colors.border};
            background-color: ${customization.colors.surfaceHover};
            font-size: ${customization.typography.fontSize.header}px;
          ">
            <div style="padding: 0.75rem; border-right: 1px solid ${customization.colors.border};">Scene</div>
            <div style="padding: 0.75rem; border-right: 1px solid ${customization.colors.border};">Int/Ext</div>
            <div style="padding: 0.75rem; border-right: 1px solid ${customization.colors.border};">Description</div>
            <div style="padding: 0.75rem; border-right: 1px solid ${customization.colors.border};">Time</div>
            <div style="padding: 0.75rem;">Pages</div>
          </div>
          ${callsheet.schedule.map((item, index) => `
            <div style="
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 0;
              border-bottom: 1px solid ${customization.colors.borderLight};
              background-color: ${alternateRows && index % 2 === 1 ? customization.colors.surface : customization.colors.background};
              font-size: ${customization.typography.fontSize.body}px;
            ">
              <div style="padding: 0.5rem; font-weight: medium; border-right: 1px solid ${customization.colors.borderLight};">${item.sceneNumber}</div>
              <div style="padding: 0.5rem; border-right: 1px solid ${customization.colors.borderLight};">${item.intExt}</div>
              <div style="padding: 0.5rem; border-right: 1px solid ${customization.colors.borderLight};">${item.description}</div>
              <div style="padding: 0.5rem; border-right: 1px solid ${customization.colors.borderLight};">${item.estimatedTime}</div>
              <div style="padding: 0.5rem;">${item.pageCount || '-'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

const generateContacts = (callsheet: CallsheetData, contacts: any[], title: string, icon: string, isEmergency: boolean, customization: PDFCustomization): string => {
  if (!contacts.length) return '';

  const showIcons = customization.sections.formatting.showSectionIcons;
  const isEmergencyProminent = isEmergency && customization.sections.formatting.emergencyProminent;
  const contactLayout = customization.sections.formatting.contactLayout;

  const cardStyle = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: isEmergency && customization.sections.formatting.emergencyProminent
      ? '#fef2f2'
      : customization.colors.surface,
    borderColor: isEmergency && customization.sections.formatting.emergencyProminent
      ? '#fca5a5'
      : customization.colors.border,
    borderLeftColor: isEmergency && customization.sections.formatting.emergencyProminent
      ? '#dc2626'
      : customization.colors.accent,
    borderLeftWidth: '4px',
    color: customization.colors.text,
    padding: '0.75rem'
  };

  const contactGridClass = contactLayout === 'compact' ? 'grid-template-columns: repeat(3, 1fr);' :
    contactLayout === 'cards' ? 'grid-template-columns: repeat(2, 1fr);' :
      'grid-template-columns: repeat(1, 1fr);';

  // Add emergency number banner for emergency contacts
  const emergencyBanner = isEmergency ? (() => {
    const emergencyNumber = callsheet.emergencyNumber || getEmergencyNumberFromLocation(callsheet.location);
    return `
      <div style="
        background-color: #fef2f2; 
        border: 2px solid #fca5a5; 
        border-radius: ${customization.visual.cornerRadius}px; 
        padding: 16px; 
        margin-bottom: 16px;
        text-align: center;
        font-weight: bold;
        color: #dc2626;
      ">
        <div style="font-size: ${customization.typography.fontSize.small}px; margin-bottom: 4px;">Emergency Services</div>
        <div style="font-size: ${customization.typography.fontSize.title}px; font-weight: bold;">${emergencyNumber}</div>
      </div>
    `;
  })() : '';

  return `
    <div style="margin-bottom: 2rem;">
      <h3 style="
        font-size: ${customization.typography.fontSize.header + 4}px;
        font-weight: semibold;
        color: ${isEmergencyProminent ? '#dc2626' : customization.colors.primary};
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      ">
        ${showIcons ? `<span style="font-size: 1.2rem;">${icon}</span>` : ''}
        ${title}
      </h3>
      ${emergencyBanner}
      <div style="display: grid; gap: 1rem; ${contactGridClass}">
        ${contacts.map(contact => `
          <div style="${Object.entries(cardStyle)
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ')}">
            <div style="font-weight: medium; margin-bottom: 0.25rem; font-size: ${customization.typography.fontSize.body}px;">${contact.name}</div>
            ${(contact.character || contact.role) ? `<div style="font-size: ${customization.typography.fontSize.small}px; color: ${customization.colors.textLight}; font-style: italic; margin-bottom: 0.5rem;">${contact.character ? `as ${contact.character}` : contact.role}</div>` : ''}
            <div style="font-size: ${customization.typography.fontSize.small}px; font-weight: ${isEmergency ? '500' : 'normal'};">${showIcons ? '📞 ' : ''}${contact.phone}</div>
            ${contact.email && !isEmergency ? `<div style="font-size: ${customization.typography.fontSize.small}px;">${showIcons ? '📧 ' : ''}${contact.email}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

const generateFooter = (customization: PDFCustomization): string => {
  if (!customization.branding.footer?.text) return '';

  const textAlign = customization.branding.footer.position || 'center';

  return `
    <div style="
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px solid ${customization.colors.border};
      text-align: ${textAlign};
      font-size: ${customization.typography.fontSize.small}px;
      color: ${customization.colors.textLight};
    ">
      ${customization.branding.footer.text}
    </div>
  `;
};

export const generateCallsheetHTML = (callsheet: CallsheetData, customization: PDFCustomization): string => {
  const containerStyles = {
    backgroundColor: customization.colors.background,
    color: customization.colors.text,
    fontFamily: customization.typography.fontFamily === 'inter' ? 'Inter' :
      customization.typography.fontFamily === 'helvetica' ? 'Helvetica' :
        customization.typography.fontFamily === 'poppins' ? 'Poppins' :
          customization.typography.fontFamily === 'montserrat' ? 'Montserrat' : 'Inter',
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.typography.lineHeight.body,
    padding: '2rem'
  };

  return `
    <div style="${Object.entries(containerStyles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')}">
      ${generateHeader(callsheet, customization)}
      ${generateProductionDetails(callsheet, customization)}
      ${generateSpecialNotes(callsheet, customization)}
      ${generateSchedule(callsheet, customization)}
      ${generateContacts(callsheet, callsheet.cast, 'CAST', '🎭', false, customization)}
      ${generateContacts(callsheet, callsheet.crew, 'CREW', '🎬', false, customization)}
      ${generateContacts(callsheet, callsheet.emergencyContacts, 'EMERGENCY CONTACTS', '⚠️', true, customization)}
      ${generateFooter(customization)}
    </div>
  `;
};

export class HTMLToPDFService {
  protected customization: PDFCustomization;

  constructor(customization: PDFCustomization) {
    this.customization = customization;
  }

  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    console.log('Generating PDF blob using HTML to PDF service');
    
    try {
      const html = generateCallsheetHTML(callsheet, this.customization);
      
      // Create a temporary iframe to render the HTML
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '794px'; // A4 width in pixels at 96 DPI
      iframe.style.height = '1123px'; // A4 height in pixels at 96 DPI
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Could not access iframe document');
      }

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; padding: 0; }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      iframeDoc.close();

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use html2canvas to capture the content
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(iframeDoc.body, {
        width: 794,
        height: 1123,
        scale: 2
      });

      // Convert canvas to PDF using jsPDF
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'pt', 'a4');
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 594, 841); // A4 size in points
      
      // Clean up
      document.body.removeChild(iframe);
      
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  async savePDF(callsheet: CallsheetData, filename?: string): Promise<void> {
    const blob = await this.generatePDF(callsheet);
    const fileName = filename || `${(callsheet.projectTitle || 'callsheet').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_callsheet.pdf`;
    
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
  }

  async previewPDF(callsheet: CallsheetData): Promise<void> {
    const blob = await this.generatePDF(callsheet);
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  }
}
