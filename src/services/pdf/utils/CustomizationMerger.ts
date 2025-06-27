
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';

export class CustomizationMerger {
  static merge(base: PDFCustomization, override: Partial<PDFCustomization>): PDFCustomization {
    console.log('CustomizationMerger: Merging customizations...');
    
    // Deep merge with proper handling of nested objects
    const merged: PDFCustomization = {
      ...DEFAULT_PDF_CUSTOMIZATION,
      ...base,
      ...override,
      layout: {
        ...DEFAULT_PDF_CUSTOMIZATION.layout,
        ...base.layout,
        ...override.layout
      },
      typography: {
        ...DEFAULT_PDF_CUSTOMIZATION.typography,
        ...base.typography,
        ...override.typography,
        fontSize: {
          ...DEFAULT_PDF_CUSTOMIZATION.typography.fontSize,
          ...base.typography?.fontSize,
          ...override.typography?.fontSize
        },
        fontWeight: {
          ...DEFAULT_PDF_CUSTOMIZATION.typography.fontWeight,
          ...base.typography?.fontWeight,
          ...override.typography?.fontWeight
        },
        lineHeight: {
          ...DEFAULT_PDF_CUSTOMIZATION.typography.lineHeight,
          ...base.typography?.lineHeight,
          ...override.typography?.lineHeight
        }
      },
      colors: {
        ...DEFAULT_PDF_CUSTOMIZATION.colors,
        ...base.colors,
        ...override.colors
      },
      visual: {
        ...DEFAULT_PDF_CUSTOMIZATION.visual,
        ...base.visual,
        ...override.visual
      },
      branding: {
        ...DEFAULT_PDF_CUSTOMIZATION.branding,
        ...base.branding,
        ...override.branding,
        logo: override.branding?.logo || base.branding?.logo,
        footer: {
          ...DEFAULT_PDF_CUSTOMIZATION.branding.footer,
          ...base.branding?.footer,
          ...override.branding?.footer
        }
      },
      sections: {
        ...DEFAULT_PDF_CUSTOMIZATION.sections,
        ...base.sections,
        ...override.sections,
        visibility: {
          ...DEFAULT_PDF_CUSTOMIZATION.sections.visibility,
          ...base.sections?.visibility,
          ...override.sections?.visibility
        },
        formatting: {
          ...DEFAULT_PDF_CUSTOMIZATION.sections.formatting,
          ...base.sections?.formatting,
          ...override.sections?.formatting
        }
      }
    };

    console.log('CustomizationMerger: Customizations merged successfully');
    return merged;
  }
}
