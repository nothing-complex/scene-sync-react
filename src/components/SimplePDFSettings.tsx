
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PDFCustomization } from '@/types/pdfTypes';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { LogoUpload } from './LogoUpload';
import { generateCustomCallsheetPDF } from '@/services/pdfService';

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
  
  const handleDownloadPDF = () => {
    generateCustomCallsheetPDF(callsheet, customization);
  };

  const updateCustomization = (section: keyof PDFCustomization, updates: any) => {
    onCustomizationChange({
      ...customization,
      [section]: {
        ...customization[section],
        ...updates
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Header Style</Label>
              <Select 
                value={customization.layout.headerStyle} 
                onValueChange={(value: 'centered' | 'left' | 'custom') => 
                  updateCustomization('layout', { headerStyle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centered">Centered</SelectItem>
                  <SelectItem value="left">Left Aligned</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Font Family</Label>
              <Select 
                value={customization.typography.fontFamily} 
                onValueChange={(value: 'helvetica' | 'arial' | 'times') => 
                  updateCustomization('typography', { fontFamily: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="helvetica">Helvetica</SelectItem>
                  <SelectItem value="arial">Arial</SelectItem>
                  <SelectItem value="times">Times New Roman</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Page Orientation</Label>
            <RadioGroup 
              value={customization.layout.pageOrientation} 
              onValueChange={(value: 'portrait' | 'landscape') => 
                updateCustomization('layout', { pageOrientation: value })
              }
              className="flex flex-row space-x-6 mt-2"
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
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Company Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <LogoUpload
            onLogoChange={(logoData) => 
              updateCustomization('branding', { logo: logoData })
            }
            currentLogo={customization.branding.logo}
          />
        </CardContent>
      </Card>

      {/* Generate PDF */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleDownloadPDF}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Download Customized PDF
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Uses your current settings to generate the callsheet PDF
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
