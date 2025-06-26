
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';

const MASTER_PDF_SETTINGS_KEY = 'master_pdf_settings';

export class MasterPDFSettingsService {
  static saveMasterSettings(customization: PDFCustomization): void {
    try {
      const serializedSettings = JSON.stringify(customization);
      localStorage.setItem(MASTER_PDF_SETTINGS_KEY, serializedSettings);
      console.log('Master PDF settings saved successfully');
    } catch (error) {
      console.error('Failed to save master PDF settings:', error);
      throw new Error('Failed to save master PDF settings');
    }
  }

  static loadMasterSettings(): PDFCustomization {
    try {
      const serializedSettings = localStorage.getItem(MASTER_PDF_SETTINGS_KEY);
      if (!serializedSettings) {
        console.log('No master PDF settings found, using defaults');
        return DEFAULT_PDF_CUSTOMIZATION;
      }

      const parsedSettings = JSON.parse(serializedSettings);
      console.log('Master PDF settings loaded successfully');
      
      // Deep merge with defaults to ensure all properties are present
      return this.deepMergeWithDefaults(DEFAULT_PDF_CUSTOMIZATION, parsedSettings);
    } catch (error) {
      console.error('Failed to load master PDF settings:', error);
      return DEFAULT_PDF_CUSTOMIZATION;
    }
  }

  static clearMasterSettings(): void {
    try {
      localStorage.removeItem(MASTER_PDF_SETTINGS_KEY);
      console.log('Master PDF settings cleared successfully');
    } catch (error) {
      console.error('Failed to clear master PDF settings:', error);
    }
  }

  static hasMasterSettings(): boolean {
    return localStorage.getItem(MASTER_PDF_SETTINGS_KEY) !== null;
  }

  private static deepMergeWithDefaults(defaults: PDFCustomization, custom: Partial<PDFCustomization>): PDFCustomization {
    return {
      ...defaults,
      ...custom,
      colors: { ...defaults.colors, ...custom.colors },
      typography: { 
        ...defaults.typography, 
        ...custom.typography,
        fontSize: { ...defaults.typography.fontSize, ...custom.typography?.fontSize },
        fontWeight: { ...defaults.typography.fontWeight, ...custom.typography?.fontWeight },
        lineHeight: { ...defaults.typography.lineHeight, ...custom.typography?.lineHeight }
      },
      layout: { 
        ...defaults.layout, 
        ...custom.layout,
        margins: { ...defaults.layout.margins, ...custom.layout?.margins },
        spacing: { ...defaults.layout.spacing, ...custom.layout?.spacing }
      },
      visual: { ...defaults.visual, ...custom.visual },
      sections: { 
        ...defaults.sections, 
        ...custom.sections,
        visibility: { ...defaults.sections.visibility, ...custom.sections?.visibility },
        formatting: { ...defaults.sections.formatting, ...custom.sections?.formatting }
      },
      branding: { 
        ...defaults.branding, 
        ...custom.branding,
        logo: custom.branding?.logo ? {
          ...defaults.branding.logo,
          ...custom.branding.logo
        } : custom.branding?.logo,
        footer: custom.branding?.footer ? {
          ...defaults.branding.footer,
          ...custom.branding.footer
        } : custom.branding?.footer
      }
    };
  }
}
