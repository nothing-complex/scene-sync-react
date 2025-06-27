
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

interface EmergencySectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  styles: any;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  callsheet,
  customization,
  styles,
}) => {
  if (!callsheet.emergencyContacts || callsheet.emergencyContacts.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.contactTightGrid}>
          {callsheet.emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.contactTightGridItem}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRole}>{contact.role}</Text>
              <View style={styles.contactDetails}>
                {contact.phone && <Text>🚨 {contact.phone}</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
