
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetPDFPreview } from './CallsheetPDFPreview';
import { ReactPDFService } from '@/services/pdf/service_backup';
import { Download, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

interface PDFPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({
  isOpen,
  onClose,
  callsheet,
  customization
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting PDF download with customization:', customization);
      const service = new ReactPDFService(customization);
      await service.savePDF(callsheet);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting PDF preview with customization:', customization);
      const service = new ReactPDFService(customization);
      await service.previewPDF(callsheet);
      toast.success('PDF preview opened in new tab!');
    } catch (error) {
      console.error('Error previewing PDF:', error);
      toast.error('Failed to preview PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>PDF Preview - {callsheet.projectTitle}</DialogTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              disabled={isGenerating}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview in New Tab
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-auto max-h-[calc(90vh-120px)] bg-gray-100 p-4">
          <div className="transform scale-75 origin-top">
            <CallsheetPDFPreview 
              callsheet={callsheet}
              customization={customization}
              className="shadow-lg"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
