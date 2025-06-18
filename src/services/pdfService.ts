
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

// Temporary placeholder - PDF functionality disabled
export const generateCallsheetPDF = (callsheet: CallsheetData) => {
  console.warn('PDF generation temporarily disabled - service being rebuilt');
  alert('PDF generation is currently being rebuilt. Please check back soon!');
};

export const generateCustomCallsheetPDF = (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.warn('PDF generation temporarily disabled - service being rebuilt');
  alert('PDF generation is currently being rebuilt. Please check back soon!');
};

export const previewCallsheetPDF = (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.warn('PDF generation temporarily disabled - service being rebuilt');
  alert('PDF generation is currently being rebuilt. Please check back soon!');
};
