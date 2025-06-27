
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View>
      {/* Company Logo and Name */}
      <View style={styles.logoSection}>
        {customization.branding.logo && (
          <Image
            src={customization.branding.logo.url}
            style={styles.logo}
          />
        )}
        {customization.branding.companyName && (
          <Text style={styles.companyName}>{customization.branding.companyName}</Text>
        )}
      </View>
      
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.projectTitle}>{callsheet.projectTitle}</Text>
        <Text style={styles.callSheetSubtitle}>CALL SHEET</Text>
      </View>

      {/* Basic Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoColumn}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Shoot Date</Text>
            <Text style={styles.infoValue}>{formatDate(callsheet.shootDate)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Weather</Text>
            <Text style={styles.infoValue}>{callsheet.weather || 'Not specified'}</Text>
          </View>
        </View>

        <View style={styles.infoColumn}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Call Time</Text>
            <Text style={styles.infoValue}>{callsheet.generalCallTime}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Parking Instructions</Text>
            <Text style={styles.infoValue}>{callsheet.parkingInstructions || 'See location details'}</Text>
          </View>
        </View>

        <View style={styles.infoColumn}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{callsheet.location}</Text>
            {callsheet.locationAddress && (
              <Text style={styles.infoSubValue}>{callsheet.locationAddress}</Text>
            )}
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Basecamp Location</Text>
            <Text style={styles.infoValue}>{callsheet.basecampLocation || 'Main lobby area'}</Text>
          </View>
        </View>
      </View>

      {/* Special Notes */}
      {callsheet.specialNotes && (
        <View style={styles.specialNotesSection}>
          <Text style={styles.specialNotesTitle}>Special Notes</Text>
          <Text style={styles.specialNotesText}>{callsheet.specialNotes}</Text>
        </View>
      )}
    </View>
  );
};
