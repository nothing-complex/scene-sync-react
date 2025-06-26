
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
    <Card className="border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center text-red-800 dark:text-red-200">
          <Phone className="w-4 h-4 mr-2" />
          Emergency Phone Number
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-center">
          <div className="font-medium text-red-700 dark:text-red-300 text-sm mb-1">Emergency Services</div>
          <div className="text-2xl font-bold text-red-800 dark:text-red-200">{emergencyNumbers.general}</div>
        </div>
      </CardContent>
    </Card>
  );
};
