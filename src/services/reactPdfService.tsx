
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';

// Register modern fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKXgZ9hiA.woff2', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fgZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfgZ9hiA.woff2', fontWeight: 700 }
  ]
});

Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2', fontWeight: 700 }
  ]
});

Font.register({
  family: 'Montserrat',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459W1hyw.woff2', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WRhyw.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wdhyw.woff2', fontWeight: 700 }
  ]
});

interface ReactPDFServiceProps {
  callsheet: CallsheetData;
  customization?: Partial<PDFCustomization>;
}

const getFontFamily = (family: string) => {
  switch (family) {
    case 'inter': return 'Inter';
    case 'poppins': return 'Poppins';
    case 'montserrat': return 'Montserrat';
    default: return 'Helvetica';
  }
};

const getFontWeight = (weight: string): number => {
  switch (weight) {
    case 'normal': return 400;
    case 'medium': return 500;
    case 'semibold': return 600;
    case 'bold': return 700;
    default: return 400;
  }
};

const createStyles = (customization: PDFCustomization) => {
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
    
    // Modern header styles
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

    // Modern section card styles
    sectionCard: {
      backgroundColor: customization.colors.surface,
      borderRadius: customization.visual.cornerRadius,
      marginBottom: customization.layout.spacing.sectionGap,
      overflow: 'hidden',
      ...(customization.visual.shadowIntensity === 'subtle' && {
        shadowColor: customization.colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      }),
      ...(customization.visual.shadowIntensity === 'medium' && {
        shadowColor: customization.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }),
      ...(customization.visual.cardStyle === 'bordered' && {
        borderWidth: 1,
        borderColor: customization.colors.border,
      }),
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

    // Modern divider styles
    sectionDivider: {
      height: customization.visual.sectionDividers === 'line' ? 1 : 0,
      backgroundColor: customization.visual.sectionDividers === 'accent' 
        ? customization.colors.accent 
        : customization.colors.borderLight,
      marginVertical: customization.visual.sectionDividers === 'space' 
        ? customization.layout.spacing.sectionGap / 2 
        : 0,
    },

    // Enhanced typography
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

    // Modern grid layouts
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
      borderWidth: customization.visual.cardStyle === 'bordered' ? 1 : 0,
      borderColor: customization.colors.borderLight,
    },
    
    infoCellAccent: {
      flex: 1,
      backgroundColor: customization.colors.accent + '10',
      padding: 12,
      borderRadius: customization.visual.cornerRadius - 2,
      borderLeftWidth: 3,
      borderLeftColor: customization.colors.accent,
    },

    // Enhanced contact styles
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
      borderLeftWidth: 2,
      borderLeftColor: customization.colors.accent,
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

    // Modern schedule styles
    scheduleItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      padding: 12,
      backgroundColor: customization.colors.background,
      borderRadius: customization.visual.cornerRadius - 2,
      borderLeftWidth: 3,
      borderLeftColor: customization.colors.accent,
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

    // Enhanced notes styling
    notesContainer: {
      backgroundColor: customization.colors.accent + '08',
      padding: 16,
      borderRadius: customization.visual.cornerRadius,
      borderLeftWidth: 4,
      borderLeftColor: customization.colors.accent,
    },

    // Modern footer
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
      borderTopWidth: customization.branding.footer?.style === 'accent' ? 2 : 0,
      borderTopColor: customization.colors.accent,
    },
    
    footerText: {
      fontSize: customization.typography.fontSize.caption,
      color: customization.colors.textLight,
      textAlign: customization.branding.footer?.position || 'center',
    },
  });
};

