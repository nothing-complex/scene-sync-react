import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { ReactPDFService, generateReactPDF } from './reactPdfService_backup';

// Main PDF generation function - now uses React-PDF by default
export const generateCallsheetPDF = (callsheet: CallsheetData) => {
  return generateReactPDF(callsheet);
};

// Enhanced service with customization - now uses React-PDF
export const generateCustomCallsheetPDF = (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  const pdfService = new ReactPDFService(customization);
  return pdfService.savePDF(callsheet);
};

// Preview function
export const previewCallsheetPDF = (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  const pdfService = new ReactPDFService(customization);
  return pdfService.previewPDF(callsheet);
};

// Export the service class for direct use
export { ReactPDFService };
