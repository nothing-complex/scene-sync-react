export interface PDFCustomization {
  layout: PDFLayout;
  typography: PDFTypography;
  branding: PDFBranding;
  colors: PDFColors;
  sections: PDFSectionConfig;
  theme: PDFTheme;
  visual: PDFVisualStyle;
  smart: PDFSmartFeatures;
}

export interface PDFLayout {
  headerAlignment: 'left' | 'center' | 'right';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    cardSpacing: number;
    lineHeight: number;
  };
  pageOrientation: 'portrait' | 'landscape';
  template: 'minimal' | 'professional' | 'creative' | 'cinematic' | 'hollywood' | 'indie' | 'horror' | 'comedy' | 'network' | 'documentary';
  borderWidth: number;
  cornerRadius: number;
}

export interface PDFTypography {
  fontFamily: 'inter' | 'helvetica' | 'poppins' | 'montserrat' | 'roboto' | 'open-sans' | 'lato' | 'source-sans' | 'nunito' | 'raleway' | 'work-sans' | 'playfair' | 'merriweather' | 'crimson' | 'libre-baskerville' | 'pt-serif';
  sectionFonts: {
    title: 'inter' | 'helvetica' | 'poppins' | 'montserrat' | 'roboto' | 'open-sans' | 'lato' | 'source-sans' | 'nunito' | 'raleway' | 'work-sans' | 'playfair' | 'merriweather' | 'crimson' | 'libre-baskerville' | 'pt-serif';
    headers: 'inter' | 'helvetica' | 'poppins' | 'montserrat' | 'roboto' | 'open-sans' | 'lato' | 'source-sans' | 'nunito' | 'raleway' | 'work-sans' | 'playfair' | 'merriweather' | 'crimson' | 'libre-baskerville' | 'pt-serif';
    body: 'inter' | 'helvetica' | 'poppins' | 'montserrat' | 'roboto' | 'open-sans' | 'lato' | 'source-sans' | 'nunito' | 'raleway' | 'work-sans' | 'playfair' | 'merriweather' | 'crimson' | 'libre-baskerville' | 'pt-serif';
    contacts: 'inter' | 'helvetica' | 'poppins' | 'montserrat' | 'roboto' | 'open-sans' | 'lato' | 'source-sans' | 'nunito' | 'raleway' | 'work-sans' | 'playfair' | 'merriweather' | 'crimson' | 'libre-baskerville' | 'pt-serif';
    schedule: 'inter' | 'helvetica' | 'poppins' | 'montserrat' | 'roboto' | 'open-sans' | 'lato' | 'source-sans' | 'nunito' | 'raleway' | 'work-sans' | 'playfair' | 'merriweather' | 'crimson' | 'libre-baskerville' | 'pt-serif';
  };
  fontSize: {
    title: number;
    header: number;
    body: number;
    small: number;
    caption: number;
  };
  fontWeight: {
    title: 'normal' | 'medium' | 'semibold' | 'bold';
    header: 'normal' | 'medium' | 'semibold' | 'bold';
    body: 'normal' | 'medium';
  };
  lineHeight: {
    title: number;
    header: number;
    body: number;
  };
}

export interface PDFBranding {
  companyName?: string;
  productionCompany?: string;
  customText1?: string;
  customText2?: string;
  customText3?: string;
  logo?: {
    url: string;
    position: 'top-left' | 'top-right';
    size: 'small' | 'medium' | 'large';
    opacity: number;
  };
  secondaryLogo?: {
    url: string;
    position: 'top-left' | 'top-right';
    size: 'small' | 'medium' | 'large';
    opacity: number;
    lockToPrimary: boolean;
  };
  footer?: {
    text: string;
    position: 'left' | 'center' | 'right';
    style: 'minimal' | 'bordered' | 'accent';
    unionCompliance?: boolean;
  };
  watermark?: {
    text: string;
    opacity: number;
    position: 'center' | 'diagonal';
    recipientType?: 'all' | 'talent' | 'crew' | 'client';
  };
}