// Modern geometric icon component
const GeometricIcon: React.FC<{ type: string; color: string; size?: number }> = ({ 
  type, 
  color, 
  size = 16 
}) => {
  const iconContent = {
    calendar: '●',
    location: '◆',
    users: '▲',
    clock: '◐',
    notes: '◢',
    emergency: '⬟'
  }[type] || '●';

  return (
    <View style={{
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{ 
        color: '#ffffff', 
        fontSize: size * 0.6, 
        fontWeight: 600,
        lineHeight: size * 0.8
      }}>
        {iconContent}
      </Text>
    </View>
  );
};

const CallsheetPDFDocument: React.FC<ReactPDFServiceProps> = ({ callsheet, customization = {} }) => {
  const config = { ...DEFAULT_PDF_CUSTOMIZATION, ...customization };
  const styles = createStyles(config);

  const Header = () => (
    <View style={styles.headerContainer}>
      {config.branding.companyName && (
        <View style={styles.brandingRow}>
          <Text style={styles.companyName}>{config.branding.companyName}</Text>
          <Text style={styles.companyName}>
            {new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
      )}
      
      <View style={styles.titleSection}>
        <Text style={styles.title}>CALL SHEET</Text>
        <Text style={styles.projectTitle}>{callsheet.projectTitle}</Text>
      </View>
    </View>
  );

  const BasicInfo = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {config.sections.formatting.showSectionIcons && (
          <GeometricIcon type="calendar" color={config.colors.accent} />
        )}
        <Text style={styles.sectionTitle}>PRODUCTION DETAILS</Text>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
            <Text style={styles.label}>Call Time</Text>
            <Text style={styles.value}>{callsheet.generalCallTime}</Text>
          </View>
          <View style={styles.infoCellAccent}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{callsheet.location}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const LocationDetails = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {config.sections.formatting.showSectionIcons && (
          <GeometricIcon type="location" color={config.colors.accent} />
        )}
        <Text style={styles.sectionTitle}>LOCATION & LOGISTICS</Text>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.infoCell}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{callsheet.locationAddress}</Text>
        </View>
        
        {config.sections.visibility.weather && callsheet.weather && (
          <View style={[styles.infoCellAccent, { marginTop: 12 }]}>
            <Text style={styles.label}>Weather Forecast</Text>
            <Text style={styles.value}>{callsheet.weather}</Text>
          </View>
        )}
        
        {(callsheet.parkingInstructions || callsheet.basecampLocation) && (
          <View style={[styles.infoGrid, { marginTop: 12 }]}>
            {callsheet.parkingInstructions && (
              <View style={styles.infoCell}>
                <Text style={styles.label}>Parking</Text>
                <Text style={styles.value}>{callsheet.parkingInstructions}</Text>
              </View>
            )}
            {callsheet.basecampLocation && (
              <View style={styles.infoCell}>
                <Text style={styles.label}>Basecamp</Text>
                <Text style={styles.value}>{callsheet.basecampLocation}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const ContactSection = ({ title, contacts, iconType }: { 
    title: string; 
    contacts: any[]; 
    iconType: string;
  }) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {config.sections.formatting.showSectionIcons && (
          <GeometricIcon type={iconType} color={config.colors.accent} />
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {contacts.length === 0 ? (
          <Text style={[styles.value, { fontStyle: 'italic', color: config.colors.textLight }]}>
            No contacts added
          </Text>
        ) : (
          <View style={config.sections.formatting.contactLayout === 'cards' ? styles.contactGrid : {}}>
            {contacts.map((contact, index) => (
              <View key={contact.id || index} style={styles.contactCard}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRole}>
                  {contact.role}
                  {contact.character && ` • ${contact.character}`}
                </Text>
                <Text style={styles.contactDetails}>{contact.phone}</Text>
                {contact.email && <Text style={styles.contactDetails}>{contact.email}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const Schedule = () => (
    config.sections.visibility.schedule && (
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          {config.sections.formatting.showSectionIcons && (
            <GeometricIcon type="clock" color={config.colors.accent} />
          )}
          <Text style={styles.sectionTitle}>SHOOTING SCHEDULE</Text>
        </View>
        <View style={styles.sectionContent}>
          {callsheet.schedule.length === 0 ? (
            <Text style={[styles.value, { fontStyle: 'italic', color: config.colors.textLight }]}>
              No schedule items added
            </Text>
          ) : (
            callsheet.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleItem}>
                <Text style={styles.sceneNumber}>{item.sceneNumber}</Text>
                <View style={styles.scheduleContent}>
                  <Text style={styles.scheduleDescription}>
                    {item.intExt} • {item.description}
                  </Text>
                  <Text style={styles.scheduleDetails}>
                    {item.estimatedTime} • {item.pageCount} pages
                  </Text>
                  {item.location && (
                    <Text style={styles.scheduleDetails}>📍 {item.location}</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    )
  );

  const Notes = () => (
    config.sections.visibility.notes && callsheet.specialNotes.trim() && (
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          {config.sections.formatting.showSectionIcons && (
            <GeometricIcon type="notes" color={config.colors.accent} />
          )}
          <Text style={styles.sectionTitle}>SPECIAL NOTES</Text>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.notesContainer}>
            <Text style={styles.value}>{callsheet.specialNotes}</Text>
          </View>
        </View>
      </View>
    )
  );

  const Footer = () => (
    config.branding.footer?.text && (
      <View style={styles.footer}>
        <Text style={styles.footerText}>{config.branding.footer.text}</Text>
      </View>
    )
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation={config.layout.pageOrientation}>
        <Header />
        <BasicInfo />
        <LocationDetails />
        <ContactSection title="CAST" contacts={callsheet.cast} iconType="users" />
        <ContactSection title="CREW" contacts={callsheet.crew} iconType="users" />
        {config.sections.visibility.emergencyContacts && (
          <ContactSection 
            title="EMERGENCY CONTACTS" 
            contacts={callsheet.emergencyContacts} 
            iconType="emergency"
          />
        )}
        <Schedule />
        <Notes />
        <Footer />
      </Page>
    </Document>
  );
};

export class ReactPDFService {
  private customization: PDFCustomization;

  constructor(customization: Partial<PDFCustomization> = {}) {
    this.customization = { ...DEFAULT_PDF_CUSTOMIZATION, ...customization };
  }

  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    const doc = <CallsheetPDFDocument callsheet={callsheet} customization={this.customization} />;
    return await pdf(doc).toBlob();
  }

  async savePDF(callsheet: CallsheetData, filename?: string): Promise<void> {
    const blob = await this.generatePDF(callsheet);
    const fileName = filename || `${callsheet.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_callsheet.pdf`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async previewPDF(callsheet: CallsheetData): Promise<void> {
    const blob = await this.generatePDF(callsheet);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}

export const generateReactPDF = (callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}) => {
  const service = new ReactPDFService(customization);
  return service.savePDF(callsheet);
};

export const previewReactPDF = (callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}) => {
  const service = new ReactPDFService(customization);
  return service.previewPDF(callsheet);
};
