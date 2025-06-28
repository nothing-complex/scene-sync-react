
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building2, Tv, FileText } from 'lucide-react';
import { PDFCustomization } from '@/types/pdfTypes';
import { LogoUpload } from '../LogoUpload';

interface EnhancedBrandingTabProps {
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const EnhancedBrandingTab: React.FC<EnhancedBrandingTabProps> = ({
  customization,
  onCustomizationChange
}) => {
  const updateBranding = (updates: Partial<typeof customization.branding>) => {
    onCustomizationChange({
      ...customization,
      branding: { ...customization.branding, ...updates }
    });
  };

  const handlePrimaryLogoChange = (logoData: { url: string; size: 'small' | 'medium' | 'large' } | null) => {
    updateBranding({
      logo: logoData ? {
        url: logoData.url,
        position: customization.branding.logo?.position || 'top-left',
        size: logoData.size,
        opacity: 1
      } : undefined
    });
  };

  const handleSecondaryLogoChange = (logoData: { url: string; size: 'small' | 'medium' | 'large' } | null) => {
    updateBranding({
      secondaryLogo: logoData ? {
        url: logoData.url,
        position: customization.branding.secondaryLogo?.position || 'top-right',
        size: logoData.size,
        opacity: 1
      } : undefined
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Production Company</Label>
              <Input
                value={customization.branding.companyName || ''}
                onChange={(e) => updateBranding({ companyName: e.target.value })}
                placeholder="Enter production company name"
              />
            </div>
            
            <div>
              <Label>Secondary Company</Label>
              <Input
                value={customization.branding.productionCompany || ''}
                onChange={(e) => updateBranding({ productionCompany: e.target.value })}
                placeholder="Enter secondary company name"
              />
            </div>
          </div>

          {customization.smart.productionType === 'series' && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Tv className="w-4 h-4" />
                    Network/Platform
                  </Label>
                  <Input
                    value={customization.branding.network || ''}
                    onChange={(e) => updateBranding({ network: e.target.value })}
                    placeholder="Netflix, HBO, etc."
                  />
                </div>
                
                <div>
                  <Label>Season</Label>
                  <Input
                    value={customization.branding.season || ''}
                    onChange={(e) => updateBranding({ season: e.target.value })}
                    placeholder="Season 1"
                  />
                </div>
                
                <div>
                  <Label>Episode</Label>
                  <Input
                    value={customization.branding.episode || ''}
                    onChange={(e) => updateBranding({ episode: e.target.value })}
                    placeholder="Episode 101"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Primary Logo</Label>
            <p className="text-sm text-muted-foreground mb-3">Main production company logo</p>
            <LogoUpload
              onLogoChange={handlePrimaryLogoChange}
              currentLogo={customization.branding.logo ? {
                url: customization.branding.logo.url,
                size: customization.branding.logo.size
              } : null}
            />
            
            {customization.branding.logo && (
              <div className="mt-3">
                <Label>Primary Logo Position</Label>
                <Select
                  value={customization.branding.logo.position}
                  onValueChange={(value: any) => updateBranding({
                    logo: { ...customization.branding.logo!, position: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="header-left">Header Left</SelectItem>
                    <SelectItem value="header-center">Header Center</SelectItem>
                    <SelectItem value="header-right">Header Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <Label className="text-base font-medium">Secondary Logo</Label>
            <p className="text-sm text-muted-foreground mb-3">Network, distributor, or sponsor logo</p>
            <LogoUpload
              onLogoChange={handleSecondaryLogoChange}
              currentLogo={customization.branding.secondaryLogo ? {
                url: customization.branding.secondaryLogo.url,
                size: customization.branding.secondaryLogo.size
              } : null}
            />
            
            {customization.branding.secondaryLogo && (
              <div className="mt-3">
                <Label>Secondary Logo Position</Label>
                <Select
                  value={customization.branding.secondaryLogo.position}
                  onValueChange={(value: any) => updateBranding({
                    secondaryLogo: { ...customization.branding.secondaryLogo!, position: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="header-left">Header Left</SelectItem>
                    <SelectItem value="header-center">Header Center</SelectItem>
                    <SelectItem value="header-right">Header Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Footer & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Footer Text</Label>
            <Input
              value={customization.branding.footer?.text || ''}
              onChange={(e) => updateBranding({
                footer: {
                  ...customization.branding.footer,
                  text: e.target.value,
                  position: customization.branding.footer?.position || 'center',
                  style: customization.branding.footer?.style || 'minimal'
                }
              })}
              placeholder="Copyright notice, contact info, etc."
            />
          </div>

          {customization.smart.unionCompliant && (
            <div className="flex items-center justify-between">
              <div>
                <Label>Include Union Compliance Text</Label>
                <p className="text-xs text-muted-foreground">Add required union information to footer</p>
              </div>
              <Switch
                checked={customization.branding.footer?.unionCompliance || false}
                onCheckedChange={(checked) => updateBranding({
                  footer: {
                    ...customization.branding.footer,
                    text: customization.branding.footer?.text || '',
                    position: customization.branding.footer?.position || 'center',
                    style: customization.branding.footer?.style || 'minimal',
                    unionCompliance: checked
                  }
                })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Footer Position</Label>
              <Select
                value={customization.branding.footer?.position || 'center'}
                onValueChange={(value: any) => updateBranding({
                  footer: {
                    ...customization.branding.footer,
                    text: customization.branding.footer?.text || '',
                    position: value,
                    style: customization.branding.footer?.style || 'minimal'
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Footer Style</Label>
              <Select
                value={customization.branding.footer?.style || 'minimal'}
                onValueChange={(value: any) => updateBranding({
                  footer: {
                    ...customization.branding.footer,
                    text: customization.branding.footer?.text || '',
                    position: customization.branding.footer?.position || 'center',
                    style: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="bordered">Bordered</SelectItem>
                  <SelectItem value="accent">Accent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
