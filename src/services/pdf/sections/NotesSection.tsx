
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

  // Notes are now handled in the HeaderSection, so this component is empty
  // but kept for compatibility
  return null;
};
