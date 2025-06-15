
export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  windSpeed: number;
  humidity: number;
  units: 'imperial' | 'metric';
}

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // state/region
}

interface WeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
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
  private static readonly WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

  static async searchLocations(query: string): Promise<GeocodingResult[]> {
    if (!query || query.length < 2) return [];
    
    try {
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
    try {
      const response = await fetch(`${this.GEOCODING_URL}?name=${encodeURIComponent(location)}&count=5`);
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
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
      const current = data.current;
      
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
        units
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
    return `${weather.condition}, ${weather.temperature}${tempUnit}, Wind: ${weather.windSpeed} ${windUnit}, Humidity: ${weather.humidity}%`;
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
