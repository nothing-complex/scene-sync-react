
import { StyleSheet } from '@react-pdf/renderer';
import { PDFCustomization } from '@/types/pdfTypes';
import { getFontFamily, getFontWeight } from './fontUtils_backup';

// Helper function for consistent border properties
export const createBorderStyle = (width: number = 0, color: string = '#000000') => {
  if (width === 0) return {};
  return { borderWidth: width, borderColor: color };
};

export const createPartialBorderStyle = (sides: { top?: number; right?: number; bottom?: number; left?: number }, color: string = '#000000') => {
  return {
    borderTopWidth: sides.top || 0,
    borderRightWidth: sides.right || 0,
    borderBottomWidth: sides.bottom || 0,
    borderLeftWidth: sides.left || 0,
    borderColor: color,
  };
};

const getSafeCornerRadius = (customization: PDFCustomization): number => {
  const radius = customization.visual?.cornerRadius;
  if (typeof radius !== 'number' || isNaN(radius) || radius < 0) {
    return 8;
  }
  return radius;
};

export const createStyles = (customization: PDFCustomization) => {
  const fontFamily = getFontFamily(customization.typography.fontFamily);
  const safeCornerRadius = getSafeCornerRadius(customization);
  
  return StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      padding: 40,
      fontFamily,
      fontSize: 10,
      color: '#1a1a1a',
      lineHeight: 1.4,
    },
    
    // Header matching screenshot
    headerContainer: {
      marginBottom: 30,
      position: 'relative',
    },
    
    logoContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 120,
      height: 60,
      backgroundColor: '#000000',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    logoText: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 2,
    },
    
    titleSection: {
      marginRight: 140, // Space for logo
      paddingTop: 10,
    },
    
    projectTitle: {
      fontSize: 32,
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: 8,
      lineHeight: 1.2,
    },
    
    callsheetSubtitle: {
      fontSize: 14,
      fontWeight: 500,
      color: '#666666',
      letterSpacing: 1,
    },

    // Legacy styles for backup compatibility
    title: {
      fontSize: 14,
      fontWeight: 500,
      color: '#666666',
      letterSpacing: 1,
    },

    companyName: {
      fontSize: 12,
      fontWeight: 400,
      color: '#666666',
      marginTop: 4,
    },
    
    // Production details grid
    productionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 15,
      marginVertical: 25,
    },
    
    gridCard: {
      flex: 1,
      minWidth: '30%',
      backgroundColor: '#f8f9fa',
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e9ecef',
    },

    // Legacy grid styles for backup compatibility
    gridItem: {
      flex: 1,
      minWidth: '30%',
      backgroundColor: '#f8f9fa',
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e9ecef',
    },
    
    gridLabel: {
      fontSize: 9,
      fontWeight: 600,
      color: '#666666',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 6,
    },

    // Legacy label style
    label: {
      fontSize: 9,
      fontWeight: 600,
      color: '#666666',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    
    gridValue: {
      fontSize: 11,
      fontWeight: 500,
      color: '#1a1a1a',
      lineHeight: 1.3,
    },

    // Legacy value style
    value: {
      fontSize: 11,
      fontWeight: 500,
      color: '#1a1a1a',
      lineHeight: 1.3,
    },

    locationAddress: {
      fontSize: 10,
      color: '#666666',
      marginTop: 2,
      lineHeight: 1.3,
    },
    
    // Section cards
    sectionCard: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#e9ecef',
      overflow: 'hidden',
      break: false,
    },
    
    sectionHeader: {
      backgroundColor: '#f8f9fa',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
    },
    
    sectionTitle: {
      fontSize: 12,
      fontWeight: 700,
      color: '#1a1a1a',
      letterSpacing: 0.5,
    },
    
    sectionContent: {
      padding: 16,
    },

    // Notes container
    notesContainer: {
      backgroundColor: '#f3f9ff',
      padding: 12,
      borderRadius: 8,
    },
    
    // Special notes with blue background
    notesCard: {
      backgroundColor: '#e3f2fd',
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#bbdefb',
      overflow: 'hidden',
    },
    
    notesHeader: {
      backgroundColor: '#2196f3',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    
    notesTitle: {
      fontSize: 12,
      fontWeight: 700,
      color: '#ffffff',
      letterSpacing: 0.5,
    },
    
    notesContent: {
      padding: 16,
      backgroundColor: '#f3f9ff',
    },
    
    notesText: {
      fontSize: 11,
      color: '#1a1a1a',
      lineHeight: 1.5,
    },
    
    // Schedule table
    scheduleTable: {
      borderWidth: 1,
      borderColor: '#e9ecef',
      borderRadius: 8,
    },
    
    scheduleHeader: {
      flexDirection: 'row',
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },

    // Legacy schedule table header
    scheduleTableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    
    scheduleHeaderCell: {
      fontSize: 9,
      fontWeight: 700,
      color: '#1a1a1a',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    
    scheduleRow: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: '#e9ecef',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },

    // Legacy schedule table row
    scheduleTableRow: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: '#e9ecef',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    
    scheduleCell: {
      fontSize: 10,
      color: '#1a1a1a',
      lineHeight: 1.3,
    },
    
    // Contact cards (two-column layout)
    contactGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },

    // Tight grid for contacts
    contactTightGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    contactTightGridItem: {
      width: '48%',
      backgroundColor: '#f8f9fa',
      padding: 10,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#e9ecef',
      marginBottom: 6,
    },
    
    contactCard: {
      width: '48%',
      backgroundColor: '#f8f9fa',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e9ecef',
      marginBottom: 8,
    },
    
    contactName: {
      fontSize: 11,
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: 4,
    },
    
    contactRole: {
      fontSize: 9,
      fontWeight: 500,
      color: '#666666',
      marginBottom: 6,
    },
    
    contactInfo: {
      fontSize: 9,
      color: '#666666',
      lineHeight: 1.3,
    },

    contactDetails: {
      fontSize: 9,
      color: '#666666',
      lineHeight: 1.3,
    },

    // Text color variants
    textLight: '#888888',
    
    // Emergency contacts with red styling
    emergencyCard: {
      backgroundColor: '#ffebee',
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#ffcdd2',
      overflow: 'hidden',
    },
    
    emergencyHeader: {
      backgroundColor: '#f44336',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    
    emergencyTitle: {
      fontSize: 12,
      fontWeight: 700,
      color: '#ffffff',
      letterSpacing: 0.5,
    },
    
    emergencyContent: {
      padding: 16,
      backgroundColor: '#fef7f7',
    },
    
    emergencyContactCard: {
      backgroundColor: '#ffffff',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ffcdd2',
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#f44336',
    },
    
    // Footer
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#e9ecef',
      alignItems: 'center',
    },
    
    footerText: {
      fontSize: 8,
      color: '#666666',
    },
  });
};
