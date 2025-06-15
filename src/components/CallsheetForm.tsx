import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Users, Calendar, MapPin, Cloud, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCallsheet, Contact, CallsheetData, ScheduleItem } from '@/contexts/CallsheetContext';
import { ContactSelector } from './ContactSelector';
import { LocationInput } from './LocationInput';
import { EmergencyNumbers } from './EmergencyNumbers';
import { WeatherService, WeatherData } from '@/services/weatherService';
import { EmergencyService } from '@/services/emergencyService';

interface CallsheetFormProps {
  onBack: () => void;
  callsheetId?: string;
}

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export const CallsheetForm = ({ onBack, callsheetId }: CallsheetFormProps) => {
  const { addCallsheet, updateCallsheet, callsheets, contacts } = useCallsheet();
  
  const existingCallsheet = callsheetId ? callsheets.find(c => c.id === callsheetId) : null;
  const isEditing = !!existingCallsheet;

  const [formData, setFormData] = useState<Partial<CallsheetData>>({
    projectTitle: '',
    shootDate: '',
    generalCallTime: '',
    location: '',
    locationAddress: '',
    parkingInstructions: '',
    basecampLocation: '',
    cast: [],
    crew: [],
    schedule: [],
    emergencyContacts: [],
    weather: '',
    specialNotes: '',
  });

  const [showContactSelector, setShowContactSelector] = useState<{
    show: boolean;
    type: 'cast' | 'crew' | 'emergency';
  }>({ show: false, type: 'cast' });

  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherUnits, setWeatherUnits] = useState<'imperial' | 'metric'>('imperial');
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null);

  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([]);
  const [emergencyServicesLoading, setEmergencyServicesLoading] = useState(false);
  const [emergencyNumbers, setEmergencyNumbers] = useState<{
    general: string;
    police: string;
    fire: string;
    medical: string;
  } | null>(null);

  useEffect(() => {
    if (existingCallsheet) {
      setFormData(existingCallsheet);
    }
  }, [existingCallsheet]);

  const handleInputChange = (field: keyof CallsheetData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = async (location: GeocodingResult) => {
    setSelectedLocation(location);
    
    // Set emergency numbers based on country
    const numbers = EmergencyService.getEmergencyNumbers(location.country || 'US');
    setEmergencyNumbers(numbers);
    
    // Auto-fetch weather for the selected location
    if (!formData.weather) {
      setWeatherLoading(true);
      try {
        const weatherData = await WeatherService.getCurrentWeather(
          location.latitude, 
          location.longitude, 
          weatherUnits
        );
        if (weatherData) {
          const weatherString = WeatherService.formatWeatherString(weatherData);
          handleInputChange('weather', weatherString);
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setWeatherLoading(false);
      }
    }

    // Auto-fetch emergency services with 10km radius
    setEmergencyServicesLoading(true);
    try {
      const services = await EmergencyService.getNearbyEmergencyServices(
        location.latitude,
        location.longitude,
        10, // 10km radius
        weatherUnits
      );
      setEmergencyServices(services);
    } catch (error) {
      console.error('Failed to fetch emergency services:', error);
    } finally {
      setEmergencyServicesLoading(false);
    }
  };

  const handleRefreshWeather = async () => {
    if (!selectedLocation && !formData.location) return;

    setWeatherLoading(true);
    try {
      let weatherData: WeatherData | null = null;
      
      if (selectedLocation) {
        weatherData = await WeatherService.getCurrentWeather(
          selectedLocation.latitude,
          selectedLocation.longitude,
          weatherUnits
        );
      } else if (formData.location) {
        weatherData = await WeatherService.getWeatherForLocation(formData.location, weatherUnits);
      }
      
      if (weatherData) {
        const weatherString = WeatherService.formatWeatherString(weatherData);
        handleInputChange('weather', weatherString);
      }
    } catch (error) {
      console.error('Failed to refresh weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Handle weather units change
  const handleWeatherUnitsChange = async (units: 'imperial' | 'metric') => {
    setWeatherUnits(units);
    
    // Re-fetch weather with new units if we have a location
    if (selectedLocation || formData.location) {
      await handleRefreshWeather();
    }
  };

  const handleAddContact = (contact: Contact, type: 'cast' | 'crew' | 'emergency') => {
    const fieldName = type === 'emergency' ? 'emergencyContacts' : type;
    const currentContacts = formData[fieldName] || [];
    
    // Check if contact already exists
    if (!currentContacts.find(c => c.id === contact.id)) {
      handleInputChange(fieldName, [...currentContacts, contact]);
    }
    setShowContactSelector({ show: false, type: 'cast' });
  };

  const handleRemoveContact = (contactId: string, type: 'cast' | 'crew' | 'emergency') => {
    const fieldName = type === 'emergency' ? 'emergencyContacts' : type;
    const currentContacts = formData[fieldName] || [];
    handleInputChange(fieldName, currentContacts.filter(c => c.id !== contactId));
  };

  const handleAddScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      sceneNumber: '',
      intExt: 'INT',
      description: '',
      location: '',
      pageCount: '',
      estimatedTime: '',
    };
    const currentSchedule = formData.schedule || [];
    handleInputChange('schedule', [...currentSchedule, newItem]);
  };

  const handleUpdateScheduleItem = (itemId: string, field: keyof ScheduleItem, value: string) => {
    const currentSchedule = formData.schedule || [];
    const updatedSchedule = currentSchedule.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    handleInputChange('schedule', updatedSchedule);
  };

  const handleRemoveScheduleItem = (itemId: string) => {
    const currentSchedule = formData.schedule || [];
    handleInputChange('schedule', currentSchedule.filter(item => item.id !== itemId));
  };

  const handleAddEmergencyService = (service: EmergencyService) => {
    const currentContacts = formData.emergencyContacts || [];
    
    // Convert emergency service to contact format
    const emergencyContact = {
      id: service.id,
      name: service.name,
      role: `${EmergencyService.formatServiceType(service.type)} (${service.distance}${weatherUnits === 'imperial' ? 'mi' : 'km'})`,
      phone: service.phone || 'Phone not available',
      email: '',
      character: '',
      company: service.address
    };
    
    // Check if already added
    if (!currentContacts.find(c => c.id === service.id)) {
      handleInputChange('emergencyContacts', [...currentContacts, emergencyContact]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectTitle || !formData.shootDate || !formData.generalCallTime) {
      alert('Please fill in all required fields');
      return;
    }

    const callsheetData = {
      projectTitle: formData.projectTitle,
      shootDate: formData.shootDate,
      generalCallTime: formData.generalCallTime,
      location: formData.location || '',
      locationAddress: formData.locationAddress || '',
      parkingInstructions: formData.parkingInstructions || '',
      basecampLocation: formData.basecampLocation || '',
      cast: formData.cast || [],
      crew: formData.crew || [],
      schedule: formData.schedule || [],
      emergencyContacts: formData.emergencyContacts || [],
      weather: formData.weather || '',
      specialNotes: formData.specialNotes || '',
    };

    if (isEditing && callsheetId) {
      updateCallsheet(callsheetId, callsheetData);
    } else {
      addCallsheet(callsheetData);
    }

    onBack();
  };

  if (showContactSelector.show) {
    return (
      <ContactSelector
        onBack={() => setShowContactSelector({ show: false, type: 'cast' })}
        onSelectContact={(contact) => handleAddContact(contact, showContactSelector.type)}
        contacts={contacts}
        title={`Add ${showContactSelector.type === 'emergency' ? 'Emergency Contact' : 
               showContactSelector.type === 'cast' ? 'Cast Member' : 'Crew Member'}`}
      />
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Callsheet' : 'Create New Callsheet'}
          </h1>
          <p className="text-gray-600 mt-1">Fill in the production details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Production Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input
                  id="projectTitle"
                  value={formData.projectTitle || ''}
                  onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="shootDate">Shoot Date *</Label>
                <Input
                  id="shootDate"
                  type="date"
                  value={formData.shootDate || ''}
                  onChange={(e) => handleInputChange('shootDate', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="generalCallTime">General Call Time *</Label>
              <Input
                id="generalCallTime"
                type="time"
                value={formData.generalCallTime || ''}
                onChange={(e) => handleInputChange('generalCallTime', e.target.value)}
                required
                className="md:w-1/2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Numbers - Prominent Display */}
        {emergencyNumbers && (
          <EmergencyNumbers emergencyNumbers={emergencyNumbers} />
        )}

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationInput
                label="Location Name"
                value={formData.location || ''}
                onChange={(value) => handleInputChange('location', value)}
                onLocationSelect={handleLocationSelect}
                placeholder="Search for a location..."
                id="location"
              />
              <div>
                <Label htmlFor="locationAddress">Location Address</Label>
                <Input
                  id="locationAddress"
                  value={formData.locationAddress || ''}
                  onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                  placeholder="Full address with zip code"
                />
              </div>
            </div>
            
            {/* Weather Units Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Weather Units</Label>
                <RadioGroup 
                  value={weatherUnits} 
                  onValueChange={handleWeatherUnitsChange}
                  className="flex flex-row space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imperial" id="imperial" />
                    <Label htmlFor="imperial" className="font-normal">Imperial (°F, mph)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metric" id="metric" />
                    <Label htmlFor="metric" className="font-normal">Metric (°C, km/h)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="weather">Weather</Label>
                <div className="relative">
                  <Input
                    id="weather"
                    value={formData.weather || ''}
                    onChange={(e) => handleInputChange('weather', e.target.value)}
                    placeholder="Auto-populated from location or enter manually"
                    className="pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshWeather}
                    disabled={weatherLoading || (!selectedLocation && !formData.location)}
                    className="absolute right-1 top-1 h-8 w-16 text-xs"
                  >
                    {weatherLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Cloud className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                {weatherLoading && (
                  <p className="text-xs text-muted-foreground mt-1">Fetching weather data...</p>
                )}
              </div>
            </div>

            {/* Emergency Services Section */}
            {emergencyServices.length > 0 && (
              <div className="mt-6">
                <Label className="text-base font-medium flex items-center mb-3">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Nearby Emergency Services
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {emergencyServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="mr-2">{EmergencyService.getServiceIcon(service.type)}</span>
                          <div>
                            <div className="font-medium text-sm">{service.name}</div>
                            <div className="text-xs text-gray-600">{EmergencyService.formatServiceType(service.type)}</div>
                            <div className="text-xs text-gray-500">
                              {service.distance}{weatherUnits === 'imperial' ? 'mi' : 'km'} away
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddEmergencyService(service)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {emergencyServicesLoading && (
                  <p className="text-xs text-muted-foreground mt-2">Loading emergency services...</p>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parkingInstructions">Parking Instructions</Label>
                <Textarea
                  id="parkingInstructions"
                  value={formData.parkingInstructions || ''}
                  onChange={(e) => handleInputChange('parkingInstructions', e.target.value)}
                  placeholder="Parking details and restrictions"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="basecampLocation">Basecamp Location</Label>
                <Textarea
                  id="basecampLocation"
                  value={formData.basecampLocation || ''}
                  onChange={(e) => handleInputChange('basecampLocation', e.target.value)}
                  placeholder="Craft services, trailers, equipment staging"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cast & Crew */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Cast ({(formData.cast || []).length})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowContactSelector({ show: true, type: 'cast' })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Cast
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(formData.cast || []).map((castMember) => (
                  <div key={castMember.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{castMember.name}</div>
                      <div className="text-sm text-gray-600">{castMember.character || castMember.role}</div>
                      <div className="text-sm text-gray-500">{castMember.phone}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(castMember.id, 'cast')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {(formData.cast || []).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No cast members added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Crew */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Crew ({(formData.crew || []).length})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowContactSelector({ show: true, type: 'crew' })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Crew
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(formData.crew || []).map((crewMember) => (
                  <div key={crewMember.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{crewMember.name}</div>
                      <div className="text-sm text-gray-600">{crewMember.role}</div>
                      <div className="text-sm text-gray-500">{crewMember.phone}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(crewMember.id, 'crew')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {(formData.crew || []).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No crew members added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Shooting Schedule</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddScheduleItem}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Scene
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(formData.schedule || []).map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <Label>Scene #</Label>
                      <Input
                        value={item.sceneNumber}
                        onChange={(e) => handleUpdateScheduleItem(item.id, 'sceneNumber', e.target.value)}
                        placeholder="1A"
                      />
                    </div>
                    <div>
                      <Label>INT/EXT</Label>
                      <Select
                        value={item.intExt}
                        onValueChange={(value: 'INT' | 'EXT') => 
                          handleUpdateScheduleItem(item.id, 'intExt', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INT">INT</SelectItem>
                          <SelectItem value="EXT">EXT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => handleUpdateScheduleItem(item.id, 'description', e.target.value)}
                        placeholder="Kitchen - Morning coffee"
                      />
                    </div>
                    <div>
                      <Label>Pages</Label>
                      <Input
                        value={item.pageCount}
                        onChange={(e) => handleUpdateScheduleItem(item.id, 'pageCount', e.target.value)}
                        placeholder="2/8"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveScheduleItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={item.location}
                        onChange={(e) => handleUpdateScheduleItem(item.id, 'location', e.target.value)}
                        placeholder="Studio Kitchen Set"
                      />
                    </div>
                    <div>
                      <Label>Estimated Time</Label>
                      <Input
                        value={item.estimatedTime}
                        onChange={(e) => handleUpdateScheduleItem(item.id, 'estimatedTime', e.target.value)}
                        placeholder="9:00 AM - 11:00 AM"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(formData.schedule || []).length === 0 && (
                <p className="text-gray-500 text-center py-8">No scenes added yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Emergency Contacts</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowContactSelector({ show: true, type: 'emergency' })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Contact
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(formData.emergencyContacts || []).map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.role}</div>
                      <div className="text-sm text-gray-500">{contact.phone}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(contact.id, 'emergency')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {(formData.emergencyContacts || []).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No emergency contacts added</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.specialNotes || ''}
                onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                placeholder="Additional production notes, safety information, special instructions..."
                rows={8}
              />
            </CardContent>
          </Card>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {isEditing ? 'Update Callsheet' : 'Create Callsheet'}
          </Button>
        </div>
      </form>
    </div>
  );
};
