
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

      // Try to ensure fonts are registered, but don't fail if they can't be
      try {
        await this.fontManager.ensureFontsRegistered();
        console.log('PDFGenerator: Fonts registered successfully');
      } catch (fontError) {
        console.warn('PDFGenerator: Font registration failed, continuing with default fonts:', fontError);
      }

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
      
      // If it's a font-related error, try again with a simplified customization
      if (error instanceof Error && error.message.includes('font')) {
        console.log('PDFGenerator: Attempting PDF generation with default font fallback...');
        try {
          const fallbackCustomization = {
            ...customization,
            typography: {
              ...customization.typography,
              fontFamily: 'helvetica' as const
            }
          };
          
          const documentElement = React.createElement(CallsheetDocument, {
            callsheet,
            customization: fallbackCustomization
          }) as React.ReactElement;

          const blob = await pdf(documentElement).toBlob();
          
          if (!blob || blob.size === 0) {
            throw new Error('Generated PDF is empty');
          }

          console.log('PDFGenerator: PDF generated successfully with fallback font, size:', blob.size);
          return blob;
        } catch (fallbackError) {
          console.error('PDFGenerator: Fallback generation also failed:', fallbackError);
          throw new Error(`PDF generation failed even with fallback: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
        }
      }
      
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
