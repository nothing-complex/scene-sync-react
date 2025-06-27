
import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { createStyles } from '../styleUtils_backup';
import { HeaderSection } from './HeaderSection';
import { ContactsSection } from './ContactsSection';
import { ScheduleSection } from './ScheduleSection';
import { EmergencySection } from './EmergencySection';
import { NotesSection } from './NotesSection';

interface CallsheetPDFDocumentProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const CallsheetPDFDocument: React.FC<CallsheetPDFDocumentProps> = ({
  callsheet,
  customization,
}) => {
  console.log('CallsheetPDFDocument: Rendering document with customization:', customization);
  
  const styles = createStyles(customization);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <HeaderSection callsheet={callsheet} customization={customization} styles={styles} />
        <ContactsSection callsheet={callsheet} customization={customization} styles={styles} />
        <ScheduleSection callsheet={callsheet} customization={customization} styles={styles} />
        <EmergencySection callsheet={callsheet} customization={customization} styles={styles} />
        <NotesSection callsheet={callsheet} customization={customization} styles={styles} />
      </Page>
    </Document>
  );
};
