
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { HTMLToPDFService } from './htmlToPdfService';

// Experimental PDF service for testing new designs
export class ExperimentalPDFService extends HTMLToPDFService {
  protected experimentalCustomization: Partial<PDFCustomization>;

  constructor(customization: Partial<PDFCustomization> = {}) {
    super(customization);
    this.experimentalCustomization = customization;
    console.log('ExperimentalPDFService initialized with customization:', this.experimentalCustomization);
  }

  // Override methods here for experimental features
  // For now, just use the parent implementation
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
