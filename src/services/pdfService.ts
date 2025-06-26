
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
    alert('Failed to generate PDF. Please try again.');
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
    alert('Failed to generate PDF. Please try again.');
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
    alert('Failed to preview PDF. Please try again.');
  }
};

// Export the service class for direct use
export { ReactPDFService };
