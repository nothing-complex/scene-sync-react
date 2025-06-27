
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

interface ContactsSectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  styles: any;
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({
  callsheet,
  customization,
  styles,
}) => {
  const renderContacts = (contacts: any[], title: string) => {
    if (!contacts || contacts.length === 0) return null;

    return (
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.contactTightGrid}>
            {contacts.map((contact, index) => (
              <View key={index} style={styles.contactTightGridItem}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRole}>{contact.role}</Text>
                <View style={styles.contactDetails}>
                  {contact.phone && <Text>📞 {contact.phone}</Text>}
                  {contact.email && <Text>✉️ {contact.email}</Text>}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {renderContacts(callsheet.cast || [], 'Cast')}
      {renderContacts(callsheet.crew || [], 'Crew')}
    </View>
  );
};
