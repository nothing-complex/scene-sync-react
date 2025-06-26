
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { ReactPDFService } from './pdf/service_backup';

// FIXED: Updated import path to use the working service_backup file
// This should resolve the "Failed to download PDF" error by ensuring we use the correct service

// Main PDF generation function using React-PDF
export const generateCallsheetPDF = async (callsheet: CallsheetData) => {
  console.log('=== PDF Generation Start ===');
  console.log('Generating callsheet PDF for:', callsheet.projectTitle);
  console.log('Callsheet data:', JSON.stringify(callsheet, null, 2));
  
  try {
    const service = new ReactPDFService();
    console.log('ReactPDFService instance created successfully');
    
    // DEBUGGING: Add validation to catch data issues early
    if (!callsheet.projectTitle || !callsheet.shootDate) {
      throw new Error('Missing required callsheet data: projectTitle or shootDate');
    }
    
    await service.savePDF(callsheet);
    console.log('PDF generation completed successfully');
  } catch (error) {
    console.error('=== PDF Generation Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Callsheet data that failed:', callsheet);
    throw error; // Re-throw to let UI handle the error display
  }
};

// Enhanced service with customization
export const generateCustomCallsheetPDF = async (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.log('=== Custom PDF Generation Start ===');
  console.log('Generating custom callsheet PDF for:', callsheet.projectTitle);
  console.log('Customization options:', JSON.stringify(customization, null, 2));
  
  try {
    const service = new ReactPDFService(customization);
    console.log('ReactPDFService instance created with customization');
    
    // DEBUGGING: Validate both callsheet and customization
    if (!callsheet.projectTitle || !callsheet.shootDate) {
      throw new Error('Missing required callsheet data: projectTitle or shootDate');
    }
    
    await service.savePDF(callsheet);
    console.log('Custom PDF generation completed successfully');
  } catch (error) {
    console.error('=== Custom PDF Generation Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Callsheet data that failed:', callsheet);
    console.error('Customization that failed:', customization);
    throw error; // Re-throw to let UI handle the error display
  }
};

// Preview function
export const previewCallsheetPDF = async (
  callsheet: CallsheetData, 
  customization: Partial<PDFCustomization> = {}
) => {
  console.log('=== PDF Preview Start ===');
  console.log('Previewing callsheet PDF for:', callsheet.projectTitle);
  
  try {
    const service = new ReactPDFService(customization);
    console.log('ReactPDFService instance created for preview');
    
    // DEBUGGING: Validate data before preview
    if (!callsheet.projectTitle || !callsheet.shootDate) {
      throw new Error('Missing required callsheet data: projectTitle or shootDate');
    }
    
    await service.previewPDF(callsheet);
    console.log('PDF preview completed successfully');
  } catch (error) {
    console.error('=== PDF Preview Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Callsheet data that failed:', callsheet);
    throw error; // Re-throw to let UI handle the error display
  }
};

// Export the service class for direct use
export { ReactPDFService };
