
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
      // Small delay to ensure all styles are applied
      const timer = setTimeout(onReady, 100);
      return () => clearTimeout(timer);
    }
  }, [onReady]);

  return (
    <div 
      id="pdf-preview-container"
      style={{
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        width: '210mm', // A4 width
        minHeight: '297mm', // A4 height
        backgroundColor: customization.colors.background,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#000',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box'
      }}
    >
      <CallsheetPDFPreview
        callsheet={callsheet}
        customization={customization}
        className="print-optimized"
      />
      
      <style>{`
        .print-optimized {
          box-shadow: none !important;
          border-radius: 0 !important;
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
      `}</style>
    </div>
  );
};
