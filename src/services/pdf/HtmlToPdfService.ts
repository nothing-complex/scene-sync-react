
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
      container.style.color = '#000000';
      
      // Set dimensions based on orientation (A4 size)
      if (isLandscape) {
        container.style.width = '297mm'; // A4 landscape width
        container.style.height = '210mm'; // A4 landscape height
      } else {
        container.style.width = '210mm'; // A4 portrait width
        container.style.height = '297mm'; // A4 portrait height
      }
      
      // Apply margins if specified
      if (options.margins) {
        container.style.padding = `${options.margins.top} ${options.margins.right} ${options.margins.bottom} ${options.margins.left}`;
      }
      
      // Ensure all fonts and styles are loaded
      container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      container.style.fontSize = '12px';
      container.style.lineHeight = '1.4';
      
      document.body.appendChild(container);

      // Wait a moment for styles to be applied
      await new Promise(resolve => setTimeout(resolve, 100));

      // Calculate canvas dimensions based on orientation (high DPI for better quality)
      const scaleFactor = 2; // For better quality
      const canvasWidth = isLandscape ? 1122 : 794; // A4 dimensions in pixels at 96 DPI
      const canvasHeight = isLandscape ? 794 : 1122;

      // Generate canvas from HTML with better options
      const canvas = await html2canvas(container, {
        scale: scaleFactor,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: canvasWidth,
        height: canvasHeight,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: true,
        imageTimeout: 5000
      });

      console.log('HtmlToPdfService: Canvas generated with dimensions:', canvas.width, 'x', canvas.height);

      // Remove temporary container
      document.body.removeChild(container);

      // Create PDF with correct orientation
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/png', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      console.log('HtmlToPdfService: PDF dimensions:', pdfWidth, 'x', pdfHeight);
      
      // Calculate image dimensions to fit the page properly
      const imgAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let imgWidth, imgHeight;
      
      if (imgAspectRatio > pdfAspectRatio) {
        // Image is wider than PDF page
        imgWidth = pdfWidth;
        imgHeight = pdfWidth / imgAspectRatio;
      } else {
        // Image is taller than PDF page
        imgHeight = pdfHeight;
        imgWidth = pdfHeight * imgAspectRatio;
      }
      
      // Center the image on the page
      const xOffset = (pdfWidth - imgWidth) / 2;
      const yOffset = (pdfHeight - imgHeight) / 2;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');
      
      console.log('HtmlToPdfService: Image added to PDF with dimensions:', imgWidth, 'x', imgHeight);

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
