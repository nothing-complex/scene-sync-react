import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { CallsheetPDFDocument } from './callsheetDocument_backup';
import { registerPDFFonts } from './fontUtils_backup';

export class ReactPDFService {
  private customization: PDFCustomization;
  private fontsRegistered: boolean = false;

  constructor(customization: Partial<PDFCustomization> = {}) {
    this.customization = { ...DEFAULT_PDF_CUSTOMIZATION, ...customization };
    console.log('ReactPDFService initialized with customization:', this.customization);
  }

  private async ensureFontsRegistered(): Promise<void> {
    if (!this.fontsRegistered) {
      try {
        console.log('Registering PDF fonts...');
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
    console.log('Generating PDF blob with full callsheet data:', callsheet);
    console.log('Using customization:', this.customization);
    
    try {
      // Ensure fonts are registered before generating PDF
      await this.ensureFontsRegistered();

      // Validate callsheet data
      if (!callsheet || !callsheet.projectTitle) {
        throw new Error('Invalid callsheet data provided');
      }

      console.log('Creating PDF document...');
      const pdfDocument = (
        <CallsheetPDFDocument 
          callsheet={callsheet}
          customization={this.customization}
        />
      );

      console.log('Generating PDF blob...');
      const blob = await pdf(pdfDocument).toBlob();
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
