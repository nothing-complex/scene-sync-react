
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, Palette, Type, Layout, Settings } from 'lucide-react';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetPDFPreview } from './pdf/CallsheetPDFPreview';
import { PDFService } from '@/services/pdf/PDFService';
import { toast } from 'sonner';
import { ThemeSelector } from './pdf/ThemeSelector';
import { EnhancedBrandingTab } from './pdf/EnhancedBrandingTab';
import { ColorCustomizationTab } from './pdf/ColorCustomizationTab';
import { TypographyCustomizationTab } from './pdf/TypographyCustomizationTab';
import { LayoutCustomizationTab } from './pdf/LayoutCustomizationTab';

interface PDFAppearanceTabProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const PDFAppearanceTab: React.FC<PDFAppearanceTabProps> = ({
  callsheet,
  customization,
  onCustomizationChange
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const updateCustomization = (updates: Partial<PDFCustomization>) => {
    onCustomizationChange({ ...customization, ...updates });
  };

  const updateSections = (updates: Partial<typeof customization.sections>) => {
    updateCustomization({
      sections: { ...customization.sections, ...updates }
    });
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      console.log('=== PDFAppearanceTab Download Start ===');
      
      const service = new PDFService();
      await service.savePDF(callsheet, customization);
      console.log('PDF download completed successfully from PDFAppearanceTab');
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('=== PDFAppearanceTab Download Error ===');
      console.error('Error downloading PDF:', error);
      toast.error(`Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    setIsGenerating(true);
    try {
      console.log('=== PDFAppearanceTab Preview Start ===');
      
      const service = new PDFService();
      await service.previewPDF(callsheet, customization);
      console.log('PDF preview completed successfully from PDFAppearanceTab');
      toast.success('PDF preview opened in new tab!');
    } catch (error) {
      console.error('=== PDFAppearanceTab Preview Error ===');
      console.error('Error previewing PDF:', error);
      toast.error(`Failed to preview PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Settings Panel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Customize PDF Appearance</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview} disabled={isGenerating}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={isGenerating}>
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="themes" className="flex items-center gap-1">
              <Palette className="w-3 h-3" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-1">
              <Layout className="w-3 h-3" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-1">
              <Palette className="w-3 h-3" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-1">
              <Type className="w-3 h-3" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
              Branding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="space-y-4">
            <ThemeSelector
              customization={customization}
              onCustomizationChange={onCustomizationChange}
            />
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <LayoutCustomizationTab
              customization={customization}
              onCustomizationChange={onCustomizationChange}
            />
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <ColorCustomizationTab
              customization={customization}
              onCustomizationChange={onCustomizationChange}
            />
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            <TypographyCustomizationTab
              customization={customization}
              onCustomizationChange={onCustomizationChange}
            />
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <EnhancedBrandingTab
              customization={customization}
              onCustomizationChange={onCustomizationChange}
            />
            
            {/* Quick Section Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Section Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Contact Layout</Label>
                  <Select
                    value={customization.sections.formatting.contactLayout}
                    onValueChange={(value: any) => updateSections({
                      formatting: { ...customization.sections.formatting, contactLayout: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="cards">Cards</SelectItem>
                      <SelectItem value="table">Table</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Show Section Icons</Label>
                  <Switch
                    checked={customization.sections.formatting.showSectionIcons}
                    onCheckedChange={(checked) => updateSections({
                      formatting: { ...customization.sections.formatting, showSectionIcons: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Emergency Contacts Prominent</Label>
                  <Switch
                    checked={customization.sections.formatting.emergencyProminent}
                    onCheckedChange={(checked) => updateSections({
                      formatting: { ...customization.sections.formatting, emergencyProminent: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Alternate Row Colors</Label>
                  <Switch
                    checked={customization.sections.formatting.alternateRowColors}
                    onCheckedChange={(checked) => updateSections({
                      formatting: { ...customization.sections.formatting, alternateRowColors: checked }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Panel */}
      <div className="lg:sticky lg:top-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="max-h-[800px] overflow-auto bg-white border rounded-lg">
              <div 
                className="transform scale-[0.35] origin-top-left"
                style={{ 
                  width: '285.7%', // 100% / 0.35 to ensure content fills container properly
                  height: 'auto'
                }}
              >
                <CallsheetPDFPreview
                  callsheet={callsheet}
                  customization={customization}
                  className="shadow-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
