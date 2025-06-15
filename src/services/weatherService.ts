
export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  windSpeed: number;
  humidity: number;
  units: 'imperial' | 'metric';
  forecastType: 'current' | 'forecast' | 'historical';
  date?: string;
}

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // state/region
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface WeatherResponse {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    relative_humidity_2m_mean: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
}

// Weather code mappings based on WMO codes
const weatherCodeMap: { [key: number]: { condition: string; description: string } } = {
  0: { condition: 'Clear', description: 'Clear sky' },
  1: { condition: 'Mostly Clear', description: 'Mainly clear' },
  2: { condition: 'Partly Cloudy', description: 'Partly cloudy' },
  3: { condition: 'Overcast', description: 'Overcast' },
  45: { condition: 'Foggy', description: 'Fog' },
  48: { condition: 'Foggy', description: 'Depositing rime fog' },
  51: { condition: 'Light Drizzle', description: 'Light drizzle' },
  53: { condition: 'Drizzle', description: 'Moderate drizzle' },
  55: { condition: 'Heavy Drizzle', description: 'Dense drizzle' },
  61: { condition: 'Light Rain', description: 'Slight rain' },
  63: { condition: 'Rain', description: 'Moderate rain' },
  65: { condition: 'Heavy Rain', description: 'Heavy rain' },
  71: { condition: 'Light Snow', description: 'Slight snow fall' },
  73: { condition: 'Snow', description: 'Moderate snow fall' },
  75: { condition: 'Heavy Snow', description: 'Heavy snow fall' },
  77: { condition: 'Snow Grains', description: 'Snow grains' },
  80: { condition: 'Light Showers', description: 'Slight rain showers' },
  81: { condition: 'Showers', description: 'Moderate rain showers' },
  82: { condition: 'Heavy Showers', description: 'Violent rain showers' },
  85: { condition: 'Snow Showers', description: 'Slight snow showers' },
  86: { condition: 'Heavy Snow Showers', description: 'Heavy snow showers' },
  95: { condition: 'Thunderstorm', description: 'Thunderstorm' },
  96: { condition: 'Thunderstorm with Hail', description: 'Thunderstorm with slight hail' },
  99: { condition: 'Thunderstorm with Heavy Hail', description: 'Thunderstorm with heavy hail' },
};

export class WeatherService {
  private static readonly GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  private static readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
  private static readonly WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

  private static formatNominatimResult(result: NominatimResult): GeocodingResult {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    // Try to extract a clean name from the display_name
    let name = result.display_name;
    if (result.address) {
      const addr = result.address;
      if (addr.house_number && addr.road) {
        name = `${addr.house_number} ${addr.road}`;
        if (addr.city || addr.town || addr.village) {
          name += `, ${addr.city || addr.town || addr.village}`;
        }
      } else if (addr.road) {
        name = addr.road;
        if (addr.city || addr.town || addr.village) {
          name += `, ${addr.city || addr.town || addr.village}`;
        }
      } else {
        // Fallback to first part of display_name
        name = result.display_name.split(',')[0];
      }
    }

    return {
      name,
      latitude: lat,
      longitude: lon,
      country: result.address?.country || '',
      admin1: result.address?.state
    };
  }

  private static getDateType(dateString: string): 'past' | 'today' | 'future' {
    const shootDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    shootDate.setHours(0, 0, 0, 0);
    
    if (shootDate < today) return 'past';
    if (shootDate.getTime() === today.getTime()) return 'today';
    return 'future';
  }

