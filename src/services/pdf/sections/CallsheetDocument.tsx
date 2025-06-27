
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { createStyles } from '../styleUtils_backup';

interface CallsheetPDFDocumentProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const CallsheetPDFDocument: React.FC<CallsheetPDFDocumentProps> = ({
  callsheet,
  customization,
}) => {
  const styles = createStyles(customization);

  const Header = () => (
    <View style={styles.headerContainer}>
      {/* Logo in top-right */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>FACE</Text>
      </View>
      
      {/* Title section */}
      <View style={styles.titleSection}>
        <Text style={styles.projectTitle}>{callsheet.projectTitle}</Text>
        <Text style={styles.callsheetSubtitle}>CALL SHEET</Text>
      </View>
    </View>
  );

  const ProductionGrid = () => (
    <View style={styles.productionGrid}>
      <View style={styles.gridCard}>
        <Text style={styles.gridLabel}>Shoot Date</Text>
        <Text style={styles.gridValue}>
          {new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      
      {callsheet.generalCallTime && (
        <View style={styles.gridCard}>
          <Text style={styles.gridLabel}>Call Time</Text>
          <Text style={styles.gridValue}>{callsheet.generalCallTime}</Text>
        </View>
      )}
      
      {callsheet.location && (
        <View style={styles.gridCard}>
          <Text style={styles.gridLabel}>Location</Text>
          <Text style={styles.gridValue}>{callsheet.location}</Text>
        </View>
      )}
      
      {callsheet.weather && (
        <View style={styles.gridCard}>
          <Text style={styles.gridLabel}>Weather</Text>
          <Text style={styles.gridValue}>{callsheet.weather}</Text>
        </View>
      )}
      
      {callsheet.parkingInstructions && (
        <View style={styles.gridCard}>
          <Text style={styles.gridLabel}>Parking Instructions</Text>
          <Text style={styles.gridValue}>{callsheet.parkingInstructions}</Text>
        </View>
      )}
      
      {callsheet.basecampLocation && (
        <View style={styles.gridCard}>
          <Text style={styles.gridLabel}>Basecamp Location</Text>
          <Text style={styles.gridValue}>{callsheet.basecampLocation}</Text>
        </View>
      )}
    </View>
  );

  const SpecialNotes = () => {
    if (!callsheet.specialNotes?.trim()) return null;
    
    return (
      <View style={styles.notesCard} wrap={false}>
        <View style={styles.notesHeader}>
          <Text style={styles.notesTitle}>SPECIAL NOTES</Text>
        </View>
        <View style={styles.notesContent}>
          <Text style={styles.notesText}>{callsheet.specialNotes}</Text>
        </View>
      </View>
    );
  };

  const Schedule = () => {
    if (!callsheet.schedule?.length) return null;
    
    return (
      <View style={styles.sectionCard} wrap={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SCHEDULE</Text>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.scheduleTable}>
            <View style={styles.scheduleHeader}>
              <Text style={[styles.scheduleHeaderCell, { width: '15%' }]}>Time</Text>
              <Text style={[styles.scheduleHeaderCell, { width: '15%' }]}>Scene</Text>
              <Text style={[styles.scheduleHeaderCell, { width: '40%' }]}>Description</Text>
              <Text style={[styles.scheduleHeaderCell, { width: '30%' }]}>Location</Text>
            </View>
            {callsheet.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleRow}>
                <Text style={[styles.scheduleCell, { width: '15%' }]}>
                  {item.estimatedTime || 'TBD'}
                </Text>
                <Text style={[styles.scheduleCell, { width: '15%' }]}>
                  {item.sceneNumber || 'N/A'}
                </Text>
                <Text style={[styles.scheduleCell, { width: '40%' }]}>
                  {item.description || 'No description'}
                </Text>
                <Text style={[styles.scheduleCell, { width: '30%' }]}>
                  {item.location || 'TBD'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const ContactSection = ({ title, contacts, type }: { 
    title: string; 
    contacts: any[]; 
    type: 'normal' | 'emergency';
  }) => {
    if (!contacts?.length) return null;
    
    const isEmergency = type === 'emergency';
    const cardStyle = isEmergency ? styles.emergencyCard : styles.sectionCard;
    const headerStyle = isEmergency ? styles.emergencyHeader : styles.sectionHeader;
    const titleStyle = isEmergency ? styles.emergencyTitle : styles.sectionTitle;
    const contentStyle = isEmergency ? styles.emergencyContent : styles.sectionContent;
    
    return (
      <View style={cardStyle} wrap={false}>
        <View style={headerStyle}>
          <Text style={titleStyle}>{title}</Text>
        </View>
        <View style={contentStyle}>
          <View style={styles.contactGrid}>
            {contacts.map((contact, index) => (
              <View 
                key={contact.id || index} 
                style={isEmergency ? styles.emergencyContactCard : styles.contactCard}
              >
                <Text style={styles.contactName}>{contact.name || 'Unknown'}</Text>
                {(contact.role || contact.character) && (
                  <Text style={styles.contactRole}>
                    {[contact.role, contact.character].filter(Boolean).join(' • ')}
                  </Text>
                )}
                {contact.phone && (
                  <Text style={styles.contactInfo}>Phone: {contact.phone}</Text>
                )}
                {contact.email && (
                  <Text style={styles.contactInfo}>Email: {contact.email}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const Footer = () => (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header />
        <ProductionGrid />
        <SpecialNotes />
        <Schedule />
        <ContactSection title="CAST" contacts={callsheet.cast || []} type="normal" />
        <ContactSection title="CREW" contacts={callsheet.crew || []} type="normal" />
        <ContactSection title="EMERGENCY CONTACTS" contacts={callsheet.emergencyContacts || []} type="emergency" />
        <Footer />
      </Page>
    </Document>
  );
};