export interface PDFColors {
  // Main colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Text colors
  text: string;
  textLight: string;
  titleText: string;
  headerText: string;
  contactNameText: string;
  contactRoleText: string;
  contactDetailsText: string;
  scheduleHeaderText: string;
  scheduleBodyText: string;
  emergencyText: string;
  
  // Background colors
  background: string;
  surface: string;
  surfaceHover: string;
  headerBackground: string;
  contactCardBackground: string;
  scheduleBackground: string;
  scheduleRowBackground: string;
  scheduleRowAlternate: string;
  emergencyBackground: string;
  
  // Border colors
  border: string;
  borderLight: string;
  contactCardBorder: string;
  scheduleBorder: string;
  emergencyBorder: string;
  
  // Section-specific colors
  castSectionColor: string;
  crewSectionColor: string;
  scheduleSectionColor: string;
  emergencySectionColor: string;
  notesSectionColor: string;
  
  gradient?: {
    from: string;
    to: string;
    direction: 'to-r' | 'to-br' | 'to-b';
  };
}

export interface PDFTheme {
  name: string;
  colors: PDFColors;
  typography: Partial<PDFTypography>;
  visual: PDFVisualStyle;
}

export interface PDFVisualStyle {
  cardStyle: 'minimal' | 'elevated' | 'bordered' | 'gradient';
  sectionDividers: 'none' | 'line' | 'space' | 'accent';
  headerBackground: 'none' | 'subtle' | 'gradient' | 'solid';
  cornerRadius: number;
  shadowIntensity: 'none' | 'subtle' | 'medium';
  iconStyle: 'none' | 'minimal' | 'geometric' | 'solid';
}

export interface PDFSectionConfig {
  order: string[];
  visibility: {
    weather: boolean;
    emergencyContacts: boolean;
    schedule: boolean;
    notes: boolean;
    companyInfo: boolean;
  };
  formatting: {
    contactLayout: 'list' | 'table' | 'cards' | 'compact';
    scheduleCompact: boolean;
    emergencyProminent: boolean;
    showSectionIcons: boolean;
    alternateRowColors: boolean;
    departmentColorCoding: boolean;
    urgencyHighlighting: boolean;
  };
  roleFiltering?: {
    enabled: boolean;
    recipientType: 'all' | 'talent' | 'crew' | 'client';
    hidePersonalInfo: boolean;
  };
}

export interface PDFSmartFeatures {
  productionType: 'feature' | 'short' | 'series' | 'commercial' | 'documentary';
  urgencyLevel: 'standard' | 'rush' | 'priority';
  unionCompliant: boolean;
  departmentColors: boolean;
  weatherResponsive: boolean;
  autoTemplate: boolean;
}

