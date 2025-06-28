
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PDFCustomization } from '@/types/pdfTypes';

interface TypographyCustomizationTabProps {
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const TypographyCustomizationTab: React.FC<TypographyCustomizationTabProps> = ({
  customization,
  onCustomizationChange
}) => {
  const updateTypography = (updates: Partial<typeof customization.typography>) => {
    onCustomizationChange({
      ...customization,
      typography: { ...customization.typography, ...updates }
    });
  };

  const updateSectionFonts = (updates: Partial<typeof customization.typography.sectionFonts>) => {
    updateTypography({
      sectionFonts: { ...customization.typography.sectionFonts, ...updates }
    });
  };

  const updateFontSize = (updates: Partial<typeof customization.typography.fontSize>) => {
    updateTypography({
      fontSize: { ...customization.typography.fontSize, ...updates }
    });
  };

  const updateFontWeight = (updates: Partial<typeof customization.typography.fontWeight>) => {
    updateTypography({
      fontWeight: { ...customization.typography.fontWeight, ...updates }
    });
  };

  const updateLineHeight = (updates: Partial<typeof customization.typography.lineHeight>) => {
    updateTypography({
      lineHeight: { ...customization.typography.lineHeight, ...updates }
    });
  };

  const fontOptions = [
    { value: 'inter', label: 'Inter' },
    { value: 'helvetica', label: 'Helvetica' },
    { value: 'poppins', label: 'Poppins' },
    { value: 'montserrat', label: 'Montserrat' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'open-sans', label: 'Open Sans' },
    { value: 'lato', label: 'Lato' },
    { value: 'source-sans', label: 'Source Sans Pro' },
    { value: 'nunito', label: 'Nunito' },
    { value: 'raleway', label: 'Raleway' },
    { value: 'work-sans', label: 'Work Sans' },
    { value: 'playfair', label: 'Playfair Display' },
    { value: 'merriweather', label: 'Merriweather' },
    { value: 'crimson', label: 'Crimson Text' },
    { value: 'libre-baskerville', label: 'Libre Baskerville' },
    { value: 'pt-serif', label: 'PT Serif' }
  ];

  const weightOptions = [
    { value: 'normal', label: 'Normal (400)' },
    { value: 'medium', label: 'Medium (500)' },
    { value: 'semibold', label: 'Semibold (600)' },
    { value: 'bold', label: 'Bold (700)' }
  ];

  const FontSelector = ({ 
    label, 
    value, 
    onChange, 
    description 
  }: {
    label: string;
    value: string;
    onChange: (value: any) => void;
    description?: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fontOptions.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Global Font Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FontSelector
            label="Default Font Family"
            value={customization.typography.fontFamily}
            onChange={(value) => updateTypography({ fontFamily: value })}
            description="Base font for the entire document"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Section-Specific Fonts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FontSelector
            label="Title Font"
            value={customization.typography.sectionFonts.title}
            onChange={(value) => updateSectionFonts({ title: value })}
            description="Font for the main callsheet title"
          />
          <FontSelector
            label="Section Headers Font"
            value={customization.typography.sectionFonts.headers}
            onChange={(value) => updateSectionFonts({ headers: value })}
            description="Font for section titles (Cast, Crew, etc.)"
          />
          <FontSelector
            label="Body Text Font"
            value={customization.typography.sectionFonts.body}
            onChange={(value) => updateSectionFonts({ body: value })}
            description="Font for general body text"
          />
          <FontSelector
            label="Contact Information Font"
            value={customization.typography.sectionFonts.contacts}
            onChange={(value) => updateSectionFonts({ contacts: value })}
            description="Font for cast and crew contact details"
          />
          <FontSelector
            label="Schedule Font"
            value={customization.typography.sectionFonts.schedule}
            onChange={(value) => updateSectionFonts({ schedule: value })}
            description="Font for schedule table content"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Font Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Title Size: {customization.typography.fontSize.title}px
            </Label>
            <Slider
              value={[customization.typography.fontSize.title]}
              onValueChange={([value]) => updateFontSize({ title: value })}
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
              onValueChange={([value]) => updateFontSize({ header: value })}
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
              onValueChange={([value]) => updateFontSize({ body: value })}
              max={18}
              min={8}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Small Text Size: {customization.typography.fontSize.small}px
            </Label>
            <Slider
              value={[customization.typography.fontSize.small]}
              onValueChange={([value]) => updateFontSize({ small: value })}
              max={14}
              min={6}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Caption Size: {customization.typography.fontSize.caption}px
            </Label>
            <Slider
              value={[customization.typography.fontSize.caption]}
              onValueChange={([value]) => updateFontSize({ caption: value })}
              max={12}
              min={6}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Font Weights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Title Weight</Label>
            <Select 
              value={customization.typography.fontWeight.title} 
              onValueChange={(value: any) => updateFontWeight({ title: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weightOptions.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Header Weight</Label>
            <Select 
              value={customization.typography.fontWeight.header} 
              onValueChange={(value: any) => updateFontWeight({ header: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weightOptions.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Body Weight</Label>
            <Select 
              value={customization.typography.fontWeight.body} 
              onValueChange={(value: any) => updateFontWeight({ body: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal (400)</SelectItem>
                <SelectItem value="medium">Medium (500)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Line Heights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Title Line Height: {customization.typography.lineHeight.title}
            </Label>
            <Slider
              value={[customization.typography.lineHeight.title]}
              onValueChange={([value]) => updateLineHeight({ title: value })}
              max={2}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Header Line Height: {customization.typography.lineHeight.header}
            </Label>
            <Slider
              value={[customization.typography.lineHeight.header]}
              onValueChange={([value]) => updateLineHeight({ header: value })}
              max={2}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Body Line Height: {customization.typography.lineHeight.body}
            </Label>
            <Slider
              value={[customization.typography.lineHeight.body]}
              onValueChange={([value]) => updateLineHeight({ body: value })}
              max={2}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
