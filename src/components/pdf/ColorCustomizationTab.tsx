
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PDFCustomization } from '@/types/pdfTypes';
import { Palette, Type, Eye, Square } from 'lucide-react';

interface ColorCustomizationTabProps {
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const ColorCustomizationTab: React.FC<ColorCustomizationTabProps> = ({
  customization,
  onCustomizationChange
}) => {
  const updateColors = (updates: Partial<typeof customization.colors>) => {
    onCustomizationChange({
      ...customization,
      colors: { ...customization.colors, ...updates }
    });
  };

  const ColorInput = ({ label, value, onChange, description }: {
    label: string;
    value: string;
    onChange: (color: string) => void;
    description?: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <div className="flex items-center gap-3">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 p-1 border rounded cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  return (
    <Tabs defaultValue="main" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="main" className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Main
        </TabsTrigger>
        <TabsTrigger value="text" className="flex items-center gap-2">
          <Type className="w-4 h-4" />
          Text
        </TabsTrigger>
        <TabsTrigger value="backgrounds" className="flex items-center gap-2">
          <Square className="w-4 h-4" />
          Backgrounds
        </TabsTrigger>
        <TabsTrigger value="sections" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Sections
        </TabsTrigger>
      </TabsList>

      <TabsContent value="main" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Primary Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorInput
              label="Primary Color"
              value={customization.colors.primary}
              onChange={(color) => updateColors({ primary: color })}
              description="Main brand color"
            />
            <ColorInput
              label="Secondary Color"
              value={customization.colors.secondary}
              onChange={(color) => updateColors({ secondary: color })}
              description="Supporting brand color"
            />
            <ColorInput
              label="Accent Color"
              value={customization.colors.accent}
              onChange={(color) => updateColors({ accent: color })}
              description="Highlight and emphasis color"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Border Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorInput
              label="Main Border"
              value={customization.colors.border}
              onChange={(color) => updateColors({ border: color })}
            />
            <ColorInput
              label="Light Border"
              value={customization.colors.borderLight}
              onChange={(color) => updateColors({ borderLight: color })}
            />
            <ColorInput
              label="Contact Card Border"
              value={customization.colors.contactCardBorder}
              onChange={(color) => updateColors({ contactCardBorder: color })}
            />
            <ColorInput
              label="Schedule Border"
              value={customization.colors.scheduleBorder}
              onChange={(color) => updateColors({ scheduleBorder: color })}
            />
            <ColorInput
              label="Emergency Border"
              value={customization.colors.emergencyBorder}
              onChange={(color) => updateColors({ emergencyBorder: color })}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="text" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">General Text Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorInput
              label="Main Text"
              value={customization.colors.text}
              onChange={(color) => updateColors({ text: color })}
            />
            <ColorInput
              label="Light Text"
              value={customization.colors.textLight}
              onChange={(color) => updateColors({ textLight: color })}
            />
            <ColorInput
              label="Title Text"
              value={customization.colors.titleText}
              onChange={(color) => updateColors({ titleText: color })}
            />
            <ColorInput
              label="Header Text"
              value={customization.colors.headerText}
              onChange={(color) => updateColors({ headerText: color })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Text Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorInput
              label="Contact Name"
              value={customization.colors.contactNameText}
              onChange={(color) => updateColors({ contactNameText: color })}
            />
            <ColorInput
              label="Contact Role"
              value={customization.colors.contactRoleText}
              onChange={(color) => updateColors({ contactRoleText: color })}
            />
            <ColorInput
              label="Contact Details"
              value={customization.colors.contactDetailsText}
              onChange={(color) => updateColors({ contactDetailsText: color })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Schedule & Emergency Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorInput
              label="Schedule Header Text"
              value={customization.colors.scheduleHeaderText}
              onChange={(color) => updateColors({ scheduleHeaderText: color })}
            />
            <ColorInput
              label="Schedule Body Text"
              value={customization.colors.scheduleBodyText}
              onChange={(color) => updateColors({ scheduleBodyText: color })}
            />
            <ColorInput
              label="Emergency Text"
              value={customization.colors.emergencyText}
              onChange={(color) => updateColors({ emergencyText: color })}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="backgrounds" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Main Backgrounds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorInput
              label="Page Background"
              value={customization.colors.background}
              onChange={(color) => updateColors({ background: color })}
            />
            <ColorInput
              label="Surface Background"
              value={customization.colors.surface}
              onChange={(color) => updateColors({ surface: color })}
            />
            <ColorInput
              label="Surface Hover"
              value={customization.colors.surfaceHover}
              onChange={(color) => updateColors({ surfaceHover: color })}
            />
            <ColorInput
              label="Header Background"
              value={customization.colors.headerBackground}
              onChange={(color) => updateColors({ headerBackground: color })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Section Backgrounds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorInput
              label="Contact Card Background"
              value={customization.colors.contactCardBackground}
              onChange={(color) => updateColors({ contactCardBackground: color })}
            />
            <ColorInput
              label="Schedule Background"
              value={customization.colors.scheduleBackground}
              onChange={(color) => updateColors({ scheduleBackground: color })}
            />
            <ColorInput
              label="Schedule Row"
              value={customization.colors.scheduleRowBackground}
              onChange={(color) => updateColors({ scheduleRowBackground: color })}
            />
            <ColorInput
              label="Schedule Row Alternate"
              value={customization.colors.scheduleRowAlternate}
              onChange={(color) => updateColors({ scheduleRowAlternate: color })}
            />
            <ColorInput
              label="Emergency Background"
              value={customization.colors.emergencyBackground}
              onChange={(color) => updateColors({ emergencyBackground: color })}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sections" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Section Accent Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorInput
              label="Cast Section"
              value={customization.colors.castSectionColor}
              onChange={(color) => updateColors({ castSectionColor: color })}
            />
            <ColorInput
              label="Crew Section"
              value={customization.colors.crewSectionColor}
              onChange={(color) => updateColors({ crewSectionColor: color })}
            />
            <ColorInput
              label="Schedule Section"
              value={customization.colors.scheduleSectionColor}
              onChange={(color) => updateColors({ scheduleSectionColor: color })}
            />
            <ColorInput
              label="Emergency Section"
              value={customization.colors.emergencySectionColor}
              onChange={(color) => updateColors({ emergencySectionColor: color })}
            />
            <ColorInput
              label="Notes Section"
              value={customization.colors.notesSectionColor}
              onChange={(color) => updateColors({ notesSectionColor: color })}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
