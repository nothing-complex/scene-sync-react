
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
      // Generate the React component HTML
      const htmlContent = renderToString(
        React.createElement(CallsheetPDFForGeneration, {
          callsheet,
          customization
        })
      );

      console.log('PDFGenerator: HTML content generated successfully');

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
      const pdfBlob = await this.htmlToPdfService.generatePDF(htmlContent, {
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
