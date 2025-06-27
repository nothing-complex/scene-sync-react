
import { StyleSheet } from '@react-pdf/renderer';
import { PDFCustomization } from '@/types/pdfTypes';
import { FontManager } from '../core/FontManager';

export class StyleUtils {
  static createStyles(customization: PDFCustomization) {
    const fontFamily = FontManager.getFontFamily(customization.typography.fontFamily);

    return StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
        fontFamily: fontFamily,
        fontSize: 10,
        color: '#000000',
        lineHeight: 1.2
      },
      
      content: {
        flex: 1,
        flexDirection: 'column'
      },
      
      // Logo and Company Section
      logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      logo: {
        width: 60,
        height: 'auto'
      },
      companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000'
      },

      // Title Section
      titleSection: {
        alignItems: 'center',
        marginBottom: 25,
      },
      projectTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 5,
        textAlign: 'center'
      },
      callSheetSubtitle: {
        fontSize: 12,
        color: '#000000',
        textAlign: 'center',
        letterSpacing: 2
      },

      // Info Grid
      infoGrid: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 15
      },
      infoColumn: {
        flex: 1,
        gap: 10
      },
      infoItem: {
        backgroundColor: '#f8f9fa',
        padding: 8,
        borderRadius: 4,
        borderLeft: '3px solid #007bff'
      },
      infoLabel: {
        fontSize: 8,
        color: '#666666',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 2
      },
      infoValue: {
        fontSize: 9,
        color: '#000000',
        fontWeight: 'normal'
      },
      infoSubValue: {
        fontSize: 8,
        color: '#666666',
        marginTop: 1
      },

      // Special Notes
      specialNotesSection: {
        backgroundColor: '#f0f8ff',
        padding: 12,
        borderRadius: 4,
        borderLeft: '4px solid #007bff',
        marginBottom: 20
      },
      specialNotesTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 5,
        textTransform: 'uppercase'
      },
      specialNotesText: {
        fontSize: 9,
        color: '#000000',
        lineHeight: 1.4
      },

      // Section Headers
      section: {
        marginBottom: 20,
        breakInside: 'avoid'
      },
      sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1
      },

      // Emergency Section
      emergencySectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#dc3545',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1
      },
      emergencyContactsContainer: {
        backgroundColor: '#fff5f5',
        padding: 10,
        borderRadius: 4,
        borderLeft: '4px solid #dc3545'
      },
      emergencyContactCard: {
        marginBottom: 8,
        paddingBottom: 8,
        borderBottom: '1px solid #ffebee'
      },
      emergencyContactName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 2
      },
      emergencyContactRole: {
        fontSize: 9,
        color: '#666666',
        fontStyle: 'italic',
        marginBottom: 2
      },
      emergencyContactPhone: {
        fontSize: 9,
        color: '#000000',
        fontWeight: 'medium'
      },

      // Schedule Table
      tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e9ecef',
        borderBottom: '2px solid #dee2e6',
        paddingVertical: 6
      },
      tableHeaderCell: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        paddingHorizontal: 4
      },
      tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #dee2e6',
        paddingVertical: 8,
        minHeight: 35
      },
      tableRowAlternate: {
        backgroundColor: '#f8f9fa'
      },
      tableCell: {
        paddingHorizontal: 4,
        justifyContent: 'center'
      },
      tableCellText: {
        fontSize: 8,
        color: '#000000'
      },
      tableCellSubText: {
        fontSize: 7,
        color: '#666666',
        marginTop: 1
      },

      // Table Column Widths
      sceneColumn: {
        width: '15%'
      },
      intExtColumn: {
        width: '12%'
      },
      descriptionColumn: {
        width: '38%'
      },
      timeColumn: {
        width: '25%'
      },
      pagesColumn: {
        width: '10%'
      },

      // Contacts Grid
      contactsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
      },
      contactCard: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: 4,
        padding: 8,
        width: '48%',
        borderLeft: '3px solid #007bff'
      },
      contactName: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 2
      },
      contactRole: {
        fontSize: 8,
        color: '#666666',
        fontStyle: 'italic',
        marginBottom: 3
      },
      contactInfo: {
        fontSize: 8,
        color: '#000000',
        marginBottom: 1
      }
    });
  }
}
