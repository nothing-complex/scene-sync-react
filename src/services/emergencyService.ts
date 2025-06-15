
export interface EmergencyService {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire_station' | 'pharmacy';
  address: string;
  phone?: string;
  distance: number; // in miles or km
  coordinates: { lat: number; lon: number };
}

interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    'addr:full'?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    phone?: string;
    emergency?: string;
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

export class EmergencyService {
  private static readonly OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static formatAddress(element: OverpassElement): string {
    const tags = element.tags;
    if (tags['addr:full']) return tags['addr:full'];
    
    let address = '';
    if (tags['addr:housenumber']) address += tags['addr:housenumber'] + ' ';
    if (tags['addr:street']) address += tags['addr:street'];
    if (tags['addr:city']) address += (address ? ', ' : '') + tags['addr:city'];
    
    return address || 'Address not available';
  }

  private static mapAmenityToType(amenity: string, emergency?: string): EmergencyService['type'] | null {
    if (emergency === 'fire_station' || amenity === 'fire_station') return 'fire_station';
    if (amenity === 'hospital') return 'hospital';
    if (amenity === 'police') return 'police';
    if (amenity === 'pharmacy') return 'pharmacy';
    // Exclude clinics and doctors - return null to filter them out
    if (amenity === 'clinic' || amenity === 'doctors') return null;
    return null; // Default to null instead of hospital
  }

  static getEmergencyNumbers(countryCode: string): EmergencyNumbers {
    const emergencyNumbers: { [key: string]: EmergencyNumbers } = {
      'AU': { general: '000', police: '000', fire: '000', medical: '000' },
      'GB': { general: '999', police: '999', fire: '999', medical: '999' },
      'US': { general: '911', police: '911', fire: '911', medical: '911' },
      'CA': { general: '911', police: '911', fire: '911', medical: '911' },
      'DE': { general: '112', police: '110', fire: '112', medical: '112' },
      'FR': { general: '112', police: '17', fire: '18', medical: '15' },
      'ES': { general: '112', police: '091', fire: '080', medical: '061' },
      'IT': { general: '112', police: '113', fire: '115', medical: '118' },
      'NL': { general: '112', police: '112', fire: '112', medical: '112' },
      'DK': { general: '112', police: '114', fire: '112', medical: '112' },
      'SE': { general: '112', police: '114', fire: '112', medical: '112' },
      'NO': { general: '112', police: '112', fire: '110', medical: '113' },
      'FI': { general: '112', police: '112', fire: '112', medical: '112' },
    };

    return emergencyNumbers[countryCode.toUpperCase()] || {
      general: '112', // Default to European standard
      police: '112',
      fire: '112',
      medical: '112'
    };
  }

  static async getNearbyEmergencyServices(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10,
    units: 'imperial' | 'metric' = 'imperial'
  ): Promise<EmergencyService[]> {
    try {
      const radiusMeters = radiusKm * 1000;
      const hospitalRadiusMeters = 10000; // 10km for hospitals
      
      // Updated Overpass QL query with separate queries for hospitals (10km) and others (default radius)
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"^(police|fire_station|pharmacy)$"](around:${radiusMeters},${latitude},${longitude});
          node["emergency"~"^(fire_station|ambulance_station)$"](around:${radiusMeters},${latitude},${longitude});
          node["amenity"="hospital"](around:${hospitalRadiusMeters},${latitude},${longitude});
        );
        out center meta;
      `;

      const response = await fetch(this.OVERPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error('Emergency services search failed');
      }

      const data: OverpassResponse = await response.json();
      
      const services: EmergencyService[] = data.elements
        .filter(element => element.tags.name) // Only include services with names
        .map(element => {
          const serviceType = this.mapAmenityToType(element.tags.amenity || '', element.tags.emergency);
          if (!serviceType) return null; // Filter out unwanted types
          
          const distance = this.calculateDistance(
            latitude, 
            longitude, 
            element.lat, 
            element.lon
          );
          
          // Convert to km if metric units
          const displayDistance = units === 'metric' ? distance * 1.609 : distance;

          return {
            id: `${element.type}-${element.id}`,
            name: element.tags.name || 'Unnamed Service',
            type: serviceType,
            address: this.formatAddress(element),
            phone: element.tags.phone,
            distance: Math.round(displayDistance * 10) / 10, // Round to 1 decimal
            coordinates: { lat: element.lat, lon: element.lon }
          };
        })
        .filter((service): service is EmergencyService => service !== null) // Remove null entries
        .sort((a, b) => a.distance - b.distance) // Sort by distance
        .slice(0, 20); // Limit to 20 results

      return services;
    } catch (error) {
      console.error('Emergency services fetch error:', error);
      return [];
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

  static getServiceIcon(type: EmergencyService['type']): string {
    switch (type) {
      case 'hospital': return '🏥';
      case 'police': return '👮';
      case 'fire_station': return '🚒';
      case 'pharmacy': return '💊';
      default: return '🚨';
    }
  }
}
