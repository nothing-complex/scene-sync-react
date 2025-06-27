
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
        margins: { top: 32, bottom: 32, left: 32, right: 32 },
        spacing: { sectionGap: 24, itemGap: 12, lineHeight: 1.4 },
        template: 'minimal',
        ...partial.layout
      },
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f1f5f9',
        text: '#1e293b',
        background: '#ffffff',
        textLight: '#6b7280',
        surface: '#f9fafb',
        surfaceHover: '#f3f4f6',
        border: '#e5e7eb',
        borderLight: '#f3f4f6',
        ...partial.colors
      },
      typography: {
        fontFamily: 'inter',
        fontSize: {
          title: 24,
          header: 12,
          body: 10,
          small: 8,
          caption: 7
        },
        fontWeight: {
          title: 'semibold',
          header: 'medium',
          body: 'normal'
        },
        lineHeight: {
          title: 1.2,
          header: 1.3,
          body: 1.4
        },
        ...partial.typography
      },
      branding: {
        companyName: '',
        footer: { text: '', position: 'center', style: 'minimal' },
        ...partial.branding
      },
      sections: {
        order: ['basic', 'location', 'cast', 'crew', 'schedule', 'emergency', 'notes'],
        visibility: {
          weather: true,
          emergencyContacts: true,
          schedule: true,
          notes: true,
          companyInfo: true
        },
        formatting: {
          contactLayout: 'list',
          scheduleCompact: false,
          emergencyProminent: true,
          showSectionIcons: false,
          alternateRowColors: false
        },
        ...partial.sections
      },
      theme: {
        name: 'minimal',
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#f1f5f9',
          text: '#1e293b',
          background: '#ffffff',
          textLight: '#6b7280',
          surface: '#f9fafb',
          surfaceHover: '#f3f4f6',
          border: '#e5e7eb',
          borderLight: '#f3f4f6'
        },
        typography: {},
        visual: {
          cornerRadius: 4,
          cardStyle: 'minimal',
          sectionDividers: 'line',
          shadowIntensity: 'subtle',
          headerBackground: 'none',
          iconStyle: 'minimal'
        }
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
