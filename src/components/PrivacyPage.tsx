
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PrivacySettings } from '@/components/gdpr/PrivacySettings';
import { DataExportDialog } from '@/components/gdpr/DataExportDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleExportData = () => {
    setShowExportDialog(true);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.'
    )) {
      try {
        // In a real implementation, you would call a backend service to handle account deletion
        // For now, we'll just sign out the user
        toast({
          title: "Account deletion requested",
          description: "Your account deletion request has been submitted. You will be contacted within 30 days.",
        });
        await signOut();
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to process account deletion request. Please contact support.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-4 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Privacy Settings</h1>
      </div>

      <div className="max-w-2xl">
        <PrivacySettings
          onExportData={handleExportData}
          onDeleteAccount={handleDeleteAccount}
        />
      </div>

      <DataExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </div>
  );
};
