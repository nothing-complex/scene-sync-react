import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Plus, Trash2, Edit2, Clock, Users, Camera, MapPin, FileText } from 'lucide-react';
import { useCallsheet, type CallsheetData, type ScheduleItem, type CastMember, type CrewMember, type EmergencyContact } from '@/contexts/CallsheetContext';
import { LocationInput } from './LocationInput';
import { ContactsManager } from './ContactsManager';
import { ContactSelector } from './ContactSelector';
import { EmergencyServicesList } from './EmergencyServicesList';
import { useToast } from '@/hooks/use-toast';

interface CallsheetFormProps {
  callsheetId?: string;
  onBack: () => void;
}

export const CallsheetForm = ({ callsheetId, onBack }: CallsheetFormProps) => {
  const { 
    callsheets, 
    createCallsheet, 
    updateCallsheet, 
    loading, 
    error 
  } = useCallsheet();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(callsheetId);
  const currentCallsheet = isEditing ? callsheets.find(cs => cs.id === callsheetId) : null;

  const [formData, setFormData] = useState<Omit<CallsheetData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>({
    projectTitle: '',
    shootDate: new Date().toISOString().split('T')[0],
    generalCallTime: '06:00',
    location: '',
    locationAddress: '',
    weather: '',
    parkingInstructions: '',
    basecampLocation: '',
    specialNotes: '',
    emergencyNumber: '',
    schedule: [],
    cast: [],
    crew: [],
    emergencyContacts: []
  });

  useEffect(() => {
    if (isEditing && currentCallsheet) {
      setFormData({
        projectTitle: currentCallsheet.projectTitle,
        shootDate: currentCallsheet.shootDate,
        generalCallTime: currentCallsheet.generalCallTime,
        location: currentCallsheet.location,
        locationAddress: currentCallsheet.locationAddress || '',
        weather: currentCallsheet.weather || '',
        parkingInstructions: currentCallsheet.parkingInstructions || '',
        basecampLocation: currentCallsheet.basecampLocation || '',
        specialNotes: currentCallsheet.specialNotes || '',
        emergencyNumber: currentCallsheet.emergencyNumber || '',
        schedule: currentCallsheet.schedule || [],
        cast: currentCallsheet.cast || [],
        crew: currentCallsheet.crew || [],
        emergencyContacts: currentCallsheet.emergencyContacts || []
      });
    }
  }, [isEditing, currentCallsheet]);

  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLocationChange = (location: string, locationAddress: string) => {
    setFormData(prevData => ({
      ...prevData,
      location: location,
      locationAddress: locationAddress
    }));
  };

  const handleScheduleChange = (newSchedule: ScheduleItem[]) => {
    setSchedule(newSchedule);
    setFormData(prevData => ({
      ...prevData,
      schedule: newSchedule
    }));
  };

  const handleCastChange = (newCast: CastMember[]) => {
    setCast(newCast);
    setFormData(prevData => ({
      ...prevData,
      cast: newCast
    }));
  };

  const handleCrewChange = (newCrew: CrewMember[]) => {
    setCrew(newCrew);
    setFormData(prevData => ({
      ...prevData,
      crew: newCrew
    }));
  };

  const handleEmergencyContactsChange = (newEmergencyContacts: EmergencyContact[]) => {
    setEmergencyContacts(newEmergencyContacts);
    setFormData(prevData => ({
      ...prevData,
      emergencyContacts: newEmergencyContacts
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditing && callsheetId) {
        await updateCallsheet(callsheetId, formData);
        toast({
          title: "Success",
          description: "Callsheet updated successfully",
        });
      } else {
        await createCallsheet(formData);
        toast({
          title: "Success", 
          description: "Callsheet created successfully",
        });
      }
      onBack();
    } catch (err) {
      console.error('Error saving callsheet:', err);
      toast({
        title: "Error",
        description: "Failed to save callsheet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">
              {isEditing ? 'Edit Callsheet' : 'Create New Callsheet'}
            </h1>
            {formData.projectTitle && (
              <p className="text-sm text-muted-foreground">{formData.projectTitle}</p>
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isSaving || loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update' : 'Create'} Callsheet
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Production Details
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Cast & Crew
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Emergency
              </TabsTrigger>
            </TabsList>

            {/* Production Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card className="glass-effect border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium tracking-tight">Production Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectTitle" className="text-sm font-medium block">Project Title</Label>
                    <Input 
                      type="text" 
                      id="projectTitle" 
                      name="projectTitle" 
                      value={formData.projectTitle} 
                      onChange={handleInputChange} 
                      className="bg-background border-border/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shootDate" className="text-sm font-medium block">Shoot Date</Label>
                    <Input 
                      type="date" 
                      id="shootDate" 
                      name="shootDate" 
                      value={formData.shootDate} 
                      onChange={handleInputChange} 
                      className="bg-background border-border/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="generalCallTime" className="text-sm font-medium block">General Call Time</Label>
                    <Input 
                      type="time" 
                      id="generalCallTime" 
                      name="generalCallTime" 
                      value={formData.generalCallTime} 
                      onChange={handleInputChange} 
                      className="bg-background border-border/50"
                    />
                  </div>

                  <LocationInput 
                    location={formData.location}
                    locationAddress={formData.locationAddress}
                    onChange={handleLocationChange}
                  />
                  
                  <div>
                    <Label htmlFor="weather" className="text-sm font-medium block">Weather Forecast</Label>
                    <Input 
                      type="text" 
                      id="weather" 
                      name="weather" 
                      value={formData.weather} 
                      onChange={handleInputChange} 
                      className="bg-background border-border/50"
                      placeholder="e.g., Sunny, 25°C"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="parkingInstructions" className="text-sm font-medium block">Parking Instructions</Label>
                    <Textarea
                      id="parkingInstructions"
                      name="parkingInstructions"
                      value={formData.parkingInstructions}
                      onChange={handleInputChange}
                      className="bg-background border-border/50"
                      placeholder="Detailed instructions for parking"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="basecampLocation" className="text-sm font-medium block">Basecamp Location</Label>
                    <Input 
                      type="text" 
                      id="basecampLocation" 
                      name="basecampLocation" 
                      value={formData.basecampLocation} 
                      onChange={handleInputChange} 
                      className="bg-background border-border/50"
                      placeholder="Address or description of basecamp"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialNotes" className="text-sm font-medium block">Special Notes</Label>
                    <Textarea
                      id="specialNotes"
                      name="specialNotes"
                      value={formData.specialNotes}
                      onChange={handleInputChange}
                      className="bg-background border-border/50"
                      placeholder="Any important information for the crew"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card className="glass-effect border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium tracking-tight">Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactsManager 
                    items={schedule}
                    setItems={handleScheduleChange}
                    itemType="schedule"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="space-y-6">
              <Card className="glass-effect border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium tracking-tight">Cast & Crew</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Cast</h4>
                    <ContactsManager 
                      items={cast}
                      setItems={handleCastChange}
                      itemType="cast"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Crew</h4>
                    <ContactsManager 
                      items={crew}
                      setItems={handleCrewChange}
                      itemType="crew"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emergency Tab */}
            <TabsContent value="emergency" className="space-y-6">
              <Card className="glass-effect border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium tracking-tight">Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyNumber" className="text-sm font-medium block">
                      Local Emergency Number
                    </Label>
                    <Input 
                      type="text" 
                      id="emergencyNumber" 
                      name="emergencyNumber" 
                      value={formData.emergencyNumber} 
                      onChange={handleInputChange} 
                      className="bg-background border-border/50"
                      placeholder="e.g., 911, 112"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Emergency Contacts</h4>
                    <ContactsManager 
                      items={emergencyContacts}
                      setItems={handleEmergencyContactsChange}
                      itemType="emergencyContact"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
};
