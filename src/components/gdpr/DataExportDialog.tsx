
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCallsheet } from '@/contexts/CallsheetContext';
import { useDataProcessingLog } from '@/hooks/useDataProcessingLog';
import { supabase } from '@/integrations/supabase/client';

interface DataExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataExportDialog: React.FC<DataExportDialogProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { callsheets, contacts } = useCallsheet();
  const { logActivity } = useDataProcessingLog();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportUserData = async () => {
    if (!user) return;

    setIsExporting(true);
    setProgress(0);

    try {
      // Log the export activity
      await logActivity('export', 'user_data', user.id);

      // Fetch user profile
      setProgress(20);
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch user consents
      setProgress(40);
      const { data: consents } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', user.id);

      // Fetch master PDF settings
      setProgress(60);
      const { data: pdfSettings } = await supabase
        .from('master_pdf_settings')
        .select('*')
        .eq('user_id', user.id);

      setProgress(80);

      // Compile all data
      const exportData = {
        export_info: {
          exported_at: new Date().toISOString(),
          user_id: user.id,
          user_email: user.email,
        },
        profile: profile,
        callsheets: callsheets,
        contacts: contacts,
        consents: consents,
        pdf_settings: pdfSettings,
        auth_metadata: {
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
        }
      };

      setProgress(100);

      // Download the data
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `callsheet-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Export Your Data</span>
          </DialogTitle>
          <DialogDescription>
            Download a complete copy of all your personal data stored in our system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            Your export will include:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Profile information</li>
              <li>All callsheets and schedules</li>
              <li>Contact information</li>
              <li>Privacy preferences</li>
              <li>PDF customization settings</li>
            </ul>
          </div>

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Preparing your data...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={exportUserData} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
