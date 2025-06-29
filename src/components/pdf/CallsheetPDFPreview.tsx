
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
  
  // Convert mm to pixels for proper scaling (1mm = 3.779527559 pixels at 96 DPI)
  const mmToPx = (mm: number) => mm * 3.779527559;
  
  // Page dimensions in mm and converted to px
  const pageDimensions = {
    mm: {
      width: isLandscape ? 297 : 210,
      height: isLandscape ? 210 : 297
    },
    px: {
      width: mmToPx(isLandscape ? 297 : 210),
      height: mmToPx(isLandscape ? 210 : 297)
    }
  };

  // Margin calculations
  const margins = {
    top: customization.layout.margins.top,
    right: customization.layout.margins.right,
    bottom: customization.layout.margins.bottom,
    left: customization.layout.margins.left
  };

  // Content area dimensions
  const contentArea = {
    width: pageDimensions.px.width - margins.left - margins.right,
    height: pageDimensions.px.height - margins.top - margins.bottom - 60, // Reserve 60px for footer
    left: margins.left,
    top: margins.top
  };

  // Logo positioning helper
  const getLogoPosition = (position: string) => {
    switch (position) {
      case 'top-left':
        return { top: `${margins.top + 10}px`, left: `${margins.left + 10}px` };
      case 'top-center':
        return { top: `${margins.top + 10}px`, left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { top: `${margins.top + 10}px`, right: `${margins.right + 10}px` };
      case 'center-left':
        return { top: '50%', left: `${margins.left + 10}px`, transform: 'translateY(-50%)' };
      case 'center-right':
        return { top: '50%', right: `${margins.right + 10}px`, transform: 'translateY(-50%)' };
      case 'bottom-left':
        return { bottom: `${margins.bottom + 70}px`, left: `${margins.left + 10}px` };
      case 'bottom-center':
        return { bottom: `${margins.bottom + 70}px`, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { bottom: `${margins.bottom + 70}px`, right: `${margins.right + 10}px` };
      default:
        return { top: `${margins.top + 10}px`, left: `${margins.left + 10}px` };
    }
  };

  const getLogoSize = (size: string) => {
    switch (size) {
      case 'small': return { width: '40px', height: '40px' };
      case 'medium': return { width: '60px', height: '60px' };
      case 'large': return { width: '80px', height: '80px' };
      default: return { width: '60px', height: '60px' };
    }
  };

  return (
    <div 
      className={`callsheet-pdf-preview ${className}`}
      style={{
        width: `${pageDimensions.px.width}px`,
        height: `${pageDimensions.px.height}px`,
        backgroundColor: '#ffffff',
        position: 'relative',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: `${customization.typography.fontSize.body}px`,
        lineHeight: customization.typography.lineHeight.body,
        color: customization.colors.text
      }}
    >
      {/* Page border visualization (for debugging - remove in production) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '1px solid #e0e0e0',
        pointerEvents: 'none'
      }} />

      {/* Margin guides (for debugging - remove in production) */}
      <div style={{
        position: 'absolute',
        top: `${margins.top}px`,
        left: `${margins.left}px`,
        right: `${margins.right}px`,
        bottom: `${margins.bottom}px`,
        border: '1px dashed #ccc',
        pointerEvents: 'none'
      }} />

      {/* Logos */}
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

      {/* Main content area */}
      <div style={{
        position: 'absolute',
        top: `${contentArea.top}px`,
        left: `${contentArea.left}px`,
        width: `${contentArea.width}px`,
        height: `${contentArea.height}px`,
        backgroundColor: customization.colors.background || '#ffffff',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        zIndex: 2
      }}>
        {/* Header Section */}
        <div style={{ 
          marginBottom: `${customization.layout.spacing.sectionGap}px`,
          paddingTop: customization.branding?.logo?.position?.includes('top') ? '60px' : '0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <h1 style={{
                fontSize: `${customization.typography.fontSize.title}px`,
                fontWeight: customization.typography.fontWeight.title,
                color: customization.colors.titleText,
                margin: '0 0 8px 0',
                lineHeight: customization.typography.lineHeight.title
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
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{
                fontSize: `${customization.typography.fontSize.small}px`,
                color: customization.colors.textLight,
                marginBottom: '4px',
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
                marginBottom: '4px',
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
                marginBottom: '4px',
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
                  marginTop: '2px'
                }}>
                  {callsheet.locationAddress}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        {callsheet.schedule && callsheet.schedule.length > 0 && (
          <div style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
            <h2 style={{
              fontSize: `${customization.typography.fontSize.header}px`,
              fontWeight: customization.typography.fontWeight.header,
              color: customization.colors.scheduleSectionColor,
              margin: `0 0 ${customization.layout.spacing.itemGap}px 0`,
              borderBottom: `1px solid ${customization.colors.border}`,
              paddingBottom: '8px'
            }}>
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
                gridTemplateColumns: '60px 60px 1fr 100px 60px',
                gap: '12px',
                padding: '12px',
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
              {callsheet.schedule.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 60px 1fr 100px 60px',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: index % 2 === 0 ? customization.colors.scheduleRowBackground : customization.colors.scheduleRowAlternate,
                    borderBottom: index < Math.min(callsheet.schedule.length - 1, 2) ? `1px solid ${customization.colors.scheduleBorder}` : 'none',
                    fontSize: `${customization.typography.fontSize.body}px`,
                    color: customization.colors.scheduleBodyText
                  }}
                >
                  <div style={{ fontWeight: 'medium' }}>{item.sceneNumber}</div>
                  <div>{item.intExt}</div>
                  <div style={{ wordBreak: 'break-word', overflow: 'hidden' }}>{item.description}</div>
                  <div style={{ fontSize: `${customization.typography.fontSize.small}px` }}>{item.estimatedTime}</div>
                  <div>{item.pageCount}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cast Section */}
        {callsheet.cast && callsheet.cast.length > 0 && (
          <div style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
            <h2 style={{
              fontSize: `${customization.typography.fontSize.header}px`,
              fontWeight: customization.typography.fontWeight.header,
              color: customization.colors.castSectionColor,
              margin: `0 0 ${customization.layout.spacing.itemGap}px 0`,
              borderBottom: `1px solid ${customization.colors.border}`,
              paddingBottom: '8px'
            }}>
              CAST
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isLandscape ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
              gap: `${customization.layout.spacing.itemGap}px`
            }}>
              {callsheet.cast.slice(0, isLandscape ? 6 : 4).map((member, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: customization.colors.contactCardBackground,
                    border: `1px solid ${customization.colors.contactCardBorder}`,
                    borderRadius: `${customization.visual.cornerRadius}px`,
                    padding: '12px'
                  }}
                >
                  <div style={{
                    fontSize: `${customization.typography.fontSize.body}px`,
                    fontWeight: 'medium',
                    color: customization.colors.contactNameText,
                    marginBottom: '4px'
                  }}>
                    {member.name}
                  </div>
                  {member.character && (
                    <div style={{
                      fontSize: `${customization.typography.fontSize.small}px`,
                      color: customization.colors.contactRoleText,
                      marginBottom: '8px'
                    }}>
                      as {member.character}
                    </div>
                  )}
                  <div style={{ fontSize: `${customization.typography.fontSize.small}px`, color: customization.colors.contactDetailsText }}>
                    {member.phone && (
                      <div style={{ marginBottom: '2px' }}>📞 {member.phone}</div>
                    )}
                    {member.email && (
                      <div>📧 {member.email}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crew Section */}
        {callsheet.crew && callsheet.crew.length > 0 && (
          <div style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
            <h2 style={{
              fontSize: `${customization.typography.fontSize.header}px`,
              fontWeight: customization.typography.fontWeight.header,
              color: customization.colors.crewSectionColor,
              margin: `0 0 ${customization.layout.spacing.itemGap}px 0`,
              borderBottom: `1px solid ${customization.colors.border}`,
              paddingBottom: '8px'
            }}>
              CREW
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isLandscape ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
              gap: `${customization.layout.spacing.itemGap}px`
            }}>
              {callsheet.crew.slice(0, isLandscape ? 8 : 6).map((member, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: customization.colors.contactCardBackground,
                    border: `1px solid ${customization.colors.contactCardBorder}`,
                    borderRadius: `${customization.visual.cornerRadius}px`,
                    padding: '12px'
                  }}
                >
                  <div style={{
                    fontSize: `${customization.typography.fontSize.body}px`,
                    fontWeight: 'medium',
                    color: customization.colors.contactNameText,
                    marginBottom: '4px'
                  }}>
                    {member.name}
                  </div>
                  <div style={{
                    fontSize: `${customization.typography.fontSize.small}px`,
                    color: customization.colors.contactRoleText,
                    marginBottom: '8px'
                  }}>
                    {member.role}
                  </div>
                  <div style={{ fontSize: `${customization.typography.fontSize.small}px`, color: customization.colors.contactDetailsText }}>
                    {member.phone && (
                      <div style={{ marginBottom: '2px' }}>📞 {member.phone}</div>
                    )}
                    {member.email && (
                      <div>📧 {member.email}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        {callsheet.emergencyContacts && callsheet.emergencyContacts.length > 0 && (
          <div style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
            <h2 style={{
              fontSize: `${customization.typography.fontSize.header}px`,
              fontWeight: customization.typography.fontWeight.header,
              color: customization.colors.emergencySectionColor,
              margin: `0 0 ${customization.layout.spacing.itemGap}px 0`,
              borderBottom: `2px solid ${customization.colors.emergencySectionColor}`,
              paddingBottom: '8px'
            }}>
              EMERGENCY CONTACTS
            </h2>
            
            <div style={{
              backgroundColor: customization.colors.emergencyBackground,
              border: `2px solid ${customization.colors.emergencyBorder}`,
              borderRadius: `${customization.visual.cornerRadius}px`,
              padding: '16px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isLandscape ? 'repeat(2, 1fr)' : '1fr',
                gap: `${customization.layout.spacing.itemGap}px`
              }}>
                {callsheet.emergencyContacts.map((contact, index) => (
                  <div key={index}>
                    <div style={{
                      fontSize: `${customization.typography.fontSize.body}px`,
                      fontWeight: 'bold',
                      color: customization.colors.emergencyText,
                      marginBottom: '4px'
                    }}>
                      {contact.name}
                    </div>
                    <div style={{
                      fontSize: `${customization.typography.fontSize.small}px`,
                      color: customization.colors.emergencyText,
                      marginBottom: '8px'
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
          <div style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
            <h2 style={{
              fontSize: `${customization.typography.fontSize.header}px`,
              fontWeight: customization.typography.fontWeight.header,
              color: customization.colors.notesSectionColor,
              margin: `0 0 ${customization.layout.spacing.itemGap}px 0`,
              borderBottom: `1px solid ${customization.colors.border}`,
              paddingBottom: '8px'
            }}>
              NOTES
            </h2>
            
            <div style={{
              backgroundColor: customization.colors.surface,
              border: `1px solid ${customization.colors.border}`,
              borderRadius: `${customization.visual.cornerRadius}px`,
              padding: '16px',
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

      {/* Footer - positioned at the bottom within margins */}
      {customization.branding?.footer?.text && (
        <div style={{
          position: 'absolute',
          bottom: `${margins.bottom + 10}px`,
          left: customization.branding.footer.position === 'left' ? `${margins.left + 20}px` : 
                customization.branding.footer.position === 'right' ? 'auto' : '50%',
          right: customization.branding.footer.position === 'right' ? `${margins.right + 20}px` : 'auto',
          transform: customization.branding.footer.position === 'center' ? 'translateX(-50%)' : 'none',
          fontSize: `${customization.typography.fontSize.small}px`,
          color: customization.colors.textLight,
          textAlign: customization.branding.footer.position as any,
          padding: customization.branding.footer.style === 'bordered' ? '6px 10px' : '3px 0',
          border: customization.branding.footer.style === 'bordered' ? `1px solid ${customization.colors.border}` : 'none',
          borderRadius: customization.branding.footer.style === 'bordered' ? `${customization.visual.cornerRadius}px` : '0',
          backgroundColor: customization.branding.footer.style === 'accent' ? customization.colors.accent : 'transparent',
          maxWidth: customization.branding.footer.position === 'center' ? 
            `${contentArea.width - 40}px` : 'auto',
          zIndex: 10
        }}>
          {customization.branding.footer.text}
          {customization.branding.footer.unionCompliance && (
            <div style={{ marginTop: '2px', fontSize: `${customization.typography.fontSize.caption}px` }}>
              This production complies with all applicable union regulations and safety standards.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
