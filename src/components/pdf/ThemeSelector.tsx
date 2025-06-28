
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Film, Tv, Camera, FileText, Palette, Zap } from 'lucide-react';
import { INDUSTRY_THEMES, IndustryThemeConfig, DEPARTMENT_COLORS } from '@/types/industryThemes';
import { PDFCustomization } from '@/types/pdfTypes';

interface ThemeSelectorProps {
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  customization,
  onCustomizationChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoryIcons = {
    film: Film,
    tv: Tv,
    commercial: Camera,
    documentary: FileText
  };

  const urgencyColors = {
    standard: '#6b7280',
    rush: '#f59e0b',
    priority: '#dc2626'
  };

  const filteredThemes = selectedCategory === 'all' 
    ? Object.values(INDUSTRY_THEMES)
    : Object.values(INDUSTRY_THEMES).filter(theme => theme.category === selectedCategory);

  const applyIndustryTheme = (themeConfig: IndustryThemeConfig) => {
    const updatedCustomization: PDFCustomization = {
      ...customization,
      theme: themeConfig.theme,
      colors: themeConfig.theme.colors,
      typography: { ...customization.typography, ...themeConfig.theme.typography },
      visual: themeConfig.theme.visual,
      layout: { ...customization.layout, template: themeConfig.id as any },
      smart: {
        ...customization.smart,
        ...themeConfig.smartDefaults
      },
      sections: {
        ...customization.sections,
        formatting: {
          ...customization.sections.formatting,
          departmentColorCoding: themeConfig.smartDefaults.departmentColors,
          urgencyHighlighting: themeConfig.smartDefaults.urgencyLevel !== 'standard'
        }
      }
    };
    onCustomizationChange(updatedCustomization);
  };

  const updateSmartFeatures = (updates: Partial<typeof customization.smart>) => {
    onCustomizationChange({
      ...customization,
      smart: { ...customization.smart, ...updates }
    });
  };

  const updateSectionFormatting = (updates: Partial<typeof customization.sections.formatting>) => {
    onCustomizationChange({
      ...customization,
      sections: {
        ...customization.sections,
        formatting: { ...customization.sections.formatting, ...updates }
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Industry Themes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="film" className="flex items-center gap-1">
                <Film className="w-3 h-3" />
                Film
              </TabsTrigger>
              <TabsTrigger value="tv" className="flex items-center gap-1">
                <Tv className="w-3 h-3" />
                TV
              </TabsTrigger>
              <TabsTrigger value="commercial" className="flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Commercial
              </TabsTrigger>
              <TabsTrigger value="documentary" className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Documentary
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map((themeConfig) => {
              const IconComponent = categoryIcons[themeConfig.category];
              const isSelected = customization.theme.name === themeConfig.theme.name;
              
              return (
                <Card
                  key={themeConfig.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => applyIndustryTheme(themeConfig)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <h4 className="font-medium text-sm">{themeConfig.name}</h4>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {themeConfig.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {themeConfig.description}
                    </p>
                    
                    <div className="flex gap-1 mb-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: themeConfig.theme.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: themeConfig.theme.colors.accent }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: themeConfig.theme.colors.surface }}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {themeConfig.smartDefaults.unionCompliant && (
                        <Badge variant="outline" className="text-xs">Union</Badge>
                      )}
                      {themeConfig.smartDefaults.departmentColors && (
                        <Badge variant="outline" className="text-xs">Dept Colors</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Smart Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Production Type</Label>
              <Select
                value={customization.smart.productionType}
                onValueChange={(value: any) => updateSmartFeatures({ productionType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature Film</SelectItem>
                  <SelectItem value="short">Short Film</SelectItem>
                  <SelectItem value="series">TV Series</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Urgency Level</Label>
              <Select
                value={customization.smart.urgencyLevel}
                onValueChange={(value: any) => updateSmartFeatures({ urgencyLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="rush">Rush</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: urgencyColors[customization.smart.urgencyLevel] }}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {customization.smart.urgencyLevel} priority
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Union Compliant</Label>
                <p className="text-xs text-muted-foreground">Include required union information</p>
              </div>
              <Switch
                checked={customization.smart.unionCompliant}
                onCheckedChange={(checked) => updateSmartFeatures({ unionCompliant: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Department Colors</Label>
                <p className="text-xs text-muted-foreground">Color-code by department role</p>
              </div>
              <Switch
                checked={customization.smart.departmentColors}
                onCheckedChange={(checked) => {
                  updateSmartFeatures({ departmentColors: checked });
                  updateSectionFormatting({ departmentColorCoding: checked });
                }}
              />
            </div>
          </div>

          {customization.smart.departmentColors && (
            <div className="space-y-2">
              <Label className="text-sm">Department Color Preview</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                {Object.entries(DEPARTMENT_COLORS).map(([dept, color]) => (
                  <div key={dept} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="capitalize">{dept}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
