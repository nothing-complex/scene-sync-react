
export interface EmergencyService {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire_station' | 'pharmacy';
  address: string;
  phone?: string;
  distance: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    emergency?: string;
    phone?: string;
    'addr:full'?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    'addr:postcode'?: string;
    [key: string]: any; // Add index signature to prevent type issues
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

interface EmergencyNumbers {
  general: string;
  police: string;
  fire: string;
  medical: string;
}

export class EmergencyServiceApi {
  private static readonly OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static convertToMiles(km: number): number {
    return km * 0.621371;
  }

  private static buildOverpassQuery(lat: number, lon: number, radiusKm: number): string {
    return `
      [out:json][timeout:25];
      (
        nwr["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lon});
        nwr["amenity"="police"](around:${radiusKm * 1000},${lat},${lon});
        nwr["amenity"="fire_station"](around:${radiusKm * 1000},${lat},${lon});
        nwr["amenity"="pharmacy"](around:${radiusKm * 1000},${lat},${lon});
        nwr["emergency"="ambulance_station"](around:${radiusKm * 1000},${lat},${lon});
      );
      out center;
    `;
  }

  private static formatAddress(element: OverpassElement): string {
    const tags = element.tags;
    if (tags['addr:full']) {
      return tags['addr:full'];
    }
    
    const parts = [];
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  }

  private static determineServiceType(element: OverpassElement): EmergencyService['type'] | null {
    const amenity = element.tags.amenity;
    const emergency = element.tags.emergency;
    
    if (amenity === 'hospital' || emergency === 'ambulance_station') return 'hospital';
    if (amenity === 'police') return 'police';
    if (amenity === 'fire_station') return 'fire_station';
    if (amenity === 'pharmacy') return 'pharmacy';
    
    return null;
  }

  static getServiceIcon(type: EmergencyService['type']): string {
    switch (type) {
      case 'hospital': return '🏥';
      case 'police': return '👮';
      case 'fire_station': return '🚒';
      case 'pharmacy': return '💊';
      default: return '🚨';
    }
  }

  static formatServiceType(type: EmergencyService['type']): string {
    switch (type) {
      case 'hospital': return 'Hospital';
      case 'police': return 'Police Station';
      case 'fire_station': return 'Fire Station';
      case 'pharmacy': return 'Pharmacy';
      default: return 'Emergency Service';
    }
  }

  static async getNearbyEmergencyServices(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    units: 'imperial' | 'metric' = 'imperial'
  ): Promise<EmergencyService[]> {
    try {
      const query = this.buildOverpassQuery(latitude, longitude, radiusKm);
      
      const response = await fetch(this.OVERPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data: OverpassResponse = await response.json();
      
      return data.elements
        .map((element): EmergencyService | null => {
          const serviceType = this.determineServiceType(element);
          if (!serviceType || !element.tags.name) return null;

          const distance = this.calculateDistance(latitude, longitude, element.lat, element.lon);
          const finalDistance = units === 'imperial' ? this.convertToMiles(distance) : distance;

          return {
            id: `${element.type}-${element.id}`,
            name: element.tags.name,
            type: serviceType,
            address: this.formatAddress(element),
            phone: element.tags.phone,
            distance: Math.round(finalDistance * 10) / 10, // Round to 1 decimal
            coordinates: { lat: element.lat, lon: element.lon }
          };
        })
        .filter((service): service is EmergencyService => service !== null)
        .sort((a, b) => a.distance - b.distance) // Sort by distance
        .slice(0, 20); // Limit to 20 results

    } catch (error) {
      console.error('Error fetching emergency services:', error);
      return [];
    }
  }

  static getEmergencyNumbers(countryCode: string): EmergencyNumbers {
    const emergencyNumbers: Record<string, EmergencyNumbers> = {
      'US': { general: '911', police: '911', fire: '911', medical: '911' },
      'CA': { general: '911', police: '911', fire: '911', medical: '911' },
      'GB': { general: '999', police: '999', fire: '999', medical: '999' },
      'AU': { general: '000', police: '000', fire: '000', medical: '000' },
      'DE': { general: '112', police: '110', fire: '112', medical: '112' },
      'FR': { general: '112', police: '17', fire: '18', medical: '15' },
      'ES': { general: '112', police: '091', fire: '080', medical: '061' },
      'IT': { general: '112', police: '113', fire: '115', medical: '118' },
      'NL': { general: '112', police: '112', fire: '112', medical: '112' },
      'DK': { general: '112', police: '114', fire: '112', medical: '112' },
      'SE': { general: '112', police: '112', fire: '112', medical: '112' },
      'NO': { general: '112', police: '112', fire: '110', medical: '113' },
      'FI': { general: '112', police: '112', fire: '112', medical: '112' },
    };

    return emergencyNumbers[countryCode] || emergencyNumbers['US'];
  }
}
