import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { createStyles } from './styleUtils_backup';
import { SafeText, SectionIcon } from './components_backup';

interface CallsheetPDFDocumentProps {
  callsheet: CallsheetData;
  customization?: Partial<PDFCustomization>;
}

export const CallsheetPDFDocument: React.FC<CallsheetPDFDocumentProps> = ({ callsheet, customization = {} }) => {
  const config: PDFCustomization = {
    ...DEFAULT_PDF_CUSTOMIZATION,
    ...customization,
    colors: { ...DEFAULT_PDF_CUSTOMIZATION.colors, ...customization.colors },
    typography: { 
      ...DEFAULT_PDF_CUSTOMIZATION.typography, 
      ...customization.typography,
      fontSize: { ...DEFAULT_PDF_CUSTOMIZATION.typography.fontSize, ...customization.typography?.fontSize },
      fontWeight: { ...DEFAULT_PDF_CUSTOMIZATION.typography.fontWeight, ...customization.typography?.fontWeight },
      lineHeight: { ...DEFAULT_PDF_CUSTOMIZATION.typography.lineHeight, ...customization.typography?.lineHeight }
    },
    layout: { 
      ...DEFAULT_PDF_CUSTOMIZATION.layout, 
      ...customization.layout,
      margins: { ...DEFAULT_PDF_CUSTOMIZATION.layout.margins, ...customization.layout?.margins },
      spacing: { ...DEFAULT_PDF_CUSTOMIZATION.layout.spacing, ...customization.layout?.spacing }
    },
    visual: { ...DEFAULT_PDF_CUSTOMIZATION.visual, ...customization.visual },
    sections: { 
      ...DEFAULT_PDF_CUSTOMIZATION.sections, 
      ...customization.sections,
      visibility: { ...DEFAULT_PDF_CUSTOMIZATION.sections.visibility, ...customization.sections?.visibility },
      formatting: { ...DEFAULT_PDF_CUSTOMIZATION.sections.formatting, ...customization.sections?.formatting }
    },
    branding: { ...DEFAULT_PDF_CUSTOMIZATION.branding, ...customization.branding }
  };
  
  const styles = createStyles(config);

  const Header = () => (
    <View style={styles.headerContainer}>
      {config.branding.companyName && config.branding.companyName.trim() && (
        <View style={styles.brandingRow}>
          <SafeText style={styles.companyName}>{config.branding.companyName}</SafeText>
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
        <SafeText style={styles.projectTitle}>{callsheet.projectTitle}</SafeText>
        <Text style={styles.title}>CALL SHEET</Text>
      </View>
    </View>
  );

  const ProductionDetailsGrid = () => (
    <View style={[styles.sectionCard, { marginBottom: 16 }]}>
      <View style={styles.productionGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Shoot Date</Text>
          <SafeText style={styles.value}>
            {new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </SafeText>
        </View>
        
        <View style={styles.gridItem}>
          <Text style={styles.label}>Call Time</Text>
          <SafeText style={styles.value}>{callsheet.generalCallTime}</SafeText>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.label}>Location</Text>
          <SafeText style={styles.value}>{callsheet.location}</SafeText>
          {callsheet.locationAddress && (
            <SafeText style={styles.locationAddress}>{callsheet.locationAddress}</SafeText>
          )}
        </View>

        {callsheet.weather && config.sections.visibility.weather && (
          <View style={styles.gridItem}>
            <Text style={styles.label}>Weather</Text>
            <SafeText style={styles.value}>{callsheet.weather}</SafeText>
          </View>
        )}

        {callsheet.parkingInstructions && (
          <View style={styles.gridItem}>
            <Text style={styles.label}>Parking Instructions</Text>
            <SafeText style={styles.value}>{callsheet.parkingInstructions}</SafeText>
          </View>
        )}

        {callsheet.basecampLocation && (
          <View style={styles.gridItem}>
            <Text style={styles.label}>Basecamp Location</Text>
            <SafeText style={styles.value}>{callsheet.basecampLocation}</SafeText>
          </View>
        )}
      </View>
    </View>
  );

  const Notes = () => (
    config.sections.visibility.notes && callsheet.specialNotes && callsheet.specialNotes.trim() && (
      <View style={[styles.sectionCard, { marginBottom: 16 }]}>
        <View style={styles.sectionHeader}>
          {config.sections.formatting.showSectionIcons && (
            <SectionIcon type="notes" color={config.colors.accent} />
          )}
          <Text style={styles.sectionTitle}>SPECIAL NOTES</Text>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.notesContainer}>
            <SafeText style={styles.value}>{callsheet.specialNotes}</SafeText>
          </View>
        </View>
      </View>
    )
  );

  const Schedule = () => (
    config.sections.visibility.schedule && callsheet.schedule && callsheet.schedule.length > 0 && (
      <View style={[styles.sectionCard, { marginBottom: 16 }]}>
        <View style={styles.sectionHeader}>
          {config.sections.formatting.showSectionIcons && (
            <SectionIcon type="clock" color={config.colors.accent} />
          )}
          <Text style={styles.sectionTitle}>SCHEDULE</Text>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.scheduleTable}>
            <View style={styles.scheduleTableHeader}>
              <Text style={[styles.scheduleHeaderCell, { flex: 1 }]}>Scene</Text>
              <Text style={[styles.scheduleHeaderCell, { flex: 1 }]}>Int/Ext</Text>
              <Text style={[styles.scheduleHeaderCell, { flex: 2 }]}>Description</Text>
              <Text style={[styles.scheduleHeaderCell, { flex: 2 }]}>Location</Text>
              <Text style={[styles.scheduleHeaderCell, { flex: 1 }]}>Time</Text>
            </View>
            {callsheet.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleTableRow}>
                <SafeText style={[styles.scheduleCell, { flex: 1 }]}>{item.sceneNumber}</SafeText>
                <SafeText style={[styles.scheduleCell, { flex: 1 }]}>{item.intExt}</SafeText>
                <SafeText style={[styles.scheduleCell, { flex: 2 }]}>{item.description}</SafeText>
                <SafeText style={[styles.scheduleCell, { flex: 2 }]}>{item.location}</SafeText>
                <SafeText style={[styles.scheduleCell, { flex: 1 }]}>{item.estimatedTime}</SafeText>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  );

  const ContactSection = ({ title, contacts, iconType }: { 
    title: string; 
    contacts: any[]; 
    iconType: string;
  }) => (
    <View style={[styles.sectionCard, { marginBottom: 16 }]}>
      <View style={styles.sectionHeader}>
        {config.sections.formatting.showSectionIcons && (
          <SectionIcon type={iconType} color={config.colors.accent} />
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {(!contacts || contacts.length === 0) ? (
          <Text style={[styles.value, { fontStyle: 'italic', color: config.colors.textLight }]}>
            No contacts added
          </Text>
        ) : (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            {contacts.map((contact, index) => (
              <View key={contact.id || index} style={{
                width: '48%',
                backgroundColor: config.colors.background,
                padding: 10,
                borderRadius: config.visual.cornerRadius - 2,
                marginBottom: 6,
                borderLeftWidth: 2,
                borderLeftColor: config.colors.accent,
              }}>
                <SafeText style={{
                  fontSize: config.typography.fontSize.body,
                  fontWeight: 600,
                  color: config.colors.text,
                  marginBottom: 2,
                }}>{contact.name}</SafeText>
                {((contact.role && contact.role.trim()) || (contact.character && contact.character.trim())) && (
                  <SafeText style={{
                    fontSize: config.typography.fontSize.small,
                    color: config.colors.textLight,
                    marginBottom: 2,
                    fontStyle: 'italic',
                  }}>
                    {[
                      contact.role && contact.role.trim() ? contact.role.trim() : '',
                      contact.character && contact.character.trim() ? contact.character.trim() : ''
                    ].filter(Boolean).join(' • ')}
                  </SafeText>
                )}
                <SafeText style={{
                  fontSize: config.typography.fontSize.small,
                  color: config.colors.textLight,
                  lineHeight: 1.3,
                }}>{contact.phone}</SafeText>
                {contact.email && contact.email.trim() && (
                  <SafeText style={{
                    fontSize: config.typography.fontSize.small,
                    color: config.colors.textLight,
                    lineHeight: 1.3,
                  }}>{contact.email}</SafeText>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const Footer = () => (
    config.branding.footer?.text && config.branding.footer.text.trim() && (
      <View style={styles.footer}>
        <SafeText style={styles.footerText}>{config.branding.footer.text}</SafeText>
      </View>
    )
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation={config.layout.pageOrientation}>
        <Header />
        <ProductionDetailsGrid />
        <Notes />
        <Schedule />
        <ContactSection title="CAST" contacts={callsheet.cast || []} iconType="users" />
        <ContactSection title="CREW" contacts={callsheet.crew || []} iconType="users" />
        {config.sections.visibility.emergencyContacts && (
          <ContactSection 
            title="EMERGENCY CONTACTS" 
            contacts={callsheet.emergencyContacts || []} 
            iconType="emergency"
          />
        )}
        <Footer />
      </Page>
    </Document>
  );
};
