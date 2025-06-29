
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PDFCustomization } from '@/types/pdfTypes';

interface LayoutTabProps {
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const LayoutTab = ({ customization, onCustomizationChange }: LayoutTabProps) => {
  const updateLayout = (updates: Partial<typeof customization.layout>) => {
    onCustomizationChange({
      ...customization,
      layout: {
        ...customization.layout,
        ...updates
      }
    });
  };

  const updateMargins = (updates: Partial<typeof customization.layout.margins>) => {
    onCustomizationChange({
      ...customization,
      layout: {
        ...customization.layout,
        margins: {
          ...customization.layout.margins,
          ...updates
        }
      }
    });
  };

  const updateSpacing = (updates: Partial<typeof customization.layout.spacing>) => {
    onCustomizationChange({
      ...customization,
      layout: {
        ...customization.layout,
        spacing: {
          ...customization.layout.spacing,
          ...updates
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-border/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium tracking-tight">Page Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Page Orientation</Label>
              <Select 
                value={customization.layout.pageOrientation} 
                onValueChange={(value: 'portrait' | 'landscape') => 
                  updateLayout({ pageOrientation: value })
                }
              >
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Header Alignment</Label>
              <Select 
                value={customization.layout.headerAlignment} 
                onValueChange={(value: 'left' | 'center' | 'right') => 
                  updateLayout({ headerAlignment: value })
                }
              >
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium tracking-tight">Page Margins & Bleed</CardTitle>
          <p className="text-sm text-muted-foreground">Control the printable area and bleed zones</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Top Margin: {customization.layout.margins.top}px
              </Label>
              <Slider
                value={[customization.layout.margins.top]}
                onValueChange={([value]) => updateMargins({ top: value })}
                max={80}
                min={10}
                step={2}
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
                min={10}
                step={2}
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
                min={10}
                step={2}
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
                min={10}
                step={2}
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-4">Quick Margin Presets</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => updateMargins({ top: 20, bottom: 20, left: 20, right: 20 })}
                className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded text-center"
              >
                Minimal (20px)
              </button>
              <button
                onClick={() => updateMargins({ top: 32, bottom: 32, left: 32, right: 32 })}
                className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded text-center"
              >
                Standard (32px)
              </button>
              <button
                onClick={() => updateMargins({ top: 48, bottom: 48, left: 48, right: 48 })}
                className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded text-center"
              >
                Wide (48px)
              </button>
              <button
                onClick={() => updateMargins({ top: 64, bottom: 64, left: 64, right: 64 })}
                className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded text-center"
              >
                Print Safe (64px)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium tracking-tight">Content Spacing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Section Gap: {customization.layout.spacing.sectionGap}px
              </Label>
              <Slider
                value={[customization.layout.spacing.sectionGap]}
                onValueChange={([value]) => updateSpacing({ sectionGap: value })}
                max={48}
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
                max={32}
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
                min={8}
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
                max={2}
                min={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
