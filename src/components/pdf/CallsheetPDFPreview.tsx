
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
  const isLandscape = customization.layout.pageOrientation === 'landscape';
  
  // Page container - represents the full page including margins
  const pageContainerStyle: React.CSSProperties = {
    width: isLandscape ? '297mm' : '210mm',
    minHeight: isLandscape ? '210mm' : '297mm',
    height: 'auto',
    backgroundColor: '#ffffff',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'visible'
  };

  // Content area - the actual printable area with margins applied
  const contentAreaStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${customization.layout.margins.top}px`,
    left: `${customization.layout.margins.left}px`,
    right: `${customization.layout.margins.right}px`,
    bottom: `${customization.layout.margins.bottom + 40}px`, // Extra space for footer
    width: `calc(100% - ${customization.layout.margins.left + customization.layout.margins.right}px)`,
    minHeight: `calc(100% - ${customization.layout.margins.top + customization.layout.margins.bottom + 40}px)`,
    backgroundColor: customization.colors.background || '#ffffff',
    fontFamily: `${customization.typography.fontFamily}, system-ui, -apple-system, sans-serif`,
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.typography.lineHeight.body,
    color: customization.colors.text,
    padding: 0,
    boxSizing: 'border-box',
    overflow: 'visible'
  };

  // Logo positioning helper
  const getLogoPosition = (position: string) => {
    const baseOffset = 16;
    switch (position) {
      case 'top-left':
        return { top: `${baseOffset}px`, left: `${baseOffset}px` };
      case 'top-center':
        return { top: `${baseOffset}px`, left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { top: `${baseOffset}px`, right: `${baseOffset}px` };
      case 'center-left':
        return { top: '50%', left: `${baseOffset}px`, transform: 'translateY(-50%)' };
      case 'center-right':
        return { top: '50%', right: `${baseOffset}px`, transform: 'translateY(-50%)' };
      case 'bottom-left':
        return { bottom: `${baseOffset + 40}px`, left: `${baseOffset}px` }; // Account for footer space
      case 'bottom-center':
        return { bottom: `${baseOffset + 40}px`, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { bottom: `${baseOffset + 40}px`, right: `${baseOffset}px` };
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
      {/* CSS for page break prevention and proper spacing */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .callsheet-pdf-preview {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .pdf-section {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: ${customization.layout.spacing.sectionGap + 12}px;
            orphans: 3;
            widows: 3;
          }
          .pdf-section-item {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: ${customization.layout.spacing.itemGap + 8}px;
            orphans: 2;
            widows: 2;
          }
          .pdf-header {
            page-break-inside: avoid;
            break-inside: avoid;
            page-break-after: avoid;
            break-after: avoid;
          }
          .contact-card {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 16px;
          }
          .schedule-row {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .emergency-contact {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        `
      }} />

      {/* Content area - positioned within margins */}
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

        {/* Watermark */}
        {customization.branding?.watermark && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: customization.branding.watermark.position === 'diagonal' 
                ? 'translate(-50%, -50%) rotate(-45deg)' 
                : 'translate(-50%, -50%)',
              fontSize: '48px',
              fontWeight: 'bold',
              color: customization.colors.textLight,
              opacity: customization.branding.watermark.opacity || 0.1,
              zIndex: 1,
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          >
            {customization.branding.watermark.text}
          </div>
        )}

        {/* Main content container */}
        <div style={{ 
          padding: '20px',
          position: 'relative',
          zIndex: 2,
          borderRadius: `${customization.visual.cornerRadius}px`
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
                  color: customization.colors.titleText,
                  margin: '0 0 12px 0',
                  lineHeight: customization.typography.lineHeight.title,
                  fontFamily: customization.typography.sectionFonts.title
                }}>
                  {callsheet.projectTitle || 'Untitled Project'}
                </h1>
                <p style={{
                  fontSize: `${customization.typography.fontSize.body}px`,
                  color: customization.colors.textLight,
                  margin: 0,
                  fontWeight: 'normal'
                }}>
                  CALL SHEET
                </p>
              </div>
              
              {customization.branding?.companyName && !customization.branding?.logo && (
                <div style={{
                  fontSize: `${customization.typography.fontSize.header}px`,
                  fontWeight: customization.typography.fontWeight.header,
                  color: customization.colors.headerText,
                  textAlign: 'right'
                }}>
                  {customization.branding.companyName}
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

          {/* Schedule Section */}
          {callsheet.schedule && callsheet.schedule.length > 0 && (
            <div className="pdf-section avoid-break">
              <h2 style={{
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: customization.typography.fontWeight.header,
                color: customization.colors.scheduleSectionColor,
                margin: `0 0 ${customization.layout.spacing.itemGap + 8}px 0`,
                borderBottom: `1px solid ${customization.colors.border}`,
                paddingBottom: '12px',
                fontFamily: customization.typography.sectionFonts.headers,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {customization.sections.formatting.showSectionIcons && (
                  <span style={{ fontSize: '16px' }}>📅</span>
                )}
                SCHEDULE
              </h2>
              
              <div style={{
                backgroundColor: customization.colors.scheduleBackground,
                border: `1px solid ${customization.colors.scheduleBorder}`,
                borderRadius: `${customization.visual.cornerRadius}px`,
                overflow: 'hidden'
              }}>
                {/* Schedule Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 80px 1fr 120px 80px',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: customization.colors.scheduleRowAlternate,
                  borderBottom: `1px solid ${customization.colors.scheduleBorder}`,
                  fontSize: `${customization.typography.fontSize.small}px`,
                  fontWeight: 'medium',
                  color: customization.colors.scheduleHeaderText
                }}>
                  <div>Scene</div>
                  <div>Int/Ext</div>
                  <div>Description</div>
                  <div>Time</div>
                  <div>Pages</div>
                </div>
                
                {/* Schedule Rows */}
                {callsheet.schedule.map((item, index) => (
                  <div
                    key={index}
                    className="schedule-row avoid-break"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 80px 1fr 120px 80px',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: index % 2 === 0 ? customization.colors.scheduleRowBackground : customization.colors.scheduleRowAlternate,
                      borderBottom: index < callsheet.schedule.length - 1 ? `1px solid ${customization.colors.scheduleBorder}` : 'none',
                      fontSize: `${customization.typography.fontSize.body}px`,
                      color: customization.colors.scheduleBodyText
                    }}
                  >
                    <div style={{ fontWeight: 'medium' }}>{item.sceneNumber}</div>
                    <div>{item.intExt}</div>
                    <div style={{ wordBreak: 'break-word' }}>{item.description}</div>
                    <div>{item.estimatedTime}</div>
                    <div>{item.pageCount}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cast Section */}
          {callsheet.cast && callsheet.cast.length > 0 && (
            <div className="pdf-section avoid-break">
              <h2 style={{
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: customization.typography.fontWeight.header,
                color: customization.colors.castSectionColor,
                margin: `0 0 ${customization.layout.spacing.itemGap + 8}px 0`,
                borderBottom: `1px solid ${customization.colors.border}`,
                paddingBottom: '12px',
                fontFamily: customization.typography.sectionFonts.headers,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {customization.sections.formatting.showSectionIcons && (
                  <span style={{ fontSize: '16px' }}>🎭</span>
                )}
                CAST
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isLandscape ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                gap: `${customization.layout.spacing.itemGap + 8}px`
              }}>
                {callsheet.cast.map((member, index) => (
                  <div
                    key={index}
                    className="contact-card avoid-break"
                     style={{
                       backgroundColor: customization.colors.contactCardBackground,
                       border: `${customization.layout.borderWidth}px solid ${customization.colors.contactCardBorder}`,
                       borderRadius: `${customization.visual.cornerRadius}px`,
                       padding: '18px',
                       boxShadow: customization.visual.shadowIntensity === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                                 customization.visual.shadowIntensity === 'subtle' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                     }}
                  >
                    <div style={{
                      fontSize: `${customization.typography.fontSize.body}px`,
                      fontWeight: 'medium',
                      color: customization.colors.contactNameText,
                      marginBottom: '8px'
                    }}>
                      {member.name}
                    </div>
                    {member.character && (
                      <div style={{
                        fontSize: `${customization.typography.fontSize.small}px`,
                        color: customization.colors.contactRoleText,
                        marginBottom: '12px'
                      }}>
                        as {member.character}
                      </div>
                    )}
                    <div style={{ fontSize: `${customization.typography.fontSize.small}px`, color: customization.colors.contactDetailsText }}>
                      {member.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <span>📞 {member.phone}</span>
                        </div>
                      )}
                      {member.email && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>📧 {member.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crew Section */}
          {callsheet.crew && callsheet.crew.length > 0 && (
            <div className="pdf-section avoid-break">
              <h2 style={{
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: customization.typography.fontWeight.header,
                color: customization.colors.crewSectionColor,
                margin: `0 0 ${customization.layout.spacing.itemGap + 8}px 0`,
                borderBottom: `1px solid ${customization.colors.border}`,
                paddingBottom: '12px',
                fontFamily: customization.typography.sectionFonts.headers,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {customization.sections.formatting.showSectionIcons && (
                  <span style={{ fontSize: '16px' }}>🎬</span>
                )}
                CREW
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isLandscape ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
                gap: `${customization.layout.spacing.itemGap + 8}px`
              }}>
                {callsheet.crew.map((member, index) => (
                  <div
                    key={index}
                    className="contact-card avoid-break"
                     style={{
                       backgroundColor: customization.colors.contactCardBackground,
                       border: `${customization.layout.borderWidth}px solid ${customization.colors.contactCardBorder}`,
                       borderRadius: `${customization.visual.cornerRadius}px`,
                       padding: '18px',
                       boxShadow: customization.visual.shadowIntensity === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                                 customization.visual.shadowIntensity === 'subtle' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                     }}
                  >
                    <div style={{
                      fontSize: `${customization.typography.fontSize.body}px`,
                      fontWeight: 'medium',
                      color: customization.colors.contactNameText,
                      marginBottom: '8px'
                    }}>
                      {member.name}
                    </div>
                    <div style={{
                      fontSize: `${customization.typography.fontSize.small}px`,
                      color: customization.colors.contactRoleText,
                      marginBottom: '12px'
                    }}>
                      {member.role}
                    </div>
                    <div style={{ fontSize: `${customization.typography.fontSize.small}px`, color: customization.colors.contactDetailsText }}>
                      {member.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <span>📞 {member.phone}</span>
                        </div>
                      )}
                      {member.email && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>📧 {member.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contacts */}
          {callsheet.emergencyContacts && callsheet.emergencyContacts.length > 0 && (
            <div className="pdf-section avoid-break">
              <h2 style={{
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: customization.typography.fontWeight.header,
                color: customization.colors.emergencySectionColor,
                margin: `0 0 ${customization.layout.spacing.itemGap + 8}px 0`,
                borderBottom: `2px solid ${customization.colors.emergencySectionColor}`,
                paddingBottom: '12px',
                fontFamily: customization.typography.sectionFonts.headers,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {customization.sections.formatting.showSectionIcons && (
                  <span style={{ fontSize: '16px' }}>🚨</span>
                )}
                EMERGENCY CONTACTS
              </h2>
              
              <div style={{
                backgroundColor: customization.colors.emergencyBackground,
                border: `2px solid ${customization.colors.emergencyBorder}`,
                borderRadius: `${customization.visual.cornerRadius}px`,
                padding: '24px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isLandscape ? 'repeat(2, 1fr)' : '1fr',
                  gap: `${customization.layout.spacing.itemGap + 8}px`
                }}>
                  {callsheet.emergencyContacts.map((contact, index) => (
                    <div key={index} className="emergency-contact avoid-break">
                      <div style={{
                        fontSize: `${customization.typography.fontSize.body}px`,
                        fontWeight: 'bold',
                        color: customization.colors.emergencyText,
                        marginBottom: '8px'
                      }}>
                        {contact.name}
                      </div>
                      <div style={{
                        fontSize: `${customization.typography.fontSize.small}px`,
                        color: customization.colors.emergencyText,
                        marginBottom: '12px'
                      }}>
                        {contact.role}
                      </div>
                      <div style={{
                        fontSize: `${customization.typography.fontSize.body}px`,
                        color: customization.colors.emergencyText,
                        fontWeight: 'medium'
                      }}>
                        📞 {contact.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes Section */}
          {callsheet.specialNotes && (
            <div className="pdf-section avoid-break">
              <h2 style={{
                fontSize: `${customization.typography.fontSize.header}px`,
                fontWeight: customization.typography.fontWeight.header,
                color: customization.colors.notesSectionColor,
                margin: `0 0 ${customization.layout.spacing.itemGap + 8}px 0`,
                borderBottom: `1px solid ${customization.colors.border}`,
                paddingBottom: '12px',
                fontFamily: customization.typography.sectionFonts.headers,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {customization.sections.formatting.showSectionIcons && (
                  <span style={{ fontSize: '16px' }}>📝</span>
                )}
                NOTES
              </h2>
              
              <div style={{
                backgroundColor: customization.colors.surface,
                border: `1px solid ${customization.colors.border}`,
                borderRadius: `${customization.visual.cornerRadius}px`,
                padding: '24px',
                fontSize: `${customization.typography.fontSize.body}px`,
                color: customization.colors.text,
                lineHeight: customization.typography.lineHeight.body,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {callsheet.specialNotes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - positioned at the very bottom of the page within margins */}
      {customization.branding?.footer?.text && (
        <div style={{
          position: 'absolute',
          bottom: `${customization.layout.margins.bottom}px`,
          left: customization.branding.footer.position === 'left' ? `${customization.layout.margins.left + 20}px` : 
                customization.branding.footer.position === 'right' ? 'auto' : '50%',
          right: customization.branding.footer.position === 'right' ? `${customization.layout.margins.right + 20}px` : 'auto',
          transform: customization.branding.footer.position === 'center' ? 'translateX(-50%)' : 'none',
          fontSize: `${customization.typography.fontSize.small}px`,
          color: customization.colors.textLight,
          textAlign: customization.branding.footer.position as any,
          padding: customization.branding.footer.style === 'bordered' ? '8px 12px' : '4px 0',
          border: customization.branding.footer.style === 'bordered' ? `1px solid ${customization.colors.border}` : 'none',
          borderRadius: customization.branding.footer.style === 'bordered' ? `${customization.visual.cornerRadius}px` : '0',
          backgroundColor: customization.branding.footer.style === 'accent' ? customization.colors.accent : 'transparent',
          maxWidth: customization.branding.footer.position === 'center' ? 
            `calc(${isLandscape ? '297mm' : '210mm'} - ${customization.layout.margins.left + customization.layout.margins.right + 40}px)` : 'auto',
          zIndex: 10
        }}>
          {customization.branding.footer.text}
          {customization.branding.footer.unionCompliance && (
            <span style={{ display: 'block', marginTop: '4px', fontSize: '6px' }}>
              This production complies with all applicable union regulations and safety standards.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
