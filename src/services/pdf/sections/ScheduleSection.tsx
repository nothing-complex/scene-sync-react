
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

interface ScheduleSectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  styles: any;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  callsheet,
  customization,
  styles,
}) => {
  if (!callsheet.schedule || callsheet.schedule.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Schedule</Text>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.scheduleTable}>
          <View style={styles.scheduleTableHeader}>
            <Text style={[styles.scheduleHeaderCell, { width: '25%' }]}>Time</Text>
            <Text style={[styles.scheduleHeaderCell, { width: '50%' }]}>Scene/Activity</Text>
            <Text style={[styles.scheduleHeaderCell, { width: '25%' }]}>Location</Text>
          </View>
          {callsheet.schedule.map((item, index) => (
            <View key={index} style={styles.scheduleTableRow}>
              <Text style={[styles.scheduleCell, { width: '25%' }]}>{item.estimatedTime}</Text>
              <Text style={[styles.scheduleCell, { width: '50%' }]}>{item.description}</Text>
              <Text style={[styles.scheduleCell, { width: '25%' }]}>{item.location}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
