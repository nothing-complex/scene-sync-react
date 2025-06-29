
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
  
  // Calculate proper content dimensions
  const containerStyle = {
    width: isLandscape ? '297mm' : '210mm',
    minHeight: 'auto', // Allow content to determine height
    height: 'auto', // Allow content to expand
    maxWidth: isLandscape ? '297mm' : '210mm',
    backgroundColor: customization.colors.background || '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.typography.lineHeight.body,
    color: customization.colors.text,
    padding: `${customization.layout.margins.top}px ${customization.layout.margins.right}px ${customization.layout.margins.bottom}px ${customization.layout.margins.left}px`,
    margin: 0,
    boxSizing: 'border-box' as const,
    overflow: 'visible', // Allow content to be visible
    position: 'relative' as const
  };

  return (
    <div 
      className={`callsheet-pdf-preview ${className}`}
      style={containerStyle}
    >
      {/* Header Section */}
      <div className="pdf-header" style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
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
          
          {customization.branding?.companyName && (
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
        <div className="pdf-section avoid-break" style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
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
              gridTemplateColumns: '80px 80px 1fr 120px 80px',
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
            {callsheet.schedule.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 80px 1fr 120px 80px',
                  gap: '12px',
                  padding: '12px',
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
        <div className="pdf-section avoid-break" style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
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
            {callsheet.cast.map((member, index) => (
              <div
                key={index}
                className="avoid-break"
                style={{
                  backgroundColor: customization.colors.contactCardBackground,
                  border: `1px solid ${customization.colors.contactCardBorder}`,
                  borderRadius: `${customization.visual.cornerRadius}px`,
                  padding: '12px',
                  breakInside: 'avoid'
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
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
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
        <div className="pdf-section avoid-break" style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
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
            {callsheet.crew.map((member, index) => (
              <div
                key={index}
                className="avoid-break"
                style={{
                  backgroundColor: customization.colors.contactCardBackground,
                  border: `1px solid ${customization.colors.contactCardBorder}`,
                  borderRadius: `${customization.visual.cornerRadius}px`,
                  padding: '12px',
                  breakInside: 'avoid'
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
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
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
        <div className="pdf-section avoid-break" style={{ marginBottom: `${customization.layout.spacing.sectionGap}px` }}>
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
                <div key={index} className="avoid-break" style={{ breakInside: 'avoid' }}>
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
        <div className="pdf-section avoid-break">
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
  );
};
