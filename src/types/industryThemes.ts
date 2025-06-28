
import { PDFTheme, PDFCustomization } from './pdfTypes';

export interface IndustryThemeConfig {
  id: string;
  name: string;
  description: string;
  category: 'film' | 'tv' | 'commercial' | 'documentary';
  theme: PDFTheme;
}

export const INDUSTRY_THEMES: Record<string, IndustryThemeConfig> = {
  hollywoodClassic: {
    id: 'hollywoodClassic',
    name: 'Hollywood Classic',
    description: 'Elegant serif typography with gold accents for prestige productions',
    category: 'film',
    theme: {
      name: 'Hollywood Classic',
      colors: {
        primary: '#1a1a1a',
        secondary: '#8b7355',
        accent: '#d4af37',
        text: '#2d2d2d',
        textLight: '#6b6b6b',
        background: '#fefefe',
        surface: '#faf9f7',
        surfaceHover: '#f5f4f1',
        border: '#e8e6e0',
        borderLight: '#f0efea',
        headerText: '#fefefe',
        headerBackground: '#1a1a1a',
        gradient: { from: '#d4af37', to: '#b8941f', direction: 'to-br' }
      },
      typography: {
        fontFamily: 'montserrat',
        fontSize: { title: 28, header: 14, body: 11, small: 9, caption: 8 },
        fontWeight: { title: 'bold', header: 'semibold', body: 'normal' },
        lineHeight: { title: 1.2, header: 1.3, body: 1.5 }
      },
      visual: {
        cardStyle: 'elevated',
        sectionDividers: 'accent',
        headerBackground: 'gradient',
        cornerRadius: 8,
        shadowIntensity: 'medium',
        iconStyle: 'solid'
      }
    }
  },
  indieFilm: {
    id: 'indieFilm',
    name: 'Indie Film',
    description: 'Clean, efficient design focused on essential information',
    category: 'film',
    theme: {
      name: 'Indie Film',
      colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        accent: '#38a169',
        text: '#1a202c',
        textLight: '#718096',
        background: '#ffffff',
        surface: '#f7fafc',
        surfaceHover: '#edf2f7',
        border: '#e2e8f0',
        borderLight: '#f1f5f9',
        headerText: '#ffffff',
        headerBackground: '#2d3748'
      },
      typography: {
        fontFamily: 'inter',
        fontSize: { title: 22, header: 12, body: 10, small: 8, caption: 7 },
        fontWeight: { title: 'semibold', header: 'medium', body: 'normal' },
        lineHeight: { title: 1.3, header: 1.4, body: 1.4 }
      },
      visual: {
        cardStyle: 'minimal',
        sectionDividers: 'line',
        headerBackground: 'solid',
        cornerRadius: 4,
        shadowIntensity: 'none',
        iconStyle: 'minimal'
      }
    }
  },
  horrorThriller: {
    id: 'horrorThriller',
    name: 'Horror/Thriller',
    description: 'Dark aesthetic with red accents for suspenseful productions',
    category: 'film',
    theme: {
      name: 'Horror/Thriller',
      colors: {
        primary: '#1a1a1a',
        secondary: '#2d1b1b',
        accent: '#dc2626',
        text: '#111827',
        textLight: '#4b5563',
        background: '#ffffff',
        surface: '#fafafa',
        surfaceHover: '#f5f5f5',
        border: '#e5e5e5',
        borderLight: '#f0f0f0',
        headerText: '#ffffff',
        headerBackground: '#1a1a1a'
      },
      typography: {
        fontFamily: 'helvetica',
        fontSize: { title: 26, header: 13, body: 10, small: 8, caption: 7 },
        fontWeight: { title: 'bold', header: 'semibold', body: 'normal' },
        lineHeight: { title: 1.2, header: 1.3, body: 1.4 }
      },
      visual: {
        cardStyle: 'bordered',
        sectionDividers: 'accent',
        headerBackground: 'solid',
        cornerRadius: 2,
        shadowIntensity: 'subtle',
        iconStyle: 'geometric'
      }
    }
  },
  comedy: {
    id: 'comedy',
    name: 'Comedy',
    description: 'Bright, playful design with vibrant colors',
    category: 'film',
    theme: {
      name: 'Comedy',
      colors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        accent: '#f59e0b',
        text: '#1f2937',
        textLight: '#6b7280',
        background: '#fefefe',
        surface: '#faf9ff',
        surfaceHover: '#f3f0ff',
        border: '#e5e2ff',
        borderLight: '#f0ecff',
        headerText: '#ffffff',
        headerBackground: '#7c3aed',
        gradient: { from: '#7c3aed', to: '#a855f7', direction: 'to-br' }
      },
      typography: {
        fontFamily: 'poppins',
        fontSize: { title: 26, header: 13, body: 11, small: 9, caption: 8 },
        fontWeight: { title: 'bold', header: 'semibold', body: 'normal' },
        lineHeight: { title: 1.3, header: 1.4, body: 1.5 }
      },
      visual: {
        cardStyle: 'gradient',
        sectionDividers: 'accent',
        headerBackground: 'gradient',
        cornerRadius: 12,
        shadowIntensity: 'medium',
        iconStyle: 'solid'
      }
    }
  },
  networkTv: {
    id: 'networkTv',
    name: 'Network TV',
    description: 'Corporate branding with network-style formatting',
    category: 'tv',
    theme: {
      name: 'Network TV',
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
        fontSize: { title: 24, header: 12, body: 10, small: 8, caption: 7 },
        fontWeight: { title: 'bold', header: 'semibold', body: 'normal' },
        lineHeight: { title: 1.2, header: 1.3, body: 1.4 }
      },
      visual: {
        cardStyle: 'elevated',
        sectionDividers: 'line',
        headerBackground: 'solid',
        cornerRadius: 6,
        shadowIntensity: 'subtle',
        iconStyle: 'geometric'
      }
    }
  },
  documentary: {
    id: 'documentary',
    name: 'Documentary',
    description: 'Clean, informational layout for non-fiction productions',
    category: 'documentary',
    theme: {
      name: 'Documentary',
      colors: {
        primary: '#374151',
        secondary: '#6b7280',
        accent: '#059669',
        text: '#111827',
        textLight: '#6b7280',
        background: '#ffffff',
        surface: '#f9fafb',
        surfaceHover: '#f3f4f6',
        border: '#d1d5db',
        borderLight: '#e5e7eb',
        headerText: '#ffffff',
        headerBackground: '#374151'
      },
      typography: {
        fontFamily: 'inter',
        fontSize: { title: 22, header: 11, body: 9, small: 8, caption: 7 },
        fontWeight: { title: 'semibold', header: 'medium', body: 'normal' },
        lineHeight: { title: 1.3, header: 1.4, body: 1.5 }
      },
      visual: {
        cardStyle: 'minimal',
        sectionDividers: 'space',
        headerBackground: 'solid',
        cornerRadius: 4,
        shadowIntensity: 'none',
        iconStyle: 'minimal'
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
