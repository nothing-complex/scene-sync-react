
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { HTMLToPDFService } from './htmlToPdfService';

// Service class that now uses HTML-to-PDF under the hood
export class ReactPDFService {
  private htmlToPdfService: HTMLToPDFService;

  constructor(customization: Partial<PDFCustomization> = {}) {
    this.htmlToPdfService = new HTMLToPDFService(customization);
    console.log('ReactPDFService initialized (using HTML-to-PDF)');
  }

  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    return this.htmlToPdfService.generatePDF(callsheet);
  }

  async savePDF(callsheet: CallsheetData, filename?: string): Promise<void> {
    return this.htmlToPdfService.savePDF(callsheet, filename);
  }

  async previewPDF(callsheet: CallsheetData): Promise<void> {
    return this.htmlToPdfService.previewPDF(callsheet);
  }
}

// Helper function for backward compatibility
export const generateReactPDF = async (callsheet: CallsheetData) => {
  const service = new ReactPDFService();
  return service.savePDF(callsheet);
};
