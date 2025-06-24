
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { ReactPDFService } from './pdf/service_backup';
import { ExperimentalCallsheetPDFDocument } from './pdf/experimentalDocument';
import { pdf } from '@react-pdf/renderer';
import React from 'react';

// Experimental PDF service for testing new designs
export class ExperimentalPDFService extends ReactPDFService {
  protected experimentalCustomization: Partial<PDFCustomization>;

  constructor(customization: Partial<PDFCustomization> = {}) {
    super(customization);
    this.experimentalCustomization = customization;
    console.log('ExperimentalPDFService initialized with customization:', this.experimentalCustomization);
  }

  // Override the generatePDF method to use the experimental document
  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    console.log('Generating experimental PDF blob with timeline design for:', callsheet.projectTitle);
    console.log('Using experimental customization:', this.experimentalCustomization);
    
    try {
      // Ensure fonts are registered before generating PDF (same as parent class)
      await this.ensureFontsRegistered();

      // Validate callsheet data
      if (!callsheet || !callsheet.projectTitle) {
        throw new Error('Invalid callsheet data provided');
      }

      console.log('Creating experimental PDF document with timeline design...');
      const pdfDocument = (
        <ExperimentalCallsheetPDFDocument 
          callsheet={callsheet}
          customization={{ ...this.customization, ...this.experimentalCustomization }}
        />
      );

      console.log('Generating experimental PDF blob...');
      const blob = await pdf(pdfDocument).toBlob();
      console.log('Experimental PDF blob generated successfully, size:', blob.size);
      return blob;
    } catch (error) {
      console.error('Error generating experimental PDF blob:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw new Error(`Experimental PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Make ensureFontsRegistered accessible to this class
  protected async ensureFontsRegistered(): Promise<void> {
    // Call the parent's font registration method
    return super['ensureFontsRegistered']();
  }
}

// Experimental PDF generation functions
export const generateExperimentalCallsheetPDF = async (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.log('Generating experimental callsheet PDF for:', callsheet.projectTitle);
  
  try {
    const service = new ExperimentalPDFService(customization);
    await service.savePDF(callsheet);
  } catch (error) {
    console.error('Error generating experimental PDF:', error);
    alert('Failed to generate experimental PDF. Please try again.');
  }
};

export const previewExperimentalCallsheetPDF = async (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.log('Previewing experimental callsheet PDF for:', callsheet.projectTitle);
  
  try {
    const service = new ExperimentalPDFService(customization);
    await service.previewPDF(callsheet);
  } catch (error) {
    console.error('Error previewing experimental PDF:', error);
    alert('Failed to preview experimental PDF. Please try again.');
  }
};
