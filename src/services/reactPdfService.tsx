
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { CallsheetPDFDocument } from './pdf/callsheetDocument_backup';

export class ReactPDFService {
  protected customization: PDFCustomization;
  private fontsRegistered: boolean = false;

  constructor(customization: Partial<PDFCustomization> = {}) {
    // Deep merge customization to ensure all nested properties are properly merged
    this.customization = this.deepMergeCustomization(DEFAULT_PDF_CUSTOMIZATION, customization);
    console.log('ReactPDFService initialized with customization:', this.customization);
  }

  private deepMergeCustomization(defaultConfig: PDFCustomization, customConfig: Partial<PDFCustomization>): PDFCustomization {
    return {
      ...defaultConfig,
      ...customConfig,
      colors: { ...defaultConfig.colors, ...customConfig.colors },
      typography: { 
        ...defaultConfig.typography, 
        ...customConfig.typography,
        fontSize: { ...defaultConfig.typography.fontSize, ...customConfig.typography?.fontSize },
        fontWeight: { ...defaultConfig.typography.fontWeight, ...customConfig.typography?.fontWeight },
        lineHeight: { ...defaultConfig.typography.lineHeight, ...customConfig.typography?.lineHeight }
      },
      layout: { 
        ...defaultConfig.layout, 
        ...customConfig.layout,
        margins: { ...defaultConfig.layout.margins, ...customConfig.layout?.margins },
        spacing: { ...defaultConfig.layout.spacing, ...customConfig.layout?.spacing }
      },
      visual: { ...defaultConfig.visual, ...customConfig.visual },
      sections: { 
        ...defaultConfig.sections, 
        ...customConfig.sections,
        visibility: { ...defaultConfig.sections.visibility, ...customConfig.sections?.visibility },
        formatting: { ...defaultConfig.sections.formatting, ...customConfig.sections?.formatting }
      },
      branding: { ...defaultConfig.branding, ...customConfig.branding }
    };
  }

  protected async ensureFontsRegistered(): Promise<void> {
    if (!this.fontsRegistered) {
      try {
        console.log('Registering PDF fonts...');
        // Import and register fonts
        const { registerPDFFonts } = await import('./pdf/fontUtils_backup');
        registerPDFFonts();
        this.fontsRegistered = true;
        console.log('PDF fonts registered successfully');
        // Give fonts a moment to register
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('Font registration failed:', error);
        // Continue without custom fonts
      }
    }
  }

  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    console.log('Generating PDF blob with React PDF Document:', callsheet);
    console.log('Using customization:', this.customization);
    
    try {
      // Ensure fonts are registered before generating PDF
      await this.ensureFontsRegistered();

      // Validate callsheet data
      if (!callsheet || !callsheet.projectTitle) {
        throw new Error('Invalid callsheet data provided');
      }

      console.log('Creating React PDF document...');
      
      // Create the document using JSX syntax which returns the Document element directly
      const documentElement = (
        <CallsheetPDFDocument
          callsheet={callsheet}
          customization={this.customization}
        />
      );

      console.log('Generating PDF blob...');
      // Pass the document element directly to pdf()
      const blob = await pdf(documentElement).toBlob();
      console.log('PDF blob generated successfully, size:', blob.size);
      return blob;
      
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async savePDF(callsheet: CallsheetData, filename?: string): Promise<void> {
    console.log('Saving PDF for callsheet:', callsheet.projectTitle);
    try {
      const blob = await this.generatePDF(callsheet);
      const fileName = filename || `${(callsheet.projectTitle || 'callsheet').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_callsheet.pdf`;
      
      console.log('Creating download link for:', fileName);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('PDF download initiated successfully');
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw error;
    }
  }

  async previewPDF(callsheet: CallsheetData): Promise<void> {
    console.log('Previewing PDF for callsheet:', callsheet.projectTitle);
    try {
      const blob = await this.generatePDF(callsheet);
      console.log('Opening PDF preview in new window');
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        console.warn('Popup blocked, trying alternative method');
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      }
      
      // Clean up the URL after a delay to allow the browser to load it
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
      
      console.log('PDF preview opened successfully');
    } catch (error) {
      console.error('Error previewing PDF:', error);
      throw error;
    }
  }
}
