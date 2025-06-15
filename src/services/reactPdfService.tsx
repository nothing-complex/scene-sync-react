
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';

// Register fonts (optional - you can add custom fonts here)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
// });

interface ReactPDFServiceProps {
  callsheet: CallsheetData;
  customization?: Partial<PDFCustomization>;
}

const createStyles = (customization: PDFCustomization) => StyleSheet.create({
  page: {
    backgroundColor: customization.colors.background,
    padding: customization.layout.margins.top,
    fontFamily: 'Helvetica',
    fontSize: customization.typography.fontSize.body,
    color: customization.colors.text,
  },
  
  // Header styles
  headerContainer: {
    marginBottom: 30,
    alignItems: customization.layout.headerStyle === 'centered' ? 'center' : 'flex-start',
  },
  
  companyCard: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: customization.layout.headerStyle === 'centered' ? 'center' : 'flex-start',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  companyName: {
    fontSize: customization.typography.fontSize.small,
    color: customization.colors.secondary,
    textAlign: customization.layout.headerStyle === 'centered' ? 'center' : 'left',
  },
  
  titleCard: {
    backgroundColor: customization.colors.accent,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: customization.layout.headerStyle === 'centered' ? 'center' : 'flex-start',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  
  title: {
    fontSize: customization.typography.fontSize.title,
    fontWeight: customization.typography.fontWeight.title,
    color: '#ffffff',
    textAlign: customization.layout.headerStyle === 'centered' ? 'center' : 'left',
  },
  
  projectTitleCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  
  projectTitle: {
    fontSize: customization.typography.fontSize.header,
    fontWeight: customization.typography.fontWeight.header,
    color: customization.colors.primary,
    textAlign: customization.layout.headerStyle === 'centered' ? 'center' : 'left',
  },

  // Card styles
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  
  cardHeader: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  cardContent: {
    padding: 15,
  },
  
  sectionTitle: {
    fontSize: customization.typography.fontSize.header,
    fontWeight: customization.typography.fontWeight.header,
    color: customization.colors.accent,
    marginLeft: 10,
  },

  // Grid layouts
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  
  column: {
    flex: 1,
  },

  // Inner cards
  innerCard: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
  },
  
  innerCardAccent: {
    backgroundColor: '#fef7ed',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#fed7aa',
  },

  // Text styles
  label: {
    fontSize: customization.typography.fontSize.small,
    color: customization.colors.secondary,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  
  value: {
    fontSize: customization.typography.fontSize.body,
    color: customization.colors.text,
    lineHeight: 1.4,
  },

  // Contact styles
  contactItem: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  
  contactName: {
    fontSize: customization.typography.fontSize.body,
    fontWeight: 'bold',
    color: customization.colors.text,
    marginBottom: 4,
  },
  
  contactDetails: {
    fontSize: customization.typography.fontSize.small,
    color: customization.colors.secondary,
    lineHeight: 1.3,
  },

  // Schedule styles
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: customization.colors.accent,
  },
  
  sceneNumber: {
    backgroundColor: customization.colors.accent,
    color: '#ffffff',
    padding: 6,
    borderRadius: 6,
    fontSize: customization.typography.fontSize.small,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
    marginRight: 12,
  },
  
  scheduleContent: {
    flex: 1,
  },
  
  scheduleHeader: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 15,
  },
  
  scheduleText: {
    fontSize: customization.typography.fontSize.small,
    color: customization.colors.secondary,
  },

  // Notes styles
  notesCard: {
    backgroundColor: '#fef3c7',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: '#f1f5f9',
    padding: 8,
    textAlign: 'center',
  },
  
  footerText: {
    fontSize: customization.typography.fontSize.small,
    color: customization.colors.secondary,
  },
});

