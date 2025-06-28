
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PDFCustomization } from '@/types/pdfTypes';
import { Separator } from '@/components/ui/separator';

interface LayoutCustomizationTabProps {
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const LayoutCustomizationTab: React.FC<LayoutCustomizationTabProps> = ({
  customization,
  onCustomizationChange
}) => {
  const updateCustomization = (updates: Partial<PDFCustomization>) => {
    onCustomizationChange({ ...customization, ...updates });
  };

  const updateLayout = (updates: Partial<typeof customization.layout>) => {
    updateCustomization({
      layout: { ...customization.layout, ...updates }
    });
  };

  const updateSpacing = (updates: Partial<typeof customization.layout.spacing>) => {
    updateLayout({
      spacing: { ...customization.layout.spacing, ...updates }
    });
  };

  const updateMargins = (updates: Partial<typeof customization.layout.margins>) => {
    updateLayout({
      margins: { ...customization.layout.margins, ...updates }
    });
  };

  const updateVisual = (updates: Partial<typeof customization.visual>) => {
    updateCustomization({
      visual: { ...customization.visual, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Alignment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Header Alignment</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-sm font-medium mb-3 block">Title & Project Name Alignment</Label>
          <RadioGroup 
            value={customization.layout.headerAlignment} 
            onValueChange={(value: 'left' | 'center' | 'right') => 
              updateLayout({ headerAlignment: value })
            }
            className="flex flex-row space-x-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="left" id="align-left" />
              <Label htmlFor="align-left" className="font-normal">Left</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="center" id="align-center" />
              <Label htmlFor="align-center" className="font-normal">Center</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="right" id="align-right" />
              <Label htmlFor="align-right" className="font-normal">Right</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Spacing Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spacing Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Section Gap: {customization.layout.spacing.sectionGap}px
            </Label>
            <Slider
              value={[customization.layout.spacing.sectionGap]}
              onValueChange={([value]) => updateSpacing({ sectionGap: value })}
              max={60}
              min={8}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Item Gap: {customization.layout.spacing.itemGap}px
            </Label>
            <Slider
              value={[customization.layout.spacing.itemGap]}
              onValueChange={([value]) => updateSpacing({ itemGap: value })}
              max={40}
              min={4}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Card Spacing: {customization.layout.spacing.cardSpacing}px
            </Label>
            <Slider
              value={[customization.layout.spacing.cardSpacing]}
              onValueChange={([value]) => updateSpacing({ cardSpacing: value })}
              max={32}
              min={4}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Line Height: {customization.layout.spacing.lineHeight}
            </Label>
            <Slider
              value={[customization.layout.spacing.lineHeight]}
              onValueChange={([value]) => updateSpacing({ lineHeight: value })}
              max={2.5}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Visual Style Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visual Style</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <Label className="text-sm font-medium mb-2 block">
              Border Width: {customization.layout.borderWidth}px
            </Label>
            <Slider
              value={[customization.layout.borderWidth]}
              onValueChange={([value]) => updateLayout({ borderWidth: value })}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Card Style</Label>
            <Select 
              value={customization.visual.cardStyle} 
              onValueChange={(value: 'minimal' | 'elevated' | 'bordered' | 'gradient') => 
                updateVisual({ cardStyle: value })
              }
            >
              <SelectTrigger>
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
              <SelectTrigger>
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

          <div>
            <Label className="text-sm font-medium mb-2 block">Shadow Intensity</Label>
            <Select 
              value={customization.visual.shadowIntensity} 
              onValueChange={(value: 'none' | 'subtle' | 'medium') => 
                updateVisual({ shadowIntensity: value })
              }
            >
              <SelectTrigger>
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

      {/* Page Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Page Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Page Orientation</Label>
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

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Top Margin: {customization.layout.margins.top}px
              </Label>
              <Slider
                value={[customization.layout.margins.top]}
                onValueChange={([value]) => updateMargins({ top: value })}
                max={80}
                min={16}
                step={4}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Bottom Margin: {customization.layout.margins.bottom}px
              </Label>
              <Slider
                value={[customization.layout.margins.bottom]}
                onValueChange={([value]) => updateMargins({ bottom: value })}
                max={80}
                min={16}
                step={4}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Left Margin: {customization.layout.margins.left}px
              </Label>
              <Slider
                value={[customization.layout.margins.left]}
                onValueChange={([value]) => updateMargins({ left: value })}
                max={80}
                min={16}
                step={4}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Right Margin: {customization.layout.margins.right}px
              </Label>
              <Slider
                value={[customization.layout.margins.right]}
                onValueChange={([value]) => updateMargins({ right: value })}
                max={80}
                min={16}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
