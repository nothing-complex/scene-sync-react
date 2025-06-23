
import { Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmergencyNumbersProps {
  emergencyNumbers: {
    general: string;
    police: string;
    fire: string;
    medical: string;
  };
  emergencyContacts?: Array<{
    id: string;
    name: string;
    role: string;
    phone: string;
    email?: string;
    address?: string;
  }>;
}

export const EmergencyNumbers = ({ emergencyNumbers, emergencyContacts = [] }: EmergencyNumbersProps) => {
  return (
    <div className="space-y-4">
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center text-red-800">
            <Phone className="w-4 h-4 mr-2" />
            Emergency Phone Number
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center">
            <div className="font-medium text-red-700 text-sm mb-1">Emergency Services</div>
            <div className="text-2xl font-bold text-red-800">{emergencyNumbers.general}</div>
          </div>
        </CardContent>
      </Card>

      {emergencyContacts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center text-red-800">
              <Phone className="w-4 h-4 mr-2" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="border-b border-red-200 last:border-b-0 pb-2 last:pb-0">
                  <div className="font-medium text-red-800">{contact.name}</div>
                  <div className="text-sm text-red-700">{contact.role}</div>
                  <div className="text-sm text-red-700">{contact.phone}</div>
                  {contact.address && (
                    <div className="flex items-center text-sm text-red-700 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {contact.address}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
