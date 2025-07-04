import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { PDFGenerator } from './core/PDFGenerator';
import { DownloadManager } from './core/DownloadManager';
import { CustomizationMerger } from './utils/CustomizationMerger';

export class PDFService {
  private generator: PDFGenerator;
  private downloadManager: DownloadManager;

  constructor() {
    this.generator = new PDFGenerator();
    this.downloadManager = new DownloadManager();
  }

  async generatePDF(callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}): Promise<Blob> {
    console.log('PDFService: Starting PDF generation');
    
    const mergedCustomization = await CustomizationMerger.mergeCustomization(customization);
    return await this.generator.generatePDF(callsheet, mergedCustomization);
  }

  async savePDF(callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}, filename?: string): Promise<void> {
    console.log('PDFService: Starting PDF save');
    
    const blob = await this.generatePDF(callsheet, customization);
    
    const sanitizedTitle = (callsheet.projectTitle || 'callsheet')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const fileName = filename || `${sanitizedTitle}_callsheet.pdf`;
    
    await this.downloadManager.downloadBlob(blob, fileName);
  }

  async previewPDF(callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}): Promise<void> {
    console.log('PDFService: Starting PDF preview');
    
    const blob = await this.generatePDF(callsheet, customization);
    await this.downloadManager.previewBlob(blob);
  }
}
