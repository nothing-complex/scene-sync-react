
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { ReactPDFService } from './pdf/service_backup';

// Main PDF generation function using React-PDF
export const generateCallsheetPDF = async (callsheet: CallsheetData) => {
  console.log('Generating callsheet PDF for:', callsheet.projectTitle);
  
  try {
    const service = new ReactPDFService();
    await service.savePDF(callsheet);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error; // Re-throw instead of just alerting
  }
};

// Enhanced service with customization
export const generateCustomCallsheetPDF = async (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.log('Generating custom callsheet PDF for:', callsheet.projectTitle);
  
  try {
    const service = new ReactPDFService(customization);
    await service.savePDF(callsheet);
  } catch (error) {
    console.error('Error generating custom PDF:', error);
    throw error; // Re-throw instead of just alerting
  }
};

// Preview function
export const previewCallsheetPDF = async (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.log('Previewing callsheet PDF for:', callsheet.projectTitle);
  
  try {
    const service = new ReactPDFService(customization);
    await service.previewPDF(callsheet);
  } catch (error) {
    console.error('Error previewing PDF:', error);
    throw error; // Re-throw instead of just alerting
  }
};

// Export the service class for direct use
export { ReactPDFService };
