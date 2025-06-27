
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetPDFDocument } from '../callsheetDocument_backup';
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
      
      // Ensure fonts are registered with error handling
      await this.fontManager.ensureFontsRegistered();

      // Validate customization
      const validatedCustomization = this.validateCustomization(customization);
      
      console.log('Creating PDF document with backup structure that matches preview...');
      
      // Use the backup document that creates the proper layout
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
      
      // Reset font manager on error
      this.fontManager.reset();
      
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateCustomization(customization: PDFCustomization): PDFCustomization {
    // Ensure all required properties exist with safe defaults
    const validated: PDFCustomization = {
      ...customization,
      visual: {
        cornerRadius: customization.visual?.cornerRadius ?? 8,
        cardStyle: customization.visual?.cardStyle ?? 'minimal',
        sectionDividers: customization.visual?.sectionDividers ?? 'line',
        shadowIntensity: customization.visual?.shadowIntensity ?? 'subtle',
        headerBackground: customization.visual?.headerBackground ?? 'none',
        iconStyle: customization.visual?.iconStyle ?? 'minimal',
        ...customization.visual
      },
      layout: {
        headerStyle: customization.layout?.headerStyle ?? 'professional',
        pageOrientation: customization.layout?.pageOrientation ?? 'portrait',
        margins: customization.layout?.margins ?? {
          top: 40,
          bottom: 40,
          left: 40,
          right: 40
        },
        spacing: customization.layout?.spacing ?? {
          sectionGap: 20,
          itemGap: 12,
          lineHeight: 1.4
        },
        template: customization.layout?.template ?? 'minimal',
        ...customization.layout
      },
      colors: {
        primary: customization.colors?.primary ?? '#2563eb',
        secondary: customization.colors?.secondary ?? '#64748b',
        accent: customization.colors?.accent ?? '#f1f5f9',
        text: customization.colors?.text ?? '#1e293b',
        textLight: customization.colors?.textLight ?? '#64748b',
        background: customization.colors?.background ?? '#ffffff',
        surface: customization.colors?.surface ?? '#f8fafc',
        surfaceHover: customization.colors?.surfaceHover ?? '#f1f5f9',
        border: customization.colors?.border ?? '#e2e8f0',
        borderLight: customization.colors?.borderLight ?? '#f1f5f9',
        ...customization.colors
      },
      typography: {
        fontFamily: customization.typography?.fontFamily ?? 'inter',
        fontSize: customization.typography?.fontSize ?? {
          title: 32,
          header: 12,
          body: 10,
          small: 9,
          caption: 8
        },
        fontWeight: customization.typography?.fontWeight ?? {
          title: 'bold',
          header: 'semibold',
          body: 'normal'
        },
        lineHeight: customization.typography?.lineHeight ?? {
          title: 1.2,
          header: 1.3,
          body: 1.4
        },
        ...customization.typography
      },
      branding: {
        companyName: customization.branding?.companyName ?? '',
        logo: customization.branding?.logo ?? null,
        footer: customization.branding?.footer ?? null,
        ...customization.branding
      },
      sections: {
        order: customization.sections?.order ?? ['basic', 'location', 'cast', 'crew', 'schedule', 'emergency', 'notes'],
        visibility: {
          weather: true,
          emergencyContacts: true,
          schedule: true,
          notes: true,
          companyInfo: true,
          ...customization.sections?.visibility
        },
        formatting: {
          contactLayout: 'cards',
          scheduleCompact: false,
          emergencyProminent: true,
          showSectionIcons: false,
          alternateRowColors: false,
          ...customization.sections?.formatting
        },
        ...customization.sections
      },
      theme: customization.theme
    };

    console.log('Validated customization:', validated);
    return validated;
  }
}
