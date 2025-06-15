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
    backgroundColor: '#fefdfb',  // Warm sand background
    padding: customization.layout.margins.top,
    fontFamily: 'Helvetica',
    fontSize: customization.typography.fontSize.body,
    color: '#2c3e50',  // Darker, sophisticated text
  },
  
  // Header styles - inspired by Airbnb's clean header
  headerContainer: {
    marginBottom: 35,
    alignItems: customization.layout.headerStyle === 'centered' ? 'center' : 'flex-start',
  },
  
  companyCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,  // More rounded like Airbnb
    marginBottom: 20,
    alignSelf: customization.layout.headerStyle === 'centered' ? 'center' : 'flex-start',
    borderWidth: 1,
    borderColor: '#e8e6e3',
  },
  
  companyName: {
    fontSize: customization.typography.fontSize.small + 1,
    color: '#6b7280',
    textAlign: customization.layout.headerStyle === 'centered' ? 'center' : 'left',
    fontWeight: 500,
  },
  
  titleCard: {
    backgroundColor: customization.colors.accent,
    padding: 20,
    borderRadius: 20,  // More pronounced rounding
    marginBottom: 25,
    alignSelf: customization.layout.headerStyle === 'centered' ? 'center' : 'flex-start',
  },
  
  title: {
    fontSize: customization.typography.fontSize.title,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: customization.layout.headerStyle === 'centered' ? 'center' : 'left',
  },
  
  projectTitleCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#f3f2f0',
  },
  
  projectTitle: {
    fontSize: customization.typography.fontSize.header + 2,
    fontWeight: 'bold',
    color: customization.colors.primary,
    textAlign: customization.layout.headerStyle === 'centered' ? 'center' : 'left',
  },

  // Enhanced card styles inspired by Airbnb
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,  // Softer, more modern rounding
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f0efec',
  },
  
  cardHeader: {
    backgroundColor: '#fafaf9',  // Subtle warm background
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0efec',
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  cardContent: {
    padding: 20,
  },
  
  sectionTitle: {
    fontSize: customization.typography.fontSize.header,
    fontWeight: 'bold',
    color: customization.colors.primary,
    marginLeft: 12,
  },

  // Grid layouts with better spacing
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  
  column: {
    flex: 1,
  },

  // Refined inner cards inspired by Airbnb's info sections
  innerCard: {
    backgroundColor: '#f8f7f5',  // Warm neutral
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ebe9e6',
  },
  
  innerCardAccent: {
    backgroundColor: '#fef9f3',  // Warm accent background
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  // Enhanced typography
  label: {
    fontSize: customization.typography.fontSize.small,
    color: '#6b7280',
    marginBottom: 5,
    fontWeight: 600,
  },
  
  value: {
    fontSize: customization.typography.fontSize.body,
    color: '#374151',
    lineHeight: 1.5,
    fontWeight: 400,
  },

  // Contact styles with Airbnb-inspired layout
  contactItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0efec',
  },
  
  contactName: {
    fontSize: customization.typography.fontSize.body,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  
  contactDetails: {
    fontSize: customization.typography.fontSize.small,
    color: '#6b7280',
    lineHeight: 1.4,
  },

  // Modern schedule styling
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    padding: 16,
    backgroundColor: '#fafaf9',
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: customization.colors.accent,
  },
  
  sceneNumber: {
    backgroundColor: customization.colors.accent,
    color: '#ffffff',
    padding: 8,
    borderRadius: 10,
    fontSize: customization.typography.fontSize.small,
    fontWeight: 'bold',
    minWidth: 45,
    textAlign: 'center',
    marginRight: 15,
  },
  
  scheduleContent: {
    flex: 1,
  },
  
  scheduleHeader: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 18,
  },
  
  scheduleText: {
    fontSize: customization.typography.fontSize.small,
    color: '#6b7280',
    fontWeight: 500,
  },

  // Enhanced notes styling
  notesCard: {
    backgroundColor: '#fffbeb',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  // Refined footer
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    backgroundColor: '#f8f7f5',
    padding: 10,
    textAlign: 'center',
    borderRadius: 8,
    marginHorizontal: 40,
  },
  
  footerText: {
    fontSize: customization.typography.fontSize.small,
    color: '#9ca3af',
  },
});

// Enhanced icon component with better styling
const IconPlaceholder: React.FC<{ type: string }> = ({ type }) => (
  <View style={{
    width: 24,
    height: 24,
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold' }}>
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
