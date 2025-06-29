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
    minHeight: 'auto',
    height: 'auto',
    maxWidth: isLandscape ? '297mm' : '210mm',
    backgroundColor: customization.colors.background || '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.typography.lineHeight.body,
    color: customization.colors.text,
    padding: `${customization.layout.margins.top}px ${customization.layout.margins.right}px ${customization.layout.margins.bottom}px ${customization.layout.margins.left}px`,
    margin: 0,
    boxSizing: 'border-box' as const,
    overflow: 'visible',
    position: 'relative' as const,
    pageBreakInside: 'avoid',
    breakInside: 'avoid'
  };

  // Logo positioning helper
  const getLogoPosition = (position: string) => {
    switch (position) {
      case 'top-left':
        return { top: '16px', left: '16px' };
      case 'top-center':
        return { top: '16px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { top: '16px', right: '16px' };
      case 'center-left':
        return { top: '50%', left: '16px', transform: 'translateY(-50%)' };
      case 'center-right':
        return { top: '50%', right: '16px', transform: 'translateY(-50%)' };
      case 'bottom-left':
        return { bottom: '16px', left: '16px' };
      case 'bottom-center':
        return { bottom: '16px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { bottom: '16px', right: '16px' };
      default:
        return { top: '16px', left: '16px' };
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
      style={containerStyle}
    >
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

      {/* Header Section */}
      <div className="pdf-header avoid-break-strict" style={{ 
        marginBottom: `${customization.layout.spacing.sectionGap + 4}px`,
        paddingTop: customization.branding?.logo?.position?.includes('top') ? '80px' : '0',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h1 style={{
              fontSize: `${customization.typography.fontSize.title}px`,
              fontWeight: customization.typography.fontWeight.title,
              color: customization.colors.titleText,
              margin: '0 0 10px 0',
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
          gap: '20px',
          marginBottom: '28px',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <div>
            <div style={{
              fontSize: `${customization.typography.fontSize.small}px`,
              color: customization.colors.textLight,
              marginBottom: '6px',
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
              marginBottom: '6px',
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
              marginBottom: '6px',
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
                marginTop: '3px'
              }}>
                {callsheet.locationAddress}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      {callsheet.schedule && callsheet.schedule.length > 0 && (
        <div className="pdf-section avoid-break-strict" style={{ 
          marginBottom: `${customization.layout.spacing.sectionGap + 8}px`,
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <h2 style={{
            fontSize: `${customization.typography.fontSize.header}px`,
            fontWeight: customization.typography.fontWeight.header,
            color: customization.colors.scheduleSectionColor,
            margin: `0 0 ${customization.layout.spacing.itemGap + 6}px 0`,
            borderBottom: `1px solid ${customization.colors.border}`,
            paddingBottom: '12px',
            pageBreakAfter: 'avoid'
          }}>
            SCHEDULE
          </h2>
          
          <div style={{
            backgroundColor: customization.colors.scheduleBackground,
            border: `1px solid ${customization.colors.scheduleBorder}`,
            borderRadius: `${customization.visual.cornerRadius}px`,
            overflow: 'hidden',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
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
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 80px 1fr 120px 80px',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: index % 2 === 0 ? customization.colors.scheduleRowBackground : customization.colors.scheduleRowAlternate,
                  borderBottom: index < callsheet.schedule.length - 1 ? `1px solid ${customization.colors.scheduleBorder}` : 'none',
                  fontSize: `${customization.typography.fontSize.body}px`,
                  color: customization.colors.scheduleBodyText,
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
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
        <div className="pdf-section avoid-break-strict" style={{ 
          marginBottom: `${customization.layout.spacing.sectionGap + 8}px`,
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <h2 style={{
            fontSize: `${customization.typography.fontSize.header}px`,
            fontWeight: customization.typography.fontWeight.header,
            color: customization.colors.castSectionColor,
            margin: `0 0 ${customization.layout.spacing.itemGap + 6}px 0`,
            borderBottom: `1px solid ${customization.colors.border}`,
            paddingBottom: '12px',
            pageBreakAfter: 'avoid'
          }}>
            CAST
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLandscape ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: `${customization.layout.spacing.itemGap + 6}px`
          }}>
            {callsheet.cast.map((member, index) => (
              <div
                key={index}
                className="avoid-break-strict"
                style={{
                  backgroundColor: customization.colors.contactCardBackground,
                  border: `1px solid ${customization.colors.contactCardBorder}`,
                  borderRadius: `${customization.visual.cornerRadius}px`,
                  padding: '16px',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
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
        <div className="pdf-section avoid-break-strict" style={{ 
          marginBottom: `${customization.layout.spacing.sectionGap + 8}px`,
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <h2 style={{
            fontSize: `${customization.typography.fontSize.header}px`,
            fontWeight: customization.typography.fontWeight.header,
            color: customization.colors.crewSectionColor,
            margin: `0 0 ${customization.layout.spacing.itemGap + 6}px 0`,
            borderBottom: `1px solid ${customization.colors.border}`,
            paddingBottom: '12px',
            pageBreakAfter: 'avoid'
          }}>
            CREW
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLandscape ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
            gap: `${customization.layout.spacing.itemGap + 6}px`
          }}>
            {callsheet.crew.map((member, index) => (
              <div
                key={index}
                className="avoid-break-strict"
                style={{
                  backgroundColor: customization.colors.contactCardBackground,
                  border: `1px solid ${customization.colors.contactCardBorder}`,
                  borderRadius: `${customization.visual.cornerRadius}px`,
                  padding: '16px',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
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
        <div className="pdf-section avoid-break-strict" style={{ 
          marginBottom: `${customization.layout.spacing.sectionGap + 8}px`,
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <h2 style={{
            fontSize: `${customization.typography.fontSize.header}px`,
            fontWeight: customization.typography.fontWeight.header,
            color: customization.colors.emergencySectionColor,
            margin: `0 0 ${customization.layout.spacing.itemGap + 6}px 0`,
            borderBottom: `2px solid ${customization.colors.emergencySectionColor}`,
            paddingBottom: '12px',
            pageBreakAfter: 'avoid'
          }}>
            EMERGENCY CONTACTS
          </h2>
          
          <div style={{
            backgroundColor: customization.colors.emergencyBackground,
            border: `2px solid ${customization.colors.emergencyBorder}`,
            borderRadius: `${customization.visual.cornerRadius}px`,
            padding: '20px',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isLandscape ? 'repeat(2, 1fr)' : '1fr',
              gap: `${customization.layout.spacing.itemGap + 6}px`
            }}>
              {callsheet.emergencyContacts.map((contact, index) => (
                <div key={index} className="avoid-break-strict" style={{ 
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}>
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
        <div className="pdf-section avoid-break-strict" style={{
          marginBottom: customization.branding?.footer ? '70px' : '0',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}>
          <h2 style={{
            fontSize: `${customization.typography.fontSize.header}px`,
            fontWeight: customization.typography.fontWeight.header,
            color: customization.colors.notesSectionColor,
            margin: `0 0 ${customization.layout.spacing.itemGap + 6}px 0`,
            borderBottom: `1px solid ${customization.colors.border}`,
            paddingBottom: '12px',
            pageBreakAfter: 'avoid'
          }}>
            NOTES
          </h2>
          
          <div style={{
            backgroundColor: customization.colors.surface,
            border: `1px solid ${customization.colors.border}`,
            borderRadius: `${customization.visual.cornerRadius}px`,
            padding: '20px',
            fontSize: `${customization.typography.fontSize.body}px`,
            color: customization.colors.text,
            lineHeight: customization.typography.lineHeight.body,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}>
            {callsheet.specialNotes}
          </div>
        </div>
      )}

      {/* Footer */}
      {customization.branding?.footer?.text && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: customization.branding.footer.position === 'left' ? '16px' : 
                customization.branding.footer.position === 'right' ? 'auto' : '50%',
          right: customization.branding.footer.position === 'right' ? '16px' : 'auto',
          transform: customization.branding.footer.position === 'center' ? 'translateX(-50%)' : 'none',
          fontSize: `${customization.typography.fontSize.small}px`,
          color: customization.colors.textLight,
          textAlign: customization.branding.footer.position as any,
          padding: customization.branding.footer.style === 'bordered' ? '8px 12px' : '4px 0',
          border: customization.branding.footer.style === 'bordered' ? `1px solid ${customization.colors.border}` : 'none',
          borderRadius: customization.branding.footer.style === 'bordered' ? `${customization.visual.cornerRadius}px` : '0',
          backgroundColor: customization.branding.footer.style === 'accent' ? customization.colors.accent : 'transparent'
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

<lov-write file_path="src/services/pdf/HtmlToPdfService.ts">
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFCustomization } from '@/types/pdfTypes';

interface PDFGenerationOptions {
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  customization?: PDFCustomization;
}

export class HtmlToPdfService {
  async generatePDF(htmlContent: string, options: PDFGenerationOptions = {}): Promise<Blob> {
    console.log('HtmlToPdfService: Starting PDF generation with options:', options);
    
    try {
      const isLandscape = options.orientation === 'landscape';
      
      // Create a temporary iframe to render the HTML content properly
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = isLandscape ? '297mm' : '210mm';
      iframe.style.height = 'auto';
      iframe.style.minHeight = isLandscape ? '210mm' : '297mm';
      iframe.style.border = 'none';
      iframe.style.overflow = 'visible';
      
      document.body.appendChild(iframe);
      
      // Wait for iframe to be ready
      await new Promise((resolve) => {
        iframe.onload = resolve;
        setTimeout(resolve, 100);
      });

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Unable to access iframe document');
      }

      // Enhanced HTML content with better page break handling
      const enhancedHtmlContent = htmlContent.replace(
        '</head>',
        `
          <style>
            /* Enhanced page break controls */
            .avoid-break-strict {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .avoid-break-strict * {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .pdf-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 20px !important;
            }
            .pdf-section h2 {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            /* Grid and table break handling */
            .grid {
              page-break-inside: avoid !important;
            }
            .grid > * {
              page-break-inside: avoid !important;
            }
            
            /* Contact cards break handling */
            [style*="backgroundColor"][style*="border"] {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Schedule table break handling */
            [style*="scheduleTable"] {
              page-break-inside: avoid !important;
            }
            [style*="scheduleTableRow"] {
              page-break-inside: avoid !important;
            }
            
            /* General content protection */
            .callsheet-pdf-preview {
              orphans: 4 !important;
              widows: 4 !important;
            }
            
            /* Prevent breaking of inline elements */
            span, strong, em {
              page-break-inside: avoid !important;
            }
          </style>
        </head>`
      );

      // Write the enhanced HTML content to the iframe
      iframeDoc.open();
      iframeDoc.write(enhancedHtmlContent);
      iframeDoc.close();

      // Extended wait for content and styles to fully load
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('HtmlToPdfService: HTML content loaded in iframe');

      // Get the body element from the iframe
      const bodyElement = iframeDoc.body;
      if (!bodyElement) {
        throw new Error('No body element found in iframe');
      }

      // Get the actual content dimensions with better measurement
      const actualWidth = Math.max(bodyElement.scrollWidth, bodyElement.offsetWidth);
      const actualHeight = Math.max(bodyElement.scrollHeight, bodyElement.offsetHeight);
      
      console.log('HtmlToPdfService: Actual content dimensions:', actualWidth, 'x', actualHeight);

      // Calculate canvas dimensions for high quality with better scaling
      const scaleFactor = 2;
      const canvasWidth = Math.max(actualWidth, isLandscape ? 1100 : 800);
      const canvasHeight = Math.max(actualHeight, isLandscape ? 800 : 1100);

      console.log('HtmlToPdfService: Target canvas dimensions:', canvasWidth, 'x', canvasHeight);

      // Generate canvas from the iframe content with enhanced settings
      const canvas = await html2canvas(bodyElement, {
        scale: scaleFactor,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: canvasWidth,
        height: canvasHeight,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: true,
        imageTimeout: 15000,
        ignoreElements: (element) => {
          // Skip elements that might cause rendering issues
          return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
        },
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied in the cloned document
          const clonedBody = clonedDoc.body;
          if (clonedBody) {
            clonedBody.style.width = isLandscape ? '297mm' : '210mm';
            clonedBody.style.height = 'auto';
            clonedBody.style.minHeight = isLandscape ? '210mm' : '297mm';
            clonedBody.style.margin = '0';
            clonedBody.style.padding = '0';
            clonedBody.style.overflow = 'visible';
            clonedBody.style.boxSizing = 'border-box';
            
            // Apply page break styles to cloned elements
            const sections = clonedBody.querySelectorAll('.pdf-section, .avoid-break-strict');
            sections.forEach(section => {
              (section as HTMLElement).style.pageBreakInside = 'avoid';
              (section as HTMLElement).style.breakInside = 'avoid';
            });
          }
        }
      });

      console.log('HtmlToPdfService: Canvas generated with dimensions:', canvas.width, 'x', canvas.height);

      // Clean up iframe
      document.body.removeChild(iframe);

      // Create PDF with correct orientation and better page handling
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      console.log('HtmlToPdfService: PDF dimensions:', pdfWidth, 'x', pdfHeight);
      
      // Enhanced multi-page handling to prevent content cutoff
      const contentAspectRatio = canvas.width / canvas.height;
      const pageAspectRatio = pdfWidth / pdfHeight;
      
      // Calculate how many pages we need based on content height
      const maxContentHeightPerPage = canvas.width * (pdfHeight / pdfWidth);
      const numberOfPages = Math.ceil(canvas.height / maxContentHeightPerPage);
      
      console.log('HtmlToPdfService: Number of pages needed:', numberOfPages);
      
      if (numberOfPages > 1) {
        // Multi-page handling with overlap to prevent cutoff
        const pageHeight = maxContentHeightPerPage;
        const overlap = 50; // 50px overlap to prevent content cutoff
        
        for (let i = 0; i < numberOfPages; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          // Create a canvas for this page with overlap handling
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          pageCanvas.width = canvas.width;
          pageCanvas.height = pageHeight + (i > 0 ? overlap : 0);
          
          if (pageCtx) {
            // Fill with white background
            pageCtx.fillStyle = '#ffffff';
            pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            
            // Calculate the y-offset for this page
            const yOffset = i * pageHeight - (i > 0 ? overlap : 0);
            
            // Draw the content for this page
            pageCtx.drawImage(canvas, 0, -yOffset);
            
            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
          }
        }
      } else {
        // Single page - fit content maintaining aspect ratio
        let finalWidth = pdfWidth;
        let finalHeight = pdfHeight;
        
        if (contentAspectRatio > pageAspectRatio) {
          finalHeight = pdfWidth / contentAspectRatio;
        } else {
          finalWidth = pdfHeight * contentAspectRatio;
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, finalWidth, finalHeight, undefined, 'FAST');
      }
      
      console.log('HtmlToPdfService: PDF generation completed successfully');
      
      // Return as blob
      const pdfOutput = pdf.output('blob');
      return pdfOutput;
    } catch (error) {
      console.error('HtmlToPdfService: Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
```

<lov-write file_path="src/services/pdf/core/PDFGenerator.tsx">
import React from 'react';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { HtmlToPdfService } from './HtmlToPdfService';

interface PDFGeneratorProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export class PDFGenerator {
  private htmlToPdfService: HtmlToPdfService;

  constructor() {
    this.htmlToPdfService = new HtmlToPdfService();
  }

  async generatePDF(callsheet: CallsheetData, customization: PDFCustomization): Promise<Blob> {
    console.log('PDFGenerator: Starting PDF generation with customization:', customization);
    
    try {
      // Create a temporary container to render the component
      const container = document.createElement('div');
      container.className = 'callsheet-pdf-preview';
      container.style.width = '100%';
      container.style.height = 'auto';
      container.style.minHeight = '100%';
      container.style.overflow = 'visible';
      container.style.boxSizing = 'border-box';
      container.style.position = 'relative';
      container.style.pageBreakInside = 'avoid';
      container.style.breakInside = 'avoid';
      
      // Render the component into the container
      const CallsheetPDFPreview = React.createElement(CallsheetPDFPreview, {
        callsheet,
        customization,
        className: 'callsheet-pdf-preview'
      });
      ReactDOM.render(CallsheetPDFPreview, container);
      
      // Get the rendered HTML
      const htmlContent = container.innerHTML;
      console.log('PDFGenerator: Component HTML extracted, content length:', htmlContent.length);

      // Create a complete HTML document with enhanced page break handling
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Call Sheet</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              font-family: system-ui, -apple-system, sans-serif;
              background-color: white;
              color: black;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
              width: 100%;
              height: auto;
              min-height: 100%;
              overflow: visible;
            }
            
            /* Enhanced Page Break Controls */
            .avoid-break-strict {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .avoid-break-strict * {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .pdf-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 20px !important;
            }
            .pdf-section h2 {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            /* Grid System with Break Protection */
            .grid {
              display: grid;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .grid > * {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
            
            /* Contact Cards Break Protection */
            [style*="backgroundColor"][style*="border"] {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Schedule Table Break Protection */
            [style*="scheduleTable"] {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            [style*="scheduleTableRow"] {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Emergency Section Break Protection */
            [style*="emergencyBackground"] {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Notes Section Break Protection */
            [style*="whiteSpace: 'pre-wrap'"] {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Responsive Grid */
            @media (min-width: 768px) {
              .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
              .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            }
            @media (min-width: 1024px) {
              .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
              .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
              .lg\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
            }
            
            /* Spacing */
            .gap-0 { gap: 0; }
            .gap-2 { gap: 0.5rem; }
            .gap-4 { gap: 1rem; }
            .p-3 { padding: 0.75rem; }
            .p-4 { padding: 1rem; }
            .space-y-3 > * + * { margin-top: 0.75rem; }
            
            /* Flexbox */
            .flex { display: flex; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .flex-1 { flex: 1 1 0%; }
            .flex-shrink-0 { flex-shrink: 0; }
            
            /* Typography */
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            
            /* Layout */
            .max-w-4xl { max-width: 56rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            
            /* Print Optimizations */
            .print-optimized {
              box-shadow: none !important;
              border-radius: 0 !important;
            }
            .print-optimized * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Ensure proper sizing and no cutoff */
            body > * {
              width: ${isLandscape ? '297mm' : '210mm'};
              height: auto;
              min-height: ${isLandscape ? '210mm' : '297mm'};
              max-width: ${isLandscape ? '297mm' : '210mm'};
              overflow: visible;
            }
            
            /* Prevent content cutoff */
            .callsheet-pdf-preview {
              height: auto !important;
              min-height: 100% !important;
              overflow: visible !important;
              orphans: 4 !important;
              widows: 4 !important;
            }
            
            /* Prevent breaking of inline elements */
            span, strong, em, small {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Section spacing with break protection */
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      // Generate PDF from the enhanced HTML content
      const pdf = await this.htmlToPdfService.generatePDF(fullHtml, {
        orientation: customization.layout.pageOrientation,
        margins: {
          top: `${customization.layout.margins.top}px`,
          bottom: `${customization.layout.margins.bottom}px`,
          left: `${customization.layout.margins.left}px`,
          right: `${customization.layout.margins.right}px`
        },
        customization
      });

      console.log('PDFGenerator: PDF generation completed successfully');
      
      // Clean up container
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);

      // Return as blob
      return pdf;
    } catch (error) {
      console.error('PDFGenerator: Error generating PDF:', error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
```
