
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

const LogoDisplay: React.FC<{ 
  logo: any; 
  customization: PDFCustomization; 
  isSecondary?: boolean;
}> = ({ logo, customization, isSecondary = false }) => {
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
        return { 
          position: 'absolute' as const,
          top: `${customization.layout.margins.top}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        };
      case 'top-right': 
        return { 
          position: 'absolute' as const,
          top: `${customization.layout.margins.top}px`,
          right: `${customization.layout.margins.right}px`,
          zIndex: 10
        };
      case 'center-left':
        return { 
          position: 'absolute' as const,
          top: '50%',
          left: `${customization.layout.margins.left}px`,
          transform: 'translateY(-50%)',
          zIndex: 10
        };
      case 'center-right':
        return { 
          position: 'absolute' as const,
          top: '50%',
          right: `${customization.layout.margins.right}px`,
          transform: 'translateY(-50%)',
          zIndex: 10
        };
      case 'bottom-left':
        return { 
          position: 'absolute' as const,
          bottom: `${customization.layout.margins.bottom + 60}px`,
          left: `${customization.layout.margins.left}px`,
          zIndex: 10
        };
      case 'bottom-center':
        return { 
          position: 'absolute' as const,
          bottom: `${customization.layout.margins.bottom + 60}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        };
      case 'bottom-right':
        return { 
          position: 'absolute' as const,
          bottom: `${customization.layout.margins.bottom + 60}px`,
          right: `${customization.layout.margins.right}px`,
          zIndex: 10
        };
      case 'top-left':
      default: 
        return { 
          position: 'absolute' as const,
          top: `${customization.layout.margins.top}px`,
          left: `${customization.layout.margins.left}px`,
          zIndex: 10
        };
    }
  };

  const positionStyle = getLogoPosition();
  const sizeStyle = getLogoSize();

  return (
    <div style={positionStyle}>
      <img
        src={logo.url}
        alt={isSecondary ? "Secondary Logo" : "Company Logo"}
        style={{
          ...sizeStyle,
          opacity: logo.opacity || 1,
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

// Section Divider Component
const SectionDivider: React.FC<{ customization: PDFCustomization }> = ({ customization }) => {
  const { sectionDividers } = customization.visual;
  
  if (sectionDividers === 'none') return null;
  
  if (sectionDividers === 'space') {
    return <div style={{ height: `${customization.layout.spacing.sectionGap}px` }} />;
  }
  
  if (sectionDividers === 'line') {
    return (
      <div style={{
        height: `${customization.layout.borderWidth}px`,
        backgroundColor: customization.colors.border,
        margin: `${customization.layout.spacing.sectionGap / 2}px 0`,
        borderRadius: `${customization.visual.cornerRadius / 2}px`
      }} />
    );
  }
  
  if (sectionDividers === 'accent') {
    return (
      <div style={{
        height: `${customization.layout.borderWidth * 2}px`,
        backgroundColor: customization.colors.accent,
        margin: `${customization.layout.spacing.sectionGap / 2}px 0`,
        borderRadius: `${customization.visual.cornerRadius}px`
      }} />
    );
  }
  
  return null;
};

const ContactCard: React.FC<ContactCardProps> = ({ contact, isEmergency = false, customization }) => {
  const contactLayout = customization.sections.formatting.contactLayout;
  
  if (contactLayout === 'table') {
    return (
      <div style={{
        fontSize: `${customization.typography.fontSize.body}px`,
        lineHeight: customization.typography.lineHeight.body,
        backgroundColor: customization.colors.contactCardBackground,
        color: customization.colors.contactNameText,
        fontFamily: getFontFamily(customization.typography.sectionFonts.contacts),
        fontWeight: getFontWeight(customization.typography.fontWeight.body),
        borderColor: customization.colors.contactCardBorder,
        borderWidth: `${customization.layout.borderWidth}px`,
        borderStyle: 'solid',
        borderRadius: `${customization.visual.cornerRadius}px`,
        marginBottom: `${customization.layout.spacing.cardSpacing}px`
      }}>
        <div className="grid grid-cols-3 gap-2" style={{ padding: `${customization.layout.spacing.itemGap}px` }}>
          <div style={{ 
            fontWeight: getFontWeight(customization.typography.fontWeight.header),
            fontFamily: getFontFamily(customization.typography.sectionFonts.contacts),
            color: customization.colors.contactNameText
          }}>{contact.name}</div>
          <div style={{ color: customization.colors.contactRoleText }}>{contact.character || contact.role}</div>
          <div style={{ color: customization.colors.contactDetailsText }}>{contact.phone}</div>
        </div>
      </div>
    );
  }

  const getCardShadow = () => {
    switch (customization.visual.shadowIntensity) {
      case 'medium': return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      case 'subtle': return '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
      case 'none':
      default: return 'none';
    }
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: isEmergency ? customization.colors.emergencyBackground : customization.colors.contactCardBackground,
    borderColor: isEmergency ? customization.colors.emergencyBorder : customization.colors.contactCardBorder,
    borderWidth: `${customization.layout.borderWidth}px`,
    borderStyle: 'solid',
    color: customization.colors.contactNameText,
    fontFamily: getFontFamily(customization.typography.sectionFonts.contacts),
    marginBottom: `${customization.layout.spacing.cardSpacing}px`,
    boxShadow: getCardShadow()
  };

  if (customization.visual.cardStyle === 'gradient' && customization.colors.gradient) {
    const { from, to, direction } = customization.colors.gradient;
    const gradientDirection = direction === 'to-r' ? 'to right' :
                            direction === 'to-br' ? 'to bottom right' : 'to bottom';
    cardStyle.background = `linear-gradient(${gradientDirection}, ${from}40, ${to}40)`;
  } else if (customization.visual.cardStyle === 'elevated') {
    cardStyle.boxShadow = getCardShadow();
  } else if (customization.visual.cardStyle === 'bordered') {
    cardStyle.borderWidth = `${customization.layout.borderWidth * 2}px`;
  }

  return (
    <Card style={cardStyle}>
      <CardContent style={{ padding: `${customization.layout.spacing.itemGap}px` }}>
        <div style={{ 
          fontSize: `${customization.typography.fontSize.header}px`,
          fontWeight: getFontWeight(customization.typography.fontWeight.header),
          color: isEmergency ? customization.colors.emergencyText : customization.colors.contactNameText,
          fontFamily: getFontFamily(customization.typography.sectionFonts.contacts),
          marginBottom: `${customization.layout.spacing.itemGap / 2}px`
        }}>
          {contact.name}
        </div>
        {(contact.character || contact.role) && (
          <div style={{ 
            color: customization.colors.contactRoleText,
            fontSize: `${customization.typography.fontSize.small}px`,
            fontFamily: getFontFamily(customization.typography.sectionFonts.contacts),
            marginBottom: `${customization.layout.spacing.itemGap / 2}px`,
            fontStyle: 'italic'
          }}>
            {contact.character ? `as ${contact.character}` : contact.role}
          </div>
        )}
        <div style={{ 
          fontSize: `${customization.typography.fontSize.body}px`,
          fontWeight: isEmergency ? getFontWeight('medium') : getFontWeight(customization.typography.fontWeight.body),
          color: customization.colors.contactDetailsText,
          fontFamily: getFontFamily(customization.typography.sectionFonts.contacts),
          marginBottom: contact.email && !isEmergency ? `${customization.layout.spacing.itemGap / 2}px` : '0'
        }}>
          📞 {contact.phone}
        </div>
        {contact.email && !isEmergency && (
          <div style={{ 
            fontSize: `${customization.typography.fontSize.small}px`,
            color: customization.colors.contactDetailsText,
            fontFamily: getFontFamily(customization.typography.sectionFonts.contacts)
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
  sectionType: 'cast' | 'crew' | 'emergency';
}> = ({ title, contacts, icon, isEmergency = false, customization, emergencyNumber, sectionType }) => {
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

  const getSectionColor = () => {
    switch (sectionType) {
      case 'cast': return customization.colors.castSectionColor;
      case 'crew': return customization.colors.crewSectionColor;
      case 'emergency': return customization.colors.emergencySectionColor;
      default: return customization.colors.primary;
    }
  };

  const getGridClass = () => {
    switch (contactLayout) {
      case 'cards':
        return 'grid grid-cols-1 md:grid-cols-2';
      case 'compact':
        return 'grid grid-cols-1 md:grid-cols-3';
      case 'list':
      default:
        return 'space-y-3';
    }
  };

  return (
    <div style={{ 
      marginBottom: `${customization.layout.spacing.sectionGap}px`,
      pageBreakInside: 'avoid'
    }}>
      <h3 style={{
        color: getSectionColor(),
        fontSize: `${customization.typography.fontSize.header + 4}px`,
        fontWeight: getFontWeight(customization.typography.fontWeight.header),
        fontFamily: getFontFamily(customization.typography.sectionFonts.headers),
        marginBottom: `${customization.layout.spacing.itemGap}px`,
        display: 'flex',
        alignItems: 'center',
        gap: showIcons ? '8px' : '0'
      }}>
        {showIcons && <span style={{ fontSize: '20px' }}>{icon}</span>}
        {title}
      </h3>
      
      {isEmergency && emergencyNumber && (
        <div style={{ 
          marginBottom: `${customization.layout.spacing.itemGap}px`,
          pageBreakInside: 'avoid'
        }}>
          <EmergencyNumbers emergencyNumbers={emergencyNumbers} />
        </div>
      )}
      
      <div className={getGridClass()} style={{ gap: `${customization.layout.spacing.cardSpacing}px` }}>
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            isEmergency={isEmergency}
            customization={customization}
          />
        ))}
      </div>
      
      <SectionDivider customization={customization} />
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
    backgroundColor: customization.colors.scheduleBackground,
    borderColor: customization.colors.scheduleBorder,
    fontFamily: getFontFamily(customization.typography.sectionFonts.schedule),
    border: `${customization.layout.borderWidth}px solid ${customization.colors.scheduleBorder}`,
    boxShadow: customization.visual.shadowIntensity === 'medium' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' :
              customization.visual.shadowIntensity === 'subtle' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
  };

  return (
    <div style={{ 
      marginBottom: `${customization.layout.spacing.sectionGap}px`,
      pageBreakInside: 'avoid'
    }}>
      <h3 style={{
        color: customization.colors.scheduleSectionColor,
        fontSize: `${customization.typography.fontSize.header + 4}px`,
        fontWeight: getFontWeight(customization.typography.fontWeight.header),
        fontFamily: getFontFamily(customization.typography.sectionFonts.headers),
        marginBottom: `${customization.layout.spacing.itemGap}px`,
        display: 'flex',
        alignItems: 'center',
        gap: showIcons ? '8px' : '0'
      }}>
        {showIcons && <span style={{ fontSize: '20px' }}>📋</span>}
        SCHEDULE
      </h3>
      
      <Card style={tableStyle}>
        <div style={{ overflow: 'hidden' }}>
          <div className={`grid ${isCompact ? 'grid-cols-4' : 'grid-cols-5'} gap-0`} style={{
            backgroundColor: customization.colors.surfaceHover,
            borderBottom: `${customization.layout.borderWidth * 2}px solid ${customization.colors.scheduleBorder}`,
            fontSize: `${customization.typography.fontSize.header}px`,
            color: customization.colors.scheduleHeaderText,
            fontFamily: getFontFamily(customization.typography.sectionFonts.schedule),
            fontWeight: getFontWeight(customization.typography.fontWeight.header)
          }}>
            <div className="p-4" style={{ borderRight: `${customization.layout.borderWidth}px solid ${customization.colors.scheduleBorder}` }}>Scene</div>
            <div className="p-4" style={{ borderRight: `${customization.layout.borderWidth}px solid ${customization.colors.scheduleBorder}` }}>Int/Ext</div>
            <div className="p-4" style={{ borderRight: `${customization.layout.borderWidth}px solid ${customization.colors.scheduleBorder}` }}>Description</div>
            <div className="p-4" style={{ borderRight: isCompact ? 'none' : `${customization.layout.borderWidth}px solid ${customization.colors.scheduleBorder}` }}>Time</div>
            {!isCompact && <div className="p-4">Pages</div>}
          </div>
          {schedule.map((item, index) => (
            <div key={index} className={`grid ${isCompact ? 'grid-cols-4' : 'grid-cols-5'} gap-0`} style={{
              backgroundColor: alternateRows && index % 2 === 1 ? customization.colors.scheduleRowAlternate : customization.colors.scheduleRowBackground,
              borderBottom: `${customization.layout.borderWidth}px solid ${customization.colors.borderLight}`,
              fontSize: `${customization.typography.fontSize.body}px`,
              color: customization.colors.scheduleBodyText,
              fontFamily: getFontFamily(customization.typography.sectionFonts.schedule),
              fontWeight: getFontWeight(customization.typography.fontWeight.body)
            }}>
              <div className="p-3" style={{ 
                borderRight: `${customization.layout.borderWidth}px solid ${customization.colors.borderLight}`,
                fontWeight: getFontWeight('medium'),
                fontFamily: getFontFamily(customization.typography.sectionFonts.schedule)
              }}>
                {item.sceneNumber}
              </div>
              <div className="p-3" style={{ borderRight: `${customization.layout.borderWidth}px solid ${customization.colors.borderLight}` }}>
                {item.intExt}
              </div>
              <div className="p-3" style={{ borderRight: `${customization.layout.borderWidth}px solid ${customization.colors.borderLight}` }}>
                {item.description}
              </div>
              <div className="p-3" style={{ borderRight: isCompact ? 'none' : `${customization.layout.borderWidth}px solid ${customization.colors.borderLight}` }}>
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
      
      <SectionDivider customization={customization} />
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
      fontFamily: getFontFamily(customization.typography.sectionFonts.body),
      textAlign: 'center'
    }}>
      {branding.companyName && (
        <div style={{ 
          fontWeight: getFontWeight('medium'),
          fontFamily: getFontFamily(customization.typography.sectionFonts.body),
          marginBottom: '4px'
        }}>
          {branding.companyName}
        </div>
      )}
      {branding.productionCompany && (
        <div style={{ 
          fontFamily: getFontFamily(customization.typography.sectionFonts.body),
          marginBottom: '2px'
        }}>
          Production: {branding.productionCompany}
        </div>
      )}
      {branding.network && (
        <div style={{ 
          fontFamily: getFontFamily(customization.typography.sectionFonts.body),
          marginBottom: '2px'
        }}>
          Network: {branding.network}
        </div>
      )}
      {branding.season && branding.episode && (
        <div style={{ 
          fontFamily: getFontFamily(customization.typography.sectionFonts.body)
        }}>
          Season {branding.season}, Episode {branding.episode}
        </div>
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
    fontFamily: getFontFamily(customization.typography.sectionFonts.title),
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

const FooterDisplay: React.FC<{ customization: PDFCustomization }> = ({ customization }) => {
  const { footer } = customization.branding;
  if (!footer?.text) return null;

  const footerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: `${customization.layout.margins.bottom}px`,
    left: `${customization.layout.margins.left}px`,
    right: `${customization.layout.margins.right}px`,
    textAlign: footer.position as any,
    fontSize: `${customization.typography.fontSize.caption}px`,
    color: customization.colors.textLight,
    fontFamily: getFontFamily(customization.typography.sectionFonts.body),
    borderTop: footer.style === 'bordered' ? `${customization.layout.borderWidth}px solid ${customization.colors.borderLight}` : 'none',
    paddingTop: footer.style === 'bordered' ? `${customization.layout.spacing.itemGap / 2}px` : '0'
  };

  if (footer.style === 'accent') {
    footerStyle.color = customization.colors.accent;
    footerStyle.fontWeight = getFontWeight('medium');
  }

  return (
    <div style={footerStyle}>
      {footer.text}
      {footer.unionCompliance && (
        <div style={{ 
          fontSize: `${customization.typography.fontSize.caption - 1}px`,
          marginTop: '2px',
          fontFamily: getFontFamily(customization.typography.sectionFonts.body)
        }}>
          This production complies with applicable union regulations.
        </div>
      )}
    </div>
  );
};

const getFontFamily = (fontFamily: string) => {
  switch (fontFamily) {
    case 'inter': return 'Inter, system-ui, sans-serif';
    case 'helvetica': return 'Helvetica, Arial, sans-serif';
    case 'poppins': return 'Poppins, system-ui, sans-serif';
    case 'montserrat': return 'Montserrat, system-ui, sans-serif';
    case 'roboto': return 'Roboto, system-ui, sans-serif';
    case 'open-sans': return '"Open Sans", system-ui, sans-serif';
    case 'lato': return 'Lato, system-ui, sans-serif';
    case 'source-sans': return '"Source Sans Pro", system-ui, sans-serif';
    case 'nunito': return 'Nunito, system-ui, sans-serif';
    case 'raleway': return 'Raleway, system-ui, sans-serif';
    case 'work-sans': return '"Work Sans", system-ui, sans-serif';
    case 'playfair': return '"Playfair Display", serif';
    case 'merriweather': return 'Merriweather, serif';
    case 'crimson': return '"Crimson Text", serif';
    case 'libre-baskerville': return '"Libre Baskerville", serif';
    case 'pt-serif': return '"PT Serif", serif';
    default: return 'Inter, system-ui, sans-serif';
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

  // Apply page orientation - simplified approach
  const pageOrientation = customization.layout.pageOrientation;
  const isLandscape = pageOrientation === 'landscape';

  const containerStyles: React.CSSProperties = {
    backgroundColor: customization.colors.background,
    color: customization.colors.text,
    fontFamily: getFontFamily(customization.typography.sectionFonts.body),
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.layout.spacing.lineHeight,
    padding: `${customization.layout.margins.top}px ${customization.layout.margins.right}px ${customization.layout.margins.bottom + 60}px ${customization.layout.margins.left}px`,
    minHeight: '100vh',
    position: 'relative',
    fontWeight: getFontWeight(customization.typography.fontWeight.body),
    // For landscape, adjust the container dimensions
    width: isLandscape ? '297mm' : '210mm',
    minHeight: isLandscape ? '210mm' : '297mm'
  };

  const getHeaderBackgroundStyle = () => {
    const { headerBackground } = customization.visual;
    const baseStyle: React.CSSProperties = {
      borderRadius: `${customization.visual.cornerRadius}px`,
      padding: '1.5rem',
      marginBottom: `${customization.layout.spacing.sectionGap}px`,
      fontFamily: getFontFamily(customization.typography.sectionFonts.title)
    };

    if (customization.colors.gradient && headerBackground === 'gradient') {
      const { from, to, direction } = customization.colors.gradient;
      const gradientDirection = direction === 'to-r' ? 'to right' :
                              direction === 'to-br' ? 'to bottom right' : 'to bottom';
      return {
        ...baseStyle,
        background: `linear-gradient(${gradientDirection}, ${from}, ${to})`,
        color: customization.colors.headerText,
        border: `${customization.layout.borderWidth}px solid ${customization.colors.border}`
      };
    }

    switch (headerBackground) {
      case 'subtle':
        return { 
          ...baseStyle, 
          backgroundColor: customization.colors.surface,
          color: customization.colors.titleText,
          border: `${customization.layout.borderWidth}px solid ${customization.colors.border}`
        };
      case 'solid':
        return { 
          ...baseStyle, 
          backgroundColor: customization.colors.headerBackground,
          color: customization.colors.headerText,
          border: `${customization.layout.borderWidth}px solid ${customization.colors.border}`
        };
      default:
        return { 
          marginBottom: `${customization.layout.spacing.sectionGap}px`,
          color: customization.colors.titleText,
          fontFamily: getFontFamily(customization.typography.sectionFonts.title)
        };
    }
  };

  const headerStyles = {
    textAlign: customization.layout.headerAlignment as 'center' | 'left' | 'right',
    ...getHeaderBackgroundStyle()
  };

  return (
    <>
      <div className={`max-w-4xl mx-auto ${className}`} style={containerStyles}>
        <WatermarkDisplay customization={customization} />
        
        {customization.branding.logo && (
          <LogoDisplay 
            logo={customization.branding.logo} 
            customization={customization} 
            isSecondary={false}
          />
        )}
        
        {customization.branding.secondaryLogo && (
          <LogoDisplay 
            logo={{
              ...customization.branding.secondaryLogo,
              position: customization.branding.secondaryLogo.lockToPrimary ? 
                customization.branding.logo?.position || 'top-right' :
                customization.branding.secondaryLogo.position
            }} 
            customization={customization} 
            isSecondary={true}
          />
        )}
        
        <CompanyInfoDisplay customization={customization} />
        
        <div style={headerStyles}>
          <h1 style={{
            fontSize: `${customization.typography.fontSize.title}px`,
            fontWeight: getFontWeight(customization.typography.fontWeight.title),
            color: headerStyles.color,
            lineHeight: customization.typography.lineHeight.title,
            margin: `0 0 ${customization.layout.spacing.itemGap}px 0`,
            fontFamily: getFontFamily(customization.typography.sectionFonts.title)
          }}>
            {callsheet.projectTitle}
          </h1>
          <h2 style={{
            fontSize: `${customization.typography.fontSize.header}px`,
            fontWeight: getFontWeight(customization.typography.fontWeight.header),
            color: headerStyles.color,
            lineHeight: customization.typography.lineHeight.header,
            margin: 0,
            fontFamily: getFontFamily(customization.typography.sectionFonts.headers)
          }}>
            CALL SHEET
          </h2>
        </div>

        <SectionDivider customization={customization} />

        <div 
          className="grid grid-cols-3"
          style={{ 
            marginBottom: `${customization.layout.spacing.sectionGap}px`,
            gap: `${customization.layout.spacing.cardSpacing}px`,
            pageBreakInside: 'avoid'
          }}
        >
          <Card style={{ 
            borderRadius: `${customization.visual.cornerRadius}px`,
            backgroundColor: customization.colors.surface,
            borderColor: customization.colors.border,
            borderWidth: `${customization.layout.borderWidth}px`,
            boxShadow: customization.visual.shadowIntensity === 'medium' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' :
                      customization.visual.shadowIntensity === 'subtle' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
          }}>
            <CardContent className="p-4 flex items-start gap-2">
              {customization.sections.formatting.showSectionIcons && <span className="text-lg flex-shrink-0">📅</span>}
              <div className="flex-1">
                <div style={{ 
                  color: customization.colors.text,
                  fontSize: `${customization.typography.fontSize.header}px`,
                  fontWeight: getFontWeight(customization.typography.fontWeight.header),
                  fontFamily: getFontFamily(customization.typography.sectionFonts.headers),
                  marginBottom: '4px'
                }}>
                  Shoot Date
                </div>
                <div style={{ 
                  fontSize: `${customization.typography.fontSize.body}px`, 
                  color: customization.colors.text,
                  lineHeight: customization.typography.lineHeight.body,
                  fontFamily: getFontFamily(customization.typography.sectionFonts.body),
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
            borderWidth: `${customization.layout.borderWidth}px`,
            boxShadow: customization.visual.shadowIntensity === 'medium' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' :
                      customization.visual.shadowIntensity === 'subtle' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
          }}>
            <CardContent className="p-4 flex items-start gap-2">
              {customization.sections.formatting.showSectionIcons && <span className="text-lg flex-shrink-0">🕐</span>}
              <div className="flex-1">
                <div style={{ 
                  color: customization.colors.text,
                  fontSize: `${customization.typography.fontSize.header}px`,
                  fontWeight: getFontWeight(customization.typography.fontWeight.header),
                  fontFamily: getFontFamily(customization.typography.sectionFonts.headers),
                  marginBottom: '4px'
                }}>
                  Call Time
                </div>
                <div style={{ 
                  fontSize: `${customization.typography.fontSize.body}px`, 
                  color: customization.colors.text,
                  lineHeight: customization.typography.lineHeight.body,
                  fontFamily: getFontFamily(customization.typography.sectionFonts.body),
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
            borderWidth: `${customization.layout.borderWidth}px`,
            boxShadow: customization.visual.shadowIntensity === 'medium' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' :
                      customization.visual.shadowIntensity === 'subtle' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
          }}>
            <CardContent className="p-4 flex items-start gap-2">
              {customization.sections.formatting.showSectionIcons && <span className="text-lg flex-shrink-0">📍</span>}
              <div className="flex-1">
                <div style={{ 
                  color: customization.colors.text,
                  fontSize: `${customization.typography.fontSize.header}px`,
                  fontWeight: getFontWeight(customization.typography.fontWeight.header),
                  fontFamily: getFontFamily(customization.typography.sectionFonts.headers),
                  marginBottom: '4px'
                }}>
                  Location
                </div>
                <div style={{ 
                  fontSize: `${customization.typography.fontSize.body}px`, 
                  color: customization.colors.text,
                  lineHeight: customization.typography.lineHeight.body,
                  fontFamily: getFontFamily(customization.typography.sectionFonts.body),
                  fontWeight: getFontWeight(customization.typography.fontWeight.body)
                }}>
                  {callsheet.location}
                </div>
                {callsheet.locationAddress && (
                  <div style={{ 
                    color: customization.colors.textLight,
                    fontSize: `${customization.typography.fontSize.small}px`,
                    fontFamily: getFontFamily(customization.typography.sectionFonts.body)
                  }}>
                    {callsheet.locationAddress}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <SectionDivider customization={customization} />

        {callsheet.schedule.length > 0 && (
          <ScheduleSection 
            schedule={callsheet.schedule} 
            customization={customization}
          />
        )}

        {callsheet.cast.length > 0 && (
          <ContactSection
            title="CAST"
            contacts={callsheet.cast}
            icon="🎭"
            customization={customization}
            sectionType="cast"
          />
        )}

        {callsheet.crew.length > 0 && (
          <ContactSection
            title="CREW"
            contacts={callsheet.crew}
            icon="🎬"
            customization={customization}
            sectionType="crew"
          />
        )}

        {callsheet.emergencyContacts.length > 0 && (
          <ContactSection
            title="EMERGENCY CONTACTS"
            contacts={callsheet.emergencyContacts}
            icon="⚠️"
            isEmergency={true}
            customization={customization}
            emergencyNumber={emergencyNumber}
            sectionType="emergency"
          />
        )}

        <FooterDisplay customization={customization} />
      </div>
    </>
  );
};
