
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFCustomization } from '@/types/pdfTypes';

interface PDFGenerationOptions {
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  customization?: PDFCustomization;
}

export class HtmlToPdfService {
  async generatePDF(htmlContent: string, options: PDFGenerationOptions = {}): Promise<Blob> {
    console.log('HtmlToPdfService: Starting PDF generation with options:', options);
    
    try {
      const isLandscape = options.orientation === 'landscape';
      
      // Create a temporary container for the HTML content
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.backgroundColor = '#ffffff';
      
      // Set dimensions based on orientation
      if (isLandscape) {
        container.style.width = '297mm'; // A4 landscape width
        container.style.minHeight = '210mm'; // A4 landscape height
      } else {
        container.style.width = '210mm'; // A4 portrait width
        container.style.minHeight = '297mm'; // A4 portrait height
      }
      
      // Apply margins if specified
      if (options.margins) {
        container.style.padding = `${options.margins.top} ${options.margins.right} ${options.margins.bottom} ${options.margins.left}`;
      }
      
      document.body.appendChild(container);

      // Calculate canvas dimensions based on orientation
      const canvasWidth = isLandscape ? 1188 : 840; // A4 dimensions in pixels at 72 DPI
      const canvasHeight = isLandscape ? 840 : 1188;

      // Generate canvas from HTML
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: canvasWidth,
        height: canvasHeight,
        logging: false
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Create PDF with correct orientation
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit the page
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight));
      
      // If content is longer than one page, handle pagination
      if (imgHeight > pdfHeight) {
        let position = pdfHeight;
        while (position < imgHeight) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
          position += pdfHeight;
        }
      }

      console.log('HtmlToPdfService: PDF generation completed successfully');
      
      // Return as blob
      const pdfOutput = pdf.output('blob');
      return pdfOutput;
    } catch (error) {
      console.error('HtmlToPdfService: Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
