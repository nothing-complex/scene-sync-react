
import { Font } from '@react-pdf/renderer';

// FIXED: Use reliable TTF font URLs with proper fallback handling
export const registerPDFFonts = () => {
  console.log('Registering fonts with TTF format and fallbacks...');
  
  try {
    // Inter font family with TTF format - using direct TTF links
    Font.register({
      family: 'Inter',
      fonts: [
        { src: 'https://rsms.me/inter/font-files/Inter-Regular.ttf', fontWeight: 400 },
        { src: 'https://rsms.me/inter/font-files/Inter-Medium.ttf', fontWeight: 500 },
        { src: 'https://rsms.me/inter/font-files/Inter-SemiBold.ttf', fontWeight: 600 },
        { src: 'https://rsms.me/inter/font-files/Inter-Bold.ttf', fontWeight: 700 }
      ]
    });

    // Fallback to system fonts if custom fonts fail
    Font.register({
      family: 'Helvetica',
      fonts: [
        { src: 'Helvetica', fontWeight: 400 },
        { src: 'Helvetica-Bold', fontWeight: 700 }
      ]
    });

    console.log('All fonts registered successfully with TTF format');
  } catch (error) {
    console.warn('Font registration failed, using system fallbacks:', error);
    // Continue without custom fonts - system fonts will be used
  }
};

export const getFontFamily = (family: string) => {
  try {
    switch (family) {
      case 'inter': return 'Inter';
      case 'poppins': return 'Helvetica'; // Fallback to Helvetica
      case 'montserrat': return 'Helvetica'; // Fallback to Helvetica
      case 'helvetica':
      default: return 'Helvetica';
    }
  } catch (error) {
    console.warn('Font family error, using Helvetica fallback:', error);
    return 'Helvetica';
  }
};

export const getFontWeight = (weight: string): number => {
  switch (weight) {
    case 'normal': return 400;
    case 'medium': return 500;
    case 'semibold': return 600;
    case 'bold': return 700;
    default: return 400;
  }
};
