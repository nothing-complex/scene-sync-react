
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
            <Text style={styles.contactRole}>{contact.role}</Text>
            {contact.phone && <Text style={styles.contactInfo}>Phone: {contact.phone}</Text>}
            {contact.email && <Text style={styles.contactInfo}>Email: {contact.email}</Text>}
            {contact.character && <Text style={styles.contactInfo}>Character: {contact.character}</Text>}
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
