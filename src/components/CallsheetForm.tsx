import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Users, Calendar, MapPin, Cloud, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCallsheet, Contact, CallsheetData, ScheduleItem } from '@/contexts/CallsheetContext';
import { useAuth } from '@/contexts/AuthContext';
import { ContactSelector } from './ContactSelector';
import { LocationInput } from './LocationInput';
import { EmergencyNumbers } from './EmergencyNumbers';
import { PDFAppearanceTab } from './PDFAppearanceTab';
import { WeatherService, WeatherData } from '@/services/weatherService';
import { EmergencyServiceApi, EmergencyService } from '@/services/emergencyService';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { SimplePDFSettings } from './SimplePDFSettings';

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
  const { addCallsheet, updateCallsheet, callsheets, contacts, addContact } = useCallsheet();
  const { user } = useAuth();
  
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
  const [weatherUnits, setWeatherUnits] = useState<'imperial' | 'metric'>('metric'); // Default to metric
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null);

  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([]);
  const [emergencyServicesLoading, setEmergencyServicesLoading] = useState(false);
  const [emergencyNumbers, setEmergencyNumbers] = useState<{
    general: string;
    police: string;
    fire: string;
    medical: string;
  } | null>(null);

  const [pdfCustomization, setPdfCustomization] = useState<PDFCustomization>(DEFAULT_PDF_CUSTOMIZATION);
  const [activeTab, setActiveTab] = useState('basic');

  // Load master PDF settings on component mount
  useEffect(() => {
    const loadMasterSettings = async () => {
      try {
        const { MasterPDFSettingsService } = await import('@/services/masterPdfSettingsService');
        const masterSettings = await MasterPDFSettingsService.loadMasterSettings();
        setPdfCustomization(masterSettings);
        console.log('CallsheetForm: Master PDF settings loaded:', masterSettings);
      } catch (error) {
        console.error('CallsheetForm: Error loading master PDF settings:', error);
      }
    };

    loadMasterSettings();
  }, []);

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
    
    // Set emergency numbers based on country - ensure we use the correct country code format
    console.log('Location country code:', location.country);
    
    // Map common country codes to our emergency numbers format
    let countryCode = location.country || 'US';
    
    // Comprehensive country code mapping including full country names and variations
    const countryCodeMap: Record<string, string> = {
      // Europe
      'Denmark': 'DK', 'DK': 'DK',
      'Germany': 'DE', 'DE': 'DE', 'Deutschland': 'DE',
      'France': 'FR', 'FR': 'FR',
      'United Kingdom': 'GB', 'UK': 'GB', 'GB': 'GB', 'Britain': 'GB',
      'Sweden': 'SE', 'SE': 'SE', 'Sverige': 'SE',
      'Norway': 'NO', 'NO': 'NO', 'Norge': 'NO',
      'Finland': 'FI', 'FI': 'FI', 'Suomi': 'FI',
      'Netherlands': 'NL', 'NL': 'NL', 'Holland': 'NL',
      'Belgium': 'BE', 'BE': 'BE', 'België': 'BE',
      'Austria': 'AT', 'AT': 'AT', 'Österreich': 'AT',
      'Switzerland': 'CH', 'CH': 'CH', 'Schweiz': 'CH',
      'Italy': 'IT', 'IT': 'IT', 'Italia': 'IT',
      'Spain': 'ES', 'ES': 'ES', 'España': 'ES',
      'Portugal': 'PT', 'PT': 'PT',
      'Poland': 'PL', 'PL': 'PL', 'Polska': 'PL',
      'Czech Republic': 'CZ', 'CZ': 'CZ', 'Czechia': 'CZ',
      'Slovakia': 'SK', 'SK': 'SK',
      'Hungary': 'HU', 'HU': 'HU', 'Magyarország': 'HU',
      'Slovenia': 'SI', 'SI': 'SI', 'Slovenija': 'SI',
      'Croatia': 'HR', 'HR': 'HR', 'Hrvatska': 'HR',
      'Estonia': 'EE', 'EE': 'EE', 'Eesti': 'EE',
      'Latvia': 'LV', 'LV': 'LV', 'Latvija': 'LV',
      'Lithuania': 'LT', 'LT': 'LT', 'Lietuva': 'LT',
      'Romania': 'RO', 'RO': 'RO', 'România': 'RO',
      'Bulgaria': 'BG', 'BG': 'BG', 'България': 'BG',
      'Greece': 'GR', 'GR': 'GR', 'Ελλάδα': 'GR',
      'Ireland': 'IE', 'IE': 'IE', 'Éire': 'IE',
      'Malta': 'MT', 'MT': 'MT',
      'Cyprus': 'CY_SOUTH', 'CY': 'CY_SOUTH',
      'Iceland': 'IS', 'IS': 'IS', 'Ísland': 'IS',
      'Luxembourg': 'LU', 'LU': 'LU',
      'Monaco': 'MC', 'MC': 'MC',
      'San Marino': 'SM', 'SM': 'SM',
      'Vatican City': 'VA', 'VA': 'VA',
      'Andorra': 'AD', 'AD': 'AD',
      'Liechtenstein': 'LI', 'LI': 'LI',
      'Russia': 'RU', 'RU': 'RU', 'Russian Federation': 'RU', 'Россия': 'RU',
      'Belarus': 'BY', 'BY': 'BY', 'Беларусь': 'BY',
      'Ukraine': 'UA', 'UA': 'UA', 'Україна': 'UA',
      'Moldova': 'MD', 'MD': 'MD',
      'Serbia': 'RS', 'RS': 'RS', 'Србија': 'RS',
      'Montenegro': 'ME', 'ME': 'ME', 'Црна Гора': 'ME',
      'Bosnia and Herzegovina': 'BA', 'BA': 'BA',
      'North Macedonia': 'MK', 'MK': 'MK', 'Macedonia': 'MK',
      'Albania': 'AL', 'AL': 'AL', 'Shqipëria': 'AL',
      'Kosovo': 'XK', 'XK': 'XK',
      'Turkey': 'TR', 'TR': 'TR', 'Türkiye': 'TR',
      
      // North America
      'United States': 'US', 'US': 'US', 'USA': 'US', 'America': 'US',
      'Canada': 'CA', 'CA': 'CA',
      'Mexico': 'MX', 'MX': 'MX', 'México': 'MX',
      
      // Asia
      'Vietnam': 'VN', 'VN': 'VN', 'Việt Nam': 'VN',
      'Japan': 'JP', 'JP': 'JP', '日本': 'JP',
      'South Korea': 'KR', 'KR': 'KR', 'Korea': 'KR', '한국': 'KR',
      'China': 'CN', 'CN': 'CN', '中国': 'CN',
      'India': 'IN', 'IN': 'IN', 'भारत': 'IN',
      'Thailand': 'TH', 'TH': 'TH', 'ไทย': 'TH',
      'Singapore': 'SG', 'SG': 'SG',
      'Malaysia': 'MY', 'MY': 'MY',
      'Indonesia': 'ID', 'ID': 'ID',
      'Philippines': 'PH', 'PH': 'PH', 'Pilipinas': 'PH',
      'Taiwan': 'TW', 'TW': 'TW', '台灣': 'TW',
      'Hong Kong': 'HK', 'HK': 'HK', '香港': 'HK',
      'Macau': 'MO', 'MO': 'MO', '澳門': 'MO',
      'Mongolia': 'MN', 'MN': 'MN', 'Монгол': 'MN',
      'Kazakhstan': 'KZ', 'KZ': 'KZ', 'Қазақстан': 'KZ',
      'Kyrgyzstan': 'KG', 'KG': 'KG', 'Кыргызстан': 'KG',
      'Tajikistan': 'TJ', 'TJ': 'TJ', 'Тоҷикистон': 'TJ',
      'Uzbekistan': 'UZ', 'UZ': 'UZ', 'Oʻzbekiston': 'UZ',
      'Turkmenistan': 'TM', 'TM': 'TM', 'Türkmenistan': 'TM',
      'Afghanistan': 'AF', 'AF': 'AF', 'افغانستان': 'AF',
      'Pakistan': 'PK', 'PK': 'PK', 'پاکستان': 'PK',
      'Bangladesh': 'BD', 'BD': 'BD', 'বাংলাদেশ': 'BD',
      'Sri Lanka': 'LK', 'LK': 'LK', 'ශ්‍රී ලංකා': 'LK',
      'Maldives': 'MV', 'MV': 'MV',
      'Nepal': 'NP', 'NP': 'NP', 'नेपाल': 'NP',
      'Bhutan': 'BT', 'BT': 'BT', 'འབྲུག': 'BT',
      'Myanmar': 'MM', 'MM': 'MM', 'မြန်မာ': 'MM',
      'Laos': 'LA', 'LA': 'LA', 'ລາວ': 'LA',
      'Cambodia': 'KH', 'KH': 'KH', 'កម្ពុជា': 'KH',
      'Brunei': 'BN', 'BN': 'BN',
      'East Timor': 'TL', 'TL': 'TL', 'Timor-Leste': 'TL',
    };
    
    // Use mapped country code if available, otherwise try the original
    const mappedCountryCode = countryCodeMap[countryCode] || countryCode.toUpperCase();
    console.log('Mapped country code:', mappedCountryCode);
    
    const numbers = EmergencyServiceApi.getEmergencyNumbers(mappedCountryCode);
    console.log('Emergency numbers for', mappedCountryCode, ':', numbers);
    setEmergencyNumbers(numbers);
    
    // Auto-fetch weather for the selected location and date
    if (!formData.weather && formData.shootDate) {
      await fetchWeatherForLocationAndDate(location);
    }

    // Auto-fetch emergency services with 10km radius
    setEmergencyServicesLoading(true);
    try {
      const services = await EmergencyServiceApi.getNearbyEmergencyServices(
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

  const fetchWeatherForLocationAndDate = async (location: GeocodingResult) => {
    if (!formData.shootDate) return;

    setWeatherLoading(true);
    try {
      const weatherData = await WeatherService.getWeatherForDate(
        location.latitude,
        location.longitude,
        formData.shootDate,
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
  };

  const handleRefreshWeather = async () => {
    if (!selectedLocation && !formData.location) return;
    if (!formData.shootDate) {
      console.warn('Shoot date is required for weather forecast');
      return;
    }

    setWeatherLoading(true);
    try {
      let weatherData: WeatherData | null = null;
      
      if (selectedLocation) {
        weatherData = await WeatherService.getWeatherForDate(
          selectedLocation.latitude,
          selectedLocation.longitude,
          formData.shootDate,
          weatherUnits
        );
      } else if (formData.location) {
        const locations = await WeatherService.geocodeLocation(formData.location);
        if (locations.length > 0) {
          weatherData = await WeatherService.getWeatherForDate(
            locations[0].latitude,
            locations[0].longitude,
            formData.shootDate,
            weatherUnits
          );
        }
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

  // Handle weather units change and re-fetch weather
  const handleWeatherUnitsChange = async (units: 'imperial' | 'metric') => {
    setWeatherUnits(units);
    
    // Re-fetch weather with new units if we have a location and date
    if ((selectedLocation || formData.location) && formData.shootDate) {
      setWeatherLoading(true);
      try {
        let weatherData: WeatherData | null = null;
        
        if (selectedLocation) {
          weatherData = await WeatherService.getWeatherForDate(
            selectedLocation.latitude,
            selectedLocation.longitude,
            formData.shootDate,
            units
          );
        } else if (formData.location) {
          const locations = await WeatherService.geocodeLocation(formData.location);
          if (locations.length > 0) {
            weatherData = await WeatherService.getWeatherForDate(
              locations[0].latitude,
              locations[0].longitude,
              formData.shootDate,
              units
            );
          }
        }
        
        if (weatherData) {
          const weatherString = WeatherService.formatWeatherString(weatherData);
          handleInputChange('weather', weatherString);
        }
      } catch (error) {
        console.error('Failed to refresh weather with new units:', error);
      } finally {
        setWeatherLoading(false);
      }
    }

    // Re-fetch emergency services with new units
    if (selectedLocation) {
      setEmergencyServicesLoading(true);
      try {
        const services = await EmergencyServiceApi.getNearbyEmergencyServices(
          selectedLocation.latitude,
          selectedLocation.longitude,
          10,
          units
        );
        setEmergencyServices(services);
      } catch (error) {
        console.error('Failed to fetch emergency services with new units:', error);
      } finally {
        setEmergencyServicesLoading(false);
      }
    }
  };

  // Auto-refresh weather when shoot date changes
  useEffect(() => {
    if (selectedLocation && formData.shootDate) {
      fetchWeatherForLocationAndDate(selectedLocation);
    }
  }, [formData.shootDate]);

  const handleAddContact = async (contact: Contact, type: 'cast' | 'crew' | 'emergency') => {
    const fieldName = type === 'emergency' ? 'emergencyContacts' : type;
    const currentContacts = formData[fieldName] || [];
    
    // Check if contact already exists in the current list
    if (!currentContacts.find(c => c.id === contact.id)) {
      // Always try to save new contacts to the database if they have the required fields
      // This ensures contacts are preserved even if removed from the callsheet later
      if (contact.name && contact.role && contact.phone) {
        // Check if this contact already exists in the contacts database
        const existingContact = contacts.find(c => 
          c.name === contact.name && 
          c.phone === contact.phone && 
          c.role === contact.role
        );
        
        // Only save if it doesn't already exist in the database
        if (!existingContact) {
          try {
            console.log('Saving new contact to database:', contact);
            await addContact({
              name: contact.name,
              role: contact.role,
              phone: contact.phone,
              email: contact.email || '',
              character: contact.character || '',
              department: contact.department || ''
            });
            console.log('Contact saved successfully to database');
          } catch (error) {
            console.error('Failed to save contact to database:', error);
            // Continue anyway - the contact will still be added to the callsheet
            // We don't want to block the user from adding contacts to their callsheet
          }
        } else {
          console.log('Contact already exists in database, skipping save');
        }
      } else {
        console.warn('Contact missing required fields, not saving to database:', contact);
      }
      
      // Always add the contact to the current callsheet regardless of database save success
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
    
    // Convert emergency service to contact format with clearer address display
    const emergencyContact = {
      id: service.id,
      name: service.name,
      role: `${EmergencyServiceApi.formatServiceType(service.type)} (${service.distance}${weatherUnits === 'imperial' ? 'mi' : 'km'})`,
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

    if (!user) {
      alert('You must be logged in to create a callsheet');
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
      userId: user.id,
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
    <div className="p-8 max-w-6xl">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex-1">
          <h1 className="section-heading mb-2">
            {isEditing ? 'Edit Callsheet' : 'Create New Callsheet'}
          </h1>
          <p className="text-muted-foreground font-normal leading-relaxed">
            Fill in the production details below
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Callsheet Details</TabsTrigger>
          <TabsTrigger value="appearance">Modify PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Calendar className="w-5 h-5 mr-2" />
                  Production Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectTitle" className="text-foreground">Project Title *</Label>
                    <Input
                      id="projectTitle"
                      value={formData.projectTitle || ''}
                      onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                      placeholder="Enter project title"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shootDate" className="text-foreground">Shoot Date *</Label>
                    <Input
                      id="shootDate"
                      type="date"
                      value={formData.shootDate || ''}
                      onChange={(e) => handleInputChange('shootDate', e.target.value)}
                      className="bg-input border-border text-foreground"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="generalCallTime" className="text-foreground">General Call Time *</Label>
                  <Input
                    id="generalCallTime"
                    type="time"
                    value={formData.generalCallTime || ''}
                    onChange={(e) => handleInputChange('generalCallTime', e.target.value)}
                    className="md:w-1/2 bg-input border-border text-foreground"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Numbers - Prominent Display */}
            {emergencyNumbers && (
              <EmergencyNumbers emergencyNumbers={emergencyNumbers} />
            )}

            {/* Location Information */}
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
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
                    <Label htmlFor="locationAddress" className="text-foreground">Location Address</Label>
                    <Input
                      id="locationAddress"
                      value={formData.locationAddress || ''}
                      onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                      placeholder="Full address with zip code"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                
                {/* Weather Units Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground">Weather Units</Label>
                    <RadioGroup 
                      value={weatherUnits} 
                      onValueChange={handleWeatherUnitsChange}
                      className="flex flex-row space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="metric" id="metric" />
                        <Label htmlFor="metric" className="font-normal text-foreground">Metric (°C, km/h)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="imperial" id="imperial" />
                        <Label htmlFor="imperial" className="font-normal text-foreground">Imperial (°F, mph)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="weather" className="text-foreground">Weather</Label>
                    <div className="relative">
                      <Input
                        id="weather"
                        value={formData.weather || ''}
                        onChange={(e) => handleInputChange('weather', e.target.value)}
                        placeholder="Auto-populated from location and date or enter manually"
                        className="pr-20 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRefreshWeather}
                        disabled={weatherLoading || (!selectedLocation && !formData.location) || !formData.shootDate}
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
                      <p className="text-xs text-muted-foreground mt-1">Fetching weather data for {formData.shootDate}...</p>
                    )}
                    {!formData.shootDate && (
                      <p className="text-xs text-muted-foreground mt-1">Set shoot date to get weather forecast</p>
                    )}
                  </div>
                </div>

                {/* Emergency Services Section - Two Column Layout */}
                {emergencyServices.length > 0 && (
                  <div className="mt-6">
                    <Label className="text-base font-medium flex items-center mb-3 text-foreground">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Nearby Emergency Services
                    </Label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                      {emergencyServices.map((service) => (
                        <div key={service.id} className="flex items-start justify-between p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              <span className="mr-2 text-lg">{EmergencyServiceApi.getServiceIcon(service.type)}</span>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm text-orange-900 dark:text-orange-100 truncate">{service.name}</div>
                                <div className="text-xs text-orange-700 dark:text-orange-200">{EmergencyServiceApi.formatServiceType(service.type)}</div>
                              </div>
                              <div className="ml-2 text-xs text-orange-600 dark:text-orange-300 whitespace-nowrap">
                                {service.distance}{weatherUnits === 'imperial' ? 'mi' : 'km'} away
                              </div>
                            </div>
                            {service.address && (
                              <div className="text-sm text-orange-800 dark:text-orange-200 mb-2 bg-white dark:bg-orange-900/30 p-2 rounded border border-orange-100 dark:border-orange-800/30">
                                <div className="flex items-start">
                                  <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                                  <span className="text-xs leading-relaxed">{service.address}</span>
                                </div>
                              </div>
                            )}
                            {service.phone && (
                              <div className="text-xs text-orange-700 dark:text-orange-300 flex items-center">
                                <span className="mr-1">📞</span>
                                {service.phone}
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddEmergencyService(service)}
                            className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 ml-3 flex-shrink-0"
                            title="Add to emergency contacts"
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
                    <Label htmlFor="parkingInstructions" className="text-foreground">Parking Instructions</Label>
                    <Textarea
                      id="parkingInstructions"
                      value={formData.parkingInstructions || ''}
                      onChange={(e) => handleInputChange('parkingInstructions', e.target.value)}
                      placeholder="Parking details and restrictions"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="basecampLocation" className="text-foreground">Basecamp Location</Label>
                    <Textarea
                      id="basecampLocation"
                      value={formData.basecampLocation || ''}
                      onChange={(e) => handleInputChange('basecampLocation', e.target.value)}
                      placeholder="Craft services, trailers, equipment staging"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cast & Crew */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cast */}
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-foreground">
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
                      <div key={castMember.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{castMember.name}</div>
                          <div className="text-sm text-muted-foreground">{castMember.character || castMember.role}</div>
                          <div className="text-sm text-muted-foreground">{castMember.phone}</div>
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
                      <p className="text-muted-foreground text-center py-4">No cast members added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Crew */}
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-foreground">
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
                      <div key={crewMember.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{crewMember.name}</div>
                          <div className="text-sm text-muted-foreground">{crewMember.role}</div>
                          <div className="text-sm text-muted-foreground">{crewMember.phone}</div>
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
                      <p className="text-muted-foreground text-center py-4">No crew members added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule */}
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
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
                    <div key={item.id} className="p-4 border border-border rounded-lg bg-muted">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <Label className="text-foreground">Scene #</Label>
                          <Input
                            value={item.sceneNumber}
                            onChange={(e) => handleUpdateScheduleItem(item.id, 'sceneNumber', e.target.value)}
                            placeholder="1A"
                            className="bg-input border-border text-foreground"
                          />
                        </div>
                        <div>
                          <Label className="text-foreground">INT/EXT</Label>
                          <Select
                            value={item.intExt}
                            onValueChange={(value: 'INT' | 'EXT') => 
                              handleUpdateScheduleItem(item.id, 'intExt', value)
                            }
                          >
                            <SelectTrigger className="bg-input border-border text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="INT" className="text-popover-foreground">INT</SelectItem>
                              <SelectItem value="EXT" className="text-popover-foreground">EXT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-foreground">Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => handleUpdateScheduleItem(item.id, 'description', e.target.value)}
                            placeholder="Kitchen - Morning coffee"
                            className="bg-input border-border text-foreground"
                          />
                        </div>
                        <div>
                          <Label className="text-foreground">Pages</Label>
                          <Input
                            value={item.pageCount}
                            onChange={(e) => handleUpdateScheduleItem(item.id, 'pageCount', e.target.value)}
                            placeholder="2/8"
                            className="bg-input border-border text-foreground"
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
                          <Label className="text-foreground">Location</Label>
                          <Input
                            value={item.location}
                            onChange={(e) => handleUpdateScheduleItem(item.id, 'location', e.target.value)}
                            placeholder="Studio Kitchen Set"
                            className="bg-input border-border text-foreground"
                          />
                        </div>
                        <div>
                          <Label className="text-foreground">Estimated Time</Label>
                          <Input
                            value={item.estimatedTime}
                            onChange={(e) => handleUpdateScheduleItem(item.id, 'estimatedTime', e.target.value)}
                            placeholder="9:00 AM - 11:00 AM"
                            className="bg-input border-border text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(formData.schedule || []).length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No scenes added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts & Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-foreground">
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
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
                        <div>
                          <div className="font-medium text-red-800 dark:text-red-200">{contact.name}</div>
                          <div className="text-sm text-red-700 dark:text-red-300">{contact.role}</div>
                          <div className="text-sm text-red-600 dark:text-red-400">{contact.phone}</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContact(contact.id, 'emergency')}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(formData.emergencyContacts || []).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No emergency contacts added</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Special Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.specialNotes || ''}
                    onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                    placeholder="Additional production notes, safety information, special instructions..."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    rows={8}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isEditing ? 'Update Callsheet' : 'Create Callsheet'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="appearance">
          {formData.projectTitle ? (
            <SimplePDFSettings
              callsheet={formData as CallsheetData}
              customization={pdfCustomization}
              onCustomizationChange={setPdfCustomization}
            />
          ) : (
            <Card className="bg-card text-card-foreground border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Please fill in the basic callsheet details first to customize PDF appearance.
                </p>
                <Button 
                  onClick={() => setActiveTab('basic')} 
                  className="mt-4"
                  variant="outline"
                >
                  Go to Callsheet Details
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
