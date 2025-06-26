
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { EmergencyNumbers } from '../EmergencyNumbers';
import { getEmergencyNumberFromLocation, getCountryCodeFromLocation } from '@/utils/emergencyNumberUtils';
import { EmergencyServiceApi } from '@/services/emergencyService';

interface CallsheetPDFPreviewProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  className?: string;
}

interface ContactCardProps {
  contact: any;
  isEmergency?: boolean;
  customization: PDFCustomization;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, isEmergency = false, customization }) => {
  const cardStyle = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: isEmergency && customization.sections.formatting.emergencyProminent 
      ? '#fef2f2' 
      : customization.colors.surface,
    borderColor: isEmergency && customization.sections.formatting.emergencyProminent 
      ? '#fca5a5' 
      : customization.colors.border,
    borderLeftColor: isEmergency && customization.sections.formatting.emergencyProminent 
      ? '#dc2626' 
      : customization.colors.accent,
    borderLeftWidth: '4px',
    color: '#1f2937',
    fontFamily: customization.typography.fontFamily === 'inter' ? 'Inter' :
                customization.typography.fontFamily === 'helvetica' ? 'Helvetica' :
                customization.typography.fontFamily === 'poppins' ? 'Poppins' :
                customization.typography.fontFamily === 'montserrat' ? 'Montserrat' : 'Inter',
    breakInside: 'avoid',
    pageBreakInside: 'avoid'
  };

  const showIcons = customization.sections.formatting.showSectionIcons;

  return (
    <Card className="border-l-4" style={cardStyle}>
      <CardContent className="p-4">
        <div className="font-medium mb-1" style={{ 
          fontSize: `${customization.typography.fontSize.body}px`,
          fontWeight: customization.typography.fontWeight.header === 'normal' ? '400' :
                     customization.typography.fontWeight.header === 'medium' ? '500' :
                     customization.typography.fontWeight.header === 'semibold' ? '600' : '700',
          color: '#1f2937'
        }}>
          {contact.name}
        </div>
        {(contact.character || contact.role) && (
          <div className="text-sm mb-2 italic" style={{ 
            color: '#6b7280',
            fontSize: `${customization.typography.fontSize.small}px`
          }}>
            {contact.character ? `as ${contact.character}` : contact.role}
          </div>
        )}
        <div className="text-sm mb-1" style={{ 
          fontSize: `${customization.typography.fontSize.small}px`,
          fontWeight: isEmergency ? '500' : 'normal',
          color: '#1f2937'
        }}>
          {showIcons && '📞 '}{contact.phone}
        </div>
        {contact.email && !isEmergency && (
          <div className="text-sm" style={{ 
            fontSize: `${customization.typography.fontSize.small}px`,
            color: '#1f2937'
          }}>
            {showIcons && '📧 '}{contact.email}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ContactSection: React.FC<{
  title: string;
  contacts: any[];
  icon: string;
  isEmergency?: boolean;
  customization: PDFCustomization;
  emergencyNumber?: string;
}> = ({ title, contacts, icon, isEmergency = false, customization, emergencyNumber }) => {
  const showIcons = customization.sections.formatting.showSectionIcons;
  const isEmergencyProminent = isEmergency && customization.sections.formatting.emergencyProminent;
  
  const contactLayout = customization.sections.formatting.contactLayout;
  const gridClass = contactLayout === 'compact' ? 'grid-cols-3' :
                   contactLayout === 'cards' ? 'grid-cols-2' :
                   contactLayout === 'table' ? 'grid-cols-1' : 'grid-cols-2';

  const emergencyNumbers = emergencyNumber ? {
    general: emergencyNumber,
    police: emergencyNumber,
    fire: emergencyNumber,
    medical: emergencyNumber
  } : {
    general: '911',
    police: '911',
    fire: '911',
    medical: '911'
  };

  return (
    <div className="mb-6" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
      <h3 className={`text-lg font-semibold mb-4 ${isEmergencyProminent ? 'text-red-800' : ''} flex items-center gap-2`} style={{
        color: isEmergencyProminent ? '#dc2626' : '#1f2937',
        fontSize: `${customization.typography.fontSize.header + 4}px`,
        fontWeight: customization.typography.fontWeight.header === 'normal' ? '400' :
                   customization.typography.fontWeight.header === 'medium' ? '500' :
                   customization.typography.fontWeight.header === 'semibold' ? '600' : '700'
      }}>
        {showIcons && <span className="text-xl">{icon}</span>}
        {title}
      </h3>
      
      {isEmergency && emergencyNumber && (
        <div className="mb-4" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <EmergencyNumbers emergencyNumbers={emergencyNumbers} />
        </div>
      )}
      
      <div className={`grid ${gridClass} gap-4`}>
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            isEmergency={isEmergency}
            customization={customization}
          />
        ))}
      </div>
    </div>
  );
};

