
import { Font } from '@react-pdf/renderer';

// FIXED: Use reliable TTF font URLs with proper fallback handling
export const registerPDFFonts = () => {
  console.log('Registering fonts with TTF format and fallbacks...');
  
  try {
    // Inter font family with TTF format
    Font.register({
      family: 'Inter',
      fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.ttf', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKXgZ9hiA.ttf', fontWeight: 500 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fgZ9hiA.ttf', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfgZ9hiA.ttf', fontWeight: 700 }
      ]
    });

    // Poppins font family with TTF format
    Font.register({
      family: 'Poppins',
      fonts: [
        { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.ttf', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.ttf', fontWeight: 500 },
        { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.ttf', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.ttf', fontWeight: 700 }
      ]
    });

    // Montserrat font family with TTF format
    Font.register({
      family: 'Montserrat',
      fonts: [
        { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459W1hyw.ttf', fontWeight: 500 },
        { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WRhyw.ttf', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wdhyw.ttf', fontWeight: 700 }
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
      case 'poppins': return 'Poppins';
      case 'montserrat': return 'Montserrat';
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
