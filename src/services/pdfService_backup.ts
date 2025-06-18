
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { ReactPDFService } from './reactPdfService_backup';

// Main PDF generation function - now uses React-PDF by default
export const generateCallsheetPDF = (callsheet: CallsheetData) => {
  console.warn('PDF generation temporarily disabled - service being rebuilt');
  alert('PDF generation is currently being rebuilt. Please check back soon!');
};

// Enhanced service with customization - now uses React-PDF
export const generateCustomCallsheetPDF = (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.warn('PDF generation temporarily disabled - service being rebuilt');
  alert('PDF generation is currently being rebuilt. Please check back soon!');
};

// Preview function
export const previewCallsheetPDF = (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.warn('PDF generation temporarily disabled - service being rebuilt');
  alert('PDF generation is currently being rebuilt. Please check back soon!');
};

// Export the service class for direct use
export { ReactPDFService };
