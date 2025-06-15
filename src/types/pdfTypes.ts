
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
    margins: { top: 20, bottom: 20, left: 20, right: 20 },
    spacing: { sectionGap: 20, itemGap: 10 },
    pageOrientation: 'portrait'
  },
  typography: {
    fontFamily: 'helvetica',
    fontSize: { title: 20, header: 14, body: 10, small: 8 },
    fontWeight: { title: 'bold', header: 'bold', body: 'normal' }
  },
  branding: {
    companyName: '',
    footer: { text: '', position: 'center' }
  },
  colors: {
    primary: '#000000',
    secondary: '#666666',
    text: '#000000',
    accent: '#0066cc',
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
