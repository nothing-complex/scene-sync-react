import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { createStyles } from './styleUtils_backup';
import { SafeText, SectionIcon } from './components_backup';

interface CallsheetPDFDocumentProps {
  callsheet: CallsheetData;
  customization?: Partial<PDFCustomization>;
}

// Helper function for deep merging objects
const deepMerge = (target: any, source: any): any => {
  if (!source) return target;
  if (!target) return source;
  
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  
  return result;
};

export const CallsheetPDFDocument: React.FC<CallsheetPDFDocumentProps> = ({ callsheet, customization = {} }) => {
  console.log('CallsheetPDFDocument rendering with callsheet:', callsheet.projectTitle);
  
  // FIXED: Use deep merge to ensure all nested properties are properly handled
  const config: PDFCustomization = deepMerge(DEFAULT_PDF_CUSTOMIZATION, customization);
  
  // CRITICAL: Ensure cornerRadius is always a valid number
  if (typeof config.visual.cornerRadius !== 'number' || isNaN(config.visual.cornerRadius)) {
    console.warn('Invalid cornerRadius detected, setting to default:', config.visual.cornerRadius);
    config.visual.cornerRadius = 8;
  }
  
  // DEBUGGING: Log the final config to verify all properties are set
  console.log('Final PDF config cornerRadius:', config.visual.cornerRadius);
  console.log('Full visual config:', config.visual);
  console.log('Full config structure:', JSON.stringify(config, null, 2));
  
  const styles = createStyles(config);

  const getLogoSize = () => {
    if (!config.branding.logo) return 64;
    const size = config.branding.logo.size;
    return size === 'small' ? 48 : size === 'large' ? 80 : 64;
  };

  const LogoComponent = ({ position }: { position: string }) => {
    if (!config.branding.logo || config.branding.logo.position !== position) return null;
    
    const logoSize = getLogoSize();
    const commonStyles = {
      width: logoSize,
      height: logoSize,
      objectFit: 'contain' as const
    };

    switch (position) {
      case 'top-left':
        return (
          <View style={{ position: 'absolute', top: 10, left: 10 }}>
            <Image src={config.branding.logo.url} style={commonStyles} />
          </View>
        );
      case 'top-right':
        return (
          <View style={{ position: 'absolute', top: 10, right: 10 }}>
            <Image src={config.branding.logo.url} style={commonStyles} />
          </View>
        );
      case 'top-center':
        return (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image src={config.branding.logo.url} style={commonStyles} />
          </View>
        );
      case 'header-left':
        return (
          <View style={{ position: 'absolute', left: 0, top: 0 }}>
            <Image src={config.branding.logo.url} style={commonStyles} />
          </View>
        );
      case 'header-right':
        return (
          <View style={{ position: 'absolute', right: 0, top: 0 }}>
            <Image src={config.branding.logo.url} style={commonStyles} />
          </View>
        );
      case 'header-center':
        return (
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <Image src={config.branding.logo.url} style={commonStyles} />
          </View>
        );
      default:
        return null;
    }
  };

  const Header = () => (
    <View style={styles.headerContainer}>
      {/* Top positioned logos */}
      <LogoComponent position="top-left" />
      <LogoComponent position="top-right" />
      
      {/* Company Name Header - FIXED: Use SafeText and check for content */}
      {config.branding.companyName && config.branding.companyName.trim() && (
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <SafeText style={{
            fontSize: config.typography.fontSize.header + 2,
            fontWeight: 600,
            color: config.colors.text,
            textAlign: 'center'
          }}>
            {config.branding.companyName.trim()}
          </SafeText>
        </View>
      )}

      {/* Top center logo */}
      <LogoComponent position="top-center" />
      
      <View style={[
        styles.titleSection,
        config.branding.logo && ['header-left', 'header-right'].includes(config.branding.logo.position) && { position: 'relative' }
      ]}>
        {/* Header positioned logos */}
        <LogoComponent position="header-left" />
        <LogoComponent position="header-right" />
        <LogoComponent position="header-center" />
        
        {/* FIXED: Use SafeText for all text content */}
        <SafeText style={[
          styles.projectTitle,
          config.branding.logo && ['header-left', 'header-right'].includes(config.branding.logo.position) && { 
            marginLeft: config.branding.logo.position === 'header-left' ? getLogoSize() + 16 : 0,
            marginRight: config.branding.logo.position === 'header-right' ? getLogoSize() + 16 : 0
          }
        ]}>
          {callsheet.projectTitle}
        </SafeText>
        
        <Text style={[
          styles.title,
          config.branding.logo && ['header-left', 'header-right'].includes(config.branding.logo.position) && { 
            marginLeft: config.branding.logo.position === 'header-left' ? getLogoSize() + 16 : 0,
            marginRight: config.branding.logo.position === 'header-right' ? getLogoSize() + 16 : 0
          }
        ]}>
          CALL SHEET
        </Text>
        
        {/* Date in header - FIXED: Use SafeText */}
        <SafeText style={styles.companyName}>
          {new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </SafeText>
      </View>
    </View>
  );

  const ProductionDetailsGrid = () => (
    <View style={[styles.sectionCard, { marginBottom: 16 }]} break={false}>
      <View style={styles.productionGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Shoot Date</Text>
          <SafeText style={styles.value}>
            {new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </SafeText>
        </View>
        
        <View style={styles.gridItem}>
          <Text style={styles.label}>Call Time</Text>
          <SafeText style={styles.value}>{callsheet.generalCallTime}</SafeText>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.label}>Location</Text>
          <SafeText style={styles.value}>{callsheet.location}</SafeText>
          {callsheet.locationAddress && callsheet.locationAddress.trim() && (
            <SafeText style={styles.locationAddress}>{callsheet.locationAddress.trim()}</SafeText>
          )}
        </View>

        {callsheet.weather && callsheet.weather.trim() && config.sections.visibility.weather && (
          <View style={styles.gridItem}>
            <Text style={styles.label}>Weather</Text>
            <SafeText style={styles.value}>{callsheet.weather.trim()}</SafeText>
          </View>
        )}

        {callsheet.parkingInstructions && callsheet.parkingInstructions.trim() && (
          <View style={styles.gridItem}>
            <Text style={styles.label}>Parking Instructions</Text>
            <SafeText style={styles.value}>{callsheet.parkingInstructions.trim()}</SafeText>
          </View>
        )}

        {callsheet.basecampLocation && callsheet.basecampLocation.trim() && (
          <View style={styles.gridItem}>
            <Text style={styles.label}>Basecamp Location</Text>
            <SafeText style={styles.value}>{callsheet.basecampLocation.trim()}</SafeText>
          </View>
        )}
      </View>
    </View>
  );

  const Notes = () => (
    config.sections.visibility.notes && callsheet.specialNotes && callsheet.specialNotes.trim() && (
      <View style={[styles.sectionCard, { marginBottom: 16 }]} break={false}>
        <View style={styles.sectionHeader}>
          {config.sections.formatting.showSectionIcons && (
            <SectionIcon type="notes" color={config.colors.accent} />
          )}
          <Text style={styles.sectionTitle}>SPECIAL NOTES</Text>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.notesContainer}>
            <SafeText style={styles.value}>{callsheet.specialNotes.trim()}</SafeText>
          </View>
        </View>
      </View>
    )
  );

  const Schedule = () => (
    config.sections.visibility.schedule && callsheet.schedule && callsheet.schedule.length > 0 && (
      <View style={[styles.sectionCard, { marginBottom: 16 }]} break={false}>
        <View style={styles.sectionHeader}>
          {config.sections.formatting.showSectionIcons && (
            <SectionIcon type="clock" color={config.colors.accent} />
          )}
          <Text style={styles.sectionTitle}>SCHEDULE</Text>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.scheduleTable}>
            <View style={styles.scheduleTableHeader}>
              <Text style={[styles.scheduleHeaderCell, { flex: 1 }]}>Scene</Text>
              <Text style={[styles.scheduleHeaderCell, { flex: 1 }]}>Int/Ext</Text>
              <Text style={[styles.scheduleHeaderCell, { flex: 2 }]}>Description</Text>
              <Text style={[styles.scheduleHeaderCell, { flex: 2 }]}>Location</Text>
              <Text style={[styles.scheduleHeaderCell, { flex: 1 }]}>Time</Text>
            </View>
            {callsheet.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleTableRow}>
                <SafeText style={[styles.scheduleCell, { flex: 1 }]}>{item.sceneNumber || 'N/A'}</SafeText>
                <SafeText style={[styles.scheduleCell, { flex: 1 }]}>{item.intExt || 'N/A'}</SafeText>
                <SafeText style={[styles.scheduleCell, { flex: 2 }]}>{item.description || 'N/A'}</SafeText>
                <SafeText style={[styles.scheduleCell, { flex: 2 }]}>{item.location || 'N/A'}</SafeText>
                <SafeText style={[styles.scheduleCell, { flex: 1 }]}>{item.estimatedTime || 'N/A'}</SafeText>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  );

  const ContactSection = ({ title, contacts, iconType }: { 
    title: string; 
    contacts: any[]; 
    iconType: string;
  }) => (
    <View style={[styles.sectionCard, { marginBottom: 16 }]} break={false}>
      <View style={styles.sectionHeader}>
        {config.sections.formatting.showSectionIcons && (
          <SectionIcon type={iconType} color={config.colors.accent} />
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {(!contacts || contacts.length === 0) ? (
          <Text style={[styles.value, { color: config.colors.textLight }]}>
            No contacts added
          </Text>
        ) : (
          <View style={styles.contactTightGrid}>
            {contacts.map((contact, index) => (
              <View key={contact.id || index} style={styles.contactTightGridItem}>
                <SafeText style={styles.contactName}>{contact.name || 'Unknown'}</SafeText>
                {/* FIXED: Completely removed fontStyle to prevent font resolution errors */}
                {((contact.role && contact.role.trim()) || (contact.character && contact.character.trim())) && (
                  <SafeText style={styles.contactRole}>
                    {[
                      contact.role && contact.role.trim() ? contact.role.trim() : '',
                      contact.character && contact.character.trim() ? contact.character.trim() : ''
                    ].filter(Boolean).join(' • ')}
                  </SafeText>
                )}
                <SafeText style={styles.contactDetails}>{contact.phone || 'No phone'}</SafeText>
                {contact.email && contact.email.trim() && (
                  <SafeText style={styles.contactDetails}>{contact.email.trim()}</SafeText>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const Footer = () => (
    config.branding.footer?.text && config.branding.footer.text.trim() && (
      <View style={styles.footer} fixed>
        <SafeText style={styles.footerText}>{config.branding.footer.text.trim()}</SafeText>
      </View>
    )
  );

  console.log('CallsheetPDFDocument: Rendering complete PDF structure');
  
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation={config.layout.pageOrientation}>
        <Header />
        <ProductionDetailsGrid />
        <Notes />
        <Schedule />
        <ContactSection title="CAST" contacts={callsheet.cast || []} iconType="users" />
        <ContactSection title="CREW" contacts={callsheet.crew || []} iconType="users" />
        {config.sections.visibility.emergencyContacts && (
          <ContactSection 
            title="EMERGENCY CONTACTS" 
            contacts={callsheet.emergencyContacts || []} 
            iconType="emergency"
          />
        )}
        <Footer />
      </Page>
    </Document>
  );
};
