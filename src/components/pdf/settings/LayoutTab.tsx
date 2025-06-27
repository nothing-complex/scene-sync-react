
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { PDFCustomization } from '@/types/pdfTypes';

interface LayoutTabProps {
  customization: PDFCustomization;
  onCustomizationChange: (updates: Partial<PDFCustomization>) => void;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({
  customization,
  onCustomizationChange
}) => {
  const updateLayout = (updates: Partial<typeof customization.layout>) => {
    onCustomizationChange({
      layout: { ...customization.layout, ...updates }
    });
  };

  const updateVisual = (updates: Partial<typeof customization.visual>) => {
    onCustomizationChange({
      visual: { ...customization.visual, ...updates }
    });
  };

  return (
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
                updateLayout({ headerStyle: value })
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
                updateLayout({ pageOrientation: value })
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
                updateVisual({ cardStyle: value })
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
                updateVisual({ sectionDividers: value })
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
            onValueChange={([value]) => updateVisual({ cornerRadius: value })}
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
              updateVisual({ shadowIntensity: value })
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
  );
};
