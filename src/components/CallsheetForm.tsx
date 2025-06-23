
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CallsheetData, useCallsheet } from '@/contexts/CallsheetContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmergencyService, EmergencyServiceApi } from '@/services/emergencyService';
import { EmergencyServicesList } from '@/components/EmergencyServicesList';
import { EmergencyNumbers } from '@/components/EmergencyNumbers';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Loader } from 'lucide-react';
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  projectTitle: z.string().min(2, {
    message: 'Project title must be at least 2 characters.',
  }),
  shootDate: z.date(),
  generalCallTime: z.string().min(5, {
    message: 'Call time must be at least 5 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  locationAddress: z.string().optional(),
  weather: z.string().optional(),
  parkingInstructions: z.string().optional(),
  basecampLocation: z.string().optional(),
  specialNotes: z.string().optional(),
});

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface CallsheetFormProps {
  onBack?: () => void;
}

export function CallsheetForm({ onBack }: CallsheetFormProps) {
  const { callsheetData, updateCallsheet } = useCallsheet();
  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [locationSearch, setLocationSearch] = useState(callsheetData.locationAddress || '');
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectTitle: callsheetData.projectTitle,
      shootDate: new Date(callsheetData.shootDate),
      generalCallTime: callsheetData.generalCallTime,
      location: callsheetData.location,
      locationAddress: callsheetData.locationAddress || '',
      weather: callsheetData.weather || '',
      parkingInstructions: callsheetData.parkingInstructions || '',
      basecampLocation: callsheetData.basecampLocation || '',
      specialNotes: callsheetData.specialNotes || '',
    },
  });

  useEffect(() => {
    if (callsheetData.locationAddress) {
      setLocationSearch(callsheetData.locationAddress);
    }
  }, [callsheetData.locationAddress]);

  useEffect(() => {
    if (isLocationEnabled && location.latitude && location.longitude) {
      fetchEmergencyServices();
    }
  }, [location, searchRadius, units, isLocationEnabled]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateCallsheet({
      ...callsheetData,
      projectTitle: values.projectTitle,
      shootDate: values.shootDate.toISOString(),
      generalCallTime: values.generalCallTime,
      location: values.location,
      locationAddress: values.locationAddress,
      weather: values.weather,
      parkingInstructions: values.parkingInstructions,
      basecampLocation: values.basecampLocation,
      specialNotes: values.specialNotes,
    });
    toast({
      title: "Success!",
      description: "You have successfully updated the callsheet form.",
    })
  };

  const handleEmergencyServiceSelect = (service: EmergencyService) => {
    const newContact = {
      id: `emergency-${Date.now()}`,
      name: service.name,
      role: EmergencyServiceApi.formatServiceType(service.type),
      phone: service.phone || 'Phone not available',
      email: '', // Emergency services typically don't have email
      address: service.address // Include the address from the service
    };
    
    updateCallsheet({
      ...callsheetData,
      emergencyContacts: [...callsheetData.emergencyContacts, newContact]
    });
  };

  const handleRemoveEmergencyContact = (id: string) => {
    updateCallsheet({
      ...callsheetData,
      emergencyContacts: callsheetData.emergencyContacts.filter(contact => contact.id !== id)
    });
  };

  const handleLocationToggle = () => {
    setIsLocationEnabled(!isLocationEnabled);
    if (!isLocationEnabled) {
      getLocation();
    } else {
      setLocation({ latitude: null, longitude: null });
      setEmergencyServices([]);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Error getting location. Please ensure location services are enabled.');
          setIsLocationEnabled(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsLocationEnabled(false);
    }
  };

  const fetchEmergencyServices = useCallback(async () => {
    if (!location.latitude || !location.longitude) {
      return;
    }

    setIsLoading(true);
    try {
      const services = await EmergencyServiceApi.findNearbyEmergencyServices(
        location.latitude,
        location.longitude,
        searchRadius,
        units
      );
      setEmergencyServices(services);
    } catch (error) {
      console.error('Error fetching emergency services:', error);
      alert('Failed to fetch emergency services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [location.latitude, location.longitude, searchRadius, units]);

  const handleSearchLocation = async () => {
    setIsLoading(true);
    try {
      // For now, just show an alert as the geocoding service needs to be implemented
      alert('Location search feature coming soon. Please use the location toggle instead.');
    } catch (error) {
      console.error('Error geocoding location:', error);
      alert('Failed to geocode location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const emergencyNumbers = location.latitude && location.longitude ? 
    EmergencyServiceApi.getEmergencyNumbers('US') : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="projectTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shootDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Shoot Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={false}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="generalCallTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>General call time</FormLabel>
                <FormControl>
                  <Input placeholder="09:00 AM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="locationAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter location address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weather"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weather</FormLabel>
                <FormControl>
                  <Input placeholder="Enter weather forecast" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parkingInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parking instructions</FormLabel>
                <FormControl>
                  <Input placeholder="Enter parking instructions" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="basecampLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Basecamp location</FormLabel>
              <FormControl>
                <Input placeholder="Enter basecamp location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter special notes" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Callsheet</Button>
      </form>

      <div className="mt-12">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Emergency Services</h2>
            <DrawerTrigger asChild>
              <Button variant="outline">
                Find Emergency Services
              </Button>
            </DrawerTrigger>
          </div>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Emergency Services</DrawerTitle>
              <DrawerDescription>
                Find nearby emergency services based on your location.
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="location-enabled">Enable Location</Label>
                <Switch
                  id="location-enabled"
                  checked={isLocationEnabled}
                  onCheckedChange={handleLocationToggle}
                />
              </div>

              {isLocationEnabled && (
                <>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="search-radius">Search Radius</Label>
                    <Input
                      type="number"
                      id="search-radius"
                      defaultValue={searchRadius.toString()}
                      onChange={(e) => setSearchRadius(Number(e.target.value))}
                      className="col-span-2"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="units">Units</Label>
                    <Select value={units} onValueChange={(value) => setUnits(value as 'imperial' | 'metric')}>
                      <SelectTrigger id="units" className="col-span-2">
                        <SelectValue placeholder="Select units" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imperial">Imperial (mi)</SelectItem>
                        <SelectItem value="metric">Metric (km)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {!isLocationEnabled && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="location-search">Search Location</Label>
                  <Input
                    type="text"
                    id="location-search"
                    placeholder="Enter address or location"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="col-span-2"
                  />
                  <Button type="button" onClick={handleSearchLocation} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
              )}
            </div>

            {isLoading && (
              <div className="flex items-center space-x-2">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading emergency services...</span>
              </div>
            )}

            {emergencyServices.length > 0 && (
              <EmergencyServicesList services={emergencyServices} units={units} />
            )}

            {emergencyNumbers && (
              <EmergencyNumbers emergencyNumbers={emergencyNumbers} />
            )}

            <DrawerFooter>
              <DrawerClose>Cancel</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {callsheetData.emergencyContacts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Emergency Contacts</h3>
          <div className="space-y-3">
            {callsheetData.emergencyContacts.map((contact) => (
              <div key={contact.id} className="border rounded-md p-4">
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-500">{contact.role}</div>
                <div className="text-sm text-gray-500">{contact.phone}</div>
                {contact.address && (
                  <div className="text-sm text-gray-500">Address: {contact.address}</div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEmergencyContact(contact.id)}
                  className="mt-2"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Form>
  );
}

function format(date: Date, formatStr: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString(undefined, options);
}
