import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Palette, Type, Layout, Settings } from 'lucide-react';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, PDF_THEMES } from '@/types/pdfTypes';
import { CallsheetPDFPreview } from './pdf/CallsheetPDFPreview';
import { ReactPDFService } from '@/services/pdf/service_backup';
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

  const updateBranding = (updates: Partial<typeof customization.branding>) => {
    updateCustomization({
      branding: { ...customization.branding, ...updates }
    });
  };

  const updateColors = (updates: Partial<typeof customization.colors>) => {
    updateCustomization({
      colors: { ...customization.colors, ...updates }
    });
  };

  const updateTypography = (updates: Partial<typeof customization.typography>) => {
    updateCustomization({
      typography: { ...customization.typography, ...updates }
    });
  };

  const updateLayout = (updates: Partial<typeof customization.layout>) => {
    updateCustomization({
      layout: { ...customization.layout, ...updates }
    });
  };

  const updateVisual = (updates: Partial<typeof customization.visual>) => {
    updateCustomization({
      visual: { ...customization.visual, ...updates }
    });
  };

  const updateSections = (updates: Partial<typeof customization.sections>) => {
    updateCustomization({
      sections: { ...customization.sections, ...updates }
    });
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
    updateBranding({
      logo: logoData ? {
        url: logoData.url,
        position: 'top-left',
        size: logoData.size,
        opacity: 1
      } : undefined
    });
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      console.log('=== PDFAppearanceTab Download Start ===');
      console.log('Using ReactPDFService with customization:', customization);
      
      const service = new ReactPDFService(customization);
      await service.savePDF(callsheet);
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
      console.log('Using ReactPDFService with customization:', customization);
      
      const service = new ReactPDFService(customization);
      await service.previewPDF(callsheet);
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
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: theme.colors.surface }}
                        />
                      </div>
                    </Button>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Custom Colors</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Primary Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={customization.colors.primary}
                          onChange={(e) => updateColors({ primary: e.target.value })}
                          className="w-8 h-8 rounded border"
                        />
                        <Input
                          value={customization.colors.primary}
                          onChange={(e) => updateColors({ primary: e.target.value })}
                          className="text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Accent Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={customization.colors.accent}
                          onChange={(e) => updateColors({ accent: e.target.value })}
                          className="w-8 h-8 rounded border"
                        />
                        <Input
                          value={customization.colors.accent}
                          onChange={(e) => updateColors({ accent: e.target.value })}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Layout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Header Style</Label>
                  <Select
                    value={customization.layout.headerStyle}
                    onValueChange={(value: any) => updateLayout({ headerStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Typography Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Font Family</Label>
                  <Select
                    value={customization.typography.fontFamily}
                    onValueChange={(value: any) => updateTypography({ fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="helvetica">Helvetica</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Title Size</Label>
                    <Input
                      type="number"
                      value={customization.typography.fontSize.title}
                      onChange={(e) => updateTypography({
                        fontSize: { ...customization.typography.fontSize, title: Number(e.target.value) }
                      })}
                      min="16"
                      max="40"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Body Size</Label>
                    <Input
                      type="number"
                      value={customization.typography.fontSize.body}
                      onChange={(e) => updateTypography({
                        fontSize: { ...customization.typography.fontSize, body: Number(e.target.value) }
                      })}
                      min="8"
                      max="16"
                    />
                  </div>
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
                
                {customization.branding.logo && (
                  <div>
                    <Label>Logo Position</Label>
                    <Select
                      value={customization.branding.logo.position}
                      onValueChange={(value: any) => updateBranding({
                        logo: { ...customization.branding.logo!, position: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-center">Top Center</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="header-left">Header Left</SelectItem>
                        <SelectItem value="header-center">Header Center</SelectItem>
                        <SelectItem value="header-right">Header Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={customization.branding.companyName || ''}
                    onChange={(e) => updateBranding({ companyName: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <Label>Footer Text</Label>
                  <Input
                    value={customization.branding.footer?.text || ''}
                    onChange={(e) => updateBranding({
                      footer: {
                        ...customization.branding.footer,
                        text: e.target.value,
                        position: customization.branding.footer?.position || 'center',
                        style: customization.branding.footer?.style || 'minimal'
                      }
                    })}
                    placeholder="Enter footer text"
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