  private static formatDateForAPI(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  static async searchLocations(query: string): Promise<GeocodingResult[]> {
    if (!query || query.length < 2) return [];
    
    try {
      // First try Nominatim for full address search
      const nominatimResponse = await fetch(
        `${this.NOMINATIM_URL}?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=us,ca,gb,au,de,fr,es,it,nl,dk,se,no,fi`,
        {
          headers: {
            'User-Agent': 'Callsheet-App/1.0'
          }
        }
      );
      
      if (nominatimResponse.ok) {
        const nominatimData: NominatimResult[] = await nominatimResponse.json();
        const nominatimResults = nominatimData.map(this.formatNominatimResult);
        
        // If we got good address results, prioritize them
        if (nominatimResults.length > 0) {
          // Also try Open-Meteo for city names to supplement
          try {
            const meteoResponse = await fetch(`${this.GEOCODING_URL}?name=${encodeURIComponent(query)}&count=3`);
            if (meteoResponse.ok) {
              const meteoData = await meteoResponse.json();
              const meteoResults = meteoData.results || [];
              
              // Combine results, prioritizing Nominatim (addresses) over Metro (cities)
              const combined = [...nominatimResults];
              meteoResults.forEach((meteoResult: GeocodingResult) => {
                // Only add if not already similar to existing results
                if (!combined.some(existing => 
                  Math.abs(existing.latitude - meteoResult.latitude) < 0.01 &&
                  Math.abs(existing.longitude - meteoResult.longitude) < 0.01
                )) {
                  combined.push(meteoResult);
                }
              });
              
              return combined.slice(0, 10);
            }
          } catch (error) {
            console.warn('Open-Meteo geocoding failed, using Nominatim only:', error);
          }
          
          return nominatimResults.slice(0, 10);
        }
      }
      
      // Fallback to Open-Meteo if Nominatim fails or returns no results
      const response = await fetch(`${this.GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10`);
      if (!response.ok) throw new Error('Location search failed');
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  static async geocodeLocation(location: string): Promise<GeocodingResult[]> {
    // Use the same enhanced search for geocoding
    return this.searchLocations(location);
  }

  static async getCurrentWeather(latitude: number, longitude: number, units: 'imperial' | 'metric' = 'imperial'): Promise<WeatherData | null> {
    try {
      const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
      const windUnit = units === 'imperial' ? 'mph' : 'kmh';
      
      const response = await fetch(
        `${this.WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`
      );
      
      if (!response.ok) throw new Error('Weather fetch failed');
      
      const data: WeatherResponse = await response.json();
      const current = data.current!;
      
      const weatherInfo = weatherCodeMap[current.weather_code] || {
        condition: 'Unknown',
        description: 'Weather data unavailable'
      };

      return {
        temperature: Math.round(current.temperature_2m),
        condition: weatherInfo.condition,
        description: weatherInfo.description,
        windSpeed: Math.round(current.wind_speed_10m),
        humidity: current.relative_humidity_2m,
        units,
        forecastType: 'current'
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
  }

  static async getWeatherForDate(
    latitude: number, 
    longitude: number, 
    dateString: string,
    units: 'imperial' | 'metric' = 'imperial'
  ): Promise<WeatherData | null> {
    try {
      const dateType = this.getDateType(dateString);
      const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
      const windUnit = units === 'imperial' ? 'mph' : 'kmh';
      const formattedDate = this.formatDateForAPI(dateString);
      
      let url: string;
      let forecastType: 'current' | 'forecast' | 'historical';
      
      if (dateType === 'today') {
        // Use current weather for today
        return await this.getCurrentWeather(latitude, longitude, units);
      } else if (dateType === 'future') {
        // Use forecast for future dates (up to 16 days)
        const daysFromNow = Math.floor((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysFromNow > 16) {
          console.warn('Forecast only available for up to 16 days ahead');
          return null;
        }
        
        url = `${this.WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,wind_speed_10m_max,weather_code&start_date=${formattedDate}&end_date=${formattedDate}&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`;
        forecastType = 'forecast';
      } else {
        // Use historical archive for past dates (from 1940 onwards)
        const archiveUrl = 'https://archive-api.open-meteo.com/v1/archive';
        url = `${archiveUrl}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,wind_speed_10m_max,weather_code&start_date=${formattedDate}&end_date=${formattedDate}&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`;
        forecastType = 'historical';
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather fetch failed');
      
      const data: WeatherResponse = await response.json();
      const daily = data.daily!;
      
      if (!daily.time || daily.time.length === 0) {
        return null;
      }
      
      const weatherInfo = weatherCodeMap[daily.weather_code[0]] || {
        condition: 'Unknown',
        description: 'Weather data unavailable'
      };

      // Use average of min/max temperature
      const avgTemp = (daily.temperature_2m_max[0] + daily.temperature_2m_min[0]) / 2;

      return {
        temperature: Math.round(avgTemp),
        condition: weatherInfo.condition,
        description: weatherInfo.description,
        windSpeed: Math.round(daily.wind_speed_10m_max[0]),
        humidity: Math.round(daily.relative_humidity_2m_mean[0]),
        units,
        forecastType,
        date: formattedDate
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
  }

  static async getWeatherForLocation(location: string, units: 'imperial' | 'metric' = 'imperial'): Promise<WeatherData | null> {
    if (!location.trim()) return null;

    const locations = await this.geocodeLocation(location);
    if (locations.length === 0) return null;

    // Use the first result
    const firstLocation = locations[0];
    return await this.getCurrentWeather(firstLocation.latitude, firstLocation.longitude, units);
  }

  static formatWeatherString(weather: WeatherData): string {
    const tempUnit = weather.units === 'imperial' ? '°F' : '°C';
    const windUnit = weather.units === 'imperial' ? 'mph' : 'km/h';
    const typeLabel = weather.forecastType === 'forecast' ? ' (Forecast)' : 
                     weather.forecastType === 'historical' ? ' (Historical)' : '';
    return `${weather.condition}, ${weather.temperature}${tempUnit}, Wind: ${weather.windSpeed} ${windUnit}, Humidity: ${weather.humidity}%${typeLabel}`;
  }

  static formatLocationName(location: GeocodingResult): string {
    let name = location.name;
    if (location.admin1) {
      name += `, ${location.admin1}`;
    }
    if (location.country) {
      name += `, ${location.country}`;
    }
    return name;
  }
}
