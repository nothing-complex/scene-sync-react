
import { StyleSheet } from '@react-pdf/renderer';
import { PDFCustomization } from '@/types/pdfTypes';
import { getFontFamily, getFontWeight } from './fontUtils_backup';

// Helper function to ensure consistent border properties
export const createBorderStyle = (width: number = 0, color: string = '#000000') => {
  if (width === 0) {
    return {};
  }
  return {
    borderWidth: width,
    borderColor: color,
  };
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

// CRITICAL FIX: Enhanced safe function to get corner radius with multiple fallbacks
const getSafeCornerRadius = (customization: PDFCustomization): number => {
  console.log('getSafeCornerRadius input:', customization.visual);
  
  // Multiple fallback checks
  let radius = customization.visual?.cornerRadius;
  
  // If visual object doesn't exist, use default
  if (!customization.visual) {
    console.warn('Visual customization object is missing, using default radius: 8');
    return 8;
  }
  
  // If cornerRadius is not set, use default
  if (radius === undefined || radius === null) {
    console.warn('Corner radius is undefined/null, using default: 8');
    return 8;
  }
  
  // If cornerRadius is not a number, use default
  if (typeof radius !== 'number') {
    console.warn('Corner radius is not a number:', typeof radius, radius, 'using default: 8');
    return 8;
  }
  
  // If cornerRadius is NaN, use default
  if (isNaN(radius)) {
    console.warn('Corner radius is NaN:', radius, 'using default: 8');
    return 8;
  }
  
  // If cornerRadius is negative, use default
  if (radius < 0) {
    console.warn('Corner radius is negative:', radius, 'using default: 8');
    return 8;
  }
  
  console.log('Using corner radius:', radius);
  return radius;
};

// FIXED: Updated createStyles to avoid problematic fontStyle usage and ensure all values are safe
export const createStyles = (customization: PDFCustomization) => {
  console.log('createStyles called with customization:', customization);
  
  // Validate the entire customization object structure
  if (!customization) {
    throw new Error('Customization object is required');
  }
  
  if (!customization.visual) {
    throw new Error('Visual customization is required');
  }
  
  if (!customization.typography) {
    throw new Error('Typography customization is required');
  }
  
  if (!customization.colors) {
    throw new Error('Colors customization is required');
  }
  
  const fontFamily = getFontFamily(customization.typography.fontFamily);
  const safeCornerRadius = getSafeCornerRadius(customization);
  
  console.log('Creating styles with font family:', fontFamily);
  console.log('Using safe corner radius:', safeCornerRadius);
  
  // Additional validation for critical properties
  if (!customization.layout?.margins) {
    throw new Error('Layout margins are required');
  }
  
  if (!customization.typography?.fontSize) {
    throw new Error('Typography fontSize is required');
  }
  
  return StyleSheet.create({
    page: {
      backgroundColor: customization.colors.background,
      padding: customization.layout.margins.top,
      paddingLeft: customization.layout.margins.left,
      paddingRight: customization.layout.margins.right,
      paddingBottom: customization.layout.margins.bottom + 60, // Extra space for footer
      fontFamily,
      fontSize: customization.typography.fontSize.body,
      color: customization.colors.text,
      lineHeight: customization.typography.lineHeight.body,
    },
    
    headerContainer: {
      marginBottom: customization.layout.spacing.sectionGap,
      alignItems: customization.layout.headerStyle === 'minimal' ? 'flex-start' : 'center',
      position: 'relative',
    },
    
    brandingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    
    companyName: {
      fontSize: customization.typography.fontSize.small,
      color: customization.colors.textLight,
      fontWeight: getFontWeight(customization.typography.fontWeight.body),
      letterSpacing: 0.5,
    },
    
    titleSection: {
      backgroundColor: customization.visual.headerBackground === 'gradient' && customization.colors.gradient 
        ? customization.colors.primary 
        : customization.visual.headerBackground === 'subtle' 
        ? customization.colors.surface 
        : 'transparent',
      padding: customization.visual.headerBackground !== 'none' ? 20 : 8,
      borderRadius: safeCornerRadius,
      marginBottom: 20,
      alignItems: customization.layout.headerStyle === 'minimal' ? 'flex-start' : 'center',
    },
    
    title: {
      fontSize: customization.typography.fontSize.header,
      fontWeight: getFontWeight(customization.typography.fontWeight.title),
      color: customization.visual.headerBackground === 'gradient' ? '#ffffff' : customization.colors.primary,
      letterSpacing: 1,
      lineHeight: customization.typography.lineHeight.title,
      marginTop: 4,
    },
    
    projectTitle: {
      fontSize: customization.typography.fontSize.title,
      fontWeight: getFontWeight(customization.typography.fontWeight.header),
      color: customization.colors.text,
      lineHeight: customization.typography.lineHeight.header,
    },

    sectionCard: {
      backgroundColor: customization.colors.surface,
      borderRadius: safeCornerRadius,
      marginBottom: customization.layout.spacing.sectionGap,
      overflow: 'hidden',
      ...createBorderStyle(
        customization.visual.cardStyle === 'bordered' ? 1 : 0,
        customization.colors.border
      ),
    },
    
    sectionHeader: {
      backgroundColor: customization.visual.cardStyle === 'gradient' && customization.colors.gradient
        ? customization.colors.accent
        : customization.colors.surfaceHover,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    sectionTitle: {
      fontSize: customization.typography.fontSize.header,
      fontWeight: getFontWeight(customization.typography.fontWeight.header),
      color: customization.visual.cardStyle === 'gradient' ? '#ffffff' : customization.colors.primary,
      letterSpacing: 0.5,
      marginLeft: customization.sections.formatting.showSectionIcons ? 8 : 0,
    },
    
    sectionContent: {
      padding: 16,
    },

    // Production Details Grid
    productionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      padding: 16,
    },

    gridItem: {
      flex: 1,
      minWidth: '30%',
      backgroundColor: customization.colors.background,
      padding: 12,
      borderRadius: safeCornerRadius > 2 ? safeCornerRadius - 2 : 0,
      ...createBorderStyle(
        customization.visual.cardStyle === 'bordered' ? 1 : 0,
        customization.colors.borderLight
      ),
    },

    locationAddress: {
      fontSize: customization.typography.fontSize.small,
      color: customization.colors.textLight,
      marginTop: 2,
    },

    sectionDivider: {
      height: customization.visual.sectionDividers === 'line' ? 1 : 0,
      backgroundColor: customization.visual.sectionDividers === 'accent' 
        ? customization.colors.accent 
        : customization.colors.borderLight,
      marginVertical: customization.visual.sectionDividers === 'space' 
        ? customization.layout.spacing.sectionGap / 2 
        : 0,
    },

    label: {
      fontSize: customization.typography.fontSize.caption,
      color: customization.colors.textLight,
      marginBottom: 4,
      fontWeight: getFontWeight('medium'),
      letterSpacing: 0.3,
      textTransform: 'uppercase',
    },
    
    value: {
      fontSize: customization.typography.fontSize.body,
      color: customization.colors.text,
      lineHeight: customization.typography.lineHeight.body,
      fontWeight: getFontWeight(customization.typography.fontWeight.body),
    },

    // Tight grid layout for contacts - matching preview
    contactTightGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    
    contactTightGridItem: {
      width: '48%',
      backgroundColor: customization.colors.background,
      padding: 10,
      borderRadius: safeCornerRadius > 2 ? safeCornerRadius - 2 : 0,
      marginBottom: 6,
      ...createPartialBorderStyle({ left: 2 }, customization.colors.accent),
    },
    
    contactName: {
      fontSize: customization.typography.fontSize.body,
      fontWeight: getFontWeight('semibold'),
      color: customization.colors.text,
      marginBottom: 2,
    },
    
    contactRole: {
      fontSize: customization.typography.fontSize.small,
      color: customization.colors.textLight,
      marginBottom: 2,
      // COMPLETELY REMOVED: No fontStyle property to prevent font resolution errors
      fontWeight: getFontWeight('normal'),
    },
    
    contactDetails: {
      fontSize: customization.typography.fontSize.small,
      color: customization.colors.textLight,
      lineHeight: 1.3,
    },

    // Schedule table styles
    scheduleTable: {
      backgroundColor: customization.colors.background,
      borderRadius: safeCornerRadius > 2 ? safeCornerRadius - 2 : 0,
      ...createBorderStyle(1, customization.colors.border),
    },

    scheduleTableHeader: {
      flexDirection: 'row',
      backgroundColor: customization.colors.surface,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: customization.colors.border,
    },

    scheduleHeaderCell: {
      fontSize: customization.typography.fontSize.small,
      fontWeight: getFontWeight('semibold'),
      color: customization.colors.text,
      paddingHorizontal: 6,
      textAlign: 'center',
    },

    scheduleTableRow: {
      flexDirection: 'row',
      paddingVertical: 6,
      paddingHorizontal: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: customization.colors.borderLight,
    },

    scheduleCell: {
      fontSize: customization.typography.fontSize.small,
      color: customization.colors.text,
      paddingHorizontal: 6,
      textAlign: 'left',
    },

    notesContainer: {
      backgroundColor: customization.colors.accent + '08',
      padding: 16,
      borderRadius: safeCornerRadius,
      ...createPartialBorderStyle({ left: 4 }, customization.colors.accent),
    },

    footer: {
      position: 'absolute',
      bottom: 20,
      left: customization.layout.margins.left,
      right: customization.layout.margins.right,
      backgroundColor: customization.branding.footer?.style === 'bordered' 
        ? customization.colors.surface 
        : 'transparent',
      padding: customization.branding.footer?.style !== 'minimal' ? 8 : 4,
      borderRadius: customization.branding.footer?.style === 'bordered' 
        ? safeCornerRadius 
        : 0,
      ...createPartialBorderStyle(
        { top: customization.branding.footer?.style === 'accent' ? 2 : 0 },
        customization.branding.footer?.style === 'accent' ? customization.colors.accent : customization.colors.border
      ),
    },
    
    footerText: {
      fontSize: customization.typography.fontSize.caption,
      color: customization.colors.textLight,
      textAlign: customization.branding.footer?.position || 'center',
    },
  });
};
