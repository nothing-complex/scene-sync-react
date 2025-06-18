
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { ReactPDFService } from './pdf/service';

// Export main service functions
export const generateReactPDF = (callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}) => {
  const service = new ReactPDFService(customization);
  return service.savePDF(callsheet);
};

export const previewReactPDF = (callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}) => {
  const service = new ReactPDFService(customization);
  return service.previewPDF(callsheet);
};

// Export the service class
export { ReactPDFService };

// Export components for potential direct use
export { CallsheetPDFDocument } from './pdf/callsheetDocument';
export { SafeText, SectionIcon } from './pdf/components';
export { createStyles, createBorderStyle, createPartialBorderStyle } from './pdf/styleUtils';
export { registerPDFFonts, getFontFamily, getFontWeight } from './pdf/fontUtils';
