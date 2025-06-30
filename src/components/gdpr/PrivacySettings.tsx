
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGDPRConsent } from '@/hooks/useGDPRConsent';
import { Shield, Eye, Mail, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PrivacySettingsProps {
  onExportData: () => void;
  onDeleteAccount: () => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  onExportData,
  onDeleteAccount
}) => {
  const { consents, updateConsent, loading } = useGDPRConsent();
  const { toast } = useToast();

  const handleConsentChange = async (consentType: keyof typeof consents, value: boolean) => {
    if (consentType === 'essential') return;
    
    try {
      await updateConsent(consentType, value);
      toast({
        title: "Preference updated",
        description: `${consentType} consent has been ${value ? 'granted' : 'withdrawn'}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating preference",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <Label className="font-medium">Essential Data Processing</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Required for basic functionality - cannot be disabled
                </p>
              </div>
              <Switch
                checked={true}
                disabled={true}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <Label className="font-medium">Data Processing</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Process your callsheet and contact data
                </p>
              </div>
              <Switch
                checked={consents.data_processing}
                onCheckedChange={(checked) => handleConsentChange('data_processing', checked)}
                disabled={loading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <Label className="font-medium">Analytics</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Help us improve by analyzing app usage
                </p>
              </div>
              <Switch
                checked={consents.analytics}
                onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
                disabled={loading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <Label className="font-medium">Marketing Communications</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive product updates and industry insights
                </p>
              </div>
              <Switch
                checked={consents.marketing}
                onCheckedChange={(checked) => handleConsentChange('marketing', checked)}
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Export Your Data</h4>
            <p className="text-sm text-muted-foreground">
              Download a copy of all your personal data in JSON format.
            </p>
            <Button
              variant="outline"
              onClick={onExportData}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-destructive">Delete Account</h4>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={onDeleteAccount}
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
