
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Download, Beaker } from 'lucide-react';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { generateCustomCallsheetPDF, previewCallsheetPDF } from '@/services/pdfService';
import { generateExperimentalCallsheetPDF, previewExperimentalCallsheetPDF } from '@/services/experimentalPdfService';
import { PDFPreviewDialog } from '../PDFPreviewDialog';
import { toast } from 'sonner';

interface ActionsTabProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
}

export const ActionsTab: React.FC<ActionsTabProps> = ({
  callsheet,
  customization
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExperimentalGenerating, setIsExperimentalGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generateCustomCallsheetPDF(callsheet, customization);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewPDF = async () => {
    setIsGenerating(true);
    try {
      await previewCallsheetPDF(callsheet, customization);
      toast.success('PDF preview opened in new tab!');
    } catch (error) {
      console.error('Error previewing PDF:', error);
      toast.error('Failed to preview PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExperimentalPreviewPDF = async () => {
    setIsExperimentalGenerating(true);
    try {
      await previewExperimentalCallsheetPDF(callsheet, customization);
      toast.success('Experimental PDF preview opened!');
    } catch (error) {
      console.error('Error previewing experimental PDF:', error);
      toast.error('Failed to preview experimental PDF. Please try again.');
    } finally {
      setIsExperimentalGenerating(false);
    }
  };

  return (
    <>
      <Card className="glass-effect border-border/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium tracking-tight">Generate PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              disabled={isGenerating}
              className="w-full font-normal"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview PDF
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleExperimentalPreviewPDF}
              disabled={isExperimentalGenerating}
              className="w-full font-normal bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              <Beaker className="w-4 h-4 mr-2" />
              {isExperimentalGenerating ? 'Generating...' : 'Experimental Preview'}
            </Button>
            
            <Button 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full font-normal"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground font-normal">
            Use the experimental preview to test new designs. Once satisfied, the regular preview will be updated.
          </p>
        </CardContent>
      </Card>

      <PDFPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        callsheet={callsheet}
        customization={customization}
      />
    </>
  );
};
