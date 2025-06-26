
import { useMemo } from 'react';
import { PDFCustomization } from '@/types/pdfTypes';
import { MasterPDFSettingsService } from '@/services/masterPdfSettingsService';

export const useMasterPdfSettings = (): PDFCustomization => {
  const masterSettings = useMemo(() => {
    return MasterPDFSettingsService.loadMasterSettings();
  }, []);

  return masterSettings;
};
