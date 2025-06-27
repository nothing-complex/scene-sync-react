import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Calendar, MapPin, Clock, Users, FileText, Plus } from 'lucide-react';
import { useCallsheet } from '@/contexts/CallsheetContext';
import { CallsheetData, Contact, ScheduleItem } from '@/types/callsheet';
import { InlineListManager } from './InlineListManager';
import { LocationInput } from '@/components/LocationInput';
import { EmergencyNumbers } from '@/components/EmergencyNumbers';
import { toast } from 'sonner';

interface CallsheetFormProps {
  callsheetId?: string;
  onBack: () => void;
}

export const CallsheetForm = ({ callsheetId, onBack }: CallsheetFormProps) => {
  const { addCallsheet, updateCallsheet, getCallsheet } = useCallsheet();
  
  const [formData, setFormData] = useState<Omit<CallsheetData, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>({
    projectTitle: '',
    director: '',
    producer: '',
    shootDate: '',
    location: '',
    generalCallTime: '',
    schedule: [],
    cast: [],
    crew: [],
    emergencyContacts: [],
    notes: '',
    weatherInfo: null
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (callsheetId) {
      const existingCallsheet = getCallsheet(callsheetId);
      if (existingCallsheet) {
        const { id, createdAt, updatedAt, userId, ...callsheetData } = existingCallsheet;
        setFormData(callsheetData);
      }
    }
  }, [callsheetId, getCallsheet]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectTitle || !formData.shootDate || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (callsheetId) {
        await updateCallsheet(callsheetId, formData);
        toast.success('Callsheet updated successfully');
      } else {
        await addCallsheet(formData);
        toast.success('Callsheet created successfully');
      }
      onBack();
    } catch (error) {
      console.error('Error saving callsheet:', error);
      toast.error('Failed to save callsheet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="hover:bg-accent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {callsheetId ? 'Edit Callsheet' : 'New Callsheet'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {callsheetId ? 'Update your production details' : 'Create a new production callsheet'}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : callsheetId ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="cast" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Cast</span>
              </TabsTrigger>
              <TabsTrigger value="crew" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Crew</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Emergency</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Production Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="projectTitle">Project Title *</Label>
                      <Input
                        id="projectTitle"
                        value={formData.projectTitle}
                        onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                        placeholder="Enter project title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="director">Director</Label>
                      <Input
                        id="director"
                        value={formData.director}
                        onChange={(e) => handleInputChange('director', e.target.value)}
                        placeholder="Enter director name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="producer">Producer</Label>
                      <Input
                        id="producer"
                        value={formData.producer}
                        onChange={(e) => handleInputChange('producer', e.target.value)}
                        placeholder="Enter producer name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shootDate">Shoot Date *</Label>
                      <Input
                        id="shootDate"
                        type="date"
                        value={formData.shootDate}
                        onChange={(e) => handleInputChange('shootDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="generalCallTime">General Call Time</Label>
                      <Input
                        id="generalCallTime"
                        type="time"
                        value={formData.generalCallTime}
                        onChange={(e) => handleInputChange('generalCallTime', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <LocationInput
                      value={formData.location}
                      onChange={handleLocationChange}
                      placeholder="Enter filming location"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Additional notes..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Shooting Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InlineListManager
                    items={formData.schedule}
                    setItems={(newSchedule: ScheduleItem[]) => handleInputChange('schedule', newSchedule)}
                    itemType="schedule"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cast" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Cast Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InlineListManager
                    items={formData.cast}
                    setItems={(newCast: Contact[]) => handleInputChange('cast', newCast)}
                    itemType="cast"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crew" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Crew Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InlineListManager
                    items={formData.crew}
                    setItems={(newCrew: Contact[]) => handleInputChange('crew', newCrew)}
                    itemType="crew"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Emergency Contacts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <InlineListManager
                    items={formData.emergencyContacts}
                    setItems={(newEmergencyContacts: Contact[]) => handleInputChange('emergencyContacts', newEmergencyContacts)}
                    itemType="emergencyContact"
                  />
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Emergency Services</h3>
                    <EmergencyNumbers />
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
