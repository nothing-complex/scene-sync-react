
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface ContactConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (consentObtained: boolean) => void;
  contactName: string;
}

export const ContactConsentDialog: React.FC<ContactConsentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  contactName
}) => {
  const [consentObtained, setConsentObtained] = useState(false);

  const handleConfirm = () => {
    onConfirm(consentObtained);
    setConsentObtained(false);
    onClose();
  };

  const handleClose = () => {
    setConsentObtained(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Contact Data Privacy</span>
          </DialogTitle>
          <DialogDescription>
            You're adding contact information for "{contactName}". Please confirm their consent status.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>GDPR Compliance:</strong> Before adding someone's personal data, 
              ensure you have their explicit consent to store and process their information 
              for production purposes.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent-obtained"
              checked={consentObtained}
              onCheckedChange={(checked) => setConsentObtained(!!checked)}
            />
            <Label htmlFor="consent-obtained" className="text-sm">
              I have obtained explicit consent from this person to store and process their personal data
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Add Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
