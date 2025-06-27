
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
        <View style={styles.contactsGrid}>
          {contacts.map((contact, index) => (
            <View key={contact.id || index} style={styles.contactCard}>
              <Text style={styles.contactName}>{contact.name}</Text>
              {(contact.character || contact.role) && (
                <Text style={styles.contactRole}>
                  {contact.character ? `as ${contact.character}` : contact.role}
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
      </View>
    );
  };

  return (
    <View>
      {renderContacts(callsheet.cast, 'CAST')}
      {renderContacts(callsheet.crew, 'CREW')}
    </View>
  );
};
