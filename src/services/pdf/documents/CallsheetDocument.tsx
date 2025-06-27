
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { HeaderSection } from '../sections/HeaderSection';
import { ContactsSection } from '../sections/ContactsSection';
import { ScheduleSection } from '../sections/ScheduleSection';
import { EmergencySection } from '../sections/EmergencySection';
import { NotesSection } from '../sections/NotesSection';
import { StyleUtils } from '../utils/StyleUtils';

interface CallsheetDocumentProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const CallsheetDocument: React.FC<CallsheetDocumentProps> = ({
  callsheet,
  customization
}) => {
  const styles = StyleUtils.createStyles(customization);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <HeaderSection callsheet={callsheet} customization={customization} />
        
        <View style={styles.content}>
          <ContactsSection callsheet={callsheet} customization={customization} />
          
          {customization.sections.visibility.schedule && (
            <ScheduleSection callsheet={callsheet} customization={customization} />
          )}
          
          {customization.sections.visibility.emergencyContacts && (
            <EmergencySection callsheet={callsheet} customization={customization} />
          )}
          
          {customization.sections.visibility.notes && callsheet.specialNotes && (
            <NotesSection callsheet={callsheet} customization={customization} />
          )}
        </View>
      </Page>
    </Document>
  );
};
