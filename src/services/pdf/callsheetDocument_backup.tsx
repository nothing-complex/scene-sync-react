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
  // Ensure complete customization object with safe defaults
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
        <Text style={styles.title}>CALL SHEET</Text>
        <SafeText style={styles.projectTitle}>{callsheet.projectTitle}</SafeText>
      </View>
    </View>
  );

  const BasicInfo = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {config.sections.formatting.showSectionIcons && (
          <SectionIcon type="calendar" color={config.colors.accent} />
        )}
        <Text style={styles.sectionTitle}>PRODUCTION DETAILS</Text>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
            <Text style={styles.label}>Call Time</Text>
            <SafeText style={styles.value}>{callsheet.generalCallTime}</SafeText>
          </View>
          <View style={styles.infoCellAccent}>
            <Text style={styles.label}>Location</Text>
            <SafeText style={styles.value}>{callsheet.location}</SafeText>
          </View>
        </View>
      </View>
    </View>
  );

  const LocationDetails = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {config.sections.formatting.showSectionIcons && (
          <SectionIcon type="location" color={config.colors.accent} />
        )}
        <Text style={styles.sectionTitle}>LOCATION & LOGISTICS</Text>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.infoCell}>
          <Text style={styles.label}>Address</Text>
          <SafeText style={styles.value}>{callsheet.locationAddress}</SafeText>
        </View>
        
        {config.sections.visibility.weather && callsheet.weather && callsheet.weather.trim() && (
          <View style={[styles.infoCellAccent, { marginTop: 12 }]}>
            <Text style={styles.label}>Weather Forecast</Text>
            <SafeText style={styles.value}>{callsheet.weather}</SafeText>
          </View>
        )}
        
        {((callsheet.parkingInstructions && callsheet.parkingInstructions.trim()) || 
          (callsheet.basecampLocation && callsheet.basecampLocation.trim())) && (
          <View style={[styles.infoGrid, { marginTop: 12 }]}>
            {callsheet.parkingInstructions && callsheet.parkingInstructions.trim() && (
              <View style={styles.infoCell}>
                <Text style={styles.label}>Parking</Text>
                <SafeText style={styles.value}>{callsheet.parkingInstructions}</SafeText>
              </View>
            )}
            {callsheet.basecampLocation && callsheet.basecampLocation.trim() && (
              <View style={styles.infoCell}>
                <Text style={styles.label}>Basecamp</Text>
                <SafeText style={styles.value}>{callsheet.basecampLocation}</SafeText>
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
          <View style={styles.contactGridContainer}>
            {contacts.map((contact, index) => (
              <View key={contact.id || index} style={styles.contactGridItem}>
                <SafeText style={styles.contactName}>{contact.name}</SafeText>
                {((contact.role && contact.role.trim()) || (contact.character && contact.character.trim())) && (
                  <SafeText style={styles.contactRole}>
                    {[
                      contact.role && contact.role.trim() ? contact.role.trim() : '',
                      contact.character && contact.character.trim() ? contact.character.trim() : ''
                    ].filter(Boolean).join(' • ')}
                  </SafeText>
                )}
                <SafeText style={styles.contactDetails}>{contact.phone}</SafeText>
                {contact.email && contact.email.trim() && (
                  <SafeText style={styles.contactDetails}>{contact.email}</SafeText>
                )}
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
            <SectionIcon type="clock" color={config.colors.accent} />
          )}
          <Text style={styles.sectionTitle}>SHOOTING SCHEDULE</Text>
        </View>
        <View style={styles.sectionContent}>
          {(!callsheet.schedule || callsheet.schedule.length === 0) ? (
            <Text style={[styles.value, { fontStyle: 'italic', color: config.colors.textLight }]}>
              No schedule items added
            </Text>
          ) : (
            callsheet.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleItem}>
                <SafeText style={styles.sceneNumber}>{item.sceneNumber}</SafeText>
                <View style={styles.scheduleContent}>
                  <SafeText style={styles.scheduleDescription}>
                    {[
                      item.intExt && item.intExt.trim() ? item.intExt.trim() : '',
                      item.description && item.description.trim() ? item.description.trim() : ''
                    ].filter(Boolean).join(' • ')}
                  </SafeText>
                  <SafeText style={styles.scheduleDetails}>
                    {[
                      item.estimatedTime && item.estimatedTime.trim() ? item.estimatedTime.trim() : '',
                      item.pageCount && item.pageCount.trim() ? `${item.pageCount.trim()} pages` : ''
                    ].filter(Boolean).join(' • ')}
                  </SafeText>
                  {item.location && item.location.trim() && (
                    <SafeText style={styles.scheduleDetails}>{`📍 ${item.location}`}</SafeText>
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
    config.sections.visibility.notes && callsheet.specialNotes && callsheet.specialNotes.trim() && (
      <View style={styles.sectionCard}>
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
        <BasicInfo />
        <LocationDetails />
        <ContactSection title="CAST" contacts={callsheet.cast || []} iconType="users" />
        <ContactSection title="CREW" contacts={callsheet.crew || []} iconType="users" />
        {config.sections.visibility.emergencyContacts && (
          <ContactSection 
            title="EMERGENCY CONTACTS" 
            contacts={callsheet.emergencyContacts || []} 
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
