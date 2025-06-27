
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { PDFGenerator } from './core/PDFGenerator';
import { DownloadManager } from './core/DownloadManager';
import { CustomizationMerger } from './utils/CustomizationMerger';

export class PDFService {
  private generator: PDFGenerator;
  private customization: PDFCustomization;

  constructor(customization: Partial<PDFCustomization> = {}) {
    this.generator = new PDFGenerator();
    this.customization = CustomizationMerger.merge(DEFAULT_PDF_CUSTOMIZATION, customization);
    
    console.log('PDFService: Initialized with customization');
  }

  async downloadPDF(callsheet: CallsheetData): Promise<void> {
    console.log('PDFService: Starting PDF download for:', callsheet.projectTitle);
    
    try {
      const blob = await this.generator.generatePDF(callsheet, this.customization);
      const filename = `${callsheet.projectTitle}_CallSheet_${callsheet.shootDate}.pdf`;
      
      await DownloadManager.downloadBlob(blob, filename);
      console.log('PDFService: PDF download completed successfully');
    } catch (error) {
      console.error('PDFService: Download failed:', error);
      throw error;
    }
  }

  async previewPDF(callsheet: CallsheetData): Promise<void> {
    console.log('PDFService: Starting PDF preview for:', callsheet.projectTitle);
    
    try {
      const blob = await this.generator.generatePDF(callsheet, this.customization);
      await DownloadManager.openPreview(blob);
      console.log('PDFService: PDF preview opened successfully');
    } catch (error) {
      console.error('PDFService: Preview failed:', error);
      throw error;
    }
  }

  updateCustomization(customization: Partial<PDFCustomization>): void {
    this.customization = CustomizationMerger.merge(this.customization, customization);
    console.log('PDFService: Customization updated');
  }
}
