
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { PDFAppearanceTab } from './PDFAppearanceTab';
import { CallsheetData } from '@/contexts/CallsheetContext';

interface MasterPDFSettingsProps {
  onBack: () => void;
}

// Dummy lorem ipsum callsheet data for preview
const DUMMY_CALLSHEET: CallsheetData = {
  id: 'preview',
  projectTitle: 'Lorem Ipsum Productions',
  shootDate: '2024-07-15',
  generalCallTime: '06:00',
  location: 'Dolor Sit Amet Studios',
  locationAddress: '123 Lorem Street, Ipsum City, CA 90210',
  parkingInstructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  basecampLocation: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  cast: [
    {
      id: 'cast1',
      name: 'John Lorem',
      role: 'Lead Actor',
      character: 'Marcus Ipsum',
      phone: '(555) 123-4567',
      email: 'john@lorem.com'
    },
    {
      id: 'cast2',
      name: 'Jane Dolor',
      role: 'Supporting Actor',
      character: 'Sarah Amet',
      phone: '(555) 234-5678',
      email: 'jane@dolor.com'
    }
  ],
  crew: [
    {
      id: 'crew1',
      name: 'Mike Consectetur',
      role: 'Director of Photography',
      phone: '(555) 345-6789',
      email: 'mike@consectetur.com',
      character: ''
    },
    {
      id: 'crew2',
      name: 'Sarah Elit',
      role: 'Script Supervisor',
      phone: '(555) 456-7890',
      email: 'sarah@elit.com',
      character: ''
    }
  ],
  schedule: [
    {
      id: 'scene1',
      sceneNumber: '1A',
      intExt: 'INT',
      description: 'Lorem ipsum dolor sit amet kitchen scene',
      location: 'Kitchen Set - Stage 2',
      pageCount: '2/8',
      estimatedTime: '07:00 AM - 09:30 AM'
    },
    {
      id: 'scene2',
      sceneNumber: '3B',
      intExt: 'EXT',
      description: 'Consectetur adipiscing elit outdoor sequence',
      location: 'Parking Lot - Back Lot',
      pageCount: '1 1/8',
      estimatedTime: '10:00 AM - 12:00 PM'
    }
  ],
  emergencyContacts: [
    {
      id: 'emergency1',
      name: 'Emergency Lorem',
      role: 'On-Set Medic',
      phone: '(555) 911-0000',
      email: 'emergency@lorem.com',
      character: ''
    }
  ],
  weather: 'Sunny, 75°F, Light breeze from the west at 5 mph',
  specialNotes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const MasterPDFSettings = ({ onBack }: MasterPDFSettingsProps) => {
  const [masterCustomization, setMasterCustomization] = useState<PDFCustomization>(DEFAULT_PDF_CUSTOMIZATION);

  const handleSave = () => {
    // TODO: Save master settings to user preferences/database
    console.log('Saving master PDF settings:', masterCustomization);
    // Show success toast or feedback
    onBack();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4 font-normal">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-medium text-foreground tracking-tight">Master PDF Appearance</h1>
            <p className="text-muted-foreground mt-1 font-normal">Configure default PDF styling for all callsheets</p>
          </div>
        </div>
        <Button onClick={handleSave} className="font-normal">
          <Save className="w-4 h-4 mr-2" />
          Save Master Settings
        </Button>
      </div>

      <Card className="glass-effect border-border/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium tracking-tight">PDF Appearance Settings</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            These settings will be applied as defaults to all new callsheets. Preview uses sample data.
          </p>
        </CardHeader>
        <CardContent>
          <PDFAppearanceTab
            callsheet={DUMMY_CALLSHEET}
            customization={masterCustomization}
            onCustomizationChange={setMasterCustomization}
          />
        </CardContent>
      </Card>
    </div>
  );
};
