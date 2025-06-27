
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

export class ValidationUtils {
  static validateCallsheet(callsheet: CallsheetData): void {
    if (!callsheet) {
      throw new Error('Callsheet data is required');
    }

    if (!callsheet.projectTitle || callsheet.projectTitle.trim() === '') {
      throw new Error('Project title is required');
    }

    if (!callsheet.shootDate || callsheet.shootDate.trim() === '') {
      throw new Error('Shoot date is required');
    }

    // Validate required arrays exist (can be empty)
    if (!Array.isArray(callsheet.cast)) {
      callsheet.cast = [];
    }
    if (!Array.isArray(callsheet.crew)) {
      callsheet.crew = [];
    }
    if (!Array.isArray(callsheet.schedule)) {
      callsheet.schedule = [];
    }
    if (!Array.isArray(callsheet.emergencyContacts)) {
      callsheet.emergencyContacts = [];
    }
  }

  static validateCustomization(customization: PDFCustomization): void {
    if (!customization) {
      throw new Error('PDF customization is required');
    }

    // Validate and fix cornerRadius to prevent the cornerRadius bug
    if (customization.visual?.cornerRadius !== undefined) {
      const radius = customization.visual.cornerRadius;
      if (typeof radius !== 'number' || isNaN(radius) || radius < 0) {
        console.warn('ValidationUtils: Invalid cornerRadius detected, setting to default value 8');
        customization.visual.cornerRadius = 8;
      }
      // Clamp to reasonable bounds
      if (radius > 20) {
        customization.visual.cornerRadius = 20;
      }
    }

    // Validate colors exist
    if (!customization.colors) {
      throw new Error('PDF colors configuration is required');
    }

    // Validate typography exists
    if (!customization.typography) {
      throw new Error('PDF typography configuration is required');
    }

    console.log('ValidationUtils: Customization validated successfully');
  }
}
