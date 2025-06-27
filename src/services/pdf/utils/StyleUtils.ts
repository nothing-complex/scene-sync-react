
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
        padding: customization.layout.margins.top,
        fontFamily: fontFamily,
        fontSize: customization.typography.fontSize.body,
        color: customization.colors.text
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
        marginBottom: 10
      },
      title: {
        fontSize: customization.typography.fontSize.title,
        fontWeight: FontManager.getFontWeight(customization.typography.fontWeight.title),
        color: customization.colors.primary,
        marginBottom: 5
      },
      subtitle: {
        fontSize: customization.typography.fontSize.header,
        fontWeight: FontManager.getFontWeight(customization.typography.fontWeight.header),
        color: customization.colors.secondary
      },
      basicInfo: {
        flexDirection: 'column',
        gap: 3
      },
      infoText: {
        fontSize: customization.typography.fontSize.body,
        color: customization.colors.text,
        marginBottom: 2
      },
      content: {
        flex: 1
      },
      section: {
        marginBottom: 15
      },
      sectionTitle: {
        fontSize: customization.typography.fontSize.header,
        fontWeight: FontManager.getFontWeight(customization.typography.fontWeight.header),
        color: customization.colors.primary,
        marginBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: customization.colors.borderLight,
        paddingBottom: 3
      },
      contactItem: {
        marginBottom: 8,
        paddingLeft: 10
      },
      contactName: {
        fontSize: customization.typography.fontSize.body,
        fontWeight: FontManager.getFontWeight(customization.typography.fontWeight.body),
        color: customization.colors.text
      },
      contactRole: {
        fontSize: customization.typography.fontSize.small,
        color: customization.colors.textLight,
        marginBottom: 2
      },
      contactInfo: {
        fontSize: customization.typography.fontSize.small,
        color: customization.colors.textLight
      },
      scheduleItem: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start'
      },
      scheduleTime: {
        fontSize: customization.typography.fontSize.body,
        fontWeight: FontManager.getFontWeight('medium'),
        color: customization.colors.primary,
        width: 60,
        marginRight: 10
      },
      scheduleDetails: {
        flex: 1
      },
      scheduleScene: {
        fontSize: customization.typography.fontSize.body,
        fontWeight: FontManager.getFontWeight(customization.typography.fontWeight.body),
        color: customization.colors.text,
        marginBottom: 2
      },
      scheduleDescription: {
        fontSize: customization.typography.fontSize.small,
        color: customization.colors.textLight,
        marginBottom: 1
      },
      schedulePages: {
        fontSize: customization.typography.fontSize.caption,
        color: customization.colors.textLight
      },
      emergencyItem: {
        marginBottom: 8,
        paddingLeft: 10,
        backgroundColor: customization.sections.formatting.emergencyProminent ? 
          customization.colors.surface : 'transparent',
        padding: customization.sections.formatting.emergencyProminent ? 8 : 0,
        borderRadius: customization.sections.formatting.emergencyProminent ? safeCornerRadius : 0
      },
      emergencyName: {
        fontSize: customization.typography.fontSize.body,
        fontWeight: FontManager.getFontWeight('semibold'),
        color: customization.colors.text
      },
      emergencyRole: {
        fontSize: customization.typography.fontSize.small,
        color: customization.colors.accent,
        marginBottom: 2
      },
      emergencyPhone: {
        fontSize: customization.typography.fontSize.small,
        color: customization.colors.text,
        marginBottom: 1
      },
      emergencyInfo: {
        fontSize: customization.typography.fontSize.caption,
        color: customization.colors.textLight
      },
      notesText: {
        fontSize: customization.typography.fontSize.body,
        color: customization.colors.text,
        lineHeight: customization.typography.lineHeight.body,
        padding: 10,
        backgroundColor: customization.colors.surface,
        borderRadius: safeCornerRadius
      }
    });
  }
}
