
import { Font } from '@react-pdf/renderer';

// Register modern fonts with proper italic variants
export const registerPDFFonts = () => {
  Font.register({
    family: 'Inter',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6WgZ9hiA.woff2', fontWeight: 400, fontStyle: 'italic' },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKXgZ9hiA.woff2', fontWeight: 500 },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKWgZ9hiA.woff2', fontWeight: 500, fontStyle: 'italic' },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fgZ9hiA.woff2', fontWeight: 600 },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6WgZ9hiA.woff2', fontWeight: 600, fontStyle: 'italic' },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfgZ9hiA.woff2', fontWeight: 700 },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyWgZ9hiA.woff2', fontWeight: 700, fontStyle: 'italic' }
    ]
  });

  Font.register({
    family: 'Poppins',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiDyp8kv8JHgFVrJJLmE15VGdU.woff2', fontWeight: 400, fontStyle: 'italic' },
      { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2', fontWeight: 500 },
      { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiDyp8kv8JHgFVrJJLmE0RYGdU.woff2', fontWeight: 500, fontStyle: 'italic' },
      { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2', fontWeight: 600 },
      { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiDyp8kv8JHgFVrJJLmE0ZYGdU.woff2', fontWeight: 600, fontStyle: 'italic' },
      { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2', fontWeight: 700 },
      { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiDyp8kv8JHgFVrJJLmE01YGdU.woff2', fontWeight: 700, fontStyle: 'italic' }
    ]
  });

  Font.register({
    family: 'Montserrat',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUQjIg1_i6t8kCHKm459WxRyyg.woff2', fontWeight: 400, fontStyle: 'italic' },
      { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459W1hyw.woff2', fontWeight: 500 },
      { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUQjIg1_i6t8kCHKm459WxZyyg.woff2', fontWeight: 500, fontStyle: 'italic' },
      { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WRhyw.woff2', fontWeight: 600 },
      { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUQjIg1_i6t8kCHKm459Wx5yyg.woff2', fontWeight: 600, fontStyle: 'italic' },
      { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wdhyw.woff2', fontWeight: 700 },
      { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUQjIg1_i6t8kCHKm459Wx1yyg.woff2', fontWeight: 700, fontStyle: 'italic' }
    ]
  });
};

export const getFontFamily = (family: string) => {
  switch (family) {
    case 'inter': return 'Inter';
    case 'poppins': return 'Poppins';
    case 'montserrat': return 'Montserrat';
    case 'helvetica':
    default: return 'Helvetica';
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
