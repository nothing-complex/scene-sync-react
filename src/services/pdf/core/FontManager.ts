
import { Font } from '@react-pdf/renderer';

export class FontManager {
  private static fontsRegistered = false;

  async ensureFontsRegistered(): Promise<void> {
    if (FontManager.fontsRegistered) {
      return;
    }

    console.log('FontManager: Registering fonts...');
    
    try {
      // Register Inter font family with corrected URLs
      Font.register({
        family: 'Inter',
        fonts: [
          { 
            src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', 
            fontWeight: 400 
          },
          { 
            src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKXgZ9hiA.woff2', 
            fontWeight: 500 
          },
          { 
            src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fgZ9hiA.woff2', 
            fontWeight: 600 
          },
          { 
            src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfgZ9hiA.woff2', 
            fontWeight: 700 
          }
        ]
      });

      // Register Poppins font family with corrected URLs
      Font.register({
        family: 'Poppins',
        fonts: [
          { 
            src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2', 
            fontWeight: 400 
          },
          { 
            src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFd2JQEk.woff2', 
            fontWeight: 500 
          },
          { 
            src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2', 
            fontWeight: 600 
          },
          { 
            src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2', 
            fontWeight: 700 
          }
        ]
      });

      // Register Montserrat font family with corrected URLs
      Font.register({
        family: 'Montserrat',
        fonts: [
          { 
            src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2', 
            fontWeight: 400 
          },
          { 
            src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459W1hyw.woff2', 
            fontWeight: 500 
          },
          { 
            src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WRhyw.woff2', 
            fontWeight: 600 
          },
          { 
            src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wdhyw.woff2', 
            fontWeight: 700 
          }
        ]
      });

      FontManager.fontsRegistered = true;
      console.log('FontManager: All fonts registered successfully');
      
      // Add a small delay to ensure fonts are fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('FontManager: Error registering fonts:', error);
      console.warn('FontManager: Falling back to default fonts');
      
      // Don't throw here - just use default fonts
      FontManager.fontsRegistered = true;
    }
  }

  static getFontFamily(family: string): string {
    switch (family) {
      case 'inter': return 'Inter';
      case 'poppins': return 'Poppins';
      case 'montserrat': return 'Montserrat';
      case 'helvetica':
      default: return 'Helvetica';
    }
  }

  static getFontWeight(weight: string): number {
    switch (weight) {
      case 'normal': return 400;
      case 'medium': return 500;
      case 'semibold': return 600;
      case 'bold': return 700;
      default: return 400;
    }
  }
}
