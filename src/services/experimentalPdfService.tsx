
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { PDFService } from './pdf/PDFService';
import { ExperimentalCallsheetPDFDocument } from './pdf/experimentalDocument';
import { pdf } from '@react-pdf/renderer';
import React from 'react';

// Experimental PDF service for testing new designs
export class ExperimentalPDFService extends PDFService {
  // Override the generatePDF method to use the experimental document
  async generateExperimentalPDF(callsheet: CallsheetData): Promise<Blob> {
    console.log('Generating experimental PDF blob with timeline design for:', callsheet.projectTitle);
    
    try {
      // Create the document using JSX syntax which returns the Document element directly
      const documentElement = (
        <ExperimentalCallsheetPDFDocument
          callsheet={callsheet}
          customization={this.customization}
        />
      );

      console.log('Generating experimental PDF blob...');
      const blob = await pdf(documentElement).toBlob();
      console.log('Experimental PDF blob generated successfully, size:', blob.size);
      return blob;
    } catch (error) {
      console.error('Error generating experimental PDF blob:', error);
      throw new Error(`Experimental PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
    const blob = await service.generateExperimentalPDF(callsheet);
    const filename = `${callsheet.projectTitle}_Experimental_CallSheet_${callsheet.shootDate}.pdf`;
    
    // Use the download manager from the base service
    const { DownloadManager } = await import('./pdf/core/DownloadManager');
    await DownloadManager.downloadBlob(blob, filename);
  } catch (error) {
    console.error('Error generating experimental PDF:', error);
    throw error;
  }
};

export const previewExperimentalCallsheetPDF = async (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.log('Previewing experimental callsheet PDF for:', callsheet.projectTitle);
  
  try {
    const service = new ExperimentalPDFService(customization);
    const blob = await service.generateExperimentalPDF(callsheet);
    
    // Use the download manager from the base service
    const { DownloadManager } = await import('./pdf/core/DownloadManager');
    await DownloadManager.openPreview(blob);
  } catch (error) {
    console.error('Error previewing experimental PDF:', error);
    throw error;
  }
};