export const PDF_THEMES: Record<string, PDFTheme> = {
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
      accent: '#3b82f6',
      text: '#1f2937',
      textLight: '#6b7280',
      titleText: '#1f2937',
      headerText: '#1f2937',
      contactNameText: '#1f2937',
      contactRoleText: '#6b7280',
      contactDetailsText: '#1f2937',
      scheduleHeaderText: '#1f2937',
      scheduleBodyText: '#1f2937',
      emergencyText: '#dc2626',
      background: '#ffffff',
      surface: '#f9fafb',
      surfaceHover: '#f3f4f6',
      headerBackground: '#ffffff',
      contactCardBackground: '#f9fafb',
      scheduleBackground: '#ffffff',
      scheduleRowBackground: '#ffffff',
      scheduleRowAlternate: '#f9fafb',
      emergencyBackground: '#fef2f2',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      contactCardBorder: '#e5e7eb',
      scheduleBorder: '#e5e7eb',
      emergencyBorder: '#fecaca',
      castSectionColor: '#3b82f6',
      crewSectionColor: '#10b981',
      scheduleSectionColor: '#f59e0b',
      emergencySectionColor: '#dc2626',
      notesSectionColor: '#8b5cf6'
    },
    typography: {
      fontFamily: 'inter',
      sectionFonts: {
        title: 'inter',
        headers: 'inter',
        body: 'inter',
        contacts: 'inter',
        schedule: 'inter'
      },
      fontWeight: { title: 'semibold', header: 'medium', body: 'normal' }
    },
    visual: {
      cardStyle: 'minimal',
      sectionDividers: 'space',
      headerBackground: 'none',
      cornerRadius: 8,
      shadowIntensity: 'none',
      iconStyle: 'minimal'
    }
  },
  professional: {
    name: 'Professional',
    colors: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#2563eb',
      text: '#334155',
      textLight: '#64748b',
      titleText: '#0f172a',
      headerText: '#ffffff',
      contactNameText: '#334155',
      contactRoleText: '#64748b',
      contactDetailsText: '#334155',
      scheduleHeaderText: '#ffffff',
      scheduleBodyText: '#334155',
      emergencyText: '#dc2626',
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceHover: '#f1f5f9',
      headerBackground: '#0f172a',
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
      castSectionColor: '#2563eb',
      crewSectionColor: '#059669',
      scheduleSectionColor: '#d97706',
      emergencySectionColor: '#dc2626',
      notesSectionColor: '#7c3aed'
    },
    typography: {
      fontFamily: 'helvetica',
      sectionFonts: {
        title: 'helvetica',
        headers: 'helvetica',
        body: 'helvetica',
        contacts: 'helvetica',
        schedule: 'helvetica'
      },
      fontWeight: { title: 'bold', header: 'semibold', body: 'normal' }
    },
    visual: {
      cardStyle: 'elevated',
      sectionDividers: 'line',
      headerBackground: 'solid',
      cornerRadius: 6,
      shadowIntensity: 'subtle',
      iconStyle: 'geometric'
    }
  },
  creative: {
    name: 'Creative',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#f59e0b',
      text: '#1f2937',
      textLight: '#6b7280',
      titleText: '#1f2937',
      headerText: '#1f2937',
      contactNameText: '#1f2937',
      contactRoleText: '#6b7280',
      contactDetailsText: '#1f2937',
      scheduleHeaderText: '#1f2937',
      scheduleBodyText: '#1f2937',
      emergencyText: '#dc2626',
      background: '#fefefe',
      surface: '#faf9ff',
      surfaceHover: '#f3f0ff',
      headerBackground: '#7c3aed',
      contactCardBackground: '#faf9ff',
      scheduleBackground: '#ffffff',
      scheduleRowBackground: '#faf9ff',
      scheduleRowAlternate: '#f3f0ff',
      emergencyBackground: '#fef2f2',
      border: '#e5e2ff',
      borderLight: '#f0ecff',
      contactCardBorder: '#e5e2ff',
      scheduleBorder: '#e5e2ff',
      emergencyBorder: '#fecaca',
      castSectionColor: '#7c3aed',
      crewSectionColor: '#059669',
      scheduleSectionColor: '#f59e0b',
      emergencySectionColor: '#dc2626',
      notesSectionColor: '#8b5cf6',
      gradient: { from: '#7c3aed', to: '#a855f7', direction: 'to-br' }
    },
    typography: {
      fontFamily: 'poppins',
      sectionFonts: {
        title: 'poppins',
        headers: 'poppins',
        body: 'poppins',
        contacts: 'poppins',
        schedule: 'poppins'
      },
      fontWeight: { title: 'bold', header: 'semibold', body: 'normal' }
    },
    visual: {
      cardStyle: 'gradient',
      sectionDividers: 'accent',
      headerBackground: 'gradient',
      cornerRadius: 12,
      shadowIntensity: 'medium',
      iconStyle: 'solid'
    }
  },
  cinematic: {
    name: 'Cinematic',
    colors: {
      primary: '#1a1a1a',
      secondary: '#404040',
      accent: '#d4af37',
      text: '#2d2d2d',
      textLight: '#6b6b6b',
      titleText: '#2d2d2d',
      headerText: '#2d2d2d',
      contactNameText: '#2d2d2d',
      contactRoleText: '#6b6b6b',
      contactDetailsText: '#2d2d2d',
      scheduleHeaderText: '#2d2d2d',
      scheduleBodyText: '#2d2d2d',
      emergencyText: '#dc2626',
      background: '#fafafa',
      surface: '#f5f5f5',
      surfaceHover: '#eeeeee',
      headerBackground: '#1a1a1a',
      contactCardBackground: '#f5f5f5',
      scheduleBackground: '#ffffff',
      scheduleRowBackground: '#f5f5f5',
      scheduleRowAlternate: '#eeeeee',
      emergencyBackground: '#fef2f2',
      border: '#e0e0e0',
      borderLight: '#f0f0f0',
      contactCardBorder: '#e0e0e0',
      scheduleBorder: '#e0e0e0',
      emergencyBorder: '#fecaca',
      castSectionColor: '#d4af37',
      crewSectionColor: '#059669',
      scheduleSectionColor: '#f59e0b',
      emergencySectionColor: '#dc2626',
      notesSectionColor: '#8b5cf6'
    },
    typography: {
      fontFamily: 'montserrat',
      sectionFonts: {
        title: 'montserrat',
        headers: 'montserrat',
        body: 'montserrat',
        contacts: 'montserrat',
        schedule: 'montserrat'
      },
      fontWeight: { title: 'bold', header: 'semibold', body: 'normal' }
    },
    visual: {
      cardStyle: 'bordered',
      sectionDividers: 'accent',
      headerBackground: 'solid',
      cornerRadius: 4,
      shadowIntensity: 'subtle',
      iconStyle: 'geometric'
    }
  }
};

