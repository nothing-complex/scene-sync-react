
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

export class HtmlToPdfService {
  async generatePDF(
    callsheet: CallsheetData, 
    customization: PDFCustomization,
    elementId: string = 'pdf-preview-container'
  ): Promise<Blob> {
    console.log('HtmlToPdfService: Starting HTML to PDF conversion');
    
    try {
      // Find the preview container element
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID ${elementId} not found`);
      }

      console.log('Converting HTML element to canvas...');
      
      // Convert HTML to canvas with high quality settings
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: customization.colors.background,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false
      });

      console.log('Canvas created, converting to PDF...');

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add the image to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      console.log('PDF generation completed');

      // Convert to blob
      const pdfBlob = pdf.output('blob');
      return pdfBlob;

    } catch (error) {
      console.error('Error in HTML to PDF conversion:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async downloadPDF(
    callsheet: CallsheetData,
    customization: PDFCustomization,
    filename?: string,
    elementId: string = 'pdf-preview-container'
  ): Promise<void> {
    const blob = await this.generatePDF(callsheet, customization, elementId);
    
    const sanitizedTitle = (callsheet.projectTitle || 'callsheet')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const fileName = filename || `${sanitizedTitle}_callsheet.pdf`;
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async previewPDF(
    callsheet: CallsheetData,
    customization: PDFCustomization,
    elementId: string = 'pdf-preview-container'
  ): Promise<void> {
    const blob = await this.generatePDF(callsheet, customization, elementId);
    
    // Open in new tab
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
