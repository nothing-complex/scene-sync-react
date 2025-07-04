
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { MasterPDFSettingsService } from '@/services/masterPdfSettingsService';

export class CustomizationMerger {
  static safeDeepMerge(target: any, source: any): any {
    if (!source || typeof source !== 'object') {
      return target;
    }

    const result = { ...target };

    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.safeDeepMerge(result[key] || {}, source[key]);
      } else if (source[key] !== undefined) {
        result[key] = source[key];
      }
    }

    return result;
  }

  static async mergeCustomization(customization: Partial<PDFCustomization>): Promise<PDFCustomization> {
    console.log('CustomizationMerger: Loading master settings and merging customization');
    
    try {
      // Load master settings first
      const masterSettings = await MasterPDFSettingsService.loadMasterSettings();
      console.log('CustomizationMerger: Master settings loaded:', masterSettings);
      
      // Merge: DEFAULT_PDF_CUSTOMIZATION <- masterSettings <- provided customization
      let merged = this.safeDeepMerge(DEFAULT_PDF_CUSTOMIZATION, masterSettings);
      merged = this.safeDeepMerge(merged, customization);
      
      // Ensure cornerRadius is always a valid number
      if (!merged.visual) {
        merged.visual = { ...DEFAULT_PDF_CUSTOMIZATION.visual };
      }
      
      if (typeof merged.visual.cornerRadius !== 'number' || 
          isNaN(merged.visual.cornerRadius) || 
          merged.visual.cornerRadius < 0) {
        console.warn('CustomizationMerger: Invalid cornerRadius, using default:', DEFAULT_PDF_CUSTOMIZATION.visual.cornerRadius);
        merged.visual.cornerRadius = DEFAULT_PDF_CUSTOMIZATION.visual.cornerRadius;
      }
      
      console.log('CustomizationMerger: Final merged customization:', merged);
      return merged;
    } catch (error) {
      console.error('CustomizationMerger: Error loading master settings, using defaults:', error);
      
      // Fallback to default merge if master settings fail
      const merged = this.safeDeepMerge(DEFAULT_PDF_CUSTOMIZATION, customization);
      
      if (!merged.visual) {
        merged.visual = { ...DEFAULT_PDF_CUSTOMIZATION.visual };
      }
      
      if (typeof merged.visual.cornerRadius !== 'number' || 
          isNaN(merged.visual.cornerRadius) || 
          merged.visual.cornerRadius < 0) {
        merged.visual.cornerRadius = DEFAULT_PDF_CUSTOMIZATION.visual.cornerRadius;
      }
      
      return merged;
    }
  }
}
