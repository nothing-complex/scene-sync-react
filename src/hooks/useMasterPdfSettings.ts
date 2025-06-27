
import { useState, useEffect } from 'react';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { MasterPDFSettingsService } from '@/services/masterPdfSettingsService';
import { supabase } from '@/integrations/supabase/client';

export const useMasterPdfSettings = () => {
  const [masterSettings, setMasterSettings] = useState<PDFCustomization>(DEFAULT_PDF_CUSTOMIZATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const settings = await MasterPDFSettingsService.loadMasterSettings();
      setMasterSettings(settings);
    } catch (err) {
      console.error('Error loading master PDF settings:', err);
      setError('Failed to load master PDF settings');
      setMasterSettings(DEFAULT_PDF_CUSTOMIZATION);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Listen for auth state changes to reload settings
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        loadSettings();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    masterSettings,
    isLoading,
    error,
    refetch: loadSettings
  };
};
