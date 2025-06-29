
import React from 'react';
import { renderToString } from 'react-dom/server';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetPDFForGeneration } from '../../../components/pdf/CallsheetPDFForGeneration';
import { HtmlToPdfService } from '../HtmlToPdfService';

export class PDFGenerator {
  private htmlToPdfService: HtmlToPdfService;

  constructor() {
    this.htmlToPdfService = new HtmlToPdfService();
  }

  async generatePDF(callsheet: CallsheetData, customization: PDFCustomization): Promise<Blob> {
    console.log('PDFGenerator: Starting PDF generation with customization:', customization);
    
    try {
      // Create a wrapper HTML document with proper styling
      const componentHtml = renderToString(
        React.createElement(CallsheetPDFForGeneration, {
          callsheet,
          customization
        })
      );

      console.log('PDFGenerator: React component rendered to HTML');

      // Create a complete HTML document with all necessary styles
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background-color: white;
              color: black;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              print-color-adjust: exact;
            }
            .grid {
              display: grid;
            }
            .grid-cols-1 {
              grid-template-columns: repeat(1, minmax(0, 1fr));
            }
            .grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .grid-cols-3 {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .grid-cols-4 {
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }
            .grid-cols-5 {
              grid-template-columns: repeat(5, minmax(0, 1fr));
            }
            .gap-0 {
              gap: 0;
            }
            .gap-2 {
              gap: 0.5rem;
            }
            .p-3 {
              padding: 0.75rem;
            }
            .p-4 {
              padding: 1rem;
            }
            .space-y-3 > * + * {
              margin-top: 0.75rem;
            }
            .flex {
              display: flex;
            }
            .items-center {
              align-items: center;
            }
            .items-start {
              align-items: flex-start;
            }
            .flex-1 {
              flex: 1 1 0%;
            }
            .flex-shrink-0 {
              flex-shrink: 0;
            }
            .text-lg {
              font-size: 1.125rem;
              line-height: 1.75rem;
            }
            .max-w-4xl {
              max-width: 56rem;
            }
            .mx-auto {
              margin-left: auto;
              margin-right: auto;
            }
            @media (min-width: 768px) {
              .md\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
              .md\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
            }
          </style>
        </head>
        <body>
          ${componentHtml}
        </body>
        </html>
      `;

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
