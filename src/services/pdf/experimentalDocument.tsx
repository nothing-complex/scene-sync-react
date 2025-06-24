
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { getFontFamily, getFontWeight } from './fontUtils_backup';

interface ExperimentalCallsheetPDFDocumentProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

const createExperimentalStyles = (customization: PDFCustomization) => {
  const fontFamily = getFontFamily(customization.typography.fontFamily);
  
  return StyleSheet.create({
    page: {
      backgroundColor: '#f8fafc',
      padding: 40,
      fontFamily,
      fontSize: customization.typography.fontSize.body,
      color: customization.colors.text,
    },
    
    // Timeline-inspired header
    timelineHeader: {
      alignItems: 'center',
      marginBottom: 40,
      padding: 30,
      backgroundColor: '#ffffff',
      borderRadius: 20,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    
    mainTitle: {
      fontSize: 36,
      fontWeight: getFontWeight('bold'),
      color: '#1a1a1a',
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: 2,
    },
    
    subtitle: {
      fontSize: 18,
      color: '#6b7280',
      textAlign: 'center',
      fontWeight: getFontWeight('medium'),
      letterSpacing: 1,
    },
    
    // Timeline navigation inspired section
    timelineNav: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
      padding: 20,
      backgroundColor: '#ffffff',
      borderRadius: 15,
    },
    
    timelineDate: {
      fontSize: 14,
      color: '#374151',
      fontWeight: getFontWeight('medium'),
      marginHorizontal: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#f3f4f6',
      borderRadius: 8,
    },
    
    activeDate: {
      backgroundColor: customization.colors.accent,
      color: '#ffffff',
    },
    
    // Event card inspired layout
    eventCard: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: customization.colors.accent,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    },
    
    eventTitle: {
      fontSize: 20,
      fontWeight: getFontWeight('semibold'),
      color: '#1f2937',
      marginBottom: 12,
    },
    
    eventMeta: {
      fontSize: 12,
      color: '#6b7280',
      marginBottom: 16,
      fontStyle: 'italic',
    },
    
    eventContent: {
      fontSize: 14,
      lineHeight: 1.6,
      color: '#374151',
    },
    
    // Grid layout for details
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 20,
    },
    
    detailCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: '#ffffff',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    
    detailLabel: {
      fontSize: 11,
      color: '#6b7280',
      fontWeight: getFontWeight('medium'),
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    
    detailValue: {
      fontSize: 14,
      color: '#1f2937',
      fontWeight: getFontWeight('medium'),
    },
    
    // Contact cards with modern styling
    contactGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    
    contactCard: {
      flex: 1,
      minWidth: '30%',
      backgroundColor: '#ffffff',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    
    contactName: {
      fontSize: 14,
      fontWeight: getFontWeight('semibold'),
      color: '#1f2937',
      marginBottom: 4,
    },
    
    contactRole: {
      fontSize: 12,
      color: '#6b7280',
      marginBottom: 8,
    },
    
    contactInfo: {
      fontSize: 11,
      color: '#374151',
      lineHeight: 1.4,
    },
    
    // Schedule timeline
    scheduleTimeline: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    
    scheduleItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    
    timeMarker: {
      width: 60,
      alignItems: 'center',
      marginRight: 16,
    },
    
    timeCircle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: customization.colors.accent,
      marginBottom: 4,
    },
    
    timeText: {
      fontSize: 10,
      color: '#6b7280',
      textAlign: 'center',
    },
    
    scheduleContent: {
      flex: 1,
    },
    
    sceneInfo: {
      fontSize: 14,
      fontWeight: getFontWeight('medium'),
      color: '#1f2937',
      marginBottom: 4,
    },
    
    sceneDetails: {
      fontSize: 12,
      color: '#6b7280',
      lineHeight: 1.4,
    },
  });
};

