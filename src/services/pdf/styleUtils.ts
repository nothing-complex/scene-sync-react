
import { StyleSheet } from '@react-pdf/renderer';
import { PDFCustomization } from '@/types/pdfTypes';
import { getFontFamily, getFontWeight } from './fontUtils';

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

export const createStyles = (customization: PDFCustomization) => {
  const fontFamily = getFontFamily(customization.typography.fontFamily);
  
  return StyleSheet.create({
    page: {
      backgroundColor: customization.colors.background,
      padding: customization.layout.margins.top,
      paddingLeft: customization.layout.margins.left,
      paddingRight: customization.layout.margins.right,
      paddingBottom: customization.layout.margins.bottom,
      fontFamily,
      fontSize: customization.typography.fontSize.body,
      color: customization.colors.text,
      lineHeight: customization.typography.lineHeight.body,
    },
    
    headerContainer: {
      marginBottom: customization.layout.spacing.sectionGap,
      alignItems: customization.layout.headerStyle === 'minimal' ? 'flex-start' : 'center',
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
      borderRadius: customization.visual.cornerRadius,
      marginBottom: 20,
      alignItems: customization.layout.headerStyle === 'minimal' ? 'flex-start' : 'center',
    },
    
    title: {
      fontSize: customization.typography.fontSize.title,
      fontWeight: getFontWeight(customization.typography.fontWeight.title),
      color: customization.visual.headerBackground === 'gradient' ? '#ffffff' : customization.colors.primary,
      letterSpacing: 1,
      lineHeight: customization.typography.lineHeight.title,
    },
    
    projectTitle: {
      fontSize: customization.typography.fontSize.header + 2,
      fontWeight: getFontWeight(customization.typography.fontWeight.header),
      color: customization.colors.text,
      marginTop: 8,
      lineHeight: customization.typography.lineHeight.header,
    },

    sectionCard: {
      backgroundColor: customization.colors.surface,
      borderRadius: customization.visual.cornerRadius,
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

    infoGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: customization.layout.spacing.itemGap,
    },
    
    infoCell: {
      flex: 1,
      backgroundColor: customization.colors.background,
      padding: 12,
      borderRadius: customization.visual.cornerRadius - 2,
      ...createBorderStyle(
        customization.visual.cardStyle === 'bordered' ? 1 : 0,
        customization.colors.borderLight
      ),
    },
    
    infoCellAccent: {
      flex: 1,
      backgroundColor: customization.colors.accent + '10',
      padding: 12,
      borderRadius: customization.visual.cornerRadius - 2,
      ...createPartialBorderStyle({ left: 3 }, customization.colors.accent),
    },

    contactGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    
    contactCard: {
      width: customization.sections.formatting.contactLayout === 'cards' ? '48%' : '100%',
      backgroundColor: customization.colors.background,
      padding: 10,
      borderRadius: customization.visual.cornerRadius - 2,
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
      fontStyle: 'italic',
    },
    
    contactDetails: {
      fontSize: customization.typography.fontSize.small,
      color: customization.colors.textLight,
      lineHeight: 1.3,
    },

    scheduleItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      padding: 12,
      backgroundColor: customization.colors.background,
      borderRadius: customization.visual.cornerRadius - 2,
      ...createPartialBorderStyle({ left: 3 }, customization.colors.accent),
    },
    
    sceneNumber: {
      backgroundColor: customization.colors.accent,
      color: '#ffffff',
      padding: 6,
      borderRadius: customization.visual.cornerRadius - 4,
      fontSize: customization.typography.fontSize.small,
      fontWeight: getFontWeight('semibold'),
      minWidth: 32,
      textAlign: 'center',
      marginRight: 12,
    },
    
    scheduleContent: {
      flex: 1,
    },
    
    scheduleDescription: {
      fontSize: customization.typography.fontSize.body,
      color: customization.colors.text,
      marginBottom: 4,
      fontWeight: getFontWeight('medium'),
    },
    
    scheduleDetails: {
      fontSize: customization.typography.fontSize.small,
      color: customization.colors.textLight,
      lineHeight: 1.3,
    },

    notesContainer: {
      backgroundColor: customization.colors.accent + '08',
      padding: 16,
      borderRadius: customization.visual.cornerRadius,
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
        ? customization.visual.cornerRadius 
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
