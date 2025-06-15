
import { Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmergencyNumbersProps {
  emergencyNumbers: {
    general: string;
    police: string;
    fire: string;
    medical: string;
  };
}

export const EmergencyNumbers = ({ emergencyNumbers }: EmergencyNumbersProps) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center text-red-800">
          <Phone className="w-4 h-4 mr-2" />
          Emergency Phone Numbers
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="font-medium text-red-700 text-sm">General</div>
            <div className="text-lg font-bold text-red-800">{emergencyNumbers.general}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-red-700 text-sm">Police</div>
            <div className="text-lg font-bold text-red-800">{emergencyNumbers.police}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-red-700 text-sm">Fire</div>
            <div className="text-lg font-bold text-red-800">{emergencyNumbers.fire}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-red-700 text-sm">Medical</div>
            <div className="text-lg font-bold text-red-800">{emergencyNumbers.medical}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
