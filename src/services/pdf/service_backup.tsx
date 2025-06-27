import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { PDFGenerator } from './core/PDFGenerator';
import { DownloadManager } from './core/DownloadManager';
import { FontManager } from './core/FontManager';

export class ReactPDFService {
  protected customization: PDFCustomization;
  private generator: PDFGenerator;
  private downloadManager: DownloadManager;
  private fontManager: FontManager;

  constructor(customization: Partial<PDFCustomization> = {}) {
    // Initialize with proper defaults
    this.customization = this.getDefaultCustomization(customization);
    this.generator = new PDFGenerator();
    this.downloadManager = new DownloadManager();
    this.fontManager = new FontManager();
    console.log('ReactPDFService initialized with customization:', this.customization);
  }

  private getDefaultCustomization(partial: Partial<PDFCustomization>): PDFCustomization {
    return {
      visual: {
        cornerRadius: 4,
        cardStyle: 'minimal',
        sectionDividers: 'line',
        shadowIntensity: 'subtle',
        ...partial.visual
      },
      layout: {
        headerStyle: 'professional',
        pageOrientation: 'portrait',
        ...partial.layout
      },
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f1f5f9',
        text: '#1e293b',
        background: '#ffffff',
        ...partial.colors
      },
      typography: {
        headerFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'medium',
        ...partial.typography
      }
    };
  }

  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    console.log('Generating PDF blob for:', callsheet.projectTitle);
    return await this.generator.generatePDF(callsheet, this.customization);
  }

  async savePDF(callsheet: CallsheetData): Promise<void> {
    try {
      const blob = await this.generatePDF(callsheet);
      this.downloadManager.downloadBlob(blob, `${callsheet.projectTitle}_callsheet.pdf`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw new Error(`PDF download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async previewPDF(callsheet: CallsheetData): Promise<void> {
    try {
      const blob = await this.generatePDF(callsheet);
      this.downloadManager.previewBlob(blob);
    } catch (error) {
      console.error('Error previewing PDF:', error);
      throw new Error(`PDF preview failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  protected async ensureFontsRegistered(): Promise<void> {
    await this.fontManager.ensureFontsRegistered();
  }
}
