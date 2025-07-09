
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
      iframe.style.width = isLandscape ? '1123px' : '794px'; // A4 in pixels
      iframe.style.height = 'auto'; // Allow content to expand
      iframe.style.minHeight = isLandscape ? '794px' : '1123px';
      iframe.style.border = 'none';
      iframe.style.overflow = 'visible';
      
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

      // Wait for styles and content to load, and for any dynamic sizing
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('HtmlToPdfService: HTML content loaded in iframe');

      // Get the body element from the iframe
      const bodyElement = iframeDoc.body;
      if (!bodyElement) {
        throw new Error('No body element found in iframe');
      }

      // Get the actual content dimensions
      const actualWidth = bodyElement.scrollWidth;
      const actualHeight = bodyElement.scrollHeight;
      
      console.log('HtmlToPdfService: Actual content dimensions:', actualWidth, 'x', actualHeight);

      // CRITICAL FIX: Use exact A4 dimensions for consistent rendering
      const targetWidth = isLandscape ? 1123 : 794;
      const targetHeight = isLandscape ? 794 : 1123;
      const scaleFactor = 2; // High quality rendering

      console.log('HtmlToPdfService: Target canvas dimensions:', targetWidth, 'x', actualHeight);

      // Generate canvas with proper page breaking
      const canvas = await html2canvas(bodyElement, {
        scale: scaleFactor,
        useCORS: true,
        allowTaint: true,
        backgroundColor: options.customization?.colors.background || '#ffffff',
        width: targetWidth,
        height: actualHeight,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: false, // Disable for better compatibility
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Apply consistent styling to cloned document
          const clonedBody = clonedDoc.body;
          if (clonedBody) {
            clonedBody.style.width = `${targetWidth}px`;
            clonedBody.style.height = 'auto';
            clonedBody.style.margin = '0';
            clonedBody.style.padding = '0';
            clonedBody.style.overflow = 'visible';
            clonedBody.style.boxSizing = 'border-box';
            clonedBody.style.fontFamily = options.customization?.typography?.fontFamily || 'Inter, sans-serif';
            clonedBody.style.fontSize = `${options.customization?.typography?.fontSize?.body || 14}px`;
            
            // Apply print-specific styles
            const style = clonedDoc.createElement('style');
            style.textContent = `
              .contact-card { page-break-inside: avoid !important; break-inside: avoid !important; }
              .pdf-section { page-break-inside: avoid !important; break-inside: avoid !important; }
              .avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
            `;
            clonedDoc.head.appendChild(style);
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

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      console.log('HtmlToPdfService: PDF dimensions:', pdfWidth, 'x', pdfHeight);
      
      // Calculate scaling to fit content properly
      const imgAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = pdfHeight;
      
      // CRITICAL FIX: Improved multi-page handling with better page breaks
      const pageHeightInPx = isLandscape ? 794 : 1123; // A4 page height in pixels
      const scaledPageHeight = pageHeightInPx * scaleFactor;
      
      // Calculate how many pages we need
      const numPages = Math.ceil(canvas.height / scaledPageHeight);
      
      console.log('HtmlToPdfService: Creating', numPages, 'pages');
      
      for (let i = 0; i < numPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Create a page-specific canvas
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = canvas.width;
        pageCanvas.height = scaledPageHeight;
        
        if (pageCtx) {
          // Fill with background color
          pageCtx.fillStyle = options.customization?.colors.background || '#ffffff';
          pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          
          // Draw the portion of the main canvas for this page
          const sourceY = i * scaledPageHeight;
          const sourceHeight = Math.min(scaledPageHeight, canvas.height - sourceY);
          
          if (sourceHeight > 0) {
            pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
          }
          
          // Convert to image and add to PDF
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }
      }
      
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
