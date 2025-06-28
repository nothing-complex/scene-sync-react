
import { PDFTheme } from './pdfTypes';

export interface IndustryThemeConfig {
  id: string;
  name: string;
  description: string;
  theme: PDFTheme;
}

export const INDUSTRY_THEMES: Record<string, IndustryThemeConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean grid layout with minimal typography and subtle borders',
    theme: {
      name: 'Minimal',
      colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        accent: '#38a169',
        text: '#1a202c',
        textLight: '#718096',
        titleText: '#1a202c',
        headerText: '#2d3748',
        contactNameText: '#1a202c',
        contactRoleText: '#718096',
        contactDetailsText: '#1a202c',
        scheduleHeaderText: '#2d3748',
        scheduleBodyText: '#1a202c',
        emergencyText: '#dc2626',
        background: '#ffffff',
        surface: '#ffffff',
        surfaceHover: '#f7fafc',
        headerBackground: '#ffffff',
        contactCardBackground: '#ffffff',
        scheduleBackground: '#ffffff',
        scheduleRowBackground: '#ffffff',
        scheduleRowAlternate: '#f7fafc',
        emergencyBackground: '#fef2f2',
        border: '#e2e8f0',
        borderLight: '#f1f5f9',
        contactCardBorder: '#e2e8f0',
        scheduleBorder: '#e2e8f0',
        emergencyBorder: '#fecaca',
        castSectionColor: '#3b82f6',
        crewSectionColor: '#10b981',
        scheduleSectionColor: '#f59e0b',
        emergencySectionColor: '#dc2626',
        notesSectionColor: '#8b5cf6'
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
    theme: {
      name: 'Dense',
      colors: {
        primary: '#1a1a1a',
        secondary: '#2d1b1b',
        accent: '#dc2626',
        text: '#111827',
        textLight: '#4b5563',
        titleText: '#111827',
        headerText: '#ffffff',
        contactNameText: '#111827',
        contactRoleText: '#4b5563',
        contactDetailsText: '#111827',
        scheduleHeaderText: '#ffffff',
        scheduleBodyText: '#111827',
        emergencyText: '#dc2626',
        background: '#ffffff',
        surface: '#f9f9f9',
        surfaceHover: '#f3f3f3',
        headerBackground: '#1a1a1a',
        contactCardBackground: '#f9f9f9',
        scheduleBackground: '#ffffff',
        scheduleRowBackground: '#f9f9f9',
        scheduleRowAlternate: '#f3f3f3',
        emergencyBackground: '#fef2f2',
        border: '#374151',
        borderLight: '#6b7280',
        contactCardBorder: '#374151',
        scheduleBorder: '#374151',
        emergencyBorder: '#fecaca',
        castSectionColor: '#dc2626',
        crewSectionColor: '#10b981',
        scheduleSectionColor: '#f59e0b',
        emergencySectionColor: '#dc2626',
        notesSectionColor: '#8b5cf6'
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
    theme: {
      name: 'Network',
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#06b6d4',
        text: '#1f2937',
        textLight: '#6b7280',
        titleText: '#1f2937',
        headerText: '#ffffff',
        contactNameText: '#1f2937',
        contactRoleText: '#6b7280',
        contactDetailsText: '#1f2937',
        scheduleHeaderText: '#ffffff',
        scheduleBodyText: '#1f2937',
        emergencyText: '#dc2626',
        background: '#ffffff',
        surface: '#f8fafc',
        surfaceHover: '#f1f5f9',
        headerBackground: '#1e40af',
        contactCardBackground: '#f8fafc',
        scheduleBackground: '#ffffff',
        scheduleRowBackground: '#f8fafc',
        scheduleRowAlternate: '#f1f5f9',
        emergencyBackground: '#fef2f2',
        border: '#cbd5e1',
        borderLight: '#e2e8f0',
        contactCardBorder: '#cbd5e1',
        scheduleBorder: '#cbd5e1',
        emergencyBorder: '#fecaca',
        castSectionColor: '#1e40af',
        crewSectionColor: '#059669',
        scheduleSectionColor: '#d97706',
        emergencySectionColor: '#dc2626',
        notesSectionColor: '#7c3aed'
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
    theme: {
      name: 'Event',
      colors: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#fbbf24',
        text: '#ffffff',
        textLight: '#e5e7eb',
        titleText: '#ffffff',
        headerText: '#ffffff',
        contactNameText: '#ffffff',
        contactRoleText: '#e5e7eb',
        contactDetailsText: '#ffffff',
        scheduleHeaderText: '#ffffff',
        scheduleBodyText: '#ffffff',
        emergencyText: '#fecaca',
        background: '#1f2937',
        surface: '#374151',
        surfaceHover: '#4b5563',
        headerBackground: '#8b5cf6',
        contactCardBackground: '#374151',
        scheduleBackground: '#374151',
        scheduleRowBackground: '#374151',
        scheduleRowAlternate: '#4b5563',
        emergencyBackground: '#7f1d1d',
        border: '#6b7280',
        borderLight: '#9ca3af',
        contactCardBorder: '#6b7280',
        scheduleBorder: '#6b7280',
        emergencyBorder: '#ef4444',
        castSectionColor: '#8b5cf6',
        crewSectionColor: '#10b981',
        scheduleSectionColor: '#fbbf24',
        emergencySectionColor: '#ef4444',
        notesSectionColor: '#a78bfa',
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
    theme: {
      name: 'Traditional',
      colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#666666',
        text: '#000000',
        textLight: '#555555',
        titleText: '#000000',
        headerText: '#000000',
        contactNameText: '#000000',
        contactRoleText: '#555555',
        contactDetailsText: '#000000',
        scheduleHeaderText: '#000000',
        scheduleBodyText: '#000000',
        emergencyText: '#dc2626',
        background: '#ffffff',
        surface: '#ffffff',
        surfaceHover: '#f5f5f5',
        headerBackground: '#ffffff',
        contactCardBackground: '#ffffff',
        scheduleBackground: '#ffffff',
        scheduleRowBackground: '#ffffff',
        scheduleRowAlternate: '#f5f5f5',
        emergencyBackground: '#fef2f2',
        border: '#000000',
        borderLight: '#cccccc',
        contactCardBorder: '#000000',
        scheduleBorder: '#000000',
        emergencyBorder: '#fecaca',
        castSectionColor: '#000000',
        crewSectionColor: '#333333',
        scheduleSectionColor: '#666666',
        emergencySectionColor: '#dc2626',
        notesSectionColor: '#000000'
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
