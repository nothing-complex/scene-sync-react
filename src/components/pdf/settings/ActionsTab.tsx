
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { generateCustomCallsheetPDF, previewCallsheetPDF } from '@/services/pdfService';
import { PDFPreviewDialog } from '../../pdf/PDFPreviewDialog';
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

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generateCustomCallsheetPDF(callsheet, customization);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error(`Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      toast.error(`Failed to preview PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Card className="glass-effect border-border/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium tracking-tight">Generate PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full font-normal"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground font-normal">
            The PDF will match exactly what you see in the live preview above.
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
