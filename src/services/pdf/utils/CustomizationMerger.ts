
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';

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

  static mergeCustomization(customization: Partial<PDFCustomization>): PDFCustomization {
    console.log('CustomizationMerger: Merging customization with defaults');
    
    const merged = this.safeDeepMerge(DEFAULT_PDF_CUSTOMIZATION, customization);
    
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
    
    console.log('CustomizationMerger: Final cornerRadius:', merged.visual.cornerRadius);
    return merged;
  }
}
