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
import { Eye, Palette, Type, Layout, Settings, Download, Sparkles, Image } from 'lucide-react';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION, PDF_THEMES } from '@/types/pdfTypes';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { ReactPDFService } from '@/services/reactPdfService';
import { useToast } from '@/hooks/use-toast';

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
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { toast } = useToast();

  const updateCustomization = (updates: Partial<PDFCustomization>) => {
    const newCustomization = { ...customization, ...updates };
    onCustomizationChange(newCustomization);
  };

  const handleThemeChange = (themeKey: string) => {
    const theme = PDF_THEMES[themeKey];
    if (theme) {
      updateCustomization({
        theme,
        colors: theme.colors,
        typography: { ...customization.typography, ...theme.typography },
        visual: theme.visual,
      });
    }
  };

  const handleLayoutChange = (field: string, value: any) => {
    updateCustomization({
      layout: { ...customization.layout, [field]: value }
    });
  };

  const handleTypographyChange = (section: string, field: string, value: any) => {
    if (section === '') {
      updateCustomization({
        typography: { ...customization.typography, [field]: value }
      });
    } else {
      updateCustomization({
        typography: { 
          ...customization.typography, 
          [section]: { 
            ...customization.typography[section as keyof typeof customization.typography], 
            [field]: value 
          }
        }
      });
    }
  };

  const handleVisualChange = (field: string, value: any) => {
    updateCustomization({
      visual: { ...customization.visual, [field]: value }
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

  const handleSectionsChange = (section: string, field: string, value: any) => {
    updateCustomization({
      sections: { 
        ...customization.sections, 
        [section]: { 
          ...customization.sections[section as keyof typeof customization.sections], 
          [field]: value 
        }
      }
    });
  };

  const handlePreviewPDF = async () => {
    setPreviewLoading(true);
    try {
      console.log('Generating PDF preview with customization:', customization);
      const pdfService = new ReactPDFService(customization);
      await pdfService.previewPDF(callsheet);
      toast({
        title: "PDF Preview Generated",
        description: "Opening PDF in new tab...",
      });
    } catch (error) {
      console.error('Failed to generate PDF preview:', error);
      toast({
        title: "Preview Failed",
        description: "Unable to generate PDF preview. Please check console for details.",
        variant: "destructive",
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      console.log('Downloading PDF with customization:', customization);
      const pdfService = new ReactPDFService(customization);
      await pdfService.savePDF(callsheet);
      toast({
        title: "PDF Downloaded",
        description: "Your callsheet PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download PDF. Please check console for details.",
        variant: "destructive",
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const resetToDefaults = () => {
    onCustomizationChange(DEFAULT_PDF_CUSTOMIZATION);
    toast({
      title: "Settings Reset",
      description: "PDF appearance settings have been reset to defaults.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-foreground tracking-tight">PDF Appearance</h3>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="font-normal"
          >
            Reset to Default
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviewPDF}
            disabled={previewLoading}
            className="font-normal"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewLoading ? 'Generating...' : 'Preview'}
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            disabled={downloadLoading}
            className="font-normal"
          >
            <Download className="w-4 h-4 mr-2" />
            {downloadLoading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-muted/30 rounded-lg p-1">
          <TabsTrigger value="themes" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Themes</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Layout className="w-4 h-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Typography</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Colors</span>
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Visual</span>
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center space-x-2 data-[state=active]:bg-background">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Sections</span>
          </TabsTrigger>
        </TabsList>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-4 mt-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium tracking-tight">Choose a Theme</CardTitle>
              <p className="text-sm text-muted-foreground">Pre-designed styles for different production types</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PDF_THEMES).map(([key, theme]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      customization.theme.name === theme.name
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-border/60'
                    }`}
                    onClick={() => handleThemeChange(key)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{theme.name}</h4>
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {key === 'minimal' && 'Clean, simple design with plenty of whitespace'}
                      {key === 'professional' && 'Traditional business style with clear hierarchy'}
                      {key === 'creative' && 'Vibrant colors and modern gradients'}
                      {key === 'cinematic' && 'Film industry standard with gold accents'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4 mt-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium tracking-tight">Layout & Spacing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Header Style</Label>
                <RadioGroup
                  value={customization.layout.headerStyle}
                  onValueChange={(value) => handleLayoutChange('headerStyle', value)}
                  className="grid grid-cols-2 gap-4"
                >
                  {['minimal', 'professional', 'creative', 'cinematic'].map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <RadioGroupItem value={style} id={style} />
                      <Label htmlFor={style} className="font-normal capitalize">{style}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Page Orientation</Label>
                  <Select
                    value={customization.layout.pageOrientation}
                    onValueChange={(value) => handleLayoutChange('pageOrientation', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Template</Label>
                  <Select
                    value={customization.layout.template}
                    onValueChange={(value) => handleLayoutChange('template', value)}
                  >
                    <SelectTrigger className="mt-2">
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
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-4 block">Spacing Controls</Label>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Section Gap: {customization.layout.spacing.sectionGap}pt
                    </Label>
                    <Slider
                      value={[customization.layout.spacing.sectionGap]}
                      onValueChange={([value]) => handleLayoutChange('spacing', {
                        ...customization.layout.spacing,
                        sectionGap: value
                      })}
                      max={40}
                      min={8}
                      step={2}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Item Gap: {customization.layout.spacing.itemGap}pt
                    </Label>
                    <Slider
                      value={[customization.layout.spacing.itemGap]}
                      onValueChange={([value]) => handleLayoutChange('spacing', {
                        ...customization.layout.spacing,
                        itemGap: value
                      })}
                      max={24}
                      min={4}
                      step={1}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Line Height: {customization.layout.spacing.lineHeight}
                    </Label>
                    <Slider
                      value={[customization.layout.spacing.lineHeight]}
                      onValueChange={([value]) => handleLayoutChange('spacing', {
                        ...customization.layout.spacing,
                        lineHeight: value
                      })}
                      max={2}
                      min={1.2}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-4 mt-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium tracking-tight">Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Font Family</Label>
                <Select
                  value={customization.typography.fontFamily}
                  onValueChange={(value) => handleTypographyChange('', 'fontFamily', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter (Modern)</SelectItem>
                    <SelectItem value="helvetica">Helvetica (Classic)</SelectItem>
                    <SelectItem value="poppins">Poppins (Friendly)</SelectItem>
                    <SelectItem value="montserrat">Montserrat (Professional)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-4 block">Font Sizes</Label>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(customization.typography.fontSize).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-sm text-muted-foreground mb-2 block capitalize">
                        {key}: {value}pt
                      </Label>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => handleTypographyChange('fontSize', key, newValue)}
                        max={key === 'title' ? 32 : key === 'header' ? 20 : 16}
                        min={key === 'caption' ? 6 : 8}
                        step={1}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-4 block">Font Weights</Label>
                <div className="space-y-4">
                  {Object.entries(customization.typography.fontWeight).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-sm font-medium mb-2 block capitalize">{key}</Label>
                      <Select
                        value={value}
                        onValueChange={(newValue) => handleTypographyChange('fontWeight', key, newValue)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="semibold">Semi Bold</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4 mt-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium tracking-tight">Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(customization.colors).filter(([key]) => key !== 'gradient').map(([key, value]) => (
                  <div key={key}>
                    <Label className="text-sm font-medium mb-2 block capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorsChange(key, e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorsChange(key, e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Tab */}
        <TabsContent value="visual" className="space-y-4 mt-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium tracking-tight">Visual Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Card Style</Label>
                  <Select
                    value={customization.visual.cardStyle}
                    onValueChange={(value) => handleVisualChange('cardStyle', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="elevated">Elevated</SelectItem>
                      <SelectItem value="bordered">Bordered</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Section Dividers</Label>
                  <Select
                    value={customization.visual.sectionDividers}
                    onValueChange={(value) => handleVisualChange('sectionDividers', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="space">Space</SelectItem>
                      <SelectItem value="accent">Accent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Header Background</Label>
                  <Select
                    value={customization.visual.headerBackground}
                    onValueChange={(value) => handleVisualChange('headerBackground', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="subtle">Subtle</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="solid">Solid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Shadow Intensity</Label>
                  <Select
                    value={customization.visual.shadowIntensity}
                    onValueChange={(value) => handleVisualChange('shadowIntensity', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="subtle">Subtle</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Corner Radius: {customization.visual.cornerRadius}px
                </Label>
                <Slider
                  value={[customization.visual.cornerRadius]}
                  onValueChange={([value]) => handleVisualChange('cornerRadius', value)}
                  max={16}
                  min={0}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4 mt-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium tracking-tight">Section Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Section Visibility</Label>
                <div className="space-y-3">
                  {Object.entries(customization.sections.visibility).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <Label className="font-normal capitalize">
                        Show {key.replace(/([A-Z])/g, ' $1')}
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => handleSectionsChange('visibility', key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium mb-4 block">Formatting Options</Label>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Contact Layout</Label>
                    <RadioGroup
                      value={customization.sections.formatting.contactLayout}
                      onValueChange={(value) => handleSectionsChange('formatting', 'contactLayout', value)}
                      className="grid grid-cols-2 gap-4"
                    >
                      {['list', 'table', 'cards', 'compact'].map((layout) => (
                        <div key={layout} className="flex items-center space-x-2">
                          <RadioGroupItem value={layout} id={layout} />
                          <Label htmlFor={layout} className="font-normal capitalize">{layout}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(customization.sections.formatting)
                      .filter(([key]) => typeof customization.sections.formatting[key as keyof typeof customization.sections.formatting] === 'boolean')
                      .map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <Label className="font-normal">
                          {key === 'scheduleCompact' && 'Compact Schedule'}
                          {key === 'emergencyProminent' && 'Prominent Emergency Contacts'}
                          {key === 'showSectionIcons' && 'Show Section Icons'}
                          {key === 'alternateRowColors' && 'Alternate Row Colors'}
                        </Label>
                        <Switch
                          checked={value as boolean}
                          onCheckedChange={(checked) => handleSectionsChange('formatting', key, checked)}
                        />
                      </div>
                    ))}
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
