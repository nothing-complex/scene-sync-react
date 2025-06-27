
import { Font } from '@react-pdf/renderer';

// Simple font registration with system fonts and minimal external dependencies
export const registerPDFFonts = () => {
  console.log('Registering fonts with system fallbacks...');
  
  try {
    // Use Helvetica as primary font - it's widely supported in PDF generation
    Font.register({
      family: 'Helvetica',
      fonts: [
        { src: 'Helvetica', fontWeight: 400 },
        { src: 'Helvetica-Bold', fontWeight: 700 }
      ]
    });

    // Register Times as secondary option
    Font.register({
      family: 'Times-Roman',
      fonts: [
        { src: 'Times-Roman', fontWeight: 400 },
        { src: 'Times-Bold', fontWeight: 700 }
      ]
    });

    console.log('System fonts registered successfully');
    return true;
  } catch (error) {
    console.warn('Font registration failed, continuing with defaults:', error);
    return false;
  }
};

export const getFontFamily = (family: string) => {
  // Always return Helvetica as it's the most reliable for PDF generation
  return 'Helvetica';
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
