
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
  const isTraditional = customization.theme.name === 'Traditional';
  const isDense = customization.theme.name === 'Dense';
  
  // Use user-selected contact layout over theme default
  const contactLayout = customization.sections.formatting.contactLayout;
  
  if (isTraditional && contactLayout === 'table') {
    return (
      <div className="border-2 border-black p-2" style={{
        fontSize: `${customization.typography.fontSize.body}px`,
        lineHeight: customization.typography.lineHeight.body,
        backgroundColor: customization.colors.surface,
        color: customization.colors.text,
        fontFamily: getFontFamily(customization.typography.fontFamily),
        fontWeight: getFontWeight(customization.typography.fontWeight.body)
      }}>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="font-bold" style={{ fontWeight: getFontWeight(customization.typography.fontWeight.header) }}>{contact.name}</div>
          <div>{contact.character || contact.role}</div>
          <div>{contact.phone}</div>
        </div>
      </div>
    );
  }

  if (isDense && contactLayout === 'table') {
    return (
      <div className="border border-gray-600" style={{
        fontSize: `${customization.typography.fontSize.body}px`,
        color: customization.colors.text,
        backgroundColor: customization.colors.surface,
        fontFamily: getFontFamily(customization.typography.fontFamily)
      }}>
        <div className="grid grid-cols-4 gap-0">
          <div className="p-2 border-r font-semibold text-xs" style={{ 
            borderColor: customization.colors.border,
            fontWeight: getFontWeight(customization.typography.fontWeight.header)
          }}>{contact.name}</div>
          <div className="p-2 border-r text-xs" style={{ borderColor: customization.colors.border }}>{contact.character || contact.role}</div>
          <div className="p-2 border-r text-xs font-mono" style={{ borderColor: customization.colors.border }}>{contact.phone}</div>
          <div className="p-2 text-xs">{contact.email ? '✓' : '-'}</div>
        </div>
      </div>
    );
  }

  // For all other layouts (list, cards, compact), use card-based design
  const cardStyle: React.CSSProperties = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: customization.colors.surface,
    borderColor: customization.colors.border,
    color: customization.colors.text,
    fontFamily: getFontFamily(customization.typography.fontFamily)
  };

  if (customization.visual.cardStyle === 'gradient' && customization.colors.gradient) {
    const { from, to, direction } = customization.colors.gradient;
    const gradientDirection = direction === 'to-r' ? 'to right' :
                            direction === 'to-br' ? 'to bottom right' : 'to bottom';
    cardStyle.background = `linear-gradient(${gradientDirection}, ${from}40, ${to}40)`;
  }

  const shadowClass = customization.visual.shadowIntensity === 'medium' ? 'shadow-md' :
                     customization.visual.shadowIntensity === 'subtle' ? 'shadow-sm' : '';

  return (
    <Card className={`${shadowClass} ${isEmergency ? 'border-l-4 border-l-red-500' : ''}`} style={cardStyle}>
      <CardContent className="p-4">
        <div className="font-medium mb-1" style={{ 
          fontSize: `${customization.typography.fontSize.header}px`,
          fontWeight: getFontWeight(customization.typography.fontWeight.header),
          color: customization.colors.text,
          fontFamily: getFontFamily(customization.typography.fontFamily)
        }}>
          {contact.name}
        </div>
        {(contact.character || contact.role) && (
          <div className="mb-2 italic" style={{ 
            color: customization.colors.textLight,
            fontSize: `${customization.typography.fontSize.small}px`,
            fontFamily: getFontFamily(customization.typography.fontFamily)
          }}>
            {contact.character ? `as ${contact.character}` : contact.role}
          </div>
        )}
        <div className="mb-1" style={{ 
          fontSize: `${customization.typography.fontSize.body}px`,
          fontWeight: isEmergency ? getFontWeight('medium') : getFontWeight(customization.typography.fontWeight.body),
          color: customization.colors.text,
          fontFamily: getFontFamily(customization.typography.fontFamily)
        }}>
          📞 {contact.phone}
        </div>
        {contact.email && !isEmergency && (
          <div style={{ 
            fontSize: `${customization.typography.fontSize.small}px`,
            color: customization.colors.textLight,
            fontFamily: getFontFamily(customization.typography.fontFamily)
          }}>
            📧 {contact.email}
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
  const contactLayout = customization.sections.formatting.contactLayout;
  const showIcons = customization.sections.formatting.showSectionIcons;
  
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

  // For table layouts in Traditional/Dense themes
  if (contactLayout === 'table') {
    return (
      <div className="mb-6" style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
        <div style={{
          backgroundColor: customization.colors.headerBackground,
          color: customization.colors.headerText,
          padding: '12px',
          marginBottom: '8px',
          borderRadius: `${customization.visual.cornerRadius}px`,
          fontFamily: getFontFamily(customization.typography.fontFamily)
        }}>
          <h3 className="font-bold text-center" style={{
            fontSize: `${customization.typography.fontSize.header + 2}px`,
            fontWeight: getFontWeight(customization.typography.fontWeight.header)
          }}>
            {showIcons && <span className="mr-2">{icon}</span>}
            {title}
          </h3>
        </div>
        
        {isEmergency && emergencyNumber && (
          <div className="mb-4 avoid-break">
            <EmergencyNumbers emergencyNumbers={emergencyNumbers} />
          </div>
        )}
        
        <div className="border-2" style={{ borderColor: customization.colors.border }}>
          {customization.theme.name !== 'Traditional' && (
            <div className="grid grid-cols-4 font-bold text-xs" style={{
              backgroundColor: customization.colors.surfaceHover,
              borderBottom: `1px solid ${customization.colors.border}`,
              color: customization.colors.text,
              fontFamily: getFontFamily(customization.typography.fontFamily),
              fontWeight: getFontWeight(customization.typography.fontWeight.header)
            }}>
              <div className="p-2 border-r" style={{ borderColor: customization.colors.border }}>NAME</div>
              <div className="p-2 border-r" style={{ borderColor: customization.colors.border }}>ROLE</div>
              <div className="p-2 border-r" style={{ borderColor: customization.colors.border }}>PHONE</div>
              <div className="p-2">EMAIL</div>
            </div>
          )}
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
  }

  // Determine grid class based on user-selected layout
  const getGridClass = () => {
    switch (contactLayout) {
      case 'cards':
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
      case 'compact':
        return 'grid grid-cols-1 md:grid-cols-3 gap-3';
      case 'list':
      default:
        return 'space-y-3';
    }
  };

  return (
    <div className="mb-8 avoid-break" style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
      <h3 className="font-semibold mb-4 flex items-center gap-2" style={{
        color: customization.colors.text,
        fontSize: `${customization.typography.fontSize.header + 4}px`,
        fontWeight: getFontWeight(customization.typography.fontWeight.header),
        fontFamily: getFontFamily(customization.typography.fontFamily),
        marginBottom: `${customization.layout.spacing.itemGap}px`
      }}>
        {showIcons && <span className="text-xl">{icon}</span>}
        {title}
      </h3>
      
      {isEmergency && emergencyNumber && (
        <div className="mb-4 avoid-break" style={{ marginBottom: `${customization.layout.spacing.itemGap}px` }}>
          <EmergencyNumbers emergencyNumbers={emergencyNumbers} />
        </div>
      )}
      
      <div className={getGridClass()} style={{ gap: `${customization.layout.spacing.itemGap}px` }}>
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
  const isCompact = customization.sections.formatting.scheduleCompact;
  const showIcons = customization.sections.formatting.showSectionIcons;
  const alternateRows = customization.sections.formatting.alternateRowColors;

  const tableStyle = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: customization.colors.surface,
    borderColor: customization.colors.border,
    fontFamily: getFontFamily(customization.typography.fontFamily)
  };

  return (
    <div className="mb-6 avoid-break" style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{
        color: customization.colors.text,
        fontSize: `${customization.typography.fontSize.header + 4}px`,
        fontWeight: getFontWeight(customization.typography.fontWeight.header),
        fontFamily: getFontFamily(customization.typography.fontFamily),
        marginBottom: `${customization.layout.spacing.itemGap}px`
      }}>
        {showIcons && <span className="text-xl">📋</span>}
        SCHEDULE
      </h3>
      
      <Card style={tableStyle}>
        <div className="overflow-hidden">
          <div className={`grid ${isCompact ? 'grid-cols-4' : 'grid-cols-5'} gap-0 font-medium border-b-2`} style={{
            backgroundColor: customization.colors.surfaceHover,
            borderColor: customization.colors.border,
            fontSize: `${customization.typography.fontSize.header}px`,
            color: customization.colors.text,
            fontFamily: getFontFamily(customization.typography.fontFamily),
            fontWeight: getFontWeight(customization.typography.fontWeight.header)
          }}>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Scene</div>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Int/Ext</div>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Description</div>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Time</div>
            {!isCompact && <div className="p-4">Pages</div>}
          </div>
          {schedule.map((item, index) => (
            <div key={index} className={`grid ${isCompact ? 'grid-cols-4' : 'grid-cols-5'} gap-0 border-b`} style={{
              backgroundColor: alternateRows && index % 2 === 1 ? customization.colors.surfaceHover : customization.colors.surface,
              borderColor: customization.colors.borderLight,
              fontSize: `${customization.typography.fontSize.body}px`,
              color: customization.colors.text,
              fontFamily: getFontFamily(customization.typography.fontFamily),
              fontWeight: getFontWeight(customization.typography.fontWeight.body)
            }}>
              <div className="p-3 font-medium border-r" style={{ 
                borderColor: customization.colors.borderLight,
                fontWeight: getFontWeight('medium')
              }}>
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
              {!isCompact && (
                <div className="p-3">
                  {item.pageCount || '-'}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const LogoDisplay: React.FC<{ logo: any; customization: PDFCustomization }> = ({ logo, customization }) => {
  if (!logo) return null;

  const getLogoSize = () => {
    switch (logo.size) {
      case 'small': return { width: '60px', height: '60px' };
      case 'large': return { width: '120px', height: '120px' };
      case 'medium':
      default: return { width: '80px', height: '80px' };
    }
  };

  const getLogoPosition = () => {
    switch (logo.position) {
      case 'top-center': 
      case 'header-center': 
        return { textAlign: 'center' as const };
      case 'top-right': 
      case 'header-right': 
        return { textAlign: 'right' as const };
      case 'top-left':
      case 'header-left':
      default: 
        return { textAlign: 'left' as const };
    }
  };

  return (
    <div style={{ 
      ...getLogoPosition(), 
      marginBottom: `${customization.layout.spacing.itemGap}px` 
    }}>
      <img
        src={logo.url}
        alt="Company Logo"
        style={{
          ...getLogoSize(),
          opacity: logo.opacity || 1,
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

const CompanyInfoDisplay: React.FC<{ customization: PDFCustomization }> = ({ customization }) => {
  const { branding } = customization;
  if (!branding.companyName && !branding.productionCompany && !branding.network) return null;

  return (
    <div style={{
      marginBottom: `${customization.layout.spacing.itemGap}px`,
      fontSize: `${customization.typography.fontSize.small}px`,
      color: customization.colors.textLight,
      fontFamily: getFontFamily(customization.typography.fontFamily),
      textAlign: 'center'
    }}>
      {branding.companyName && (
        <div style={{ fontWeight: getFontWeight('medium') }}>
          {branding.companyName}
        </div>
      )}
      {branding.productionCompany && (
        <div>Production: {branding.productionCompany}</div>
      )}
      {branding.network && (
        <div>Network: {branding.network}</div>
      )}
      {branding.season && branding.episode && (
        <div>Season {branding.season}, Episode {branding.episode}</div>
      )}
    </div>
  );
};

const WatermarkDisplay: React.FC<{ customization: PDFCustomization }> = ({ customization }) => {
  const { watermark } = customization.branding;
  if (!watermark?.text) return null;

  const watermarkStyle: React.CSSProperties = {
    position: 'fixed',
    opacity: watermark.opacity || 0.1,
    color: customization.colors.textLight,
    fontSize: `${customization.typography.fontSize.title * 2}px`,
    fontFamily: getFontFamily(customization.typography.fontFamily),
    fontWeight: getFontWeight('bold'),
    pointerEvents: 'none',
    zIndex: 0,
    userSelect: 'none'
  };

  if (watermark.position === 'diagonal') {
    watermarkStyle.top = '50%';
    watermarkStyle.left = '50%';
    watermarkStyle.transform = 'translate(-50%, -50%) rotate(-45deg)';
  } else {
    watermarkStyle.top = '50%';
    watermarkStyle.left = '50%';
    watermarkStyle.transform = 'translate(-50%, -50%)';
  }

  return (
    <div style={watermarkStyle}>
      {watermark.text}
    </div>
  );
};

const getFontFamily = (fontFamily: string) => {
  switch (fontFamily) {
    case 'inter': return 'Inter, sans-serif';
    case 'helvetica': return 'Helvetica, Arial, sans-serif';
    case 'poppins': return 'Poppins, sans-serif';
    case 'montserrat': return 'Montserrat, sans-serif';
    default: return 'Inter, sans-serif';
  }
};

const getFontWeight = (weight: string) => {
  switch (weight) {
    case 'normal': return '400';
    case 'medium': return '500';
    case 'semibold': return '600';
    case 'bold': return '700';
    default: return '400';
  }
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

  const containerStyles = {
    backgroundColor: customization.colors.background,
    color: customization.colors.text,
    fontFamily: getFontFamily(customization.typography.fontFamily),
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.typography.lineHeight.body,
    padding: `${customization.layout.margins.top}px ${customization.layout.margins.right}px ${customization.layout.margins.bottom}px ${customization.layout.margins.left}px`,
    minHeight: '100vh',
    position: 'relative' as const,
    paddingBottom: '4rem'
  };

  const getHeaderBackgroundStyle = () => {
    const { headerBackground } = customization.visual;
    const baseStyle = {
      borderRadius: `${customization.visual.cornerRadius}px`,
      padding: '1.5rem',
      marginBottom: `${customization.layout.spacing.sectionGap}px`,
      fontFamily: getFontFamily(customization.typography.fontFamily)
    };

    if (customization.colors.gradient && headerBackground === 'gradient') {
      const { from, to, direction } = customization.colors.gradient;
      const gradientDirection = direction === 'to-r' ? 'to right' :
                              direction === 'to-br' ? 'to bottom right' : 'to bottom';
      return {
        ...baseStyle,
        background: `linear-gradient(${gradientDirection}, ${from}, ${to})`,
        color: customization.colors.headerText
      };
    }

    switch (headerBackground) {
      case 'subtle':
        return { 
          ...baseStyle, 
          backgroundColor: customization.colors.surface,
          color: customization.colors.text,
          border: `1px solid ${customization.colors.border}`
        };
      case 'solid':
        return { 
          ...baseStyle, 
          backgroundColor: customization.colors.headerBackground,
          color: customization.colors.headerText,
          border: `1px solid ${customization.colors.border}`
        };
      default:
        return { 
          marginBottom: `${customization.layout.spacing.sectionGap}px`,
          color: customization.colors.text,
          fontFamily: getFontFamily(customization.typography.fontFamily)
        };
    }
  };

  const headerStyles = {
    textAlign: (customization.layout.headerStyle === 'creative' ? 'center' : 'left') as 'center' | 'left',
    ...getHeaderBackgroundStyle()
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`} style={containerStyles}>
      {/* Watermark */}
      <WatermarkDisplay customization={customization} />
      
      {/* Logo Display */}
      {customization.branding.logo && (
        <LogoDisplay logo={customization.branding.logo} customization={customization} />
      )}
      
      {/* Company Info */}
      <CompanyInfoDisplay customization={customization} />
      
      {/* Header Section */}
      <div style={headerStyles}>
        <h1 className="font-bold mb-3" style={{
          fontSize: `${customization.typography.fontSize.title}px`,
          fontWeight: getFontWeight(customization.typography.fontWeight.title),
          color: headerStyles.color,
          lineHeight: customization.typography.lineHeight.title,
          margin: `0 0 ${customization.layout.spacing.itemGap}px 0`,
          fontFamily: getFontFamily(customization.typography.fontFamily)
        }}>
          {callsheet.projectTitle}
        </h1>
        <h2 className="font-semibold" style={{
          fontSize: `${customization.typography.fontSize.header}px`,
          fontWeight: getFontWeight(customization.typography.fontWeight.header),
          color: headerStyles.color,
          lineHeight: customization.typography.lineHeight.header,
          margin: 0,
          fontFamily: getFontFamily(customization.typography.fontFamily)
        }}>
          CALL SHEET
        </h2>
      </div>

      {/* Production Details Grid */}
      <div 
        className="grid grid-cols-3 avoid-break"
        style={{ 
          marginBottom: `${customization.layout.spacing.sectionGap}px`,
          gap: `${customization.layout.spacing.itemGap}px`
        }}
      >
        <Card style={{ 
          borderRadius: `${customization.visual.cornerRadius}px`,
          backgroundColor: customization.colors.surface,
          borderColor: customization.colors.border,
          boxShadow: customization.visual.shadowIntensity === 'medium' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' :
                    customization.visual.shadowIntensity === 'subtle' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
        }}>
          <CardContent className="p-4 flex items-start gap-2">
            {customization.sections.formatting.showSectionIcons && <span className="text-lg flex-shrink-0">📅</span>}
            <div className="flex-1">
              <div className="font-medium mb-1" style={{ 
                color: customization.colors.text,
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: getFontWeight(customization.typography.fontWeight.header),
                fontFamily: getFontFamily(customization.typography.fontFamily)
              }}>
                Shoot Date
              </div>
              <div style={{ 
                fontSize: `${customization.typography.fontSize.body}px`, 
                color: customization.colors.text,
                lineHeight: customization.typography.lineHeight.body,
                fontFamily: getFontFamily(customization.typography.fontFamily),
                fontWeight: getFontWeight(customization.typography.fontWeight.body)
              }}>
                {formatDate(callsheet.shootDate)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ 
          borderRadius: `${customization.visual.cornerRadius}px`,
          backgroundColor: customization.colors.surface,
          borderColor: customization.colors.border,
          boxShadow: customization.visual.shadowIntensity === 'medium' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' :
                    customization.visual.shadowIntensity === 'subtle' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
        }}>
          <CardContent className="p-4 flex items-start gap-2">
            {customization.sections.formatting.showSectionIcons && <span className="text-lg flex-shrink-0">🕐</span>}
            <div className="flex-1">
              <div className="font-medium mb-1" style={{ 
                color: customization.colors.text,
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: getFontWeight(customization.typography.fontWeight.header),
                fontFamily: getFontFamily(customization.typography.fontFamily)
              }}>
                Call Time
              </div>
              <div style={{ 
                fontSize: `${customization.typography.fontSize.body}px`, 
                color: customization.colors.text,
                lineHeight: customization.typography.lineHeight.body,
                fontFamily: getFontFamily(customization.typography.fontFamily),
                fontWeight: getFontWeight(customization.typography.fontWeight.body)
              }}>
                {callsheet.generalCallTime}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ 
          borderRadius: `${customization.visual.cornerRadius}px`,
          backgroundColor: customization.colors.surface,
          borderColor: customization.colors.border,
          boxShadow: customization.visual.shadowIntensity === 'medium' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' :
                    customization.visual.shadowIntensity === 'subtle' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
        }}>
          <CardContent className="p-4 flex items-start gap-2">
            {customization.sections.formatting.showSectionIcons && <span className="text-lg flex-shrink-0">📍</span>}
            <div className="flex-1">
              <div className="font-medium mb-1" style={{ 
                color: customization.colors.text,
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: getFontWeight(customization.typography.fontWeight.header),
                fontFamily: getFontFamily(customization.typography.fontFamily)
              }}>
                Location
              </div>
              <div style={{ 
                fontSize: `${customization.typography.fontSize.body}px`, 
                color: customization.colors.text,
                lineHeight: customization.typography.lineHeight.body,
                fontFamily: getFontFamily(customization.typography.fontFamily),
                fontWeight: getFontWeight(customization.typography.fontWeight.body)
              }}>
                {callsheet.location}
              </div>
              {callsheet.locationAddress && (
                <div className="text-sm" style={{ 
                  color: customization.colors.textLight,
                  fontSize: `${customization.typography.fontSize.small}px`,
                  fontFamily: getFontFamily(customization.typography.fontFamily)
                }}>
                  {callsheet.locationAddress}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Section */}
      {callsheet.schedule.length > 0 && (
        <div style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
          <ScheduleSection 
            schedule={callsheet.schedule} 
            customization={customization}
          />
        </div>
      )}

      {/* Cast Section */}
      {callsheet.cast.length > 0 && (
        <div style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
          <ContactSection
            title="CAST"
            contacts={callsheet.cast}
            icon="🎭"
            customization={customization}
          />
        </div>
      )}

      {/* Crew Section */}
      {callsheet.crew.length > 0 && (
        <div style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
          <ContactSection
            title="CREW"
            contacts={callsheet.crew}
            icon="🎬"
            customization={customization}
          />
        </div>
      )}

      {/* Emergency Contacts Section */}
      {callsheet.emergencyContacts.length > 0 && (
        <div style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
          <ContactSection
            title="EMERGENCY CONTACTS"
            contacts={callsheet.emergencyContacts}
            icon="⚠️"
            isEmergency={true}
            customization={customization}
            emergencyNumber={emergencyNumber}
          />
        </div>
      )}

      {/* Footer */}
      {customization.branding.footer?.text && (
        <div style={{
          position: 'absolute',
          bottom: `${customization.layout.margins.bottom}px`,
          left: `${customization.layout.margins.left}px`,
          right: `${customization.layout.margins.right}px`,
          textAlign: customization.branding.footer.position as any,
          fontSize: `${customization.typography.fontSize.caption}px`,
          color: customization.colors.textLight,
          fontFamily: getFontFamily(customization.typography.fontFamily),
          borderTop: customization.branding.footer.style === 'bordered' ? `1px solid ${customization.colors.borderLight}` : 'none',
          paddingTop: customization.branding.footer.style === 'bordered' ? `${customization.layout.spacing.itemGap / 2}px` : '0'
        }}>
          {customization.branding.footer.text}
        </div>
      )}
    </div>
  );
};
