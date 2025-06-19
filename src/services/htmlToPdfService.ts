
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

  private async renderPDFContent(callsheet: CallsheetData): Promise<HTMLElement> {
    console.log('Rendering PDF content for:', callsheet.projectTitle);
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '8.5in';
    container.style.minHeight = '11in';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '32px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.id = 'temp-pdf-content';
    
    // Add CSS variables for customization
    const cssVariables = {
      '--pdf-font-family': this.customization.typography.fontFamily === 'helvetica' ? 'Arial, sans-serif' : 
                          this.customization.typography.fontFamily === 'inter' ? 'Inter, sans-serif' : 
                          this.customization.typography.fontFamily === 'poppins' ? 'Poppins, sans-serif' :
                          this.customization.typography.fontFamily === 'montserrat' ? 'Montserrat, sans-serif' :
                          'Arial, sans-serif',
      '--pdf-font-size': `${this.customization.typography.fontSize.body}px`,
      '--pdf-primary-color': this.customization.colors.primary,
      '--pdf-secondary-color': this.customization.colors.secondary,
      '--pdf-text-color': this.customization.colors.text,
      '--pdf-background-color': this.customization.colors.background,
    };

    // Apply CSS variables
    Object.entries(cssVariables).forEach(([key, value]) => {
      container.style.setProperty(key, value);
    });

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

    const isHeaderCentered = this.customization.layout.headerStyle === 'minimal' || this.customization.layout.headerStyle === 'creative';

    return `
      <div style="font-family: var(--pdf-font-family); font-size: var(--pdf-font-size); color: var(--pdf-text-color);">
        <!-- Header -->
        <div style="margin-bottom: 32px; text-align: ${isHeaderCentered ? 'center' : 'left'};">
          ${this.customization.branding.logo ? `
            <div style="margin-bottom: 16px;">
              <img src="${typeof this.customization.branding.logo === 'string' ? this.customization.branding.logo : this.customization.branding.logo.url}" 
                   alt="Company Logo" 
                   style="height: 64px; width: auto; ${isHeaderCentered ? 'display: block; margin: 0 auto;' : 'display: inline-block;'}" />
            </div>
          ` : ''}
          <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 8px; color: var(--pdf-primary-color); font-family: var(--pdf-font-family);">
            ${callsheet.projectTitle}
          </h1>
          <h2 style="font-size: 24px; font-weight: 600; color: var(--pdf-secondary-color); font-family: var(--pdf-font-family);">
            CALL SHEET
          </h2>
        </div>

        <!-- Basic Information -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
          <div>
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <div style="margin-left: 8px;">
                <div style="font-weight: 600;">Shoot Date</div>
                <div>${formatDate(callsheet.shootDate)}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="margin-left: 8px;">
                <div style="font-weight: 600;">General Call Time</div>
                <div>${callsheet.generalCallTime}</div>
              </div>
            </div>
          </div>
          <div>
            <div style="display: flex; align-items: center;">
              <div style="margin-left: 8px;">
                <div style="font-weight: 600;">Location</div>
                <div>${callsheet.location}</div>
                ${callsheet.locationAddress ? `<div style="font-size: 14px; color: #666;">${callsheet.locationAddress}</div>` : ''}
              </div>
            </div>
          </div>
        </div>

        ${callsheet.schedule.length > 0 ? `
        <!-- Schedule -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; color: var(--pdf-primary-color); font-family: var(--pdf-font-family);">
            SCHEDULE
          </h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; border-right: 1px solid #d1d5db; font-weight: 600; text-align: left;">Scene</th>
                <th style="padding: 8px; border-right: 1px solid #d1d5db; font-weight: 600; text-align: left;">Int/Ext</th>
                <th style="padding: 8px; border-right: 1px solid #d1d5db; font-weight: 600; text-align: left;">Description</th>
                <th style="padding: 8px; border-right: 1px solid #d1d5db; font-weight: 600; text-align: left;">Location</th>
                <th style="padding: 8px; font-weight: 600; text-align: left;">Time</th>
              </tr>
            </thead>
            <tbody>
              ${callsheet.schedule.map((item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                  <td style="padding: 8px; border-right: 1px solid #d1d5db; font-weight: 500;">${item.sceneNumber}</td>
                  <td style="padding: 8px; border-right: 1px solid #d1d5db;">${item.intExt}</td>
                  <td style="padding: 8px; border-right: 1px solid #d1d5db;">${item.description}</td>
                  <td style="padding: 8px; border-right: 1px solid #d1d5db;">${item.location}</td>
                  <td style="padding: 8px;">${item.estimatedTime}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${callsheet.cast.length > 0 ? `
        <!-- Cast -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; color: var(--pdf-primary-color); font-family: var(--pdf-font-family);">
            CAST
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            ${callsheet.cast.map(member => `
              <div style="border: 1px solid #d1d5db; padding: 12px;">
                <div style="font-weight: 600;">${member.name}</div>
                ${member.character ? `<div style="font-size: 14px; color: #666; margin-bottom: 4px;">as ${member.character}</div>` : ''}
                <div style="font-size: 14px; margin-bottom: 4px;">📞 ${member.phone}</div>
                <div style="font-size: 14px;">📧 ${member.email}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${callsheet.crew.length > 0 ? `
        <!-- Crew -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; color: var(--pdf-primary-color); font-family: var(--pdf-font-family);">
            CREW
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            ${callsheet.crew.map(member => `
              <div style="border: 1px solid #d1d5db; padding: 12px;">
                <div style="font-weight: 600;">${member.name}</div>
                <div style="font-size: 14px; color: #666; margin-bottom: 4px;">${member.role}</div>
                <div style="font-size: 14px; margin-bottom: 4px;">📞 ${member.phone}</div>
                <div style="font-size: 14px;">📧 ${member.email}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${callsheet.emergencyContacts.length > 0 ? `
        <!-- Emergency Contacts -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; color: var(--pdf-primary-color); font-family: var(--pdf-font-family);">
            ⚠️ EMERGENCY CONTACTS
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            ${callsheet.emergencyContacts.map(contact => `
              <div style="border: 1px solid #fca5a5; background-color: #fef2f2; padding: 12px;">
                <div style="font-weight: 600;">${contact.name}</div>
                <div style="font-size: 14px; color: #666; margin-bottom: 4px;">${contact.role}</div>
                <div style="font-size: 14px; font-weight: 500;">📞 ${contact.phone}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Additional Information -->
        <div>
          ${callsheet.parkingInstructions ? `
            <div style="margin-bottom: 16px;">
              <h4 style="font-weight: 600; margin-bottom: 8px;">Parking Instructions</h4>
              <p style="font-size: 14px;">${callsheet.parkingInstructions}</p>
            </div>
          ` : ''}
          
          ${callsheet.basecampLocation ? `
            <div style="margin-bottom: 16px;">
              <h4 style="font-weight: 600; margin-bottom: 8px;">Basecamp Location</h4>
              <p style="font-size: 14px;">${callsheet.basecampLocation}</p>
            </div>
          ` : ''}
          
          ${callsheet.weather ? `
            <div style="margin-bottom: 16px;">
              <h4 style="font-weight: 600; margin-bottom: 8px;">Weather</h4>
              <p style="font-size: 14px;">${callsheet.weather}</p>
            </div>
          ` : ''}
          
          ${callsheet.specialNotes ? `
            <div style="margin-bottom: 16px;">
              <h4 style="font-weight: 600; margin-bottom: 8px;">Special Notes</h4>
              <p style="font-size: 14px;">${callsheet.specialNotes}</p>
            </div>
          ` : ''}
        </div>
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
        backgroundColor: '#ffffff',
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
