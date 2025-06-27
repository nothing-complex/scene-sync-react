
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { HtmlToPdfService } from '../HtmlToPdfService';
import { CallsheetPDFForGeneration } from '@/components/pdf/CallsheetPDFForGeneration';
import React from 'react';
import { createRoot } from 'react-dom/client';

export class PDFGenerator {
  private htmlToPdfService: HtmlToPdfService;
  
  constructor() {
    this.htmlToPdfService = new HtmlToPdfService();
  }

  async generatePDF(callsheet: CallsheetData, customization: PDFCustomization): Promise<Blob> {
    try {
      console.log('PDFGenerator: Creating temporary PDF preview component');
      
      // Create a temporary container
      const tempContainer = document.createElement('div');
      document.body.appendChild(tempContainer);
      
      return new Promise<Blob>((resolve, reject) => {
        const root = createRoot(tempContainer);
        
        const handleReady = async () => {
          try {
            console.log('PDFGenerator: PDF preview ready, generating PDF...');
            
            // Generate PDF from the rendered component
            const blob = await this.htmlToPdfService.generatePDF(
              callsheet, 
              customization, 
              'pdf-preview-container'
            );
            
            // Clean up
            root.unmount();
            document.body.removeChild(tempContainer);
            
            resolve(blob);
          } catch (error) {
            console.error('Error generating PDF:', error);
            
            // Clean up on error
            root.unmount();
            document.body.removeChild(tempContainer);
            
            reject(error);
          }
        };

        // Render the PDF preview component
        root.render(
          <CallsheetPDFForGeneration
            callsheet={callsheet}
            customization={customization}
            onReady={handleReady}
          />
        );
      });
      
    } catch (error) {
      console.error('Error in PDF generation:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
