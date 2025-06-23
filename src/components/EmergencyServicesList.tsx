
import React from 'react';
import { ExternalLink, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencyService, EmergencyServiceApi } from '@/services/emergencyService';

interface EmergencyServicesListProps {
  services: EmergencyService[];
  units: 'imperial' | 'metric';
}

export const EmergencyServicesList = ({ services, units }: EmergencyServicesListProps) => {
  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No emergency services found</h3>
          <p className="text-gray-600">Try expanding the search radius or checking the location.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center">
              <span className="text-lg mr-2">{EmergencyServiceApi.getServiceIcon(service.type)}</span>
              {service.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">
                    {EmergencyServiceApi.formatServiceType(service.type)}
                  </div>
                  <div className="flex items-center text-sm text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    <a
                      href={EmergencyServiceApi.getGoogleMapsUrl(service)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                    >
                      {service.address}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                  {service.phone && (
                    <div className="flex items-center text-sm text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-1 text-gray-400" />
                      <a
                        href={`tel:${service.phone}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {service.phone}
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="font-medium">
                    {service.distance} {units === 'imperial' ? 'mi' : 'km'}
                  </div>
                  <div className="text-xs text-gray-500">away</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