export const DEFAULT_PDF_CUSTOMIZATION: PDFCustomization = {
  layout: {
    headerAlignment: 'left',
    margins: { top: 32, bottom: 32, left: 32, right: 32 },
    spacing: { sectionGap: 24, itemGap: 12, cardSpacing: 16, lineHeight: 1.4 },
    pageOrientation: 'portrait',
    template: 'minimal',
    borderWidth: 1,
    cornerRadius: 8
  },
  typography: {
    fontFamily: 'inter',
    sectionFonts: {
      title: 'inter',
      headers: 'inter',
      body: 'inter',
      contacts: 'inter',
      schedule: 'inter'
    },
    fontSize: { title: 24, header: 12, body: 10, small: 8, caption: 7 },
    fontWeight: { title: 'semibold', header: 'medium', body: 'normal' },
    lineHeight: { title: 1.2, header: 1.3, body: 1.4 }
  },
  branding: {
    companyName: '',
    footer: { text: '', position: 'center', style: 'minimal' }
  },
  colors: PDF_THEMES.minimal.colors,
  theme: PDF_THEMES.minimal,
  visual: PDF_THEMES.minimal.visual,
  sections: {
    order: ['basic', 'location', 'cast', 'crew', 'schedule', 'emergency', 'notes'],
    visibility: {
      weather: true,
      emergencyContacts: true,
      schedule: true,
      notes: true,
      companyInfo: true
    },
    formatting: {
      contactLayout: 'list',
      scheduleCompact: false,
      emergencyProminent: true,
      showSectionIcons: false,
      alternateRowColors: false,
      departmentColorCoding: false,
      urgencyHighlighting: false
    }
  },
  smart: {
    productionType: 'feature',
    urgencyLevel: 'standard',
    unionCompliant: false,
    departmentColors: false,
    weatherResponsive: true,
    autoTemplate: false
  }
};

export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  customization: PDFCustomization;
  category: 'corporate' | 'creative' | 'minimal' | 'cinematic';
  preview?: string;
}
