
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { PDFService } from './pdf/PDFService';
import { toast } from 'sonner';

// Main PDF generation function
export const generateCallsheetPDF = async (callsheet: CallsheetData) => {
  console.log('=== PDF Generation Start ===');
  
  try {
    const service = new PDFService();
    await service.savePDF(callsheet);
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
  
  try {
    const service = new PDFService();
    await service.savePDF(callsheet, customization);
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
  
  try {
    const service = new PDFService();
    await service.previewPDF(callsheet, customization);
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
