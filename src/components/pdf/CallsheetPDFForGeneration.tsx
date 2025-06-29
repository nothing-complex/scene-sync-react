
import React from 'react';
import { CallsheetPDFPreview } from './CallsheetPDFPreview';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';

interface CallsheetPDFForGenerationProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  onReady?: () => void;
}

export const CallsheetPDFForGeneration: React.FC<CallsheetPDFForGenerationProps> = ({ 
  callsheet, 
  customization,
  onReady 
}) => {
  React.useEffect(() => {
    // Notify parent component when the PDF preview is ready
    if (onReady) {
      // Longer delay to ensure all content and styles are fully loaded
      const timer = setTimeout(() => {
        console.log('CallsheetPDFForGeneration: Component ready, calling onReady');
        onReady();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [onReady, callsheet, customization]);

  const isLandscape = customization.layout.pageOrientation === 'landscape';

  return (
    <div 
      id="pdf-preview-container"
      style={{
        backgroundColor: customization.colors.background || '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#000000',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        width: isLandscape ? '297mm' : '210mm',
        height: isLandscape ? '210mm' : '297mm',
        maxWidth: isLandscape ? '297mm' : '210mm',
        maxHeight: isLandscape ? '210mm' : '297mm',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <CallsheetPDFPreview
        callsheet={callsheet}
        customization={customization}
        className="print-optimized"
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .print-optimized {
            box-shadow: none !important;
            border-radius: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
          }
          .print-optimized * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Ensure proper grid behavior in PDF generation */
          .grid {
            display: grid !important;
          }
          .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
          .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
          
          /* Override responsive behavior for consistent PDF output */
          @media (min-width: 768px) {
            .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          }
          @media (min-width: 1024px) {
            .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
            .lg\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
          }
        `
      }} />
    </div>
  );
};
