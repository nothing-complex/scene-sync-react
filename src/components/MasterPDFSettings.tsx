
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

// Enhanced dummy callsheet data for preview with modern content
const DUMMY_CALLSHEET: CallsheetData = {
  id: 'preview',
  projectTitle: 'Midnight in Paris',
  shootDate: '2024-07-15',
  generalCallTime: '06:00 AM',
  location: 'Historic Downtown Studio',
  locationAddress: '123 Creative Boulevard, Los Angeles, CA 90028',
  parkingInstructions: 'Crew parking available in Lot B behind main building. Cast parking in covered structure on Level 2.',
  basecampLocation: 'Main lobby area. Craft services available from 5:30 AM.',
  cast: [
    {
      id: 'cast1',
      name: 'Emma Thompson',
      role: 'Lead Actress',
      character: 'Charlotte Winters',
      phone: '(555) 123-4567',
      email: 'emma.thompson@talent.com'
    },
    {
      id: 'cast2',
      name: 'James Rodriguez',
      role: 'Supporting Actor',
      character: 'Detective Hayes',
      phone: '(555) 234-5678',
      email: 'james.rodriguez@talent.com'
    },
    {
      id: 'cast3',
      name: 'Sarah Chen',
      role: 'Day Player',
      character: 'Cafe Owner',
      phone: '(555) 345-6789',
      email: 'sarah.chen@talent.com'
    }
  ],
  crew: [
    {
      id: 'crew1',
      name: 'Michael Anderson',
      role: 'Director of Photography',
      phone: '(555) 345-6789',
      email: 'michael.anderson@crew.com',
      character: ''
    },
    {
      id: 'crew2',
      name: 'Lisa Parker',
      role: 'Script Supervisor',
      phone: '(555) 456-7890',
      email: 'lisa.parker@crew.com',
      character: ''
    },
    {
      id: 'crew3',
      name: 'David Kim',
      role: 'Gaffer',
      phone: '(555) 567-8901',
      email: 'david.kim@crew.com',
      character: ''
    }
  ],
  schedule: [
    {
      id: 'scene1',
      sceneNumber: '12A',
      intExt: 'INT',
      description: 'Charlotte discovers the hidden letter in the antique desk',
      location: 'Apartment Set - Stage 1',
      pageCount: '2 1/8',
      estimatedTime: '07:00 AM - 09:30 AM'
    },
    {
      id: 'scene2',
      sceneNumber: '15B',
      intExt: 'EXT',
      description: 'Detective Hayes arrives at the crime scene',
      location: 'Alley - Back Lot',
      pageCount: '1 3/8',
      estimatedTime: '10:00 AM - 12:00 PM'
    },
    {
      id: 'scene3',
      sceneNumber: '18C',
      intExt: 'INT',
      description: 'Confrontation scene in the cafe',
      location: 'Cafe Set - Stage 2',
      pageCount: '3 2/8',
      estimatedTime: '02:00 PM - 05:00 PM'
    }
  ],
  emergencyContacts: [
    {
      id: 'emergency1',
      name: 'Dr. Jennifer Walsh',
      role: 'On-Set Medic',
      phone: '(555) 911-0000',
      email: 'j.walsh@medics.com',
      character: ''
    },
    {
      id: 'emergency2',
      name: 'Security Command',
      role: 'Studio Security',
      phone: '(555) 911-1111',
      email: 'security@studio.com',
      character: ''
    }
  ],
  weather: 'Partly cloudy, 72°F. Light breeze from the southwest at 8 mph. 15% chance of light rain in the afternoon.',
  specialNotes: 'Please note: All cast and crew must check in at main security gate. COVID protocols in effect - masks required in all indoor locations. Lunch will be served at 12:30 PM in the commissary. Please be mindful of noise levels as adjacent stages are filming.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'preview-user'
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
            These settings will be applied as defaults to all new callsheets. Preview uses enhanced sample data.
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
