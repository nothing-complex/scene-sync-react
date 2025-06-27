
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
      <Text style={styles.emergencySectionTitle}>EMERGENCY CONTACTS</Text>
      
      <View style={styles.emergencyContactsContainer}>
        {callsheet.emergencyContacts.map((contact, index) => (
          <View key={contact.id || index} style={styles.emergencyContactCard}>
            <Text style={styles.emergencyContactName}>{contact.name}</Text>
            {contact.role && (
              <Text style={styles.emergencyContactRole}>{contact.role}</Text>
            )}
            {contact.phone && contact.phone !== 'Phone not available' && (
              <Text style={styles.emergencyContactPhone}>Phone: {contact.phone}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
