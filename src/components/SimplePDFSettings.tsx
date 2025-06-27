import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { LogoUpload } from './LogoUpload';
import { generateCustomCallsheetPDF, previewCallsheetPDF } from '@/services/pdfService';
import { generateExperimentalCallsheetPDF, previewExperimentalCallsheetPDF } from '@/services/experimentalPdfService';
import { PDFPreviewDialog } from './pdf/PDFPreviewDialog';
import { Eye, Download, Palette, Type, Layout, Settings, Beaker } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface SimplePDFSettingsProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const SimplePDFSettings = ({ 
  callsheet, 
  customization, 
  onCustomizationChange 
}: SimplePDFSettingsProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExperimentalGenerating, setIsExperimentalGenerating] = useState(false);
  
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    console.log('=== PDF Download Button Clicked ===');
    console.log('User Agent:', navigator.userAgent);
    console.log('Browser supports File System Access API:', 'showSaveFilePicker' in window);
    console.log('Callsheet data:', callsheet);
    console.log('Customization:', customization);
    
    try {
      // Enhanced validation
      if (!callsheet) {
        throw new Error('No callsheet data available');
      }
      if (!callsheet.projectTitle) {
        throw new Error('Project title is required');
      }
      if (!callsheet.shootDate) {
        throw new Error('Shoot date is required');
      }
      
      console.log('=== Starting PDF Generation ===');
      await generateCustomCallsheetPDF(callsheet, customization);
      console.log('=== PDF Generation Completed Successfully ===');
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('=== PDF Download Error ===');
      console.error('Error type:', typeof error);
      console.error('Error instanceof Error:', error instanceof Error);
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Show detailed error to user for debugging
      let errorMessage = 'Failed to download PDF. Please try again.';
      let debugInfo = '';
      
      if (error instanceof Error) {
        debugInfo = error.message;
        
        // Provide specific guidance based on error type
        if (error.message.includes('projectTitle')) {
          errorMessage = 'Project title is missing. Please ensure your callsheet has a title.';
        } else if (error.message.includes('shootDate')) {
          errorMessage = 'Shoot date is missing. Please ensure your callsheet has a date.';
        } else if (error.message.includes('Font')) {
          errorMessage = 'Font loading error. Please refresh the page and try again.';
        } else if (error.message.includes('blob is empty')) {
          errorMessage = 'PDF generation produced empty result. Please check your data and try again.';
        } else if (error.message.includes('download') || error.message.includes('Download')) {
          errorMessage = 'Download mechanism failed. This may be a browser security issue. Try using Chrome or Firefox.';
        } else if (error.message.includes('Object URL') || error.message.includes('createObjectURL')) {
          errorMessage = 'Browser download error. Please try refreshing the page and downloading again.';
        } else if (error.message.includes('click') || error.message.includes('Click')) {
          errorMessage = 'Download trigger failed. Please try a different browser or disable popup blockers.';
        } else {
          errorMessage = `PDF Error: ${error.message}`;
        }
      }
      
      console.error('User-facing error message:', errorMessage);
      console.error('Debug info for developers:', debugInfo);
      
      // Show error with debug info in development
      if (process.env.NODE_ENV === 'development') {
        toast.error(`${errorMessage}\n\nDebug: ${debugInfo}`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewPDF = async () => {
    setIsGenerating(true);
    console.log('=== Preview PDF Button Clicked ===');
    
    try {
      // DEBUGGING: Same validation for preview
      if (!callsheet || !callsheet.projectTitle || !callsheet.shootDate) {
        throw new Error('Missing required callsheet data for preview');
      }
      
      console.log('Starting PDF preview...');
      await previewCallsheetPDF(callsheet, customization);
      console.log('PDF preview successful');
      toast.success('PDF preview opened in new tab!');
    } catch (error) {
      console.error('=== PDF Preview Error Caught in Component ===');
      console.error('Error details:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      let errorMessage = 'Failed to preview PDF. Please try again.';
      if (error instanceof Error && error.message) {
        if (error.message.includes('popup')) {
          errorMessage = 'PDF preview blocked by browser. Please allow popups and try again.';
        } else {
          errorMessage = `Preview Error: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
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

  const handleExperimentalDownloadPDF = async () => {
    setIsExperimentalGenerating(true);
    try {
      await generateExperimentalCallsheetPDF(callsheet, customization);
      toast.success('Experimental PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating experimental PDF:', error);
      toast.error('Failed to download experimental PDF. Please try again.');
    } finally {
      setIsExperimentalGenerating(false);
    }
  };

  const updateCustomization = (section: keyof PDFCustomization, updates: any) => {
    onCustomizationChange({
      ...customization,
      [section]: {
        ...customization[section],
        ...updates
      }
    });
  };

  const updateNestedCustomization = (section: keyof PDFCustomization, subsection: string, updates: any) => {
    onCustomizationChange({
      ...customization,
      [section]: {
        ...customization[section],
        [subsection]: {
          ...(customization[section] as any)[subsection],
          ...updates
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Sections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tight">Layout Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Header Style</Label>
                  <Select 
                    value={customization.layout.headerStyle} 
                    onValueChange={(value: 'minimal' | 'professional' | 'creative' | 'cinematic') => 
                      updateCustomization('layout', { headerStyle: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border/50">
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
                  <Label className="text-sm font-medium mb-2 block">Page Orientation</Label>
                  <RadioGroup 
                    value={customization.layout.pageOrientation} 
                    onValueChange={(value: 'portrait' | 'landscape') => 
                      updateCustomization('layout', { pageOrientation: value })
                    }
                    className="flex flex-row space-x-8"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="portrait" id="portrait" />
                      <Label htmlFor="portrait" className="font-normal">Portrait</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="landscape" id="landscape" />
                      <Label htmlFor="landscape" className="font-normal">Landscape</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Card Style</Label>
                  <Select 
                    value={customization.visual.cardStyle} 
                    onValueChange={(value: 'minimal' | 'elevated' | 'bordered' | 'gradient') => 
                      updateCustomization('visual', { cardStyle: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border/50">
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
                  <Label className="text-sm font-medium mb-2 block">Section Dividers</Label>
                  <Select 
                    value={customization.visual.sectionDividers} 
                    onValueChange={(value: 'none' | 'line' | 'space' | 'accent') => 
                      updateCustomization('visual', { sectionDividers: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border/50">
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

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Corner Radius: {customization.visual.cornerRadius}px
                </Label>
                <Slider
                  value={[customization.visual.cornerRadius]}
                  onValueChange={([value]) => updateCustomization('visual', { cornerRadius: value })}
                  max={20}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Shadow Intensity</Label>
                <Select 
                  value={customization.visual.shadowIntensity} 
                  onValueChange={(value: 'none' | 'subtle' | 'medium') => 
                    updateCustomization('visual', { shadowIntensity: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="subtle">Subtle</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tight">Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Font Family</Label>
                <Select 
                  value={customization.typography.fontFamily} 
                  onValueChange={(value: 'inter' | 'helvetica' | 'poppins' | 'montserrat') => 
                    updateCustomization('typography', { fontFamily: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border/50">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Title Size: {customization.typography.fontSize.title}px
                  </Label>
                  <Slider
                    value={[customization.typography.fontSize.title]}
                    onValueChange={([value]) => 
                      updateNestedCustomization('typography', 'fontSize', { title: value })
                    }
                    max={48}
                    min={16}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Header Size: {customization.typography.fontSize.header}px
                  </Label>
                  <Slider
                    value={[customization.typography.fontSize.header]}
                    onValueChange={([value]) => 
                      updateNestedCustomization('typography', 'fontSize', { header: value })
                    }
                    max={24}
                    min={8}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Body Size: {customization.typography.fontSize.body}px
                  </Label>
                  <Slider
                    value={[customization.typography.fontSize.body]}
                    onValueChange={([value]) => 
                      updateNestedCustomization('typography', 'fontSize', { body: value })
                    }
                    max={18}
                    min={8}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Title Weight</Label>
                  <Select 
                    value={customization.typography.fontWeight.title} 
                    onValueChange={(value: 'normal' | 'medium' | 'semibold' | 'bold') => 
                      updateNestedCustomization('typography', 'fontWeight', { title: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Header Weight</Label>
                  <Select 
                    value={customization.typography.fontWeight.header} 
                    onValueChange={(value: 'normal' | 'medium' | 'semibold' | 'bold') => 
                      updateNestedCustomization('typography', 'fontWeight', { header: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Body Weight</Label>
                  <Select 
                    value={customization.typography.fontWeight.body} 
                    onValueChange={(value: 'normal' | 'medium') => 
                      updateNestedCustomization('typography', 'fontWeight', { body: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tight">Color Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Primary Color</Label>
                  <Input
                    type="color"
                    value={customization.colors.primary}
                    onChange={(e) => updateCustomization('colors', { primary: e.target.value })}
                    className="h-10 w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Secondary Color</Label>
                  <Input
                    type="color"
                    value={customization.colors.secondary}
                    onChange={(e) => updateCustomization('colors', { secondary: e.target.value })}
                    className="h-10 w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Accent Color</Label>
                  <Input
                    type="color"
                    value={customization.colors.accent}
                    onChange={(e) => updateCustomization('colors', { accent: e.target.value })}
                    className="h-10 w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Text Color</Label>
                  <Input
                    type="color"
                    value={customization.colors.text}
                    onChange={(e) => updateCustomization('colors', { text: e.target.value })}
                    className="h-10 w-full"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Header Background</Label>
                <Select 
                  value={customization.visual.headerBackground} 
                  onValueChange={(value: 'none' | 'subtle' | 'gradient' | 'solid') => 
                    updateCustomization('visual', { headerBackground: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="subtle">Subtle</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tight">Company Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <LogoUpload
                onLogoChange={(logoData) => 
                  updateCustomization('branding', { logo: logoData })
                }
                currentLogo={customization.branding.logo}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tight">Section Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-icons" className="text-sm font-medium">Show Section Icons</Label>
                  <Switch
                    id="show-icons"
                    checked={customization.sections.formatting.showSectionIcons}
                    onCheckedChange={(checked) => 
                      updateNestedCustomization('sections', 'formatting', { showSectionIcons: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="alternate-rows" className="text-sm font-medium">Alternate Row Colors</Label>
                  <Switch
                    id="alternate-rows"
                    checked={customization.sections.formatting.alternateRowColors}
                    onCheckedChange={(checked) => 
                      updateNestedCustomization('sections', 'formatting', { alternateRowColors: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="emergency-prominent" className="text-sm font-medium">Prominent Emergency Contacts</Label>
                  <Switch
                    id="emergency-prominent"
                    checked={customization.sections.formatting.emergencyProminent}
                    onCheckedChange={(checked) => 
                      updateNestedCustomization('sections', 'formatting', { emergencyProminent: checked })
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Contact Layout</Label>
                <Select 
                  value={customization.sections.formatting.contactLayout} 
                  onValueChange={(value: 'list' | 'table' | 'cards' | 'compact') => 
                    updateNestedCustomization('sections', 'formatting', { contactLayout: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="cards">Cards</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Section Visibility</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-weather" className="text-sm font-normal">Weather</Label>
                    <Switch
                      id="show-weather"
                      checked={customization.sections.visibility.weather}
                      onCheckedChange={(checked) => 
                        updateNestedCustomization('sections', 'visibility', { weather: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-emergency" className="text-sm font-normal">Emergency Contacts</Label>
                    <Switch
                      id="show-emergency"
                      checked={customization.sections.visibility.emergencyContacts}
                      onCheckedChange={(checked) => 
                        updateNestedCustomization('sections', 'visibility', { emergencyContacts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-schedule" className="text-sm font-normal">Schedule</Label>
                    <Switch
                      id="show-schedule"
                      checked={customization.sections.visibility.schedule}
                      onCheckedChange={(checked) => 
                        updateNestedCustomization('sections', 'visibility', { schedule: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-notes" className="text-sm font-normal">Special Notes</Label>
                    <Switch
                      id="show-notes"
                      checked={customization.sections.visibility.notes}
                      onCheckedChange={(checked) => 
                        updateNestedCustomization('sections', 'visibility', { notes: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate PDF */}
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

      {/* PDF Preview Dialog */}
      <PDFPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        callsheet={callsheet}
        customization={customization}
      />
    </div>
  );
};
