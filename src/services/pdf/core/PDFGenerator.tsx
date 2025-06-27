import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { HtmlToPdfService } from '../HtmlToPdfService';
import { CallsheetPDFForGeneration } from '@/components/pdf/CallsheetPDFForGeneration';
import React from 'react';
import { createRoot } from 'react-dom/client';

export class PDFGenerator {
  private htmlToPdfService: HtmlToPdfService;
  
  constructor() {
    this.htmlToPdfService = new HtmlToPdfService();
  }

  async generatePDF(callsheet: CallsheetData, customization: PDFCustomization): Promise<Blob> {
    try {
      console.log('PDFGenerator: Creating temporary PDF preview component');
      
      // Create a temporary container
      const tempContainer = document.createElement('div');
      document.body.appendChild(tempContainer);
      
      return new Promise<Blob>((resolve, reject) => {
        const root = createRoot(tempContainer);
        
        const handleReady = async () => {
          try {
            console.log('PDFGenerator: PDF preview ready, generating PDF...');
            
            // Generate PDF from the rendered component
            const blob = await this.htmlToPdfService.generatePDF(
              callsheet, 
              customization, 
              'pdf-preview-container'
            );
            
            // Clean up
            root.unmount();
            document.body.removeChild(tempContainer);
            
            resolve(blob);
          } catch (error) {
            console.error('Error generating PDF:', error);
            
            // Clean up on error
            root.unmount();
            document.body.removeChild(tempContainer);
            
            reject(error);
          }
        };

        // Render the PDF preview component
        root.render(
          <CallsheetPDFForGeneration
            callsheet={callsheet}
            customization={customization}
            onReady={handleReady}
          />
        );
      });
      
    } catch (error) {
      console.error('Error in PDF generation:', error);
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
