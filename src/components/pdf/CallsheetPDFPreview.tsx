
import React from 'react';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

interface CallsheetPDFPreviewProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  className?: string;
}

export const CallsheetPDFPreview: React.FC<CallsheetPDFPreviewProps> = ({
  callsheet,
  customization,
  className = ''
}) => {
  const {
    layout,
    typography,
    colors,
    branding,
    visual,
    sections
  } = customization;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFontFamily = () => {
    switch (typography.fontFamily) {
      case 'inter':
        return '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      case 'helvetica':
        return '"Helvetica Neue", Helvetica, Arial, sans-serif';
      case 'poppins':
        return '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      case 'montserrat':
        return '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      default:
        return '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    }
  };

  const getCardStyles = () => {
    const baseStyles: React.CSSProperties = {
      borderRadius: `${visual.cornerRadius}px`,
    };
    
    switch (visual.cardStyle) {
      case 'elevated':
        if (visual.shadowIntensity === 'subtle') {
          baseStyles.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        } else if (visual.shadowIntensity === 'medium') {
          baseStyles.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }
        break;
      case 'bordered':
        baseStyles.border = `1px solid ${colors.border}`;
        break;
      case 'gradient':
        if (colors.gradient) {
          const { from, to, direction } = colors.gradient;
          const gradientDirection = direction === 'to-r' ? 'to right' :
                                  direction === 'to-br' ? 'to bottom right' : 'to bottom';
          baseStyles.background = `linear-gradient(${gradientDirection}, ${from}, ${to})`;
        }
        break;
    }
    
    return baseStyles;
  };

  const getSectionDividerStyles = () => {
    const baseStyles: React.CSSProperties = {};
    
    switch (visual.sectionDividers) {
      case 'line':
        baseStyles.borderBottom = `1px solid ${colors.border}`;
        baseStyles.paddingBottom = '16px';
        baseStyles.marginBottom = '24px';
        break;
      case 'accent':
        baseStyles.borderBottom = `2px solid ${colors.accent}`;
        baseStyles.paddingBottom = '16px';
        baseStyles.marginBottom = '24px';
        break;
      case 'space':
        baseStyles.marginBottom = '32px';
        break;
      default:
        baseStyles.marginBottom = '24px';
        break;
    }
    
    return baseStyles;
  };

  const getHeaderBackgroundStyles = () => {
    const baseStyles: React.CSSProperties = {};
    
    switch (visual.headerBackground) {
      case 'subtle':
        baseStyles.backgroundColor = colors.surface;
        baseStyles.padding = '24px';
        baseStyles.margin = '-32px -32px 32px -32px';
        break;
      case 'solid':
        baseStyles.backgroundColor = colors.primary;
        baseStyles.color = colors.background;
        baseStyles.padding = '24px';
        baseStyles.margin = '-32px -32px 32px -32px';
        break;
      case 'gradient':
        if (colors.gradient) {
          const { from, to, direction } = colors.gradient;
          const gradientDirection = direction === 'to-r' ? 'to right' :
                                  direction === 'to-br' ? 'to bottom right' : 'to bottom';
          baseStyles.background = `linear-gradient(${gradientDirection}, ${from}, ${to})`;
          baseStyles.color = colors.background;
          baseStyles.padding = '24px';
          baseStyles.margin = '-32px -32px 32px -32px';
        }
        break;
    }
    
    return baseStyles;
  };

  const isHeaderCentered = layout.headerStyle === 'minimal' || layout.headerStyle === 'creative';
  const cardStyles = getCardStyles();
  const sectionDividerStyles = getSectionDividerStyles();
  const headerBackgroundStyles = getHeaderBackgroundStyles();

  return (
    <div 
      className={`bg-white text-black min-h-[11in] w-[8.5in] mx-auto p-8 ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: getFontFamily(),
        fontSize: `${typography.fontSize.body}px`,
        lineHeight: typography.lineHeight.body,
        padding: `${layout.margins.top}px`,
      }}
      id="pdf-content"
    >
      {/* Header */}
      <div 
        className={`mb-8 ${isHeaderCentered ? 'text-center' : 'text-left'}`}
        style={headerBackgroundStyles}
      >
        {branding.logo && (
          <div className="mb-4">
            <img 
              src={typeof branding.logo === 'string' ? branding.logo : branding.logo.url} 
              alt="Company Logo" 
              style={{ 
                height: branding.logo && typeof branding.logo === 'object' ? 
                  branding.logo.size === 'small' ? '48px' :
                  branding.logo.size === 'large' ? '80px' : '64px'
                : '64px',
                width: 'auto',
                margin: isHeaderCentered ? '0 auto' : '0',
                display: isHeaderCentered ? 'block' : 'inline-block'
              }}
            />
          </div>
        )}
        <h1 
          style={{ 
            fontFamily: getFontFamily(),
            fontSize: `${typography.fontSize.title}px`,
            fontWeight: typography.fontWeight.title === 'normal' ? 400 : 
                       typography.fontWeight.title === 'medium' ? 500 :
                       typography.fontWeight.title === 'semibold' ? 600 : 700,
            marginBottom: '8px',
            color: headerBackgroundStyles.background || headerBackgroundStyles.color ? 
                   colors.background : colors.primary,
            lineHeight: typography.lineHeight.title
          }}
        >
          {callsheet.projectTitle}
        </h1>
        <h2 
          style={{ 
            fontFamily: getFontFamily(),
            fontSize: `${typography.fontSize.header}px`,
            fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                       typography.fontWeight.header === 'medium' ? 500 :
                       typography.fontWeight.header === 'semibold' ? 600 : 700,
            color: headerBackgroundStyles.background || headerBackgroundStyles.color ? 
                   colors.background : colors.secondary,
            lineHeight: typography.lineHeight.header
          }}
        >
          CALL SHEET
        </h2>
      </div>

      {/* Production Details Grid - moved to top */}
      <div className="grid grid-cols-3 gap-4 mb-6" style={sectionDividerStyles}>
        {/* Shoot Date */}
        <div className="flex items-center" style={{...cardStyles, padding: '12px'}}>
          {sections.formatting.showSectionIcons && <span className="mr-2">📅</span>}
          <div>
            <div 
              style={{
                fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                           typography.fontWeight.header === 'medium' ? 500 :
                           typography.fontWeight.header === 'semibold' ? 600 : 700,
                fontSize: `${typography.fontSize.header}px`
              }}
            >
              Shoot Date
            </div>
            <div style={{ fontSize: `${typography.fontSize.body}px` }}>
              {formatDate(callsheet.shootDate)}
            </div>
          </div>
        </div>
        
        {/* General Call Time */}
        <div className="flex items-center" style={{...cardStyles, padding: '12px'}}>
          {sections.formatting.showSectionIcons && <span className="mr-2">🕐</span>}
          <div>
            <div 
              style={{
                fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                           typography.fontWeight.header === 'medium' ? 500 :
                           typography.fontWeight.header === 'semibold' ? 600 : 700,
                fontSize: `${typography.fontSize.header}px`
              }}
            >
              General Call Time
            </div>
            <div style={{ fontSize: `${typography.fontSize.body}px` }}>
              {callsheet.generalCallTime}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center" style={{...cardStyles, padding: '12px'}}>
          {sections.formatting.showSectionIcons && <span className="mr-2">📍</span>}
          <div>
            <div 
              style={{
                fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                           typography.fontWeight.header === 'medium' ? 500 :
                           typography.fontWeight.header === 'semibold' ? 600 : 700,
                fontSize: `${typography.fontSize.header}px`
              }}
            >
              Location
            </div>
            <div style={{ fontSize: `${typography.fontSize.body}px` }}>
              {callsheet.location}
            </div>
            {callsheet.locationAddress && (
              <div style={{ 
                fontSize: `${typography.fontSize.small}px`, 
                color: colors.textLight 
              }}>
                {callsheet.locationAddress}
              </div>
            )}
          </div>
        </div>

        {/* Weather */}
        {callsheet.weather && sections.visibility.weather && (
          <div className="flex items-center" style={{...cardStyles, padding: '12px'}}>
            {sections.formatting.showSectionIcons && <span className="mr-2">🌤️</span>}
            <div>
              <div 
                style={{
                  fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                             typography.fontWeight.header === 'medium' ? 500 :
                             typography.fontWeight.header === 'semibold' ? 600 : 700,
                  fontSize: `${typography.fontSize.header}px`
                }}
              >
                Weather
              </div>
              <div style={{ fontSize: `${typography.fontSize.body}px` }}>
                {callsheet.weather}
              </div>
            </div>
          </div>
        )}

        {/* Parking Instructions */}
        {callsheet.parkingInstructions && (
          <div className="flex items-center" style={{...cardStyles, padding: '12px'}}>
            {sections.formatting.showSectionIcons && <span className="mr-2">🅿️</span>}
            <div>
              <div 
                style={{
                  fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                             typography.fontWeight.header === 'medium' ? 500 :
                             typography.fontWeight.header === 'semibold' ? 600 : 700,
                  fontSize: `${typography.fontSize.header}px`
                }}
              >
                Parking Instructions
              </div>
              <div style={{ fontSize: `${typography.fontSize.body}px` }}>
                {callsheet.parkingInstructions}
              </div>
            </div>
          </div>
        )}

        {/* Basecamp Location */}
        {callsheet.basecampLocation && (
          <div className="flex items-center" style={{...cardStyles, padding: '12px'}}>
            {sections.formatting.showSectionIcons && <span className="mr-2">🏕️</span>}
            <div>
              <div 
                style={{
                  fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                             typography.fontWeight.header === 'medium' ? 500 :
                             typography.fontWeight.header === 'semibold' ? 600 : 700,
                  fontSize: `${typography.fontSize.header}px`
                }}
              >
                Basecamp Location
              </div>
              <div style={{ fontSize: `${typography.fontSize.body}px` }}>
                {callsheet.basecampLocation}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Special Notes - moved to top but separate from grid */}
      {callsheet.specialNotes && sections.visibility.notes && (
        <div style={{...sectionDividerStyles, ...cardStyles, padding: '16px'}}>
          <h4 
            className={sections.formatting.showSectionIcons ? "flex items-center" : ""}
            style={{
              fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                         typography.fontWeight.header === 'medium' ? 500 :
                         typography.fontWeight.header === 'semibold' ? 600 : 700,
              marginBottom: '12px',
              fontSize: `${typography.fontSize.header}px`,
              color: colors.primary
            }}
          >
            {sections.formatting.showSectionIcons && <span className="mr-2">📝</span>}
            Special Notes
          </h4>
          <p style={{ fontSize: `${typography.fontSize.body}px` }}>
            {callsheet.specialNotes}
          </p>
        </div>
      )}

      {/* Schedule */}
      {callsheet.schedule.length > 0 && sections.visibility.schedule && (
        <div style={sectionDividerStyles}>
          <h3 
            className={sections.formatting.showSectionIcons ? "flex items-center" : ""}
            style={{ 
              fontFamily: getFontFamily(),
              fontSize: `${typography.fontSize.title}px`,
              fontWeight: typography.fontWeight.title === 'normal' ? 400 : 
                         typography.fontWeight.title === 'medium' ? 500 :
                         typography.fontWeight.title === 'semibold' ? 600 : 700,
              marginBottom: '16px',
              color: colors.primary
            }}
          >
            {sections.formatting.showSectionIcons && <span className="mr-2">📋</span>}
            SCHEDULE
          </h3>
          <div style={{...cardStyles, border: `1px solid ${colors.border}`}}>
            <div className="grid grid-cols-5 font-semibold text-sm" style={{ backgroundColor: colors.surface }}>
              <div className="p-2" style={{ borderRight: `1px solid ${colors.border}`, fontSize: `${typography.fontSize.header}px` }}>Scene</div>
              <div className="p-2" style={{ borderRight: `1px solid ${colors.border}`, fontSize: `${typography.fontSize.header}px` }}>Int/Ext</div>
              <div className="p-2" style={{ borderRight: `1px solid ${colors.border}`, fontSize: `${typography.fontSize.header}px` }}>Description</div>
              <div className="p-2" style={{ borderRight: `1px solid ${colors.border}`, fontSize: `${typography.fontSize.header}px` }}>Location</div>
              <div className="p-2" style={{ fontSize: `${typography.fontSize.header}px` }}>Time</div>
            </div>
            {callsheet.schedule.map((item, index) => (
              <div 
                key={item.id} 
                className="grid grid-cols-5"
                style={{ 
                  backgroundColor: sections.formatting.alternateRowColors ? 
                    (index % 2 === 0 ? colors.background : colors.surface) : 
                    colors.background
                }}
              >
                <div className="p-2 font-medium" style={{ borderRight: `1px solid ${colors.border}`, fontSize: `${typography.fontSize.body}px` }}>{item.sceneNumber}</div>
                <div className="p-2" style={{ borderRight: `1px solid ${colors.border}`, fontSize: `${typography.fontSize.body}px` }}>{item.intExt}</div>
                <div className="p-2" style={{ borderRight: `1px solid ${colors.border}`, fontSize: `${typography.fontSize.body}px` }}>{item.description}</div>
                <div className="p-2" style={{ borderRight: `1px solid ${colors.border}`, fontSize: `${typography.fontSize.body}px` }}>{item.location}</div>
                <div className="p-2" style={{ fontSize: `${typography.fontSize.body}px` }}>{item.estimatedTime}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cast */}
      {callsheet.cast.length > 0 && (
        <div style={sectionDividerStyles}>
          <h3 
            className={sections.formatting.showSectionIcons ? "flex items-center" : ""}
            style={{ 
              fontFamily: getFontFamily(),
              fontSize: `${typography.fontSize.title}px`,
              fontWeight: typography.fontWeight.title === 'normal' ? 400 : 
                         typography.fontWeight.title === 'medium' ? 500 :
                         typography.fontWeight.title === 'sebibold' ? 600 : 700,
              marginBottom: '16px',
              color: colors.primary
            }}
          >
            {sections.formatting.showSectionIcons && <span className="mr-2">🎭</span>}
            CAST
          </h3>
          <div 
            className="grid gap-4"
            style={{ 
              gridTemplateColumns: sections.formatting.contactLayout === 'compact' ? 
                'repeat(3, 1fr)' : 'repeat(2, 1fr)'
            }}
          >
            {callsheet.cast.map((member) => (
              <div 
                key={member.id} 
                style={{
                  ...cardStyles, 
                  padding: '12px',
                  border: `1px solid ${colors.border}`
                }}
              >
                <div 
                  style={{
                    fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                               typography.fontWeight.header === 'medium' ? 500 :
                               typography.fontWeight.header === 'semibold' ? 600 : 700,
                    fontSize: `${typography.fontSize.body}px`
                  }}
                >
                  {member.name}
                </div>
                {member.character && (
                  <div style={{ 
                    fontSize: `${typography.fontSize.small}px`, 
                    color: colors.textLight,
                    marginBottom: '4px'
                  }}>
                    as {member.character}
                  </div>
                )}
                <div style={{ fontSize: `${typography.fontSize.small}px`, marginBottom: '4px' }}>
                  {sections.formatting.showSectionIcons && '📞 '}
                  {member.phone}
                </div>
                <div style={{ fontSize: `${typography.fontSize.small}px` }}>
                  {sections.formatting.showSectionIcons && '📧 '}
                  {member.email}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew */}
      {callsheet.crew.length > 0 && (
        <div style={sectionDividerStyles}>
          <h3 
            className={sections.formatting.showSectionIcons ? "flex items-center" : ""}
            style={{ 
              fontFamily: getFontFamily(),
              fontSize: `${typography.fontSize.title}px`,
              fontWeight: typography.fontWeight.title === 'normal' ? 400 : 
                         typography.fontWeight.title === 'medium' ? 500 :
                         typography.fontWeight.title === 'semibold' ? 600 : 700,
              marginBottom: '16px',
              color: colors.primary
            }}
          >
            {sections.formatting.showSectionIcons && <span className="mr-2">🎬</span>}
            CREW
          </h3>
          <div 
            className="grid gap-4"
            style={{ 
              gridTemplateColumns: sections.formatting.contactLayout === 'compact' ? 
                'repeat(3, 1fr)' : 'repeat(2, 1fr)'
            }}
          >
            {callsheet.crew.map((member) => (
              <div 
                key={member.id} 
                style={{
                  ...cardStyles, 
                  padding: '12px',
                  border: `1px solid ${colors.border}`
                }}
              >
                <div 
                  style={{
                    fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                               typography.fontWeight.header === 'medium' ? 500 :
                               typography.fontWeight.header === 'semibold' ? 600 : 700,
                    fontSize: `${typography.fontSize.body}px`
                  }}
                >
                  {member.name}
                </div>
                <div style={{ 
                  fontSize: `${typography.fontSize.small}px`, 
                  color: colors.textLight,
                  marginBottom: '4px'
                }}>
                  {member.role}
                </div>
                <div style={{ fontSize: `${typography.fontSize.small}px`, marginBottom: '4px' }}>
                  {sections.formatting.showSectionIcons && '📞 '}
                  {member.phone}
                </div>
                <div style={{ fontSize: `${typography.fontSize.small}px` }}>
                  {sections.formatting.showSectionIcons && '📧 '}
                  {member.email}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      {callsheet.emergencyContacts.length > 0 && sections.visibility.emergencyContacts && (
        <div style={sectionDividerStyles}>
          <h3 
            className={sections.formatting.showSectionIcons ? "flex items-center" : ""}
            style={{ 
              fontFamily: getFontFamily(),
              fontSize: `${typography.fontSize.title}px`,
              fontWeight: typography.fontWeight.title === 'normal' ? 400 : 
                         typography.fontWeight.title === 'medium' ? 500 :
                         typography.fontWeight.title === 'semibold' ? 600 : 700,
              marginBottom: '16px',
              color: sections.formatting.emergencyProminent ? '#dc2626' : colors.primary
            }}
          >
            {sections.formatting.showSectionIcons && <span className="mr-2">⚠️</span>}
            EMERGENCY CONTACTS
          </h3>
          <div 
            className="grid gap-4"
            style={{ 
              gridTemplateColumns: sections.formatting.contactLayout === 'compact' ? 
                'repeat(3, 1fr)' : 'repeat(2, 1fr)'
            }}
          >
            {callsheet.emergencyContacts.map((contact) => (
              <div 
                key={contact.id} 
                style={{
                  ...cardStyles, 
                  padding: '12px',
                  border: sections.formatting.emergencyProminent ? 
                    '2px solid #fca5a5' : `1px solid ${colors.border}`,
                  backgroundColor: sections.formatting.emergencyProminent ? 
                    '#fef2f2' : colors.surface
                }}
              >
                <div 
                  style={{
                    fontWeight: typography.fontWeight.header === 'normal' ? 400 : 
                               typography.fontWeight.header === 'medium' ? 500 :
                               typography.fontWeight.header === 'semibold' ? 600 : 700,
                    fontSize: `${typography.fontSize.body}px`
                  }}
                >
                  {contact.name}
                </div>
                <div style={{ 
                  fontSize: `${typography.fontSize.small}px`, 
                  color: colors.textLight,
                  marginBottom: '4px'
                }}>
                  {contact.role}
                </div>
                <div style={{ fontSize: `${typography.fontSize.small}px`, fontWeight: 500 }}>
                  {sections.formatting.showSectionIcons && '📞 '}
                  {contact.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {branding.footer?.text && (
        <div 
          style={{
            marginTop: '32px',
            paddingTop: '16px',
            borderTop: `1px solid ${colors.border}`,
            textAlign: branding.footer.position,
            fontSize: `${typography.fontSize.small}px`,
            color: colors.textLight
          }}
        >
          {branding.footer.text}
        </div>
      )}
    </div>
  );
};
