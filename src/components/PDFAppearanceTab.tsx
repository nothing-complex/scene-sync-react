
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Download, Eye, Palette, Type, Layout, Settings } from 'lucide-react';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, PDF_THEMES } from '@/types/pdfTypes';
import { CallsheetPDFPreview } from './pdf/CallsheetPDFPreview';
import { PDFService } from '@/services/pdf/PDFService';
import { LogoUpload } from './LogoUpload';
import { toast } from 'sonner';

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

  const handleThemeChange = (themeName: string) => {
    const theme = PDF_THEMES[themeName];
    if (theme) {
      updateCustomization({
        theme: theme,
        colors: theme.colors,
        typography: { ...customization.typography, ...theme.typography },
        visual: theme.visual
      });
    }
  };

  const handleLogoChange = (logoData: { url: string; size: 'small' | 'medium' | 'large' } | null) => {
    updateCustomization({
      branding: {
        ...customization.branding,
        logo: logoData ? {
          url: logoData.url,
          position: 'top-left',
          size: logoData.size,
          opacity: 1
        } : undefined
      }
    });
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      console.log('PDFAppearanceTab: Starting download with new PDFService');
      const service = new PDFService(customization);
      await service.downloadPDF(callsheet);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDFAppearanceTab: Download error:', error);
      toast.error(`Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    setIsGenerating(true);
    try {
      console.log('PDFAppearanceTab: Starting preview with new PDFService');
      const service = new PDFService(customization);
      await service.previewPDF(callsheet);
      toast.success('PDF preview opened in new tab!');
    } catch (error) {
      console.error('PDFAppearanceTab: Preview error:', error);
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

        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="theme" className="flex items-center gap-1">
              <Palette className="w-3 h-3" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-1">
              <Layout className="w-3 h-3" />
              Layout
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

          <TabsContent value="theme" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Theme Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(PDF_THEMES).map(([key, theme]) => (
                    <Button
                      key={key}
                      variant={customization.theme.name === theme.name ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col items-start"
                      onClick={() => handleThemeChange(key)}
                    >
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className="flex gap-1 mt-1">
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Branding & Logo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LogoUpload
                  onLogoChange={handleLogoChange}
                  currentLogo={customization.branding.logo ? {
                    url: customization.branding.logo.url,
                    size: customization.branding.logo.size
                  } : null}
                />
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
          <CardContent className="p-0">
            <div className="max-h-[800px] overflow-auto bg-gray-50 dark:bg-gray-900">
              <div className="transform scale-50 origin-top-left" style={{ width: '200%' }}>
                <CallsheetPDFPreview
                  callsheet={callsheet}
                  customization={customization}
                  className="shadow-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
