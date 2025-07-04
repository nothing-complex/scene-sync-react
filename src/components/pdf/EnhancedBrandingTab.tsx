
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { LogoUpload } from '../LogoUpload';
import { PDFCustomization } from '@/types/pdfTypes';

interface EnhancedBrandingTabProps {
  customization: PDFCustomization;
  onCustomizationChange: (customization: PDFCustomization) => void;
}

export const EnhancedBrandingTab: React.FC<EnhancedBrandingTabProps> = ({
  customization,
  onCustomizationChange
}) => {
  const updateCustomization = (updates: Partial<PDFCustomization>) => {
    onCustomizationChange({ ...customization, ...updates });
  };

  const updateBranding = (updates: Partial<typeof customization.branding>) => {
    updateCustomization({
      branding: { ...customization.branding, ...updates }
    });
  };

  const handleLogoChange = (logoData: { url: string; size: 'small' | 'medium' | 'large' } | null) => {
    updateBranding({
      logo: logoData ? {
        url: logoData.url,
        position: customization.branding.logo?.position || 'top-left',
        size: logoData.size,
        opacity: customization.branding.logo?.opacity || 1
      } : undefined
    });
  };

  const handleSecondaryLogoChange = (logoData: { url: string; size: 'small' | 'medium' | 'large' } | null) => {
    updateBranding({
      secondaryLogo: logoData ? {
        url: logoData.url,
        position: customization.branding.secondaryLogo?.lockToPrimary ? 
          (customization.branding.logo?.position || 'top-right') : 
          (customization.branding.secondaryLogo?.position || 'top-right'),
        size: logoData.size,
        opacity: customization.branding.secondaryLogo?.opacity || 1,
        lockToPrimary: customization.branding.secondaryLogo?.lockToPrimary ?? true
      } : undefined
    });
  };

  const handleSecondaryLogoLockChange = (locked: boolean) => {
    if (customization.branding.secondaryLogo) {
      updateBranding({
        secondaryLogo: {
          ...customization.branding.secondaryLogo,
          lockToPrimary: locked,
          position: locked ? 
            (customization.branding.logo?.position || 'top-right') : 
            customization.branding.secondaryLogo.position
        }
      });
    }
  };

  const logoPositions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'center-left', label: 'Center Left' },
    { value: 'center-right', label: 'Center Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input
              value={customization.branding.companyName || ''}
              onChange={(e) => updateBranding({ companyName: e.target.value })}
              placeholder="Your Company Name"
            />
          </div>
          
          <div>
            <Label>Production Company</Label>
            <Input
              value={customization.branding.productionCompany || ''}
              onChange={(e) => updateBranding({ productionCompany: e.target.value })}
              placeholder="Production Company"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Custom Text 1</Label>
              <Input
                value={customization.branding.customText1 || ''}
                onChange={(e) => updateBranding({ customText1: e.target.value })}
                placeholder="Network, Genre, etc."
              />
            </div>
            <div>
              <Label>Custom Text 2</Label>
              <Input
                value={customization.branding.customText2 || ''}
                onChange={(e) => updateBranding({ customText2: e.target.value })}
                placeholder="Season, Year, etc."
              />
            </div>
            <div>
              <Label>Custom Text 3</Label>
              <Input
                value={customization.branding.customText3 || ''}
                onChange={(e) => updateBranding({ customText3: e.target.value })}
                placeholder="Episode, Version, etc."
              />
            </div>
          </div>

          {(customization.branding.companyName || customization.branding.productionCompany || customization.branding.customText1 || customization.branding.customText2 || customization.branding.customText3) && (
            <div>
              <Label>Company Information Alignment</Label>
              <Select
                value={customization.layout.headerAlignment}
                onValueChange={(value: 'left' | 'center' | 'right') => updateCustomization({
                  layout: { ...customization.layout, headerAlignment: value }
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
          )}
        </CardContent>
      </Card>

      {/* Primary Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Primary Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LogoUpload
            onLogoChange={handleLogoChange}
            currentLogo={customization.branding.logo ? {
              url: customization.branding.logo.url,
              size: customization.branding.logo.size
            } : null}
          />

          {customization.branding.logo && (
            <>
              <div>
                <Label>Logo Position</Label>
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
                    {logoPositions.map(pos => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">
                  Logo Opacity: {Math.round((customization.branding.logo.opacity || 1) * 100)}%
                </Label>
                <Slider
                  value={[(customization.branding.logo.opacity || 1) * 100]}
                  onValueChange={([value]) => updateBranding({
                    logo: { ...customization.branding.logo!, opacity: value / 100 }
                  })}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Secondary Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Secondary Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LogoUpload
            onLogoChange={handleSecondaryLogoChange}
            currentLogo={customization.branding.secondaryLogo ? {
              url: customization.branding.secondaryLogo.url,
              size: customization.branding.secondaryLogo.size
            } : null}
          />

          {customization.branding.secondaryLogo && (
            <>
              <div className="flex items-center justify-between">
                <Label>Lock to Primary Logo Position</Label>
                <Switch
                  checked={customization.branding.secondaryLogo.lockToPrimary}
                  onCheckedChange={handleSecondaryLogoLockChange}
                />
              </div>

              {!customization.branding.secondaryLogo.lockToPrimary && (
                <div>
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
                      {logoPositions.map(pos => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="mb-2 block">
                  Secondary Logo Opacity: {Math.round((customization.branding.secondaryLogo.opacity || 1) * 100)}%
                </Label>
                <Slider
                  value={[(customization.branding.secondaryLogo.opacity || 1) * 100]}
                  onValueChange={([value]) => updateBranding({
                    secondaryLogo: { ...customization.branding.secondaryLogo!, opacity: value / 100 }
                  })}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Footer</CardTitle>
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
              placeholder="Optional footer text"
            />
          </div>

          {customization.branding.footer?.text && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Footer Position</Label>
                <Select
                  value={customization.branding.footer.position}
                  onValueChange={(value: 'left' | 'center' | 'right') => updateBranding({
                    footer: { ...customization.branding.footer!, position: value }
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
                  value={customization.branding.footer.style}
                  onValueChange={(value: 'minimal' | 'bordered' | 'accent') => updateBranding({
                    footer: { ...customization.branding.footer!, style: value }
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
          )}

          {customization.branding.footer?.text && (
            <div className="flex items-center justify-between">
              <Label>Union Compliance Notice</Label>
              <Switch
                checked={customization.branding.footer?.unionCompliance || false}
                onCheckedChange={(checked) => updateBranding({
                  footer: { ...customization.branding.footer!, unionCompliance: checked }
                })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Watermark */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Watermark</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Watermark Text</Label>
            <Input
              value={customization.branding.watermark?.text || ''}
              onChange={(e) => updateBranding({
                watermark: {
                  ...customization.branding.watermark,
                  text: e.target.value,
                  opacity: customization.branding.watermark?.opacity || 0.1,
                  position: customization.branding.watermark?.position || 'center'
                }
              })}
              placeholder="CONFIDENTIAL, DRAFT, etc."
            />
          </div>

          {customization.branding.watermark?.text && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Watermark Position</Label>
                  <Select
                    value={customization.branding.watermark.position}
                    onValueChange={(value: 'center' | 'diagonal') => updateBranding({
                      watermark: { ...customization.branding.watermark!, position: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="diagonal">Diagonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Recipient Type</Label>
                  <Select
                    value={customization.branding.watermark.recipientType || 'all'}
                    onValueChange={(value: 'all' | 'talent' | 'crew' | 'client') => updateBranding({
                      watermark: { ...customization.branding.watermark!, recipientType: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Recipients</SelectItem>
                      <SelectItem value="talent">Talent Only</SelectItem>
                      <SelectItem value="crew">Crew Only</SelectItem>
                      <SelectItem value="client">Client Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">
                  Watermark Opacity: {Math.round((customization.branding.watermark.opacity || 0.1) * 100)}%
                </Label>
                <Slider
                  value={[(customization.branding.watermark.opacity || 0.1) * 100]}
                  onValueChange={([value]) => updateBranding({
                    watermark: { ...customization.branding.watermark!, opacity: value / 100 }
                  })}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
