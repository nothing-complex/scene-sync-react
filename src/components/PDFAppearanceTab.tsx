import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Palette, Type, Layout, Settings, Download } from 'lucide-react';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { ReactPDFService } from '@/services/reactPdfService';

interface PDFAppearanceTabProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const PDFAppearanceTab = ({ 
  callsheet, 
  customization, 
  onCustomizationChange 
}: PDFAppearanceTabProps) => {
  const [previewLoading, setPreviewLoading] = useState(false);

  const updateCustomization = (updates: Partial<PDFCustomization>) => {
    onCustomizationChange({ ...customization, ...updates });
  };

  const handleLayoutChange = (field: string, value: any) => {
    updateCustomization({
      layout: { ...customization.layout, [field]: value }
    });
  };

  const handleTypographyChange = (field: string, value: any) => {
    updateCustomization({
      typography: { ...customization.typography, [field]: value }
    });
  };

  const handleBrandingChange = (field: string, value: any) => {
    updateCustomization({
      branding: { ...customization.branding, [field]: value }
    });
  };

  const handleColorsChange = (field: string, value: string) => {
    updateCustomization({
      colors: { ...customization.colors, [field]: value }
    });
  };

  const handleSectionsChange = (field: string, value: any) => {
    updateCustomization({
      sections: { ...customization.sections, [field]: value }
    });
  };

  const handleLogoChange = (logoData: { url: string; size: 'small' | 'medium' | 'large' } | null) => {
    updateCustomization({
      branding: { 
        ...customization.branding, 
        logo: logoData ? {
          ...logoData,
          position: customization.branding.logo?.position || 'top-center'
        } : null
      }
    });
  };

  const handlePreviewPDF = async () => {
    setPreviewLoading(true);
    try {
      const pdfService = new ReactPDFService(customization);
      await pdfService.previewPDF(callsheet);
    } catch (error) {
      console.error('Failed to generate PDF preview:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const pdfService = new ReactPDFService(customization);
    await pdfService.savePDF(callsheet);
  };

  const resetToDefaults = () => {
    onCustomizationChange(DEFAULT_PDF_CUSTOMIZATION);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">PDF Appearance</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
          >
            Reset to Default
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviewPDF}
            disabled={previewLoading}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewLoading ? 'Generating...' : 'Preview'}
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="layout" className="flex items-center space-x-2">
            <Layout className="w-4 h-4" />
            <span>Layout</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center space-x-2">
            <Type className="w-4 h-4" />
            <span>Typography</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Colors</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Branding</span>
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Sections</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Header Style</Label>
                <RadioGroup
                  value={customization.layout.headerStyle}
                  onValueChange={(value) => handleLayoutChange('headerStyle', value)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="centered" id="centered" />
                    <Label htmlFor="centered">Centered</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="left" />
                    <Label htmlFor="left">Left Aligned</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Page Orientation</Label>
                  <Select
                    value={customization.layout.pageOrientation}
                    onValueChange={(value) => handleLayoutChange('pageOrientation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Margins (pt)</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div>
                    <Label className="text-xs">Top</Label>
                    <Input
                      type="number"
                      value={customization.layout.margins.top}
                      onChange={(e) => handleLayoutChange('margins', {
                        ...customization.layout.margins,
                        top: parseInt(e.target.value) || 20
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Bottom</Label>
                    <Input
                      type="number"
                      value={customization.layout.margins.bottom}
                      onChange={(e) => handleLayoutChange('margins', {
                        ...customization.layout.margins,
                        bottom: parseInt(e.target.value) || 20
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Left</Label>
                    <Input
                      type="number"
                      value={customization.layout.margins.left}
                      onChange={(e) => handleLayoutChange('margins', {
                        ...customization.layout.margins,
                        left: parseInt(e.target.value) || 20
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Right</Label>
                    <Input
                      type="number"
                      value={customization.layout.margins.right}
                      onChange={(e) => handleLayoutChange('margins', {
                        ...customization.layout.margins,
                        right: parseInt(e.target.value) || 20
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Section Spacing</Label>
                <div className="mt-2">
                  <Label className="text-sm text-muted-foreground">
                    Section Gap: {customization.layout.spacing.sectionGap}pt
                  </Label>
                  <Slider
                    value={[customization.layout.spacing.sectionGap]}
                    onValueChange={([value]) => handleLayoutChange('spacing', {
                      ...customization.layout.spacing,
                      sectionGap: value
                    })}
                    max={40}
                    min={10}
                    step={2}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Font Family</Label>
                <Select
                  value={customization.typography.fontFamily}
                  onValueChange={(value) => handleTypographyChange('fontFamily', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                    <SelectItem value="arial">Arial</SelectItem>
                    <SelectItem value="times">Times New Roman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label>Font Sizes</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Title: {customization.typography.fontSize.title}pt</Label>
                    <Slider
                      value={[customization.typography.fontSize.title]}
                      onValueChange={([value]) => handleTypographyChange('fontSize', {
                        ...customization.typography.fontSize,
                        title: value
                      })}
                      max={30}
                      min={14}
                      step={1}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Header: {customization.typography.fontSize.header}pt</Label>
                    <Slider
                      value={[customization.typography.fontSize.header]}
                      onValueChange={([value]) => handleTypographyChange('fontSize', {
                        ...customization.typography.fontSize,
                        header: value
                      })}
                      max={20}
                      min={10}
                      step={1}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Body: {customization.typography.fontSize.body}pt</Label>
                    <Slider
                      value={[customization.typography.fontSize.body]}
                      onValueChange={([value]) => handleTypographyChange('fontSize', {
                        ...customization.typography.fontSize,
                        body: value
                      })}
                      max={14}
                      min={8}
                      step={1}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Small: {customization.typography.fontSize.small}pt</Label>
                    <Slider
                      value={[customization.typography.fontSize.small]}
                      onValueChange={([value]) => handleTypographyChange('fontSize', {
                        ...customization.typography.fontSize,
                        small: value
                      })}
                      max={12}
                      min={6}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <Input
                    type="color"
                    value={customization.colors.primary}
                    onChange={(e) => handleColorsChange('primary', e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label>Secondary Color</Label>
                  <Input
                    type="color"
                    value={customization.colors.secondary}
                    onChange={(e) => handleColorsChange('secondary', e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={customization.colors.text}
                    onChange={(e) => handleColorsChange('text', e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label>Accent Color</Label>
                  <Input
                    type="color"
                    value={customization.colors.accent}
                    onChange={(e) => handleColorsChange('accent', e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={customization.branding.companyName || ''}
                  onChange={(e) => handleBrandingChange('companyName', e.target.value)}
                  placeholder="Your Production Company"
                />
              </div>

              <Separator />

              <div>
                <Label>Footer Text</Label>
                <Input
                  value={customization.branding.footer?.text || ''}
                  onChange={(e) => handleBrandingChange('footer', {
                    ...customization.branding.footer,
                    text: e.target.value
                  })}
                  placeholder="© 2024 Your Company"
                />
              </div>

              <div>
                <Label>Footer Position</Label>
                <Select
                  value={customization.branding.footer?.position || 'center'}
                  onValueChange={(value) => handleBrandingChange('footer', {
                    ...customization.branding.footer,
                    position: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Visibility & Formatting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base">Section Visibility</Label>
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between">
                    <Label>Show Weather</Label>
                    <Switch
                      checked={customization.sections.visibility.weather}
                      onCheckedChange={(checked) => handleSectionsChange('visibility', {
                        ...customization.sections.visibility,
                        weather: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Emergency Contacts</Label>
                    <Switch
                      checked={customization.sections.visibility.emergencyContacts}
                      onCheckedChange={(checked) => handleSectionsChange('visibility', {
                        ...customization.sections.visibility,
                        emergencyContacts: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Schedule</Label>
                    <Switch
                      checked={customization.sections.visibility.schedule}
                      onCheckedChange={(checked) => handleSectionsChange('visibility', {
                        ...customization.sections.visibility,
                        schedule: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Notes</Label>
                    <Switch
                      checked={customization.sections.visibility.notes}
                      onCheckedChange={(checked) => handleSectionsChange('visibility', {
                        ...customization.sections.visibility,
                        notes: checked
                      })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base">Formatting Options</Label>
                <div className="space-y-3 mt-3">
                  <div>
                    <Label>Contact Layout</Label>
                    <RadioGroup
                      value={customization.sections.formatting.contactLayout}
                      onValueChange={(value) => handleSectionsChange('formatting', {
                        ...customization.sections.formatting,
                        contactLayout: value
                      })}
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="list" id="list" />
                        <Label htmlFor="list">List</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="table" id="table" />
                        <Label htmlFor="table">Table</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Compact Schedule</Label>
                    <Switch
                      checked={customization.sections.formatting.scheduleCompact}
                      onCheckedChange={(checked) => handleSectionsChange('formatting', {
                        ...customization.sections.formatting,
                        scheduleCompact: checked
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Prominent Emergency Contacts</Label>
                    <Switch
                      checked={customization.sections.formatting.emergencyProminent}
                      onCheckedChange={(checked) => handleSectionsChange('formatting', {
                        ...customization.sections.formatting,
                        emergencyProminent: checked
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
