
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { StyleUtils } from '../utils/StyleUtils';

interface HeaderSectionProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  callsheet,
  customization
}) => {
  const styles = StyleUtils.createStyles(customization);

  return (
    <View style={styles.header}>
      {customization.branding.logo && (
        <View style={styles.logoContainer}>
          <Image
            src={customization.branding.logo.url}
            style={styles.logo}
          />
        </View>
      )}
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{callsheet.projectTitle}</Text>
        <Text style={styles.subtitle}>Call Sheet - {callsheet.shootDate}</Text>
      </View>
      
      <View style={styles.basicInfo}>
        <Text style={styles.infoText}>Call Time: {callsheet.generalCallTime}</Text>
        <Text style={styles.infoText}>Location: {callsheet.location}</Text>
        {callsheet.weather && (
          <Text style={styles.infoText}>Weather: {callsheet.weather}</Text>
        )}
      </View>
    </View>
  );
};