const IconPlaceholder: React.FC<{ type: string }> = ({ type }) => (
  <View style={{
    width: 20,
    height: 20,
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Text style={{ color: '#ffffff', fontSize: 8, fontWeight: 'bold' }}>
      {type === 'calendar' ? '📅' : type === 'location' ? '📍' : type === 'users' ? '👥' : type === 'clock' ? '🕐' : '📄'}
    </Text>
  </View>
);

const CallsheetPDFDocument: React.FC<ReactPDFServiceProps> = ({ callsheet, customization = {} }) => {
  const config = { ...DEFAULT_PDF_CUSTOMIZATION, ...customization };
  const styles = createStyles(config);

  const Header = () => (
    <View style={styles.headerContainer}>
      {config.branding.companyName && (
        <View style={styles.companyCard}>
          <Text style={styles.companyName}>{config.branding.companyName}</Text>
        </View>
      )}
      
      <View style={styles.titleCard}>
        <Text style={styles.title}>CALL SHEET</Text>
      </View>
      
      <View style={styles.projectTitleCard}>
        <Text style={styles.projectTitle}>{callsheet.projectTitle}</Text>
      </View>
    </View>
  );

  const BasicInfo = () => (
    <View style={styles.sectionCard}>
      <View style={styles.cardHeader}>
        <IconPlaceholder type="calendar" />
        <Text style={styles.sectionTitle}>SHOOT DETAILS</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.twoColumnGrid}>
          <View style={styles.column}>
            <View style={styles.innerCard}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>
                {new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <View style={styles.innerCard}>
              <Text style={styles.label}>General Call</Text>
              <Text style={styles.value}>{callsheet.generalCallTime}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.innerCardAccent}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{callsheet.location}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const LocationDetails = () => (
    <View style={styles.sectionCard}>
      <View style={styles.cardHeader}>
        <IconPlaceholder type="location" />
        <Text style={styles.sectionTitle}>LOCATION DETAILS</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.innerCard}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{callsheet.locationAddress}</Text>
        </View>
        
        {config.sections.visibility.weather && callsheet.weather && (
          <View style={styles.innerCardAccent}>
            <Text style={styles.label}>Weather</Text>
            <Text style={styles.value}>{callsheet.weather}</Text>
          </View>
        )}
        
        {(callsheet.parkingInstructions || callsheet.basecampLocation) && (
          <View style={styles.twoColumnGrid}>
            {callsheet.parkingInstructions && (
              <View style={styles.column}>
                <Text style={styles.label}>Parking</Text>
                <Text style={styles.value}>{callsheet.parkingInstructions}</Text>
              </View>
            )}
            {callsheet.basecampLocation && (
              <View style={styles.column}>
                <Text style={styles.label}>Basecamp</Text>
                <Text style={styles.value}>{callsheet.basecampLocation}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const ContactSection = ({ title, contacts }: { title: string; contacts: any[] }) => (
    <View style={styles.sectionCard}>
      <View style={styles.cardHeader}>
        <IconPlaceholder type="users" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {contacts.length === 0 ? (
          <Text style={[styles.value, { fontStyle: 'italic' }]}>No contacts added</Text>
        ) : (
          contacts.map((contact, index) => (
            <View key={index} style={styles.contactItem}>
              <Text style={styles.contactName}>
                {contact.name} • {contact.role}
                {contact.character && ` (${contact.character})`}
              </Text>
              <Text style={styles.contactDetails}>
                {contact.phone}
                {contact.email && ` • ${contact.email}`}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );

  const Schedule = () => (
    config.sections.visibility.schedule && (
      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <IconPlaceholder type="clock" />
          <Text style={styles.sectionTitle}>SHOOTING SCHEDULE</Text>
        </View>
        <View style={styles.cardContent}>
          {callsheet.schedule.length === 0 ? (
            <Text style={[styles.value, { fontStyle: 'italic' }]}>No schedule items added</Text>
          ) : (
            callsheet.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleItem}>
                <Text style={styles.sceneNumber}>{item.sceneNumber}</Text>
                <View style={styles.scheduleContent}>
                  <View style={styles.scheduleHeader}>
                    <Text style={styles.scheduleText}>{item.intExt}</Text>
                    <Text style={styles.scheduleText}>{item.estimatedTime}</Text>
                    <Text style={styles.scheduleText}>{item.pageCount} pages</Text>
                  </View>
                  <Text style={styles.value}>{item.description}</Text>
                  {item.location && (
                    <Text style={styles.scheduleText}>📍 {item.location}</Text>
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
        <View style={styles.cardHeader}>
          <IconPlaceholder type="notes" />
          <Text style={styles.sectionTitle}>SPECIAL NOTES</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.notesCard}>
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
        <ContactSection title="CAST" contacts={callsheet.cast} />
        <ContactSection title="CREW" contacts={callsheet.crew} />
        {config.sections.visibility.emergencyContacts && (
          <ContactSection title="EMERGENCY CONTACTS" contacts={callsheet.emergencyContacts} />
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
    
    // Create download link
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

// Export the new service for use in other components
export const generateReactPDF = (callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}) => {
  const service = new ReactPDFService(customization);
  return service.savePDF(callsheet);
};

export const previewReactPDF = (callsheet: CallsheetData, customization: Partial<PDFCustomization> = {}) => {
  const service = new ReactPDFService(customization);
  return service.previewPDF(callsheet);
};
