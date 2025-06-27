
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

interface HeaderSectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  styles: any;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  callsheet,
  customization,
  styles,
}) => {
  return (
    <View style={styles.headerContainer}>
      {customization.branding.companyName && (
        <View style={styles.brandingRow}>
          <Text style={styles.companyName}>{customization.branding.companyName}</Text>
        </View>
      )}
      
      <View style={styles.titleSection}>
        <Text style={styles.title}>CALL SHEET</Text>
        <Text style={styles.projectTitle}>{callsheet.projectTitle}</Text>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionContent}>
          <View style={styles.productionGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Shoot Date</Text>
              <Text style={styles.value}>{callsheet.shootDate}</Text>
            </View>
            
            {callsheet.callTime && (
              <View style={styles.gridItem}>
                <Text style={styles.label}>Call Time</Text>
                <Text style={styles.value}>{callsheet.callTime}</Text>
              </View>
            )}
            
            {callsheet.wrapTime && (
              <View style={styles.gridItem}>
                <Text style={styles.label}>Wrap Time</Text>
                <Text style={styles.value}>{callsheet.wrapTime}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {callsheet.location && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.value}>{callsheet.location}</Text>
          </View>
        </View>
      )}
    </View>
  );
};
