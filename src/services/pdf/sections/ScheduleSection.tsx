
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
      <Text style={styles.sectionTitle}>Schedule</Text>
      {callsheet.schedule.map((item, index) => (
        <View key={item.id || index} style={styles.scheduleItem}>
          <Text style={styles.scheduleTime}>{item.estimatedTime}</Text>
          <View style={styles.scheduleDetails}>
            <Text style={styles.scheduleScene}>
              Scene {item.sceneNumber} - {item.intExt}. {item.location || item.description}
            </Text>
            <Text style={styles.scheduleDescription}>{item.description}</Text>
            {item.pageCount && (
              <Text style={styles.schedulePages}>Pages: {item.pageCount}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};
