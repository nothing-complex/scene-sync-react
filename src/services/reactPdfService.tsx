
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

// Temporary placeholder class
export class ReactPDFService {
  constructor(customization: Partial<PDFCustomization> = {}) {
    console.warn('ReactPDFService temporarily disabled - being rebuilt');
  }

  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    throw new Error('PDF generation temporarily disabled - service being rebuilt');
  }

  async savePDF(callsheet: CallsheetData, filename?: string): Promise<void> {
    alert('PDF generation is currently being rebuilt. Please check back soon!');
  }

  async previewPDF(callsheet: CallsheetData): Promise<void> {
    alert('PDF generation is currently being rebuilt. Please check back soon!');
  }
}

export const generateReactPDF = (callsheet: CallsheetData) => {
  console.warn('PDF generation temporarily disabled - service being rebuilt');
  alert('PDF generation is currently being rebuilt. Please check back soon!');
};
