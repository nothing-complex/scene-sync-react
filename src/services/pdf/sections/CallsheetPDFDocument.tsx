
import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { createStyles } from '../styleUtils_backup';

interface CallsheetPDFDocumentProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const CallsheetPDFDocument: React.FC<CallsheetPDFDocumentProps> = ({
  callsheet,
  customization,
}) => {
  console.log('CallsheetPDFDocument rendering with callsheet:', callsheet.projectTitle);
  
  const styles = createStyles(customization);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLogoSize = () => {
    if (!customization.branding.logo) return 64;
    const size = customization.branding.logo.size;
    return size === 'small' ? 48 : size === 'large' ? 80 : 64;
  };

  const getTitleColor = () => {
    const isHeaderWithBackground = customization.visual.headerBackground !== 'none';
    
    if (customization.layout.headerStyle === 'professional' && isHeaderWithBackground) {
      return customization.colors.background;
    }
    
    return isHeaderWithBackground ? customization.colors.background : customization.colors.text;
  };

  const getSubtitleColor = () => {
    const isHeaderWithBackground = customization.visual.headerBackground !== 'none';
    
    if (customization.layout.headerStyle === 'professional' && isHeaderWithBackground) {
      return customization.colors.background;
    }
    
    return isHeaderWithBackground ? customization.colors.background : customization.colors.textLight;
  };

  const getHeaderBackgroundStyle = () => {
    const { headerBackground } = customization.visual;
    const baseStyle = {
      borderRadius: customization.visual.cornerRadius,
      padding: 24,
      marginBottom: 32
    };

    switch (headerBackground) {
      case 'subtle':
        return { ...baseStyle, backgroundColor: customization.colors.surface };
      case 'solid':
        return { 
          ...baseStyle, 
          backgroundColor: customization.colors.primary,
          color: customization.colors.background
        };
      case 'gradient':
        if (customization.colors.gradient) {
          return {
            ...baseStyle,
            backgroundColor: customization.colors.primary,
            color: customization.colors.background
          };
        }
        return baseStyle;
      default:
        return { marginBottom: 24 };
    }
  };

  const isHeaderCentered = customization.layout.headerStyle === 'minimal' || 
                          customization.layout.headerStyle === 'creative';

  const showSectionIcons = customization.sections.formatting.showSectionIcons;

  const Header = () => (
    <View style={getHeaderBackgroundStyle()}>
      {/* Logo positioning for top positions */}
      {customization.branding.logo && ['top-left', 'top-right'].includes(customization.branding.logo.position) && (
        <View style={{
          position: 'absolute',
          top: customization.branding.logo.position === 'top-left' ? 16 : 16,
          left: customization.branding.logo.position === 'top-left' ? 32 : undefined,
          right: customization.branding.logo.position === 'top-right' ? 32 : undefined,
        }}>
          <Image 
            src={customization.branding.logo.url} 
            style={{
              width: getLogoSize(),
              height: getLogoSize(),
              objectFit: 'contain'
            }}
          />
        </View>
      )}

      {/* Company Name Header */}
      {customization.branding.companyName && customization.branding.companyName.trim() && (
        <View style={{ 
          textAlign: 'center',
          marginBottom: 16,
          fontSize: customization.typography.fontSize.header + 2,
          fontWeight: 600,
          color: getTitleColor()
        }}>
          <Text>{customization.branding.companyName}</Text>
        </View>
      )}

      {/* Logo for center positions */}
      {customization.branding.logo && ['top-center', 'header-center'].includes(customization.branding.logo.position || 'top-center') && (
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Image 
            src={customization.branding.logo.url} 
            style={{
              width: getLogoSize(),
              height: getLogoSize(),
              objectFit: 'contain'
            }}
          />
        </View>
      )}

      {/* Header Left/Right Logo */}
      {customization.branding.logo && ['header-left', 'header-right'].includes(customization.branding.logo.position) && (
        <View style={{
          position: 'absolute',
          [customization.branding.logo.position === 'header-left' ? 'left' : 'right']: 0,
          top: 0,
        }}>
          <Image 
            src={customization.branding.logo.url} 
            style={{
              width: getLogoSize(),
              height: getLogoSize(),
              objectFit: 'contain'
            }}
          />
        </View>
      )}
      
      <View style={{ textAlign: isHeaderCentered ? 'center' : 'left' }}>
        <Text style={{
          fontSize: customization.typography.fontSize.title,
          fontWeight: 700,
          color: getTitleColor(),
          marginBottom: 12,
          lineHeight: customization.typography.lineHeight.title
        }}>
          {callsheet.projectTitle}
        </Text>
        <Text style={{
          fontSize: customization.typography.fontSize.header,
          fontWeight: 600,
          color: getSubtitleColor(),
          lineHeight: customization.typography.lineHeight.header
        }}>
          CALL SHEET
        </Text>
      </View>
    </View>
  );

  const ProductionDetailsGrid = () => (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 32
    }}>
      {/* Shoot Date */}
      <View style={{
        flex: '1 1 30%',
        backgroundColor: customization.colors.surface,
        borderRadius: customization.visual.cornerRadius,
        borderWidth: 1,
        borderColor: customization.colors.border,
        padding: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          {showSectionIcons && <Text style={{ fontSize: 18 }}>📅</Text>}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontWeight: 500,
              marginBottom: 4,
              color: customization.colors.text,
              fontSize: customization.typography.fontSize.header
            }}>
              Shoot Date
            </Text>
            <Text style={{
              fontSize: customization.typography.fontSize.body,
              color: customization.colors.text
            }}>
              {formatDate(callsheet.shootDate)}
            </Text>
          </View>
        </View>
      </View>

      {/* Call Time */}
      <View style={{
        flex: '1 1 30%',
        backgroundColor: customization.colors.surface,
        borderRadius: customization.visual.cornerRadius,
        borderWidth: 1,
        borderColor: customization.colors.border,
        padding: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          {showSectionIcons && <Text style={{ fontSize: 18 }}>🕐</Text>}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontWeight: 500,
              marginBottom: 4,
              color: customization.colors.text,
              fontSize: customization.typography.fontSize.header
            }}>
              Call Time
            </Text>
            <Text style={{
              fontSize: customization.typography.fontSize.body,
              color: customization.colors.text
            }}>
              {callsheet.generalCallTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Location */}
      <View style={{
        flex: '1 1 30%',
        backgroundColor: customization.colors.surface,
        borderRadius: customization.visual.cornerRadius,
        borderWidth: 1,
        borderColor: customization.colors.border,
        padding: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          {showSectionIcons && <Text style={{ fontSize: 18 }}>📍</Text>}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontWeight: 500,
              marginBottom: 4,
              color: customization.colors.text,
              fontSize: customization.typography.fontSize.header
            }}>
              Location
            </Text>
            <Text style={{
              fontSize: customization.typography.fontSize.body,
              color: customization.colors.text
            }}>
              {callsheet.location}
            </Text>
            {callsheet.locationAddress && (
              <Text style={{
                fontSize: customization.typography.fontSize.small,
                color: customization.colors.textLight
              }}>
                {callsheet.locationAddress}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Weather */}
      {callsheet.weather && customization.sections.visibility.weather && (
        <View style={{
          flex: '1 1 30%',
          backgroundColor: customization.colors.surface,
          borderRadius: customization.visual.cornerRadius,
          borderWidth: 1,
          borderColor: customization.colors.border,
          padding: 16
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            {showSectionIcons && <Text style={{ fontSize: 18 }}>🌤️</Text>}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontWeight: 500,
                marginBottom: 4,
                color: customization.colors.text,
                fontSize: customization.typography.fontSize.header
              }}>
                Weather
              </Text>
              <Text style={{
                fontSize: customization.typography.fontSize.body,
                color: customization.colors.text
              }}>
                {callsheet.weather}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Parking Instructions */}
      {callsheet.parkingInstructions && (
        <View style={{
          flex: '1 1 30%',
          backgroundColor: customization.colors.surface,
          borderRadius: customization.visual.cornerRadius,
          borderWidth: 1,
          borderColor: customization.colors.border,
          padding: 16
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            {showSectionIcons && <Text style={{ fontSize: 18 }}>🅿️</Text>}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontWeight: 500,
                marginBottom: 4,
                color: customization.colors.text,
                fontSize: customization.typography.fontSize.header
              }}>
                Parking Instructions
              </Text>
              <Text style={{
                fontSize: customization.typography.fontSize.body,
                color: customization.colors.text
              }}>
                {callsheet.parkingInstructions}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Basecamp Location */}
      {callsheet.basecampLocation && (
        <View style={{
          flex: '1 1 30%',
          backgroundColor: customization.colors.surface,
          borderRadius: customization.visual.cornerRadius,
          borderWidth: 1,
          borderColor: customization.colors.border,
          padding: 16
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            {showSectionIcons && <Text style={{ fontSize: 18 }}>🏕️</Text>}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontWeight: 500,
                marginBottom: 4,
                color: customization.colors.text,
                fontSize: customization.typography.fontSize.header
              }}>
                Basecamp Location
              </Text>
              <Text style={{
                fontSize: customization.typography.fontSize.body,
                color: customization.colors.text
              }}>
                {callsheet.basecampLocation}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const SpecialNotes = () => {
    if (!callsheet.specialNotes?.trim() || !customization.sections.visibility.notes) return null;
    
    return (
      <View style={{
        marginBottom: 32,
        backgroundColor: customization.colors.surface,
        borderRadius: customization.visual.cornerRadius,
        borderWidth: 1,
        borderColor: customization.colors.border,
        borderLeftWidth: 4,
        borderLeftColor: customization.colors.accent,
        padding: 20
      }} wrap={false}>
        <Text style={{
          fontWeight: 500,
          marginBottom: 12,
          color: customization.colors.text,
          fontSize: customization.typography.fontSize.header,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8
        }}>
          {showSectionIcons && <Text style={{ fontSize: 18 }}>📝</Text>}
          Special Notes
        </Text>
        <Text style={{
          fontSize: customization.typography.fontSize.body,
          color: customization.colors.text,
          lineHeight: 1.5
        }}>
          {callsheet.specialNotes}
        </Text>
      </View>
    );
  };

  const Schedule = () => {
    if (!callsheet.schedule?.length || !customization.sections.visibility.schedule) return null;
    
    const alternateRows = customization.sections.formatting.alternateRowColors;
    
    return (
      <View style={{ marginBottom: 24 }} wrap={false}>
        <Text style={{
          fontSize: customization.typography.fontSize.header + 4,
          fontWeight: 600,
          color: customization.colors.text,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8
        }}>
          {showSectionIcons && <Text style={{ fontSize: 20 }}>📋</Text>}
          SCHEDULE
        </Text>
        
        <View style={{
          backgroundColor: customization.colors.surface,
          borderRadius: customization.visual.cornerRadius,
          borderWidth: 1,
          borderColor: customization.colors.border,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: customization.colors.surfaceHover,
            borderBottomWidth: 2,
            borderBottomColor: customization.colors.border,
            fontWeight: 500,
            fontSize: customization.typography.fontSize.header,
            color: customization.colors.text
          }}>
            <Text style={{ width: '20%', padding: 16, borderRightWidth: 1, borderRightColor: customization.colors.border }}>Scene</Text>
            <Text style={{ width: '20%', padding: 16, borderRightWidth: 1, borderRightColor: customization.colors.border }}>Int/Ext</Text>
            <Text style={{ width: '40%', padding: 16, borderRightWidth: 1, borderRightColor: customization.colors.border }}>Description</Text>
            <Text style={{ width: '20%', padding: 16 }}>Time</Text>
          </View>
          
          {/* Rows */}
          {callsheet.schedule.map((item, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              backgroundColor: alternateRows && index % 2 === 1 ? customization.colors.surface : customization.colors.background,
              borderBottomWidth: 1,
              borderBottomColor: customization.colors.borderLight,
              fontSize: customization.typography.fontSize.body,
              color: customization.colors.text
            }}>
              <Text style={{ 
                width: '20%', 
                padding: 12, 
                borderRightWidth: 1, 
                borderRightColor: customization.colors.borderLight,
                fontWeight: 500
              }}>
                {item.sceneNumber || 'N/A'}
              </Text>
              <Text style={{ 
                width: '20%', 
                padding: 12, 
                borderRightWidth: 1, 
                borderRightColor: customization.colors.borderLight 
              }}>
                {item.intExt || '-'}
              </Text>
              <Text style={{ 
                width: '40%', 
                padding: 12, 
                borderRightWidth: 1, 
                borderRightColor: customization.colors.borderLight 
              }}>
                {item.description || 'No description'}
              </Text>
              <Text style={{ width: '20%', padding: 12 }}>
                {item.estimatedTime || 'TBD'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const ContactSection = ({ 
    title, 
    contacts, 
    icon, 
    isEmergency = false 
  }: { 
    title: string; 
    contacts: any[]; 
    icon: string;
    isEmergency?: boolean;
  }) => {
    if (!contacts?.length) return null;
    
    const isEmergencyProminent = isEmergency && customization.sections.formatting.emergencyProminent;
    const contactLayout = customization.sections.formatting.contactLayout;
    
    return (
      <View style={{ marginBottom: 24 }} wrap={false}>
        <Text style={{
          fontSize: customization.typography.fontSize.header + 4,
          fontWeight: 600,
          color: isEmergencyProminent ? '#dc2626' : customization.colors.text,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8
        }}>
          {showSectionIcons && <Text style={{ fontSize: 20 }}>{icon}</Text>}
          {title}
        </Text>
        
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 16
        }}>
          {contacts.map((contact, index) => (
            <View
              key={contact.id || index}
              style={{
                flex: contactLayout === 'compact' ? '1 1 30%' : '1 1 45%',
                backgroundColor: isEmergency && isEmergencyProminent ? '#fef2f2' : customization.colors.surface,
                borderRadius: customization.visual.cornerRadius,
                borderWidth: 1,
                borderColor: isEmergency && isEmergencyProminent ? '#fca5a5' : customization.colors.border,
                borderLeftWidth: 4,
                borderLeftColor: isEmergency && isEmergencyProminent ? '#dc2626' : customization.colors.accent,
                padding: 16
              }}
            >
              <Text style={{
                fontWeight: 500,
                marginBottom: 4,
                fontSize: customization.typography.fontSize.body,
                color: customization.colors.text
              }}>
                {contact.name || 'Unknown'}
              </Text>
              {(contact.character || contact.role) && (
                <Text style={{
                  fontSize: customization.typography.fontSize.small,
                  color: customization.colors.textLight,
                  marginBottom: 8,
                  fontStyle: 'italic'
                }}>
                  {contact.character ? `as ${contact.character}` : contact.role}
                </Text>
              )}
              <Text style={{
                fontSize: customization.typography.fontSize.small,
                marginBottom: 4,
                fontWeight: isEmergency ? 500 : 'normal',
                color: customization.colors.text
              }}>
                {showSectionIcons && '📞 '}{contact.phone}
              </Text>
              {contact.email && !isEmergency && (
                <Text style={{
                  fontSize: customization.typography.fontSize.small,
                  color: customization.colors.text
                }}>
                  {showSectionIcons && '📧 '}{contact.email}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const Footer = () => (
    <View style={{
      position: 'absolute',
      bottom: 16,
      left: 32,
      right: 32,
      borderTopWidth: 1,
      borderTopColor: customization.colors.border,
      paddingTop: 16,
      fontSize: customization.typography.fontSize.small,
      color: customization.colors.textLight,
      textAlign: customization.branding.footer?.position === 'center' ? 'center' : 
                customization.branding.footer?.position === 'right' ? 'right' : 'left'
    }} fixed>
      <Text>
        {customization.branding.footer?.text || 
         `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`}
      </Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={{
        backgroundColor: customization.colors.background,
        color: customization.colors.text,
        fontFamily: 'Helvetica',
        fontSize: customization.typography.fontSize.body,
        lineHeight: customization.typography.lineHeight.body,
        padding: 32,
        paddingBottom: 64,
        position: 'relative'
      }}>
        <Header />
        <ProductionDetailsGrid />
        <SpecialNotes />
        <Schedule />
        <ContactSection title="CAST" contacts={callsheet.cast || []} icon="🎭" />
        <ContactSection title="CREW" contacts={callsheet.crew || []} icon="🎬" />
        {customization.sections.visibility.emergencyContacts && (
          <ContactSection 
            title="EMERGENCY CONTACTS" 
            contacts={callsheet.emergencyContacts || []} 
            icon="⚠️" 
            isEmergency={true} 
          />
        )}
        <Footer />
      </Page>
    </Document>
  );
};
