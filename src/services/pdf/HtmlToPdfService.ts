
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
      
      // Create a temporary iframe to render the HTML content properly
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = isLandscape ? '297mm' : '210mm';
      iframe.style.height = isLandscape ? '210mm' : '297mm';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      // Wait for iframe to be ready
      await new Promise((resolve) => {
        iframe.onload = resolve;
        // Set a fallback timeout in case onload doesn't fire
        setTimeout(resolve, 100);
      });

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Unable to access iframe document');
      }

      // Write the HTML content to the iframe
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Wait for styles and content to load
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('HtmlToPdfService: HTML content loaded in iframe');

      // Get the body element from the iframe
      const bodyElement = iframeDoc.body;
      if (!bodyElement) {
        throw new Error('No body element found in iframe');
      }

      // Calculate canvas dimensions for high quality (A4 dimensions at 300 DPI)
      const scaleFactor = 3; // High quality scaling
      let canvasWidth, canvasHeight;
      
      if (isLandscape) {
        canvasWidth = Math.floor(11.7 * 300); // 11.7 inches * 300 DPI
        canvasHeight = Math.floor(8.3 * 300);  // 8.3 inches * 300 DPI
      } else {
        canvasWidth = Math.floor(8.3 * 300);   // 8.3 inches * 300 DPI
        canvasHeight = Math.floor(11.7 * 300); // 11.7 inches * 300 DPI
      }

      console.log('HtmlToPdfService: Target canvas dimensions:', canvasWidth, 'x', canvasHeight);

      // Generate canvas from the iframe content
      const canvas = await html2canvas(bodyElement, {
        scale: scaleFactor,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: canvasWidth / scaleFactor,
        height: canvasHeight / scaleFactor,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: true,
        imageTimeout: 10000,
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied in the cloned document
          const clonedBody = clonedDoc.body;
          if (clonedBody) {
            clonedBody.style.width = isLandscape ? '297mm' : '210mm';
            clonedBody.style.height = isLandscape ? '210mm' : '297mm';
            clonedBody.style.margin = '0';
            clonedBody.style.padding = '0';
            clonedBody.style.overflow = 'hidden';
          }
        }
      });

      console.log('HtmlToPdfService: Canvas generated with dimensions:', canvas.width, 'x', canvas.height);

      // Clean up iframe
      document.body.removeChild(iframe);

      // Create PDF with correct orientation
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98); // High quality JPEG
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      console.log('HtmlToPdfService: PDF dimensions:', pdfWidth, 'x', pdfHeight);
      
      // Add image to PDF with proper scaling
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      console.log('HtmlToPdfService: Image added to PDF successfully');

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
