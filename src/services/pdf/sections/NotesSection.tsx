
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

interface NotesSectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  styles: any;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  callsheet,
  customization,
  styles,
}) => {
  if (!callsheet.specialNotes || callsheet.specialNotes.trim() === '') {
    return null;
  }

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Special Notes</Text>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.notesContainer}>
          <Text style={styles.value}>{callsheet.specialNotes}</Text>
        </View>
      </View>
    </View>
  );
};