export const ExperimentalCallsheetPDFDocument: React.FC<ExperimentalCallsheetPDFDocumentProps> = ({
  callsheet,
  customization,
}) => {
  const styles = createExperimentalStyles(customization);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Timeline-inspired header */}
        <View style={styles.timelineHeader}>
          <Text style={styles.mainTitle}>{callsheet.projectTitle}</Text>
          <Text style={styles.subtitle}>Production Timeline</Text>
        </View>

        {/* Timeline navigation bar */}
        <View style={styles.timelineNav}>
          <Text style={[styles.timelineDate, styles.activeDate]}>
            {formatDate(callsheet.shootDate)}
          </Text>
          <Text style={styles.timelineDate}>Call: {callsheet.generalCallTime}</Text>
        </View>

        {/* Production Details as Event Cards */}
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>Production Details</Text>
          <Text style={styles.eventMeta}>Shoot Day Information</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{callsheet.location}</Text>
              {callsheet.locationAddress && (
                <Text style={[styles.eventContent, { marginTop: 4 }]}>
                  {callsheet.locationAddress}
                </Text>
              )}
            </View>
            
            {callsheet.weather && (
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Weather</Text>
                <Text style={styles.detailValue}>{callsheet.weather}</Text>
              </View>
            )}
            
            {callsheet.parkingInstructions && (
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Parking</Text>
                <Text style={styles.detailValue}>{callsheet.parkingInstructions}</Text>
              </View>
            )}
            
            {callsheet.basecampLocation && (
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Basecamp</Text>
                <Text style={styles.detailValue}>{callsheet.basecampLocation}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Schedule as Timeline */}
        {callsheet.schedule.length > 0 && (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Schedule Timeline</Text>
            <Text style={styles.eventMeta}>Scene by Scene Breakdown</Text>
            
            <View style={styles.scheduleTimeline}>
              {callsheet.schedule.map((item, index) => (
                <View key={item.id} style={styles.scheduleItem}>
                  <View style={styles.timeMarker}>
                    <View style={styles.timeCircle} />
                    <Text style={styles.timeText}>{item.estimatedTime}</Text>
                  </View>
                  <View style={styles.scheduleContent}>
                    <Text style={styles.sceneInfo}>
                      Scene {item.sceneNumber} - {item.intExt}
                    </Text>
                    <Text style={styles.sceneDetails}>
                      {item.description} • {item.location}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Cast & Crew as Contact Cards */}
        {(callsheet.cast.length > 0 || callsheet.crew.length > 0) && (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Team Directory</Text>
            <Text style={styles.eventMeta}>Cast & Crew Contact Information</Text>
            
            {callsheet.cast.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.detailLabel, { marginBottom: 12 }]}>Cast</Text>
                <View style={styles.contactGrid}>
                  {callsheet.cast.map((member) => (
                    <View key={member.id} style={styles.contactCard}>
                      <Text style={styles.contactName}>{member.name}</Text>
                      {member.character && (
                        <Text style={styles.contactRole}>as {member.character}</Text>
                      )}
                      <Text style={styles.contactInfo}>
                        {member.phone} • {member.email}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {callsheet.crew.length > 0 && (
              <View>
                <Text style={[styles.detailLabel, { marginBottom: 12 }]}>Crew</Text>
                <View style={styles.contactGrid}>
                  {callsheet.crew.map((member) => (
                    <View key={member.id} style={styles.contactCard}>
                      <Text style={styles.contactName}>{member.name}</Text>
                      <Text style={styles.contactRole}>{member.role}</Text>
                      <Text style={styles.contactInfo}>
                        {member.phone} • {member.email}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Special Notes */}
        {callsheet.specialNotes && (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Important Notes</Text>
            <Text style={styles.eventMeta}>Special Instructions & Information</Text>
            <Text style={styles.eventContent}>{callsheet.specialNotes}</Text>
          </View>
        )}

        {/* Emergency Contacts */}
        {callsheet.emergencyContacts.length > 0 && (
          <View style={[styles.eventCard, { 
            borderLeftColor: '#dc2626',
            backgroundColor: '#fef2f2'
          }]}>
            <Text style={[styles.eventTitle, { color: '#dc2626' }]}>Emergency Contacts</Text>
            <Text style={styles.eventMeta}>Important Contact Information</Text>
            
            <View style={styles.contactGrid}>
              {callsheet.emergencyContacts.map((contact) => (
                <View key={contact.id} style={[styles.contactCard, {
                  borderColor: '#fca5a5',
                  backgroundColor: '#ffffff'
                }]}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRole}>{contact.role}</Text>
                  <Text style={[styles.contactInfo, { fontWeight: getFontWeight('medium') }]}>
                    {contact.phone}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
