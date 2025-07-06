
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetPDFPreview } from '../../../components/pdf/CallsheetPDFPreview';
import { HtmlToPdfService } from '../HtmlToPdfService';

export class PDFGenerator {
  private htmlToPdfService: HtmlToPdfService;

  constructor() {
    this.htmlToPdfService = new HtmlToPdfService();
  }

  // FIX: Font family mapping function for PDF generation consistency
  private getFontFamily(fontName: string): string {
    const fontMap: Record<string, string> = {
      'inter': '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      'helvetica': '"Helvetica Neue", Helvetica, Arial, sans-serif',
      'poppins': '"Poppins", system-ui, -apple-system, sans-serif',
      'montserrat': '"Montserrat", system-ui, -apple-system, sans-serif',
      'roboto': '"Roboto", system-ui, -apple-system, sans-serif',
      'open-sans': '"Open Sans", system-ui, -apple-system, sans-serif',
      'lato': '"Lato", system-ui, -apple-system, sans-serif',
      'source-sans': '"Source Sans Pro", system-ui, -apple-system, sans-serif',
      'nunito': '"Nunito", system-ui, -apple-system, sans-serif',
      'raleway': '"Raleway", system-ui, -apple-system, sans-serif',
      'work-sans': '"Work Sans", system-ui, -apple-system, sans-serif',
      'playfair': '"Playfair Display", Georgia, serif',
      'merriweather': '"Merriweather", Georgia, serif',
      'crimson': '"Crimson Text", Georgia, serif',
      'libre-baskerville': '"Libre Baskerville", Georgia, serif',
      'pt-serif': '"PT Serif", Georgia, serif'
    };
    return fontMap[fontName] || fontMap['inter'];
  }

  async generatePDF(callsheet: CallsheetData, customization: PDFCustomization): Promise<Blob> {
    console.log('PDFGenerator: Starting PDF generation with customization:', customization);
    
    try {
      // FIXED: Simplified container setup for PDF generation
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.visibility = 'hidden';
      container.style.pointerEvents = 'none';
      container.style.backgroundColor = '#ffffff';
      
      const isLandscape = customization.layout.pageOrientation === 'landscape';
      container.style.width = isLandscape ? '297mm' : '210mm';
      container.style.minHeight = isLandscape ? '210mm' : '297mm';
      container.style.overflow = 'visible';
      
      document.body.appendChild(container);

      // Create React root and render component
      const root = createRoot(container);
      
      // Render the component and wait for it to complete
      await new Promise<void>((resolve, reject) => {
        try {
          root.render(
            React.createElement(CallsheetPDFPreview, {
              callsheet,
              customization,
              className: 'print-optimized'
            })
          );
          
          // Wait for component to render completely
          setTimeout(() => {
            console.log('PDFGenerator: Component rendered, proceeding with PDF generation');
            resolve();
          }, 2000); // Increased timeout for better rendering
        } catch (error) {
          reject(error);
        }
      });

      // Additional wait to ensure all content is fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the rendered HTML
      const htmlContent = container.innerHTML;
      console.log('PDFGenerator: Component HTML extracted, content length:', htmlContent.length);

      // Create a complete HTML document with all necessary styles for PDF generation
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Call Sheet</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              font-family: ${this.getFontFamily(customization.typography.fontFamily)};
              background-color: ${customization.colors.background};
              color: ${customization.colors.text};
              line-height: ${customization.layout.spacing.lineHeight || customization.typography.lineHeight.body};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
              width: 100%;
              height: auto;
              min-height: 100%;
              overflow: visible;
            }
            
            /* Grid System */
            .grid {
              display: grid;
            }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
            
            /* Responsive Grid */
            @media (min-width: 768px) {
              .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
              .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            }
            @media (min-width: 1024px) {
              .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
              .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
              .lg\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
            }
            
            /* Spacing */
            .gap-0 { gap: 0; }
            .gap-2 { gap: 0.5rem; }
            .gap-4 { gap: 1rem; }
            .p-3 { padding: 0.75rem; }
            .p-4 { padding: 1rem; }
            .space-y-3 > * + * { margin-top: 0.75rem; }
            
            /* PDF Specific Spacing */
            .contact-card {
              margin-bottom: ${customization.layout.spacing.cardSpacing}px;
              line-height: ${customization.layout.spacing.lineHeight || customization.typography.lineHeight.body};
            }
            .pdf-section {
              margin-bottom: ${customization.layout.spacing.sectionGap}px;
            }
            .pdf-section-item {
              margin-bottom: ${customization.layout.spacing.itemGap}px;
            }
            
            /* Flexbox */
            .flex { display: flex; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .flex-1 { flex: 1 1 0%; }
            .flex-shrink-0 { flex-shrink: 0; }
            
            /* Typography */
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            
            /* Layout */
            .max-w-4xl { max-width: 56rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            
            /* FIX: Watermark styles for PDF generation */
            .pdf-watermark {
              position: fixed !important;
              top: 50% !important;
              left: 50% !important;
              transform: translate(-50%, -50%) !important;
              font-size: 72px !important;
              font-weight: bold !important;
              opacity: 0.3 !important;
              z-index: 1000 !important;
              pointer-events: none !important;
              user-select: none !important;
              text-align: center !important;
              white-space: nowrap !important;
            }
            .pdf-watermark.diagonal {
              transform: translate(-50%, -50%) rotate(-45deg) !important;
            }
            
            /* Print optimizations */
            .print-optimized {
              box-shadow: none !important;
              border-radius: 0 !important;
            }
            .print-optimized * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .avoid-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            /* Ensure proper sizing and no cutoff */
            body > * {
              width: ${isLandscape ? '297mm' : '210mm'};
              height: auto;
              min-height: ${isLandscape ? '210mm' : '297mm'};
              max-width: ${isLandscape ? '297mm' : '210mm'};
              overflow: visible;
            }
            
            /* Prevent content cutoff */
            .callsheet-pdf-preview {
              height: auto !important;
              min-height: 100% !important;
              overflow: visible !important;
            }
            
            /* FIXED: Watermark for PDF generation */
            .pdf-watermark {
              position: fixed !important;
              top: 50% !important;
              left: 50% !important;
              transform: translate(-50%, -50%) ${customization.branding?.watermark?.position === 'diagonal' ? 'rotate(-45deg)' : ''} !important;
              font-size: 48px !important;
              font-weight: bold !important;
              opacity: ${Math.min(customization.branding?.watermark?.opacity || 0.15, 0.3)} !important;
              z-index: 9999 !important;
              pointer-events: none !important;
              user-select: none !important;
              color: ${customization.colors.primary || '#666666'} !important;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      // Clean up React root and container
      root.unmount();
      document.body.removeChild(container);

      // Apply page orientation and other layout settings
      const pageOptions = {
        orientation: customization.layout.pageOrientation as 'portrait' | 'landscape',
        margins: {
          top: `${customization.layout.margins.top}px`,
          bottom: `${customization.layout.margins.bottom}px`,
          left: `${customization.layout.margins.left}px`,
          right: `${customization.layout.margins.right}px`
        }
      };

      // Convert HTML to PDF with proper styling and orientation
      const pdfBlob = await this.htmlToPdfService.generatePDF(fullHtml, {
        ...pageOptions,
        customization
      });

      console.log('PDFGenerator: PDF generated successfully');
      return pdfBlob;
    } catch (error) {
      console.error('PDFGenerator: Error generating PDF:', error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
