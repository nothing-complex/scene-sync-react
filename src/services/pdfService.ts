
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { ReactPDFService } from './pdf/service_backup';
import { toast } from 'sonner';

// Main PDF generation function using React-PDF
export const generateCallsheetPDF = async (callsheet: CallsheetData) => {
  console.log('=== PDF Generation Start ===');
  console.log('Generating callsheet PDF for:', callsheet.projectTitle);
  console.log('Callsheet data:', JSON.stringify(callsheet, null, 2));
  
  try {
    const service = new ReactPDFService();
    console.log('ReactPDFService instance created successfully');
    
    // Validation
    if (!callsheet.projectTitle || !callsheet.shootDate) {
      throw new Error('Missing required callsheet data: projectTitle or shootDate');
    }
    
    await service.savePDF(callsheet);
    console.log('PDF generation completed successfully');
    toast.success('PDF downloaded successfully!');
  } catch (error) {
    console.error('=== PDF Generation Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Callsheet data that failed:', callsheet);
    
    // Show user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error(`Failed to download PDF: ${errorMessage}`);
    throw error;
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
    
    // Validation
    if (!callsheet.projectTitle || !callsheet.shootDate) {
      throw new Error('Missing required callsheet data: projectTitle or shootDate');
    }
    
    await service.savePDF(callsheet);
    console.log('Custom PDF generation completed successfully');
    toast.success('PDF downloaded successfully!');
  } catch (error) {
    console.error('=== Custom PDF Generation Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Callsheet data that failed:', callsheet);
    console.error('Customization that failed:', customization);
    
    // Show user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error(`Failed to download PDF: ${errorMessage}`);
    throw error;
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
    
    // Validation
    if (!callsheet.projectTitle || !callsheet.shootDate) {
      throw new Error('Missing required callsheet data: projectTitle or shootDate');
    }
    
    await service.previewPDF(callsheet);
    console.log('PDF preview completed successfully');
    toast.success('PDF preview opened in new tab!');
  } catch (error) {
    console.error('=== PDF Preview Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Callsheet data that failed:', callsheet);
    
    // Show user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error(`Failed to preview PDF: ${errorMessage}`);
    throw error;
  }
};

// Export the service class for direct use
export { ReactPDFService };
