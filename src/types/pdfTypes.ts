export interface PDFCustomization {
  layout: PDFLayout;
  typography: PDFTypography;
  branding: PDFBranding;
  colors: PDFColors;
  sections: PDFSectionConfig;
  theme: PDFTheme;
  visual: PDFVisualStyle;
  smart: PDFSmartFeatures; // New smart features
}

export interface PDFLayout {
  headerStyle: 'minimal' | 'professional' | 'creative' | 'cinematic';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    lineHeight: number;
  };
  pageOrientation: 'portrait' | 'landscape';
  template: 'minimal' | 'professional' | 'creative' | 'cinematic' | 'hollywood' | 'indie' | 'horror' | 'comedy' | 'network' | 'documentary';
}

export interface PDFTypography {
  fontFamily: 'inter' | 'helvetica' | 'poppins' | 'montserrat';
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
  productionCompany?: string; // New field
  network?: string; // New field for TV productions
  season?: string; // New field for TV series
  episode?: string; // New field for TV series
  logo?: {
    url: string;
    position: 'top-left' | 'top-center' | 'top-right' | 'header-left' | 'header-center' | 'header-right';
    size: 'small' | 'medium' | 'large';
    opacity: number;
  };
  secondaryLogo?: { // New field for production company/network logos
    url: string;
    position: 'top-left' | 'top-center' | 'top-right' | 'header-left' | 'header-center' | 'header-right';
    size: 'small' | 'medium' | 'large';
    opacity: number;
  };
  footer?: {
    text: string;
    position: 'left' | 'center' | 'right';
    style: 'minimal' | 'bordered' | 'accent';
    unionCompliance?: boolean; // New field
  };
  watermark?: {
    text: string;
    opacity: number;
    position: 'center' | 'diagonal';
    recipientType?: 'all' | 'talent' | 'crew' | 'client'; // New field
  };
}

export interface PDFColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textLight: string;
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderLight: string;
  headerText: string; // Added for header text color
  headerBackground: string; // Added for header background color
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
    departmentColorCoding: boolean; // New field
    urgencyHighlighting: boolean; // New field
  };
  roleFiltering?: { // New field for role-specific content
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
  autoTemplate: boolean; // Automatically apply template based on production type
}

// Predefined sophisticated themes with improved contrast
export const PDF_THEMES: Record<string, PDFTheme> = {
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
      accent: '#3b82f6',
      text: '#1f2937',
      textLight: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb',
      surfaceHover: '#f3f4f6',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      headerText: '#1f2937', // Dark text for light backgrounds
      headerBackground: '#ffffff', // Light background
    },
    typography: {
      fontFamily: 'inter',
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
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceHover: '#f1f5f9',
      border: '#cbd5e1',
      borderLight: '#e2e8f0',
      headerText: '#ffffff', // White text for dark backgrounds
      headerBackground: '#0f172a', // Dark background
    },
    typography: {
      fontFamily: 'helvetica',
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
      background: '#fefefe',
      surface: '#faf9ff',
      surfaceHover: '#f3f0ff',
      border: '#e5e2ff',
      borderLight: '#f0ecff',
      headerText: '#ffffff', // White text for gradient backgrounds
      headerBackground: '#7c3aed', // Purple background
      gradient: { from: '#7c3aed', to: '#a855f7', direction: 'to-br' }
    },
    typography: {
      fontFamily: 'poppins',
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
      background: '#fafafa',
      surface: '#f5f5f5',
      surfaceHover: '#eeeeee',
      border: '#e0e0e0',
      borderLight: '#f0f0f0',
      headerText: '#fafafa', // Light text for dark backgrounds
      headerBackground: '#1a1a1a', // Dark background
    },
    typography: {
      fontFamily: 'montserrat',
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
    headerStyle: 'minimal',
    margins: { top: 32, bottom: 32, left: 32, right: 32 },
    spacing: { sectionGap: 24, itemGap: 12, lineHeight: 1.4 },
    pageOrientation: 'portrait',
    template: 'minimal'
  },
  typography: {
    fontFamily: 'inter',
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
      showSectionIcons: false, // Set to false by default to avoid emoji issues
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
