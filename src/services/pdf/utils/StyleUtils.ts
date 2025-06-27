
import { StyleSheet } from '@react-pdf/renderer';
import { PDFCustomization } from '@/types/pdfTypes';
import { FontManager } from '../core/FontManager';

export class StyleUtils {
  static createStyles(customization: PDFCustomization) {
    const fontFamily = FontManager.getFontFamily(customization.typography.fontFamily);
    const safeCornerRadius = Math.max(0, Math.min(20, customization.visual.cornerRadius || 8));

    return StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: customization.colors.background,
        padding: 40,
        fontFamily: fontFamily,
        fontSize: 10,
        color: customization.colors.text,
        lineHeight: 1.4
      },
      header: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: customization.colors.border
      },
      logoContainer: {
        alignItems: 'flex-start',
        marginBottom: 10
      },
      logo: {
        width: customization.branding.logo?.size === 'large' ? 80 : 
               customization.branding.logo?.size === 'medium' ? 60 : 40,
        height: 'auto'
      },
      titleContainer: {
        marginBottom: 15
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: customization.colors.text,
        marginBottom: 5
      },
      subtitle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: customization.colors.textLight,
        marginBottom: 10
      },
      basicInfo: {
        flexDirection: 'column',
        gap: 3
      },
      infoText: {
        fontSize: 10,
        color: customization.colors.text,
        marginBottom: 2
      },
      content: {
        flex: 1
      },
      section: {
        marginBottom: 20
      },
      sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: customization.colors.text,
        marginBottom: 10,
        textTransform: 'uppercase'
      },
      contactItem: {
        marginBottom: 12,
        paddingLeft: 10
      },
      contactName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: customization.colors.text,
        marginBottom: 1
      },
      contactRole: {
        fontSize: 9,
        color: customization.colors.textLight,
        marginBottom: 1,
        fontStyle: 'italic'
      },
      contactInfo: {
        fontSize: 9,
        color: customization.colors.text,
        marginBottom: 1
      },
      scheduleItem: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start'
      },
      scheduleTime: {
        fontSize: 10,
        fontWeight: 'bold',
        color: customization.colors.text,
        width: 80,
        marginRight: 15
      },
      scheduleDetails: {
        flex: 1
      },
      scheduleScene: {
        fontSize: 10,
        fontWeight: 'bold',
        color: customization.colors.text,
        marginBottom: 2
      },
      scheduleDescription: {
        fontSize: 9,
        color: customization.colors.text,
        marginBottom: 1,
        lineHeight: 1.3
      },
      schedulePages: {
        fontSize: 8,
        color: customization.colors.textLight,
        fontStyle: 'italic'
      },
      emergencyItem: {
        marginBottom: 12,
        paddingLeft: 10,
        backgroundColor: customization.sections.formatting.emergencyProminent ? 
          customization.colors.surface : 'transparent',
        padding: customization.sections.formatting.emergencyProminent ? 8 : 0,
        borderRadius: customization.sections.formatting.emergencyProminent ? safeCornerRadius : 0
      },
      emergencyName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: customization.colors.text,
        marginBottom: 1
      },
      emergencyRole: {
        fontSize: 9,
        color: customization.colors.textLight,
        marginBottom: 2,
        fontStyle: 'italic'
      },
      emergencyPhone: {
        fontSize: 9,
        color: customization.colors.text,
        marginBottom: 1
      },
      emergencyInfo: {
        fontSize: 8,
        color: customization.colors.textLight
      },
      notesText: {
        fontSize: 10,
        color: customization.colors.text,
        lineHeight: 1.4,
        padding: 15,
        backgroundColor: customization.colors.surface,
        borderRadius: safeCornerRadius,
        textAlign: 'justify'
      }
    });
  }
}
