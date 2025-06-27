
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

export class ValidationUtils {
  static validateCallsheet(callsheet: CallsheetData): void {
    if (!callsheet) {
      throw new Error('CallsheetData is null or undefined');
    }
    
    if (!callsheet.projectTitle || callsheet.projectTitle.trim() === '') {
      throw new Error('Project title is required and cannot be empty');
    }
    
    if (!callsheet.shootDate || callsheet.shootDate.trim() === '') {
      throw new Error('Shoot date is required and cannot be empty');
    }
  }

  static validateCustomization(customization: PDFCustomization): void {
    if (!customization) {
      throw new Error('Customization object is required');
    }
    
    if (!customization.visual) {
      throw new Error('Visual customization is required');
    }
    
    if (!customization.typography) {
      throw new Error('Typography customization is required');
    }
    
    if (!customization.colors) {
      throw new Error('Colors customization is required');
    }
    
    if (!customization.layout?.margins) {
      throw new Error('Layout margins are required');
    }
    
    if (!customization.typography?.fontSize) {
      throw new Error('Typography fontSize is required');
    }
  }
}
