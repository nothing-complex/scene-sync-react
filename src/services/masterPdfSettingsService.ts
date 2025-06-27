
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { supabase } from '@/integrations/supabase/client';

export class MasterPDFSettingsService {
  static async saveMasterSettings(customization: PDFCustomization): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to save master PDF settings');
      }

      const { error } = await supabase
        .from('master_pdf_settings')
        .upsert({
          user_id: user.id,
          settings: customization
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Supabase error saving master PDF settings:', error);
        throw new Error('Failed to save master PDF settings');
      }

      console.log('Master PDF settings saved successfully to Supabase');
    } catch (error) {
      console.error('Failed to save master PDF settings:', error);
      throw error;
    }
  }

  static async loadMasterSettings(): Promise<PDFCustomization> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user, using default settings');
        return DEFAULT_PDF_CUSTOMIZATION;
      }

      const { data, error } = await supabase
        .from('master_pdf_settings')
        .select('settings')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Supabase error loading master PDF settings:', error);
        return DEFAULT_PDF_CUSTOMIZATION;
      }

      if (!data) {
        console.log('No master PDF settings found for user, using defaults');
        return DEFAULT_PDF_CUSTOMIZATION;
      }

      console.log('Master PDF settings loaded successfully from Supabase');
      
      // Deep merge with defaults to ensure all properties are present
      return this.deepMergeWithDefaults(DEFAULT_PDF_CUSTOMIZATION, data.settings);
    } catch (error) {
      console.error('Failed to load master PDF settings:', error);
      return DEFAULT_PDF_CUSTOMIZATION;
    }
  }

  static async clearMasterSettings(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to clear master PDF settings');
      }

      const { error } = await supabase
        .from('master_pdf_settings')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Supabase error clearing master PDF settings:', error);
        throw new Error('Failed to clear master PDF settings');
      }

      console.log('Master PDF settings cleared successfully');
    } catch (error) {
      console.error('Failed to clear master PDF settings:', error);
      throw error;
    }
  }

  static async hasMasterSettings(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return false;
      }

      const { data, error } = await supabase
        .from('master_pdf_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking for master PDF settings:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Failed to check master PDF settings:', error);
      return false;
    }
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
