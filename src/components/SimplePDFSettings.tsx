
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { LogoUpload } from './LogoUpload';
import { LayoutTab } from './pdf/settings/LayoutTab';
import { ActionsTab } from './pdf/settings/ActionsTab';
import { Palette, Type, Layout, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const updateCustomization = (updates: Partial<PDFCustomization>) => {
    onCustomizationChange({ ...customization, ...updates });
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
          <LayoutTab 
            customization={customization}
            onCustomizationChange={updateCustomization}
          />
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
                    updateCustomization({ typography: { ...customization.typography, fontFamily: value } })
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
                    onChange={(e) => updateCustomization({ colors: { ...customization.colors, primary: e.target.value } })}
                    className="h-10 w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Accent Color</Label>
                  <Input
                    type="color"
                    value={customization.colors.accent}
                    onChange={(e) => updateCustomization({ colors: { ...customization.colors, accent: e.target.value } })}
                    className="h-10 w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tight">Company Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <LogoUpload
                onLogoChange={(logoData) => 
                  updateCustomization({ 
                    branding: { 
                      ...customization.branding, 
                      logo: logoData ? {
                        url: logoData.url,
                        size: logoData.size,
                        position: 'top-left',
                        opacity: 1
                      } : undefined
                    } 
                  })
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
                <h4 className="text-sm font-medium mb-3">Section Visibility</h4>
                <div className="space-y-3">
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

      <ActionsTab callsheet={callsheet} customization={customization} />
    </div>
  );
};
