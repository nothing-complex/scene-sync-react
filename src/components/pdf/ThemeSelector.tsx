
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette } from 'lucide-react';
import { INDUSTRY_THEMES, IndustryThemeConfig } from '@/types/industryThemes';
import { PDFCustomization } from '@/types/pdfTypes';

interface ThemeSelectorProps {
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  customization,
  onCustomizationChange
}) => {
  const applyIndustryTheme = (themeConfig: IndustryThemeConfig) => {
    const updatedCustomization: PDFCustomization = {
      ...customization,
      theme: themeConfig.theme,
      colors: themeConfig.theme.colors,
      typography: { ...customization.typography, ...themeConfig.theme.typography },
      visual: themeConfig.theme.visual,
      layout: { ...customization.layout, template: themeConfig.id as any }
    };
    onCustomizationChange(updatedCustomization);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Quick Themes
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Start with a theme, then customize colors, typography, and layout in other tabs
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(INDUSTRY_THEMES).map((themeConfig) => {
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
                    <h4 className="font-medium text-sm">{themeConfig.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      Theme
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
                  
                  <div className="text-xs text-muted-foreground">
                    <div className="mb-1">
                      <span className="font-medium">Font:</span> {themeConfig.theme.typography.fontFamily}
                    </div>
                    <div>
                      <span className="font-medium">Style:</span> {themeConfig.theme.visual.cardStyle}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