const ScheduleSection: React.FC<{
  schedule: any[];
  customization: PDFCustomization;
}> = ({ schedule, customization }) => {
  const showIcons = customization.sections.formatting.showSectionIcons;
  const alternateRows = customization.sections.formatting.alternateRowColors;

  const tableStyle = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: customization.colors.surface,
    borderColor: customization.colors.border,
    fontFamily: customization.typography.fontFamily === 'inter' ? 'Inter' :
                customization.typography.fontFamily === 'helvetica' ? 'Helvetica' :
                customization.typography.fontFamily === 'poppins' ? 'Poppins' :
                customization.typography.fontFamily === 'montserrat' ? 'Montserrat' : 'Inter',
    breakInside: 'avoid',
    pageBreakInside: 'avoid'
  };

  return (
    <div className="mb-6" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{
        color: '#1f2937',
        fontSize: `${customization.typography.fontSize.header + 4}px`,
        fontWeight: customization.typography.fontWeight.header === 'normal' ? '400' :
                   customization.typography.fontWeight.header === 'medium' ? '500' :
                   customization.typography.fontWeight.header === 'semibold' ? '600' : '700'
      }}>
        {showIcons && <span className="text-xl">📋</span>}
        SCHEDULE
      </h3>
      
      <Card style={tableStyle}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-5 gap-0 font-medium border-b-2" style={{
            backgroundColor: customization.colors.surfaceHover,
            borderColor: customization.colors.border,
            fontSize: `${customization.typography.fontSize.header}px`,
            color: '#1f2937'
          }}>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Scene</div>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Int/Ext</div>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Description</div>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Time</div>
            <div className="p-4">Pages</div>
          </div>
          {schedule.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-0 border-b" style={{
              backgroundColor: alternateRows && index % 2 === 1 ? customization.colors.surface : customization.colors.background,
              borderColor: customization.colors.borderLight,
              fontSize: `${customization.typography.fontSize.body}px`,
              color: '#1f2937'
            }}>
              <div className="p-3 font-medium border-r" style={{ borderColor: customization.colors.borderLight }}>
                {item.sceneNumber}
              </div>
              <div className="p-3 border-r" style={{ borderColor: customization.colors.borderLight }}>
                {item.intExt}
              </div>
              <div className="p-3 border-r" style={{ borderColor: customization.colors.borderLight }}>
                {item.description}
              </div>
              <div className="p-3 border-r" style={{ borderColor: customization.colors.borderLight }}>
                {item.estimatedTime}
              </div>
              <div className="p-3">
                {item.pageCount || '-'}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const CallsheetPDFPreview: React.FC<CallsheetPDFPreviewProps> = ({ 
  callsheet, 
  customization,
  className = ""
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const emergencyNumber = callsheet.emergencyNumber || getEmergencyNumberFromLocation(callsheet.location);
  const countryCode = getCountryCodeFromLocation(callsheet.location);
  const emergencyNumbers = EmergencyServiceApi.getEmergencyNumbers(countryCode);

  const isHeaderCentered = customization.layout.headerStyle === 'minimal' || 
                          customization.layout.headerStyle === 'creative';
  
  const showSectionIcons = customization.sections.formatting.showSectionIcons;
  const isEmergencyProminent = customization.sections.formatting.emergencyProminent;
  
  const contactLayout = customization.sections.formatting.contactLayout;
  const contactGridClass = contactLayout === 'compact' ? 'grid grid-cols-3 gap-4' :
                          contactLayout === 'cards' ? 'grid grid-cols-2 gap-4' :
                          contactLayout === 'table' ? 'space-y-2' : 'grid grid-cols-2 gap-4';

  const containerStyles = {
    backgroundColor: customization.colors.background,
    color: '#1f2937',
    fontFamily: customization.typography.fontFamily === 'inter' ? 'Inter' :
                customization.typography.fontFamily === 'helvetica' ? 'Helvetica' :
                customization.typography.fontFamily === 'poppins' ? 'Poppins' :
                customization.typography.fontFamily === 'montserrat' ? 'Montserrat' : 'Inter',
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.typography.lineHeight.body,
    padding: '2rem',
    minHeight: '100vh',
    position: 'relative' as const,
    paddingBottom: '4rem'
  };

  const getHeaderBackgroundStyle = () => {
    const { headerBackground } = customization.visual;
    const baseStyle = {
      borderRadius: `${customization.visual.cornerRadius}px`,
      padding: '1.5rem',
      marginBottom: '2rem'
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
          const { from, to, direction } = customization.colors.gradient;
          const gradientDirection = direction === 'to-r' ? 'to right' :
                                  direction === 'to-br' ? 'to bottom right' : 'to bottom';
          return {
            ...baseStyle,
            background: `linear-gradient(${gradientDirection}, ${from}, ${to})`,
            color: customization.colors.background
          };
        }
        return baseStyle;
      default:
        return { marginBottom: '1.5rem' };
    }
  };

  const headerStyles = {
    textAlign: (isHeaderCentered ? 'center' : 'left') as 'center' | 'left',
    ...getHeaderBackgroundStyle()
  };

  const getTitleColor = () => {
    const isHeaderWithBackground = customization.visual.headerBackground !== 'none';
    
    if (customization.layout.headerStyle === 'professional' && isHeaderWithBackground) {
      return customization.colors.background;
    }
    
    return isHeaderWithBackground ? customization.colors.background : '#1f2937';
  };

  const getSubtitleColor = () => {
    const isHeaderWithBackground = customization.visual.headerBackground !== 'none';
    
    if (customization.layout.headerStyle === 'professional' && isHeaderWithBackground) {
      return customization.colors.background;
    }
    
    return isHeaderWithBackground ? customization.colors.background : '#374151';
  };

  // Calculate logo size based on size setting
  const getLogoSize = () => {
    if (!customization.branding.logo) return '64px';
    const size = customization.branding.logo.size;
    return size === 'small' ? '48px' : size === 'large' ? '80px' : '64px';
  };

  // Get logo positioning styles
  const getLogoPositionStyles = () => {
    if (!customization.branding.logo) return {};
    
    const position = customization.branding.logo.position;
    const baseStyles = {
      height: getLogoSize(),
      width: 'auto',
      maxWidth: '100%'
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyles, position: 'absolute' as const, top: '1rem', left: '2rem' };
      case 'top-right':
        return { ...baseStyles, position: 'absolute' as const, top: '1rem', right: '2rem' };
      case 'top-center':
        return { ...baseStyles, margin: '0 auto', display: 'block' };
      case 'header-left':
        return { ...baseStyles, float: 'left' as const, marginRight: '1rem', marginBottom: '1rem' };
      case 'header-right':
        return { ...baseStyles, float: 'right' as const, marginLeft: '1rem', marginBottom: '1rem' };
      default:
        return { ...baseStyles, margin: '0 auto', display: 'block' };
    }
  };

  return (
    <div className={`max-w-4xl mx-auto bg-white ${className}`} style={containerStyles}>
      {/* Logo positioning for top positions */}
      {customization.branding.logo && ['top-left', 'top-right'].includes(customization.branding.logo.position) && (
        <img 
          src={customization.branding.logo.url} 
          alt="Company Logo" 
          style={getLogoPositionStyles()}
        />
      )}

      {/* Company Name Header */}
      {customization.branding.companyName && customization.branding.companyName.trim() && (
        <div className="text-center mb-4" style={{
          fontSize: `${customization.typography.fontSize.header + 2}px`,
          fontWeight: customization.typography.fontWeight.header === 'normal' ? '400' :
                     customization.typography.fontWeight.header === 'medium' ? '500' :
                     customization.typography.fontWeight.header === 'semibold' ? '600' : '700',
          color: '#1f2937'
        }}>
          {customization.branding.companyName}
        </div>
      )}

      {/* Header Section */}
      <div style={headerStyles}>
        {customization.branding.logo && ['header-left', 'header-right'].includes(customization.branding.logo.position) && (
          <img 
            src={customization.branding.logo.url} 
            alt="Company Logo" 
            style={getLogoPositionStyles()}
          />
        )}
        
        {customization.branding.logo && ['top-center', 'header-center'].includes(customization.branding.logo.position || 'top-center') && (
          <div className="mb-4">
            <img 
              src={customization.branding.logo.url} 
              alt="Company Logo" 
              style={getLogoPositionStyles()}
            />
          </div>
        )}
        
        <h1 className="font-bold mb-3" style={{
          fontSize: `${customization.typography.fontSize.title}px`,
          fontWeight: customization.typography.fontWeight.title === 'normal' ? '400' :
                     customization.typography.fontWeight.title === 'medium' ? '500' :
                     customization.typography.fontWeight.title === 'semibold' ? '600' : '700',
          color: getTitleColor(),
          lineHeight: customization.typography.lineHeight.title,
          margin: '0 0 12px 0'
        }}>
          {callsheet.projectTitle}
        </h1>
        <h2 className="font-semibold" style={{
          fontSize: `${customization.typography.fontSize.header}px`,
          fontWeight: customization.typography.fontWeight.header === 'normal' ? '400' :
                     customization.typography.fontWeight.header === 'medium' ? '500' :
                     customization.typography.fontWeight.header === 'semibold' ? '600' : '700',
          color: getSubtitleColor(),
          lineHeight: customization.typography.lineHeight.header,
          margin: 0
        }}>
          CALL SHEET
        </h2>
      </div>

      {/* Production Details Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        <Card style={{ 
          borderRadius: `${customization.visual.cornerRadius}px`,
          backgroundColor: customization.colors.surface,
          borderColor: customization.colors.border,
          breakInside: 'avoid',
          pageBreakInside: 'avoid'
        }}>
          <CardContent className="p-4 flex items-start gap-2">
            {showSectionIcons && <span className="text-lg flex-shrink-0">📅</span>}
            <div className="flex-1">
              <div className="font-medium mb-1" style={{ 
                color: '#1f2937',
                fontSize: `${customization.typography.fontSize.header}px`
              }}>
                Shoot Date
              </div>
              <div style={{ fontSize: `${customization.typography.fontSize.body}px`, color: '#1f2937' }}>
                {formatDate(callsheet.shootDate)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ 
          borderRadius: `${customization.visual.cornerRadius}px`,
          backgroundColor: customization.colors.surface,
          borderColor: customization.colors.border,
          breakInside: 'avoid',
          pageBreakInside: 'avoid'
        }}>
          <CardContent className="p-4 flex items-start gap-2">
            {showSectionIcons && <span className="text-lg flex-shrink-0">🕐</span>}
            <div className="flex-1">
              <div className="font-medium mb-1" style={{ 
                color: '#1f2937',
                fontSize: `${customization.typography.fontSize.header}px`
              }}>
                Call Time
              </div>
              <div style={{ fontSize: `${customization.typography.fontSize.body}px`, color: '#1f2937' }}>
                {callsheet.generalCallTime}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ 
          borderRadius: `${customization.visual.cornerRadius}px`,
          backgroundColor: customization.colors.surface,
          borderColor: customization.colors.border,
          breakInside: 'avoid',
          pageBreakInside: 'avoid'
        }}>
          <CardContent className="p-4 flex items-start gap-2">
            {showSectionIcons && <span className="text-lg flex-shrink-0">📍</span>}
            <div className="flex-1">
              <div className="font-medium mb-1" style={{ 
                color: '#1f2937',
                fontSize: `${customization.typography.fontSize.header}px`
              }}>
                Location
              </div>
              <div style={{ fontSize: `${customization.typography.fontSize.body}px`, color: '#1f2937' }}>
                {callsheet.location}
              </div>
              {callsheet.locationAddress && (
                <div className="text-sm" style={{ 
                  color: '#6b7280',
                  fontSize: `${customization.typography.fontSize.small}px`
                }}>
                  {callsheet.locationAddress}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {callsheet.weather && customization.sections.visibility.weather && (
          <Card style={{ 
            borderRadius: `${customization.visual.cornerRadius}px`,
            backgroundColor: customization.colors.surface,
            borderColor: customization.colors.border,
            breakInside: 'avoid',
            pageBreakInside: 'avoid'
          }}>
            <CardContent className="p-4 flex items-start gap-2">
              {showSectionIcons && <span className="text-lg flex-shrink-0">🌤️</span>}
              <div className="flex-1">
                <div className="font-medium mb-1" style={{ 
                  color: '#1f2937',
                  fontSize: `${customization.typography.fontSize.header}px`
                }}>
                  Weather
                </div>
                <div style={{ fontSize: `${customization.typography.fontSize.body}px`, color: '#1f2937' }}>
                  {callsheet.weather}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {callsheet.parkingInstructions && (
          <Card style={{ 
            borderRadius: `${customization.visual.cornerRadius}px`,
            backgroundColor: customization.colors.surface,
            borderColor: customization.colors.border,
            breakInside: 'avoid',
            pageBreakInside: 'avoid'
          }}>
            <CardContent className="p-4 flex items-start gap-2">
              {showSectionIcons && <span className="text-lg flex-shrink-0">🅿️</span>}
              <div className="flex-1">
                <div className="font-medium mb-1" style={{ 
                  color: '#1f2937',
                  fontSize: `${customization.typography.fontSize.header}px`
                }}>
                  Parking Instructions
                </div>
                <div style={{ fontSize: `${customization.typography.fontSize.body}px`, color: '#1f2937' }}>
                  {callsheet.parkingInstructions}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {callsheet.basecampLocation && (
          <Card style={{ 
            borderRadius: `${customization.visual.cornerRadius}px`,
            backgroundColor: customization.colors.surface,
            borderColor: customization.colors.border,
            breakInside: 'avoid',
            pageBreakInside: 'avoid'
          }}>
            <CardContent className="p-4 flex items-start gap-2">
              {showSectionIcons && <span className="text-lg flex-shrink-0">🏕️</span>}
              <div className="flex-1">
                <div className="font-medium mb-1" style={{ 
                  color: '#1f2937',
                  fontSize: `${customization.typography.fontSize.header}px`
                }}>
                  Basecamp Location
                </div>
                <div style={{ fontSize: `${customization.typography.fontSize.body}px`, color: '#1f2937' }}>
                  {callsheet.basecampLocation}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Special Notes */}
      {callsheet.specialNotes && customization.sections.visibility.notes && (
        <div className="mb-8" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <Card style={{ 
            borderRadius: `${customization.visual.cornerRadius}px`,
            backgroundColor: customization.colors.surface,
            borderColor: customization.colors.border,
            borderLeftColor: customization.colors.accent,
            borderLeftWidth: '4px'
          }}>
            <CardContent className="p-5">
              <h4 className="font-medium mb-3 flex items-center gap-2" style={{
                color: '#1f2937',
                fontSize: `${customization.typography.fontSize.header}px`
              }}>
                {showSectionIcons && <span className="text-lg">📝</span>}
                Special Notes
              </h4>
              <p className="leading-relaxed" style={{ 
                fontSize: `${customization.typography.fontSize.body}px`,
                color: '#1f2937',
                margin: 0,
                lineHeight: 1.5
              }}>
                {callsheet.specialNotes}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule */}
      {callsheet.schedule.length > 0 && customization.sections.visibility.schedule && (
        <ScheduleSection 
          schedule={callsheet.schedule} 
          customization={customization}
        />
      )}

      {/* Cast */}
      {callsheet.cast.length > 0 && (
        <ContactSection
          title="CAST"
          contacts={callsheet.cast}
          icon="🎭"
          customization={customization}
        />
      )}

      {/* Crew */}
      {callsheet.crew.length > 0 && (
        <ContactSection
          title="CREW"
          contacts={callsheet.crew}
          icon="🎬"
          customization={customization}
        />
      )}

      {/* Emergency Contacts */}
      {callsheet.emergencyContacts.length > 0 && customization.sections.visibility.emergencyContacts && (
        <ContactSection
          title="EMERGENCY CONTACTS"
          contacts={callsheet.emergencyContacts}
          icon="⚠️"
          isEmergency={true}
          customization={customization}
          emergencyNumber={emergencyNumber}
        />
      )}

      {/* Footer - positioned at bottom of page */}
      {customization.branding.footer?.text && customization.branding.footer.text.trim() && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '2rem',
          right: '2rem',
          borderTop: `1px solid ${customization.colors.border}`,
          paddingTop: '1rem',
          fontSize: `${customization.typography.fontSize.small}px`,
          color: '#6b7280',
          textAlign: customization.branding.footer.position as 'center' | 'left' | 'right'
        }}>
          {customization.branding.footer.text}
        </div>
      )}
    </div>
  );
};
