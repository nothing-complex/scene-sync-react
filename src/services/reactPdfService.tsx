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
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#2c3e50',  // Darker, sophisticated text
  },
  
  // Header styles - more compact
  headerContainer: {
    marginBottom: 20,
    alignItems: customization.layout.headerStyle === 'centered' ? 'center' : 'flex-start',
  },
  
  companyCard: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: customization.layout.headerStyle === 'centered' ? 'center' : 'flex-start',
    borderWidth: 1,
    borderColor: '#e8e6e3',
  },
  
  companyName: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: customization.layout.headerStyle === 'centered' ? 'center' : 'left',
    fontWeight: 500,
  },
  
  titleCard: {
    backgroundColor: customization.colors.accent,
    padding: 12,
    borderRadius: 14,
    marginBottom: 15,
    alignSelf: customization.layout.headerStyle === 'centered' ? 'center' : 'flex-start',
  },
  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: customization.layout.headerStyle === 'centered' ? 'center' : 'left',
  },
  
  projectTitleCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#f3f2f0',
  },
  
  projectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: customization.colors.primary,
    textAlign: customization.layout.headerStyle === 'centered' ? 'center' : 'left',
  },

  // Table-based card styles
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0efec',
  },
  
  cardHeader: {
    backgroundColor: '#fafaf9',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0efec',
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  cardContent: {
    padding: 12,
  },
  
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: customization.colors.primary,
    marginLeft: 8,
  },

  // Table layout styles - removed invalid borderStyle
  table: {
    width: '100%',
  },
  
  tableRow: {
    flexDirection: 'row',
  },
  
  tableCell: {
    flex: 1,
    padding: 4,
  },
  
  tableCellHalf: {
    width: '50%',
    padding: 4,
  },
  
  tableCellThird: {
    width: '33.33%',
    padding: 4,
  },
  
  tableCellTwoThirds: {
    width: '66.67%',
    padding: 4,
  },

  // Two column grid for contacts
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  
  column: {
    flex: 1,
  },

  // Compact inner cards
  innerCard: {
    backgroundColor: '#f8f7f5',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ebe9e6',
  },
  
  innerCardAccent: {
    backgroundColor: '#fef9f3',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  // Smaller typography
  label: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 3,
    fontWeight: 600,
  },
  
  value: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.3,
    fontWeight: 400,
  },

  // Compact contact styles for two-column layout
  contactItem: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f0efec',
  },
  
  contactName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  
  contactRole: {
    fontSize: 7,
    color: '#6b7280',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  
  contactDetails: {
    fontSize: 7,
    color: '#6b7280',
    lineHeight: 1.2,
  },

  // Schedule styling with table layout - removed invalid borderStyle
  scheduleTable: {
    width: '100%',
  },
  
  scheduleHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f7f5',
    padding: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  
  scheduleHeaderCell: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#6b7280',
    textAlign: 'center',
  },
  
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fafaf9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: customization.colors.accent,
  },
  
  sceneNumber: {
    backgroundColor: customization.colors.accent,
    color: '#ffffff',
    padding: 4,
    borderRadius: 6,
    fontSize: 7,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
    marginRight: 8,
  },
  
  scheduleContent: {
    flex: 1,
  },
  
  scheduleText: {
    fontSize: 7,
    color: '#6b7280',
    fontWeight: 500,
  },
  
  scheduleDescription: {
    fontSize: 8,
    color: '#374151',
    marginBottom: 2,
  },

  // Info grid styles
  infoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  
  infoCell: {
    flex: 1,
    backgroundColor: '#f8f7f5',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ebe9e6',
  },
  
  infoCellAccent: {
    flex: 1,
    backgroundColor: '#fef9f3',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  // Notes styling
  notesCard: {
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    backgroundColor: '#f8f7f5',
    padding: 8,
    textAlign: 'center',
    borderRadius: 6,
    marginHorizontal: 30,
  },
  
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
});

// Smaller icon component
const IconPlaceholder: React.FC<{ type: string }> = ({ type }) => (
  <View style={{
    width: 18,
    height: 18,
    backgroundColor: '#f59e0b',
    borderRadius: 9,
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
        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.label}>General Call</Text>
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
          <View style={styles.infoGrid}>
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
          <View style={styles.twoColumnGrid}>
            <View style={styles.column}>
              {contacts.filter((_, index) => index % 2 === 0).map((contact, index) => (
                <View key={contact.id || index} style={styles.contactItem}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRole}>
                    {contact.role}
                    {contact.character && ` (${contact.character})`}
                  </Text>
                  <Text style={styles.contactDetails}>{contact.phone}</Text>
                  {contact.email && <Text style={styles.contactDetails}>{contact.email}</Text>}
                </View>
              ))}
            </View>
            <View style={styles.column}>
              {contacts.filter((_, index) => index % 2 === 1).map((contact, index) => (
                <View key={contact.id || index} style={styles.contactItem}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRole}>
                    {contact.role}
                    {contact.character && ` (${contact.character})`}
                  </Text>
                  <Text style={styles.contactDetails}>{contact.phone}</Text>
                  {contact.email && <Text style={styles.contactDetails}>{contact.email}</Text>}
                </View>
              ))}
            </View>
          </View>
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
            <View style={styles.scheduleTable}>
              {/* Schedule Header */}
              <View style={styles.scheduleHeaderRow}>
                <View style={[styles.tableCellThird, { alignItems: 'center' }]}>
                  <Text style={styles.scheduleHeaderCell}>SCENE</Text>
                </View>
                <View style={[styles.tableCellThird, { alignItems: 'center' }]}>
                  <Text style={styles.scheduleHeaderCell}>TIME</Text>
                </View>
                <View style={[styles.tableCellThird, { alignItems: 'center' }]}>
                  <Text style={styles.scheduleHeaderCell}>PAGES</Text>
                </View>
              </View>
              
              {callsheet.schedule.map((item, index) => (
                <View key={index} style={styles.scheduleRow}>
                  <Text style={styles.sceneNumber}>{item.sceneNumber}</Text>
                  <View style={styles.scheduleContent}>
                    <View style={styles.tableRow}>
                      <View style={styles.tableCellThird}>
                        <Text style={styles.scheduleText}>{item.intExt}</Text>
                      </View>
                      <View style={styles.tableCellThird}>
                        <Text style={styles.scheduleText}>{item.estimatedTime}</Text>
                      </View>
                      <View style={styles.tableCellThird}>
                        <Text style={styles.scheduleText}>{item.pageCount}</Text>
                      </View>
                    </View>
                    <Text style={styles.scheduleDescription}>{item.description}</Text>
                    {item.location && (
                      <Text style={styles.scheduleText}>📍 {item.location}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
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
