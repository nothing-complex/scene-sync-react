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
    units: 'imperial' | 'metric' = 'metric'
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
      'AT': { general: '112', police: '133', fire: '122', medical: '144' },
      'CH': { general: '112', police: '117', fire: '118', medical: '144' },
      'BE': { general: '112', police: '101', fire: '100', medical: '100' },
      'LU': { general: '112', police: '113', fire: '112', medical: '112' },
      'IE': { general: '112', police: '999', fire: '999', medical: '999' },
      'PT': { general: '112', police: '112', fire: '112', medical: '112' },
      'GR': { general: '112', police: '100', fire: '199', medical: '166' },
      'CZ': { general: '112', police: '158', fire: '150', medical: '155' },
      'SK': { general: '112', police: '158', fire: '150', medical: '155' },
      'PL': { general: '112', police: '997', fire: '998', medical: '999' },
      'HU': { general: '112', police: '107', fire: '105', medical: '104' },
      'SI': { general: '112', police: '113', fire: '112', medical: '112' },
      'HR': { general: '112', police: '192', fire: '193', medical: '194' },
      'EE': { general: '112', police: '110', fire: '112', medical: '112' },
      'LV': { general: '112', police: '110', fire: '112', medical: '113' },
      'LT': { general: '112', police: '102', fire: '101', medical: '103' },
      'RO': { general: '112', police: '112', fire: '112', medical: '112' },
      'BG': { general: '112', police: '166', fire: '160', medical: '150' },
      'MT': { general: '112', police: '112', fire: '112', medical: '112' },
      'CY': { general: '112', police: '199', fire: '199', medical: '199' },
      'IS': { general: '112', police: '112', fire: '112', medical: '112' },
      'LI': { general: '112', police: '117', fire: '118', medical: '144' },
      'MC': { general: '112', police: '17', fire: '18', medical: '15' },
      'SM': { general: '112', police: '113', fire: '115', medical: '118' },
      'VA': { general: '112', police: '113', fire: '115', medical: '118' },
      'AD': { general: '112', police: '110', fire: '118', medical: '116' },
      'JP': { general: '110', police: '110', fire: '119', medical: '119' },
      'KR': { general: '112', police: '112', fire: '119', medical: '119' },
      'CN': { general: '110', police: '110', fire: '119', medical: '120' },
      'IN': { general: '112', police: '100', fire: '101', medical: '102' },
      'BR': { general: '190', police: '190', fire: '193', medical: '192' },
      'MX': { general: '911', police: '911', fire: '911', medical: '911' },
      'AR': { general: '911', police: '911', fire: '911', medical: '911' },
      'CL': { general: '133', police: '133', fire: '132', medical: '131' },
      'CO': { general: '123', police: '123', fire: '119', medical: '125' },
      'PE': { general: '105', police: '105', fire: '116', medical: '117' },
      'UY': { general: '911', police: '911', fire: '911', medical: '911' },
      'PY': { general: '911', police: '911', fire: '911', medical: '911' },
      'BO': { general: '110', police: '110', fire: '119', medical: '118' },
      'EC': { general: '911', police: '911', fire: '911', medical: '911' },
      'VE': { general: '171', police: '171', fire: '171', medical: '171' },
      'GY': { general: '911', police: '911', fire: '911', medical: '911' },
      'SR': { general: '115', police: '115', fire: '110', medical: '113' },
      'GF': { general: '15', police: '17', fire: '18', medical: '15' },
      'ZA': { general: '10111', police: '10111', fire: '10177', medical: '10177' },
      'EG': { general: '122', police: '122', fire: '180', medical: '123' },
      'MA': { general: '19', police: '19', fire: '15', medical: '15' },
      'TN': { general: '197', police: '197', fire: '198', medical: '190' },
      'DZ': { general: '17', police: '17', fire: '14', medical: '14' },
      'LY': { general: '193', police: '193', fire: '193', medical: '193' },
      'SD': { general: '999', police: '999', fire: '999', medical: '999' },
      'ET': { general: '991', police: '991', fire: '939', medical: '907' },
      'KE': { general: '999', police: '999', fire: '999', medical: '999' },
      'UG': { general: '999', police: '999', fire: '999', medical: '999' },
      'TZ': { general: '112', police: '112', fire: '115', medical: '114' },
      'RW': { general: '112', police: '112', fire: '112', medical: '912' },
      'BI': { general: '117', police: '117', fire: '118', medical: '114' },
      'DJ': { general: '17', police: '17', fire: '18', medical: '19' },
      'SO': { general: '888', police: '888', fire: '555', medical: '999' },
      'ER': { general: '127', police: '127', fire: '116', medical: '114' },
      'SS': { general: '999', police: '999', fire: '999', medical: '999' },
      'CF': { general: '117', police: '117', fire: '118', medical: '1220' },
      'TD': { general: '17', police: '17', fire: '18', medical: '2251' },
      'CM': { general: '117', police: '117', fire: '118', medical: '119' },
      'GQ': { general: '114', police: '114', fire: '115', medical: '116' },
      'GA': { general: '1730', police: '1730', fire: '18', medical: '1300' },
      'CG': { general: '117', police: '117', fire: '118', medical: '1411' },
      'CD': { general: '112', police: '112', fire: '118', medical: '114' },
      'AO': { general: '113', police: '113', fire: '115', medical: '112' },
      'ZM': { general: '999', police: '999', fire: '993', medical: '992' },
      'ZW': { general: '999', police: '999', fire: '993', medical: '994' },
      'BW': { general: '999', police: '999', fire: '998', medical: '997' },
      'NA': { general: '10111', police: '10111', fire: '2032276', medical: '2032276' },
      'SZ': { general: '999', police: '999', fire: '933', medical: '977' },
      'LS': { general: '123', police: '123', fire: '122', medical: '121' },
      'MZ': { general: '119', police: '119', fire: '198', medical: '117' },
      'MW': { general: '997', police: '997', fire: '998', medical: '998' },
      'MG': { general: '117', police: '117', fire: '118', medical: '124' },
      'MU': { general: '999', police: '999', fire: '995', medical: '114' },
      'SC': { general: '999', police: '999', fire: '999', medical: '151' },
      'KM': { general: '17', police: '17', fire: '18', medical: '772' },
      'YT': { general: '15', police: '17', fire: '18', medical: '15' },
      'RE': { general: '15', police: '17', fire: '18', medical: '15' },
      'SH': { general: '999', police: '999', fire: '999', medical: '999' },
      'NG': { general: '199', police: '199', fire: '199', medical: '199' },
      'GH': { general: '999', police: '999', fire: '192', medical: '193' },
      'CI': { general: '170', police: '170', fire: '180', medical: '185' },
      'BF': { general: '17', police: '17', fire: '18', medical: '3131' },
      'ML': { general: '17', police: '17', fire: '18', medical: '15' },
      'NE': { general: '17', police: '17', fire: '18', medical: '15' },
      'SN': { general: '17', police: '17', fire: '18', medical: '15' },
      'GM': { general: '117', police: '117', fire: '118', medical: '116' },
      'GW': { general: '117', police: '117', fire: '118', medical: '119' },
      'CV': { general: '132', police: '132', fire: '131', medical: '130' },
      'SL': { general: '999', police: '999', fire: '019', medical: '999' },
      'LR': { general: '911', police: '911', fire: '911', medical: '911' },
      'GN': { general: '442020', police: '442020', fire: '442020', medical: '442020' },
      'TG': { general: '117', police: '117', fire: '118', medical: '8200' },
      'BJ': { general: '117', police: '117', fire: '118', medical: '01' },
      'IL': { general: '112', police: '100', fire: '102', medical: '101' },
      'PS': { general: '100', police: '100', fire: '102', medical: '101' },
      'JO': { general: '911', police: '911', fire: '911', medical: '911' },
      'LB': { general: '112', police: '112', fire: '175', medical: '140' },
      'SY': { general: '112', police: '112', fire: '113', medical: '110' },
      'IQ': { general: '104', police: '104', fire: '115', medical: '122' },
      'IR': { general: '110', police: '110', fire: '125', medical: '115' },
      'AF': { general: '119', police: '119', fire: '119', medical: '102' },
      'PK': { general: '15', police: '15', fire: '16', medical: '1122' },
      'BD': { general: '999', police: '999', fire: '9555555', medical: '199' },
      'LK': { general: '119', police: '119', fire: '110', medical: '110' },
      'MV': { general: '102', police: '119', fire: '118', medical: '102' },
      'NP': { general: '100', police: '100', fire: '101', medical: '102' },
      'BT': { general: '113', police: '113', fire: '110', medical: '112' },
      'MM': { general: '199', police: '199', fire: '191', medical: '192' },
      'TH': { general: '191', police: '191', fire: '199', medical: '1669' },
      'LA': { general: '190', police: '191', fire: '190', medical: '195' },
      'KH': { general: '117', police: '117', fire: '118', medical: '119' },
      'VN': { general: '113', police: '113', fire: '114', medical: '115' },
      'MY': { general: '999', police: '999', fire: '994', medical: '999' },
      'SG': { general: '999', police: '999', fire: '995', medical: '995' },
      'BN': { general: '993', police: '993', fire: '995', medical: '991' },
      'ID': { general: '112', police: '110', fire: '113', medical: '118' },
      'TL': { general: '112', police: '112', fire: '112', medical: '112' },
      'PH': { general: '117', police: '117', fire: '116', medical: '911' },
      'TW': { general: '110', police: '110', fire: '119', medical: '119' },
      'HK': { general: '999', police: '999', fire: '999', medical: '999' },
      'MO': { general: '999', police: '999', fire: '999', medical: '999' },
      'MN': { general: '102', police: '102', fire: '101', medical: '103' },
      'KZ': { general: '112', police: '102', fire: '101', medical: '103' },
      'KG': { general: '112', police: '102', fire: '101', medical: '103' },
      'TJ': { general: '112', police: '102', fire: '101', medical: '103' },
      'UZ': { general: '112', police: '102', fire: '101', medical: '103' },
      'TM': { general: '112', police: '102', fire: '101', medical: '103' },
      'GE': { general: '112', police: '122', fire: '111', medical: '113' },
      'AM': { general: '112', police: '102', fire: '101', medical: '103' },
      'AZ': { general: '112', police: '102', fire: '101', medical: '103' },
      'TR': { general: '112', police: '155', fire: '110', medical: '112' },
      'CY': { general: '112', police: '199', fire: '199', medical: '199' },
      'RU': { general: '112', police: '102', fire: '101', medical: '103' },
      'BY': { general: '112', police: '102', fire: '101', medical: '103' },
      'UA': { general: '112', police: '102', fire: '101', medical: '103' },
      'MD': { general: '112', police: '902', fire: '901', medical: '903' },
      'NZ': { general: '111', police: '111', fire: '111', medical: '111' },
      'FJ': { general: '911', police: '911', fire: '911', medical: '911' },
      'PG': { general: '000', police: '000', fire: '110', medical: '111' },
      'SB': { general: '999', police: '999', fire: '988', medical: '977' },
      'VU': { general: '112', police: '112', fire: '112', medical: '112' },
      'NC': { general: '15', police: '17', fire: '18', medical: '15' },
      'PF': { general: '15', police: '17', fire: '18', medical: '15' },
      'WF': { general: '15', police: '17', fire: '18', medical: '15' },
      'CK': { general: '999', police: '999', fire: '996', medical: '998' },
      'NU': { general: '999', police: '999', fire: '999', medical: '999' },
      'TK': { general: '999', police: '999', fire: '999', medical: '999' },
      'TV': { general: '911', police: '911', fire: '911', medical: '911' },
      'KI': { general: '999', police: '999', fire: '999', medical: '994' },
      'NR': { general: '110', police: '110', fire: '119', medical: '118' },
      'MH': { general: '911', police: '911', fire: '911', medical: '911' },
      'FM': { general: '911', police: '911', fire: '911', medical: '911' },
      'PW': { general: '911', police: '911', fire: '911', medical: '911' },
      'GU': { general: '911', police: '911', fire: '911', medical: '911' },
      'MP': { general: '911', police: '911', fire: '911', medical: '911' },
      'AS': { general: '911', police: '911', fire: '911', medical: '911' },
      'WS': { general: '999', police: '999', fire: '994', medical: '996' },
      'TO': { general: '911', police: '911', fire: '911', medical: '911' },
    };

    return emergencyNumbers[countryCode] || emergencyNumbers['US'];
  }
}