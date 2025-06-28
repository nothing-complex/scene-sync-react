
import { PDFTheme, PDFCustomization } from './pdfTypes';

export interface IndustryThemeConfig {
  id: string;
  name: string;
  description: string;
  category: 'film' | 'tv' | 'commercial' | 'documentary';
  theme: PDFTheme;
}

export const INDUSTRY_THEMES: Record<string, IndustryThemeConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean grid layout with minimal typography and subtle borders',
    category: 'film',
    theme: {
      name: 'Minimal',
      colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        accent: '#38a169',
        text: '#1a202c',
        textLight: '#718096',
        background: '#ffffff',
        surface: '#ffffff',
        surfaceHover: '#f7fafc',
        border: '#e2e8f0',
        borderLight: '#f1f5f9',
        headerText: '#2d3748',
        headerBackground: '#ffffff'
      },
      typography: {
        fontFamily: 'inter',
        fontSize: { title: 24, header: 11, body: 9, small: 8, caption: 7 },
        fontWeight: { title: 'medium', header: 'medium', body: 'normal' },
        lineHeight: { title: 1.4, header: 1.5, body: 1.7 }
      },
      visual: {
        cardStyle: 'minimal',
        sectionDividers: 'line',
        headerBackground: 'none',
        cornerRadius: 0,
        shadowIntensity: 'none',
        iconStyle: 'minimal'
      }
    }
  },
  dense: {
    id: 'dense',
    name: 'Dense',
    description: 'Compact table-style layout with dark borders and condensed typography',
    category: 'film',
    theme: {
      name: 'Dense',
      colors: {
        primary: '#1a1a1a',
        secondary: '#2d1b1b',
        accent: '#dc2626',
        text: '#111827',
        textLight: '#4b5563',
        background: '#ffffff',
        surface: '#f9f9f9',
        surfaceHover: '#f3f3f3',
        border: '#374151',
        borderLight: '#6b7280',
        headerText: '#ffffff',
        headerBackground: '#1a1a1a'
      },
      typography: {
        fontFamily: 'helvetica',
        fontSize: { title: 28, header: 12, body: 9, small: 8, caption: 7 },
        fontWeight: { title: 'bold', header: 'bold', body: 'normal' },
        lineHeight: { title: 1.1, header: 1.2, body: 1.3 }
      },
      visual: {
        cardStyle: 'bordered',
        sectionDividers: 'accent',
        headerBackground: 'solid',
        cornerRadius: 0,
        shadowIntensity: 'subtle',
        iconStyle: 'geometric'
      }
    }
  },
  network: {
    id: 'network',
    name: 'Network',
    description: 'Corporate table-grid hybrid with structured typography and blue accents',
    category: 'tv',
    theme: {
      name: 'Network',
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#06b6d4',
        text: '#1f2937',
        textLight: '#6b7280',
        background: '#ffffff',
        surface: '#f8fafc',
        surfaceHover: '#f1f5f9',
        border: '#cbd5e1',
        borderLight: '#e2e8f0',
        headerText: '#ffffff',
        headerBackground: '#1e40af'
      },
      typography: {
        fontFamily: 'helvetica',
        fontSize: { title: 26, header: 13, body: 10, small: 8, caption: 7 },
        fontWeight: { title: 'bold', header: 'semibold', body: 'normal' },
        lineHeight: { title: 1.2, header: 1.3, body: 1.4 }
      },
      visual: {
        cardStyle: 'elevated',
        sectionDividers: 'line',
        headerBackground: 'solid',
        cornerRadius: 4,
        shadowIntensity: 'subtle',
        iconStyle: 'geometric'
      }
    }
  },
  event: {
    id: 'event',
    name: 'Event',
    description: 'Vibrant gradient-based design with large headers and card layouts',
    category: 'commercial',
    theme: {
      name: 'Event',
      colors: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#fbbf24',
        text: '#ffffff',
        textLight: '#e5e7eb',
        background: '#1f2937',
        surface: '#374151',
        surfaceHover: '#4b5563',
        border: '#6b7280',
        borderLight: '#9ca3af',
        headerText: '#ffffff',
        headerBackground: '#8b5cf6',
        gradient: { from: '#8b5cf6', to: '#ec4899', direction: 'to-br' }
      },
      typography: {
        fontFamily: 'poppins',
        fontSize: { title: 36, header: 18, body: 12, small: 10, caption: 9 },
        fontWeight: { title: 'bold', header: 'bold', body: 'medium' },
        lineHeight: { title: 1.1, header: 1.2, body: 1.5 }
      },
      visual: {
        cardStyle: 'gradient',
        sectionDividers: 'accent',
        headerBackground: 'gradient',
        cornerRadius: 20,
        shadowIntensity: 'medium',
        iconStyle: 'solid'
      }
    }
  },
  traditional: {
    id: 'traditional',
    name: 'Traditional',
    description: 'Classic form-based layout with dense information and clear borders',
    category: 'film',
    theme: {
      name: 'Traditional',
      colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#666666',
        text: '#000000',
        textLight: '#555555',
        background: '#ffffff',
        surface: '#ffffff',
        surfaceHover: '#f5f5f5',
        border: '#000000',
        borderLight: '#cccccc',
        headerText: '#000000',
        headerBackground: '#ffffff'
      },
      typography: {
        fontFamily: 'helvetica',
        fontSize: { title: 24, header: 10, body: 8, small: 7, caption: 6 },
        fontWeight: { title: 'bold', header: 'bold', body: 'normal' },
        lineHeight: { title: 1.2, header: 1.1, body: 1.2 }
      },
      visual: {
        cardStyle: 'bordered',
        sectionDividers: 'line',
        headerBackground: 'none',
        cornerRadius: 0,
        shadowIntensity: 'none',
        iconStyle: 'none'
      }
    }
  }
};

export const DEPARTMENT_COLORS = {
  camera: '#3b82f6',
  sound: '#10b981',
  lighting: '#f59e0b',
  grip: '#8b5cf6',
  art: '#ec4899',
  wardrobe: '#06b6d4',
  makeup: '#f97316',
  script: '#6366f1',
  production: '#84cc16',
  post: '#ef4444'
};
