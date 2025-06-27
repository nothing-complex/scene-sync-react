
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { CallsheetDocument } from '../documents/CallsheetDocument';
import { FontManager } from './FontManager';
import { ValidationUtils } from '../utils/ValidationUtils';

export class PDFGenerator {
  private fontManager: FontManager;

  constructor() {
    this.fontManager = new FontManager();
  }

  async generatePDF(callsheet: CallsheetData, customization: PDFCustomization): Promise<Blob> {
    console.log('PDFGenerator: Starting PDF generation for:', callsheet.projectTitle);
    
    try {
      // Validate input data
      ValidationUtils.validateCallsheet(callsheet);
      ValidationUtils.validateCustomization(customization);

      // Ensure fonts are registered
      await this.fontManager.ensureFontsRegistered();

      // Create document element - the CallsheetDocument component returns a Document element
      const documentElement = React.createElement(CallsheetDocument, {
        callsheet,
        customization
      }) as React.ReactElement;

      console.log('PDFGenerator: Creating PDF blob...');
      const blob = await pdf(documentElement).toBlob();
      
      if (!blob || blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      console.log('PDFGenerator: PDF generated successfully, size:', blob.size);
      return blob;
    } catch (error) {
      console.error('PDFGenerator: Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async previewPDF(callsheet: CallsheetData, customization: PDFCustomization): Promise<string> {
    console.log('PDFGenerator: Creating PDF preview URL');
    
    try {
      const blob = await this.generatePDF(callsheet, customization);
      const url = URL.createObjectURL(blob);
      console.log('PDFGenerator: Preview URL created successfully');
      return url;
    } catch (error) {
      console.error('PDFGenerator: Error creating preview URL:', error);
      throw error;
    }
  }
}
