
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { PDFService } from './pdf/PDFService';
import { toast } from 'sonner';

// Main PDF generation function using the new PDFService
export const generateCallsheetPDF = async (callsheet: CallsheetData) => {
  console.log('=== PDF Generation Start ===');
  console.log('Generating callsheet PDF for:', callsheet.projectTitle);
  
  try {
    const service = new PDFService();
    await service.downloadPDF(callsheet);
    console.log('PDF generation completed successfully');
    toast.success('PDF downloaded successfully!');
  } catch (error) {
    console.error('=== PDF Generation Error ===');
    console.error('Error details:', error);
    
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
  
  try {
    const service = new PDFService(customization);
    await service.downloadPDF(callsheet);
    console.log('Custom PDF generation completed successfully');
    toast.success('PDF downloaded successfully!');
  } catch (error) {
    console.error('=== Custom PDF Generation Error ===');
    console.error('Error details:', error);
    
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
    const service = new PDFService(customization);
    await service.previewPDF(callsheet);
    console.log('PDF preview completed successfully');
    toast.success('PDF preview opened in new tab!');
  } catch (error) {
    console.error('=== PDF Preview Error ===');
    console.error('Error details:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error(`Failed to preview PDF: ${errorMessage}`);
    throw error;
  }
};

// Export the service class for direct use
export { PDFService };
