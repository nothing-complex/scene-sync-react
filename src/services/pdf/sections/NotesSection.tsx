
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { StyleUtils } from '../utils/StyleUtils';

interface NotesSectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  callsheet,
  customization
}) => {
  const styles = StyleUtils.createStyles(customization);

  if (!callsheet.specialNotes || callsheet.specialNotes.trim() === '') {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Special Notes</Text>
      <Text style={styles.notesText}>{callsheet.specialNotes}</Text>
    </View>
  );
};
