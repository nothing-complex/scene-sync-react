
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { ReactPDFService } from './pdf/service_backup';

export class HTMLToPDFService extends ReactPDFService {
  constructor(customization: Partial<PDFCustomization> = {}) {
    super(customization);
    console.log('HTMLToPDFService initialized, delegating to ReactPDFService');
  }

  // All methods are inherited from ReactPDFService
  // This service now uses React PDF rendering instead of HTML to PDF conversion
}
