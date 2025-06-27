
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { StyleUtils } from '../utils/StyleUtils';

interface ContactsSectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({
  callsheet,
  customization
}) => {
  const styles = StyleUtils.createStyles(customization);

  const renderContacts = (contacts: any[], title: string) => {
    if (!contacts || contacts.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {contacts.map((contact, index) => (
          <View key={contact.id || index} style={styles.contactItem}>
            <Text style={styles.contactName}>{contact.name}</Text>
            {(contact.role || contact.character) && (
              <Text style={styles.contactRole}>
                {contact.character ? contact.character : contact.role}
              </Text>
            )}
            {contact.phone && contact.phone !== 'Phone not available' && (
              <Text style={styles.contactInfo}>Phone: {contact.phone}</Text>
            )}
            {contact.email && contact.email !== 'Email not available' && (
              <Text style={styles.contactInfo}>Email: {contact.email}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View>
      {renderContacts(callsheet.cast, 'Cast')}
      {renderContacts(callsheet.crew, 'Crew')}
    </View>
  );
};
