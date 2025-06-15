
import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WeatherService } from '@/services/weatherService';

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: GeocodingResult) => void;
  placeholder?: string;
  id?: string;
}

export const LocationInput = ({ 
  label, 
  value, 
  onChange, 
  onLocationSelect,
  placeholder = "Search for a location or address...",
  id 
}: LocationInputProps) => {
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const searchLocations = async () => {
      if (value.length < 3) { // Increased minimum length for address search
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const results = await WeatherService.searchLocations(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Location search failed:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 400); // Slightly longer delay for address search
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleLocationSelect = (location: GeocodingResult) => {
    const locationName = WeatherService.formatLocationName(location);
    onChange(locationName);
    setShowSuggestions(false);
    onLocationSelect?.(location);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const getLocationTypeIcon = (location: GeocodingResult): string => {
    // Simple heuristic to determine if it's likely an address vs city
    if (location.name.match(/^\d+\s/)) {
      return '🏠'; // Has house number
    } else if (location.name.includes(',') && location.name.split(',')[0].length < 30) {
      return '🏠'; // Likely street address
    } else {
      return '🏙️'; // Likely city/place
    }
  };

  return (
    <div className="relative">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="pr-8"
        />
        <MapPin className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((location, index) => (
              <button
                key={`${location.latitude}-${location.longitude}`}
                ref={(el) => (suggestionRefs.current[index] = el)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                onClick={() => handleLocationSelect(location)}
                type="button"
              >
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-xs">
                    {getLocationTypeIcon(location)}
                  </span>
                  <div>
                    <div className="font-medium text-sm">
                      {WeatherService.formatLocationName(location)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {loading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};
