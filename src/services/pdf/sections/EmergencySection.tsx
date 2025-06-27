
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { StyleUtils } from '../utils/StyleUtils';

interface EmergencySectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  callsheet,
  customization
}) => {
  const styles = StyleUtils.createStyles(customization);

  if (!callsheet.emergencyContacts || callsheet.emergencyContacts.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      {callsheet.emergencyContacts.map((contact, index) => (
        <View key={contact.id || index} style={styles.emergencyItem}>
          <Text style={styles.emergencyName}>{contact.name}</Text>
          {contact.role && (
            <Text style={styles.emergencyRole}>{contact.role}</Text>
          )}
          {contact.phone && contact.phone !== 'Phone not available' && (
            <Text style={styles.emergencyPhone}>Phone: {contact.phone}</Text>
          )}
          {contact.company && contact.company !== 'Address not available' && (
            <Text style={styles.emergencyInfo}>{contact.company}</Text>
          )}
        </View>
      ))}
    </View>
  );
};
