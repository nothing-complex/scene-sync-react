import React from 'react';
import { CallsheetData } from '@/types/callsheet';
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
  const isLandscape = customization.layout.pageOrientation === 'landscape';
  
  // Add option to show/hide icons - default to off to prevent rendering issues
  const showIcons = customization.sections.formatting.showSectionIcons;
  
  // Enhanced font family mapping to ensure consistency between preview and generated PDF
  const getFontFamily = (fontName: string): string => {
    const fontMap: Record<string, string> = {
      'inter': 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'helvetica': 'Helvetica, "Helvetica Neue", Arial, sans-serif',
      'poppins': 'Poppins, system-ui, -apple-system, sans-serif',
      'montserrat': 'Montserrat, system-ui, -apple-system, sans-serif',
      'roboto': 'Roboto, system-ui, -apple-system, sans-serif',
      'open-sans': '"Open Sans", system-ui, -apple-system, sans-serif',
      'lato': 'Lato, system-ui, -apple-system, sans-serif',
      'source-sans': '"Source Sans Pro", system-ui, -apple-system, sans-serif',
      'nunito': 'Nunito, system-ui, -apple-system, sans-serif',
      'raleway': 'Raleway, system-ui, -apple-system, sans-serif',
      'work-sans': '"Work Sans", system-ui, -apple-system, sans-serif',
      'playfair': '"Playfair Display", Georgia, serif',
      'merriweather': 'Merriweather, Georgia, serif',
      'crimson': '"Crimson Text", Georgia, serif',
      'libre-baskerville': '"Libre Baskerville", Georgia, serif',
      'pt-serif': '"PT Serif", Georgia, serif'
    };
    return fontMap[fontName] || fontMap['inter'];
  };
  
  // Fixed page container for A4 dimensions with proper multi-page support
  const pageContainerStyle: React.CSSProperties = {
    width: isLandscape ? '1123px' : '794px', // A4 size in pixels at 96 DPI
    height: isLandscape ? '794px' : '1123px', // Fixed height for consistent layout
    backgroundColor: customization.colors.background || '#ffffff',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden', // Ensure content doesn't overflow page bounds
    fontFamily: getFontFamily(customization.typography.fontFamily),
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.typography.lineHeight.body,
    color: customization.colors.text,
    display: 'block'
  };

  // Content area within the page margins
  const contentAreaStyle: React.CSSProperties = {
    position: 'relative',
    margin: `${customization.layout.margins.top}px ${customization.layout.margins.right}px ${customization.layout.margins.bottom}px ${customization.layout.margins.left}px`,
    width: `calc(100% - ${customization.layout.margins.left + customization.layout.margins.right}px)`,
    height: `calc(100% - ${customization.layout.margins.top + customization.layout.margins.bottom}px)`,
    backgroundColor: 'transparent',
    fontFamily: getFontFamily(customization.typography.fontFamily),
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.layout.spacing.lineHeight || customization.typography.lineHeight.body,
    color: customization.colors.text,
    padding: 0,
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  // Logo positioning helper - simplified to only top positions
  const getLogoPosition = (position: string) => {
    const baseOffset = 16;
    switch (position) {
      case 'top-left':
        return { top: `${baseOffset}px`, left: `${baseOffset}px` };
      case 'top-right':
        return { top: `${baseOffset}px`, right: `${baseOffset}px` };
      default:
        return { top: `${baseOffset}px`, left: `${baseOffset}px` };
    }
  };

  // Logo size helper
  const getLogoSize = (size: string) => {
    switch (size) {
      case 'small':
        return { width: '40px', height: '40px' };
      case 'medium':
        return { width: '60px', height: '60px' };
      case 'large':
        return { width: '80px', height: '80px' };
      default:
        return { width: '60px', height: '60px' };
    }
  };

  return (
    <div 
      className={`callsheet-pdf-preview ${className}`}
      style={pageContainerStyle}
    >
      {/* CSS for consistent styling and page break prevention */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .pdf-section {
            margin-bottom: ${customization.layout.spacing.sectionGap}px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .pdf-section-item {
            margin-bottom: ${customization.layout.spacing.itemGap}px;
          }
          .contact-card {
            margin-bottom: ${customization.layout.spacing.cardSpacing}px;
            line-height: ${customization.layout.spacing.lineHeight || customization.typography.lineHeight.body};
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        `
      }} />

      <div style={contentAreaStyle}>
        {/* Logos - positioned relative to content area */}
        {customization.branding?.logo && (
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              opacity: customization.branding.logo.opacity || 1,
              ...getLogoPosition(customization.branding.logo.position),
              ...getLogoSize(customization.branding.logo.size)
            }}
          >
            <img
              src={customization.branding.logo.url}
              alt="Company Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {customization.branding?.secondaryLogo && (
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              opacity: customization.branding.secondaryLogo.opacity || 1,
              ...getLogoPosition(customization.branding.secondaryLogo.position),
              ...getLogoSize(customization.branding.secondaryLogo.size)
            }}
          >
            <img
              src={customization.branding.secondaryLogo.url}
              alt="Secondary Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {/* Watermark positioned properly */}
        {customization.branding?.watermark?.text && (
          <div
            className="pdf-watermark"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: customization.branding.watermark.position === 'diagonal' 
                ? 'translate(-50%, -50%) rotate(-45deg)' 
                : 'translate(-50%, -50%)',
              fontSize: '48px',
              fontWeight: 'bold',
              color: customization.colors.primary || '#999999',
              opacity: Math.min(customization.branding.watermark.opacity || 0.15, 0.5),
              zIndex: 1,
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              fontFamily: getFontFamily(customization.typography.fontFamily),
              textAlign: 'center'
            }}
          >
            {customization.branding.watermark.text}
          </div>
        )}

        {/* Main content container with simplified styling for consistent rendering */}
        <div style={{ 
          padding: '20px',
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent',
          height: 'calc(100% - 40px)',
          overflow: 'hidden',
          // Simplified styling to prevent rendering issues
          ...(customization.visual.cardStyle === 'bordered' && {
            border: `1px solid ${customization.colors.border}`
          })
        }}>
          {/* Header Section */}
          <div className="pdf-header avoid-break" style={{ 
            marginBottom: `${customization.layout.spacing.sectionGap + 8}px`,
            paddingTop: customization.branding?.logo?.position?.includes('top') ? '80px' : '0'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: customization.layout.headerAlignment === 'center' ? 'center' : 
                            customization.layout.headerAlignment === 'right' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '20px',
              textAlign: customization.layout.headerAlignment
            }}>
              <div style={{ 
                flex: customization.layout.headerAlignment === 'center' ? 'none' : '1', 
                minWidth: '200px',
                textAlign: customization.layout.headerAlignment
              }}>
                <h1 style={{
                  fontSize: `${customization.typography.fontSize.title}px`,
                  fontWeight: customization.typography.fontWeight.title,
                  // Ensure title text is never white-on-white, use primary color for contrast
                  color: customization.colors.titleText === '#ffffff' && customization.colors.background === '#ffffff' 
                    ? customization.colors.primary : customization.colors.titleText,
                  margin: '0 0 12px 0',
                  lineHeight: customization.typography.lineHeight.title,
                  fontFamily: getFontFamily(customization.typography.sectionFonts.title || customization.typography.fontFamily)
                }}>
                  {callsheet.projectTitle || 'Untitled Project'}
                </h1>
                <p style={{
                  fontSize: `${customization.typography.fontSize.body}px`,
                  // Ensure subtitle is visible
                  color: customization.colors.textLight === '#ffffff' && customization.colors.background === '#ffffff' 
                    ? customization.colors.secondary : customization.colors.textLight,
                  margin: 0,
                  fontWeight: 'normal',
                  fontFamily: getFontFamily(customization.typography.sectionFonts.body || customization.typography.fontFamily)
                }}>
                  CALL SHEET
                </p>
              </div>
              
              {(customization.branding?.companyName || customization.branding?.productionCompany || customization.branding?.customText1 || customization.branding?.customText2 || customization.branding?.customText3) && (
                <div style={{
                  fontSize: `${customization.typography.fontSize.header}px`,
                  fontWeight: customization.typography.fontWeight.header,
                  // Ensure company information text is visible
                  color: customization.colors.headerText === '#ffffff' && customization.colors.background === '#ffffff' 
                    ? customization.colors.primary : customization.colors.headerText,
                  textAlign: customization.layout.headerAlignment === 'center' ? 'center' : 
                           customization.layout.headerAlignment === 'left' ? 'left' : 'right',
                  lineHeight: customization.typography.lineHeight.header,
                  fontFamily: getFontFamily(customization.typography.sectionFonts.headers || customization.typography.fontFamily)
                }}>
                  {customization.branding?.companyName && (
                    <div style={{ marginBottom: '4px' }}>{customization.branding.companyName}</div>
                  )}
                  {customization.branding?.productionCompany && (
                    <div style={{ marginBottom: '4px', fontSize: `${customization.typography.fontSize.small}px` }}>
                      {customization.branding.productionCompany}
                    </div>
                  )}
                  {customization.branding?.customText1 && (
                    <div style={{ marginBottom: '2px', fontSize: `${customization.typography.fontSize.small}px` }}>
                      {customization.branding.customText1}
                    </div>
                  )}
                  {customization.branding?.customText2 && (
                    <div style={{ marginBottom: '2px', fontSize: `${customization.typography.fontSize.small}px` }}>
                      {customization.branding.customText2}
                    </div>
                  )}
                  {customization.branding?.customText3 && (
                    <div style={{ fontSize: `${customization.typography.fontSize.small}px` }}>
                      {customization.branding.customText3}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Basic Info Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isLandscape ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div>
                <div style={{
                  fontSize: `${customization.typography.fontSize.small}px`,
                  color: customization.colors.textLight,
                  marginBottom: '8px',
                  fontWeight: 'medium'
                }}>
                  Shoot Date
                </div>
                <div style={{
                  fontSize: `${customization.typography.fontSize.body}px`,
                  color: customization.colors.text
                }}>
                  {callsheet.shootDate || 'TBD'}
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: `${customization.typography.fontSize.small}px`,
                  color: customization.colors.textLight,
                  marginBottom: '8px',
                  fontWeight: 'medium'
                }}>
                  Call Time
                </div>
                <div style={{
                  fontSize: `${customization.typography.fontSize.body}px`,
                  color: customization.colors.text
                }}>
                  {callsheet.generalCallTime || 'TBD'}
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: `${customization.typography.fontSize.small}px`,
                  color: customization.colors.textLight,
                  marginBottom: '8px',
                  fontWeight: 'medium'
                }}>
                  Location
                </div>
                <div style={{
                  fontSize: `${customization.typography.fontSize.body}px`,
                  color: customization.colors.text
                }}>
                  {callsheet.location || 'TBD'}
                </div>
                {callsheet.locationAddress && (
                  <div style={{
                    fontSize: `${customization.typography.fontSize.small}px`,
                    color: customization.colors.textLight,
                    marginTop: '4px'
                  }}>
                    {callsheet.locationAddress}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          {(callsheet.cast && callsheet.cast.length > 0) && customization.sections.visibility.companyInfo && (
            <div className="pdf-section avoid-break">
              <h2 style={{
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: customization.typography.fontWeight.header,
                color: customization.colors.text,
                marginBottom: `${customization.layout.spacing.itemGap}px`,
                borderBottom: customization.visual.sectionDividers === 'line' ? `1px solid ${customization.colors.border}` : 'none',
                paddingBottom: customization.visual.sectionDividers === 'line' ? '8px' : '0'
              }}>
                {showIcons && '👥 '}Cast & Crew
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: `${customization.layout.spacing.cardSpacing}px`
              }}>
                {callsheet.cast.map((contact, index) => (
                  <div key={index} className="contact-card avoid-break" style={{
                    padding: '12px',
                    border: `1px solid ${customization.colors.border}`,
                    borderRadius: `${customization.visual.cornerRadius}px`
                  }}>
                    <div style={{
                      fontSize: `${customization.typography.fontSize.body}px`,
                      fontWeight: 'bold',
                      color: customization.colors.text,
                      marginBottom: '4px'
                    }}>
                      {contact.name}
                    </div>
                    {contact.role && (
                      <div style={{
                        fontSize: `${customization.typography.fontSize.small}px`,
                        color: customization.colors.textLight,
                        marginBottom: '2px'
                      }}>
                        {contact.role}
                      </div>
                    )}
                    {contact.character && (
                      <div style={{
                        fontSize: `${customization.typography.fontSize.small}px`,
                        color: customization.colors.textLight,
                        marginBottom: '4px'
                      }}>
                        as {contact.character}
                      </div>
                    )}
                    <div style={{
                      fontSize: `${customization.typography.fontSize.small}px`,
                      color: customization.colors.text
                    }}>
                      {contact.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Section */}
          {(callsheet.schedule && callsheet.schedule.length > 0) && customization.sections.visibility.schedule && (
            <div className="pdf-section">
              <h2 style={{
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: customization.typography.fontWeight.header,
                color: customization.colors.text,
                marginBottom: `${customization.layout.spacing.itemGap}px`,
                borderBottom: customization.visual.sectionDividers === 'line' ? `1px solid ${customization.colors.border}` : 'none',
                paddingBottom: customization.visual.sectionDividers === 'line' ? '8px' : '0'
              }}>
                {showIcons && '📅 '}Schedule
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {callsheet.schedule.map((item, index) => (
                  <div key={index} className="schedule-row avoid-break" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderBottom: `1px solid ${customization.colors.border}`,
                    backgroundColor: customization.sections.formatting.alternateRowColors && index % 2 === 1 ? 
                      customization.colors.surface : 'transparent'
                  }}>
                    <div style={{
                      fontSize: `${customization.typography.fontSize.body}px`,
                      fontWeight: 'bold',
                      color: customization.colors.text,
                      minWidth: '80px',
                      marginRight: '16px'
                    }}>
                      {item.estimatedTime}
                    </div>
                    <div style={{
                      fontSize: `${customization.typography.fontSize.body}px`,
                      color: customization.colors.text,
                      flex: 1
                    }}>
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contacts */}
          {(callsheet.emergencyContacts && callsheet.emergencyContacts.length > 0) && customization.sections.visibility.emergencyContacts && (
            <div className="pdf-section">
              <h2 style={{
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: customization.typography.fontWeight.header,
                color: customization.colors.text,
                marginBottom: `${customization.layout.spacing.itemGap}px`,
                borderBottom: customization.visual.sectionDividers === 'line' ? `1px solid ${customization.colors.border}` : 'none',
                paddingBottom: customization.visual.sectionDividers === 'line' ? '8px' : '0'
              }}>
                {showIcons && '🚨 '}Emergency Contacts
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {callsheet.emergencyContacts.map((contact, index) => (
                  <div key={index} className="emergency-contact avoid-break" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    border: `1px solid ${customization.colors.primary}`,
                    borderRadius: `${customization.visual.cornerRadius}px`,
                    backgroundColor: customization.sections.formatting.emergencyProminent ? 
                      `${customization.colors.primary}20` : 'transparent'
                  }}>
                    <div>
                      <div style={{
                        fontSize: `${customization.typography.fontSize.body}px`,
                        fontWeight: 'bold',
                        color: customization.colors.text
                      }}>
                        {contact.name}
                      </div>
                      {contact.role && (
                        <div style={{
                          fontSize: `${customization.typography.fontSize.small}px`,
                          color: customization.colors.textLight
                        }}>
                          {contact.role}
                        </div>
                      )}
                    </div>
                    <div style={{
                      fontSize: `${customization.typography.fontSize.body}px`,
                      color: customization.colors.text,
                      fontWeight: 'bold'
                    }}>
                      {contact.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Notes */}
          {callsheet.specialNotes && customization.sections.visibility.notes && (
            <div className="pdf-section">
              <h2 style={{
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: customization.typography.fontWeight.header,
                color: customization.colors.text,
                marginBottom: `${customization.layout.spacing.itemGap}px`,
                borderBottom: customization.visual.sectionDividers === 'line' ? `1px solid ${customization.colors.border}` : 'none',
                paddingBottom: customization.visual.sectionDividers === 'line' ? '8px' : '0'
              }}>
                {showIcons && '📝 '}Special Notes
              </h2>
              
              <div style={{
                border: `1px solid ${customization.colors.border}`,
                borderRadius: `${customization.visual.cornerRadius}px`,
                padding: '16px',
                backgroundColor: customization.colors.surface || 'transparent'
              }}>
                <div style={{
                  fontSize: `${customization.typography.fontSize.body}px`,
                  color: customization.colors.text,
                  lineHeight: customization.typography.lineHeight.body,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {callsheet.specialNotes}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - positioned at the bottom */}
        {customization.branding?.footer?.text && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: customization.branding.footer.position === 'left' ? '20px' : 
                  customization.branding.footer.position === 'right' ? 'auto' : '50%',
            right: customization.branding.footer.position === 'right' ? '20px' : 'auto',
            transform: customization.branding.footer.position === 'center' ? 'translateX(-50%)' : 'none',
            fontSize: `${customization.typography.fontSize.small}px`,
            color: customization.colors.textLight,
            textAlign: customization.branding.footer.position as any,
            padding: customization.branding.footer.style === 'bordered' ? '8px 12px' : '4px 0',
            border: customization.branding.footer.style === 'bordered' ? `1px solid ${customization.colors.border}` : 'none',
            borderRadius: customization.branding.footer.style === 'bordered' ? `${customization.visual.cornerRadius}px` : '0',
            backgroundColor: customization.branding.footer.style === 'accent' ? customization.colors.accent : 'transparent',
            zIndex: 10
          }}>
            {customization.branding.footer.text}
            {customization.branding.footer.unionCompliance && (
              <span style={{ display: 'block', marginTop: '4px', fontSize: '10px' }}>
                This production complies with all applicable union regulations and safety standards.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};