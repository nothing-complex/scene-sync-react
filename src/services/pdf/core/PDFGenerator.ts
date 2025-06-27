
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetPDFDocument } from '../sections/CallsheetDocument';
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
      // Validate inputs
      ValidationUtils.validateCallsheet(callsheet);
      ValidationUtils.validateCustomization(customization);
      
      // Ensure fonts are registered
      await this.fontManager.ensureFontsRegistered();

      // Create the document
      const documentElement = (
        <CallsheetPDFDocument
          callsheet={callsheet}
          customization={customization}
        />
      );

      // Generate blob
      const blob = await pdf(documentElement).toBlob();
      
      if (!blob || blob.size === 0) {
        throw new Error('Generated PDF blob is empty or invalid');
      }
      
      console.log('PDFGenerator: PDF generated successfully, size:', blob.size, 'bytes');
      return blob;
    } catch (error) {
      console.error('PDFGenerator: Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
