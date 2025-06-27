
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetPDFDocument } from '../sections/CallsheetDocument';
import { pdf } from '@react-pdf/renderer';
import { FontManager } from './FontManager';
import React from 'react';

export class PDFGenerator {
  private fontManager: FontManager;
  
  constructor() {
    this.fontManager = new FontManager();
  }

  async generatePDF(callsheet: CallsheetData, customization: PDFCustomization): Promise<Blob> {
    try {
      console.log('Generating PDF with customization:', customization);
      
      // Ensure fonts are registered
      await this.fontManager.ensureFontsRegistered();

      // Validate customization - ensure border radius is defined
      const validatedCustomization = this.validateCustomization(customization);
      
      console.log('Creating PDF document...');
      
      // Create JSX element - CallsheetPDFDocument returns a Document element
      const documentElement = (
        <CallsheetPDFDocument
          callsheet={callsheet}
          customization={validatedCustomization}
        />
      );

      console.log('Generating PDF blob...');
      const blob = await pdf(documentElement).toBlob();
      console.log('PDF blob generated successfully, size:', blob.size);
      
      return blob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateCustomization(customization: PDFCustomization): PDFCustomization {
    // Ensure all visual properties have valid defaults
    const validated: PDFCustomization = {
      ...customization,
      visual: {
        cornerRadius: customization.visual?.cornerRadius ?? 4,
        cardStyle: customization.visual?.cardStyle ?? 'minimal',
        sectionDividers: customization.visual?.sectionDividers ?? 'line',
        shadowIntensity: customization.visual?.shadowIntensity ?? 'subtle',
        ...customization.visual
      },
      layout: {
        headerStyle: customization.layout?.headerStyle ?? 'professional',
        pageOrientation: customization.layout?.pageOrientation ?? 'portrait',
        ...customization.layout
      },
      colors: {
        primary: customization.colors?.primary ?? '#2563eb',
        secondary: customization.colors?.secondary ?? '#64748b',
        accent: customization.colors?.accent ?? '#f1f5f9',
        text: customization.colors?.text ?? '#1e293b',
        background: customization.colors?.background ?? '#ffffff',
        ...customization.colors
      },
      typography: {
        fontFamily: customization.typography?.fontFamily ?? 'inter',
        fontSize: customization.typography?.fontSize ?? {
          title: 24,
          header: 12,
          body: 10,
          small: 8,
          caption: 7
        },
        ...customization.typography
      }
    };

    console.log('Validated customization:', validated);
    return validated;
  }
}
