
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { StyleUtils } from '../utils/StyleUtils';

interface ScheduleSectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  callsheet,
  customization
}) => {
  const styles = StyleUtils.createStyles(customization);

  if (!callsheet.schedule || callsheet.schedule.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SCHEDULE</Text>
      
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, styles.sceneColumn]}>Scene</Text>
        <Text style={[styles.tableHeaderCell, styles.intExtColumn]}>Int/Ext</Text>
        <Text style={[styles.tableHeaderCell, styles.descriptionColumn]}>Description</Text>
        <Text style={[styles.tableHeaderCell, styles.timeColumn]}>Time</Text>
        <Text style={[styles.tableHeaderCell, styles.pagesColumn]}>Pages</Text>
      </View>

      {/* Table Rows */}
      {callsheet.schedule.map((item, index) => (
        <View key={item.id || index} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlternate]}>
          <Text style={[styles.tableCell, styles.sceneColumn]}>{item.sceneNumber}</Text>
          <Text style={[styles.tableCell, styles.intExtColumn]}>{item.intExt}</Text>
          <View style={[styles.tableCell, styles.descriptionColumn]}>
            <Text style={styles.tableCellText}>{item.description}</Text>
            {item.location && item.location !== item.description && (
              <Text style={styles.tableCellSubText}>{item.location}</Text>
            )}
          </View>
          <Text style={[styles.tableCell, styles.timeColumn]}>{item.estimatedTime}</Text>
          <Text style={[styles.tableCell, styles.pagesColumn]}>{item.pageCount || '-'}</Text>
        </View>
      ))}
    </View>
  );
};
