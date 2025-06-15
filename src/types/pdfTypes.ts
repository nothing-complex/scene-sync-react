
export interface PDFCustomization {
  layout: PDFLayout;
  typography: PDFTypography;
  branding: PDFBranding;
  colors: PDFColors;
  sections: PDFSectionConfig;
}

export interface PDFLayout {
  headerStyle: 'centered' | 'left' | 'custom';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
  };
  pageOrientation: 'portrait' | 'landscape';
}

export interface PDFTypography {
  fontFamily: 'helvetica' | 'arial' | 'times';
  fontSize: {
    title: number;
    header: number;
    body: number;
    small: number;
  };
  fontWeight: {
    title: 'normal' | 'bold';
    header: 'normal' | 'bold';
    body: 'normal' | 'bold';
  };
}

export interface PDFBranding {
  companyName?: string;
  logo?: {
    url: string;
    position: 'top-left' | 'top-center' | 'top-right';
    size: 'small' | 'medium' | 'large';
  };
  footer?: {
    text: string;
    position: 'left' | 'center' | 'right';
  };
}

export interface PDFColors {
  primary: string;
  secondary: string;
  text: string;
  accent: string;
  background: string;
}

export interface PDFSectionConfig {
  order: string[];
  visibility: {
    weather: boolean;
    emergencyContacts: boolean;
    schedule: boolean;
    notes: boolean;
  };
  formatting: {
    contactLayout: 'table' | 'list';
    scheduleCompact: boolean;
    emergencyProminent: boolean;
  };
}

export const DEFAULT_PDF_CUSTOMIZATION: PDFCustomization = {
  layout: {
    headerStyle: 'centered',
    margins: { top: 30, bottom: 30, left: 30, right: 30 },
    spacing: { sectionGap: 25, itemGap: 12 },
    pageOrientation: 'portrait'
  },
  typography: {
    fontFamily: 'helvetica',
    fontSize: { title: 24, header: 13, body: 11, small: 9 },
    fontWeight: { title: 'bold', header: 'bold', body: 'normal' }
  },
  branding: {
    companyName: '',
    footer: { text: '', position: 'center' }
  },
  colors: {
    primary: '#2c1810',
    secondary: '#8b6f47',
    text: '#2c1810',
    accent: '#d4a574',
    background: '#ffffff'
  },
  sections: {
    order: ['basic', 'location', 'cast', 'crew', 'schedule', 'emergency', 'notes'],
    visibility: {
      weather: true,
      emergencyContacts: true,
      schedule: true,
      notes: true
    },
    formatting: {
      contactLayout: 'list',
      scheduleCompact: false,
      emergencyProminent: true
    }
  }
};

export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  customization: PDFCustomization;
  category: 'corporate' | 'creative' | 'minimal' | 'custom';
}
