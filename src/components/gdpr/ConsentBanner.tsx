
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useGDPRConsent } from '@/hooks/useGDPRConsent';
import { useAuth } from '@/contexts/AuthContext';
import { X, Shield, Eye, Mail } from 'lucide-react';

export const ConsentBanner = () => {
  const { user } = useAuth();
  const { consents, updateConsent, loading } = useGDPRConsent();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [tempConsents, setTempConsents] = useState(consents);

  useEffect(() => {
    // Show banner for new users or users who haven't set data processing consent
    if (user && !loading && !consents.data_processing) {
      setShowBanner(true);
    }
  }, [user, loading, consents.data_processing]);

  useEffect(() => {
    setTempConsents(consents);
  }, [consents]);

  const handleSaveConsents = async () => {
    try {
      await Promise.all([
        updateConsent('analytics', tempConsents.analytics),
        updateConsent('marketing', tempConsents.marketing),
        updateConsent('data_processing', tempConsents.data_processing),
      ]);
      setShowBanner(false);
    } catch (error) {
      console.error('Error saving consents:', error);
    }
  };

  const handleAcceptAll = async () => {
    try {
      await Promise.all([
        updateConsent('analytics', true),
        updateConsent('marketing', true),
        updateConsent('data_processing', true),
      ]);
      setShowBanner(false);
    } catch (error) {
      console.error('Error accepting all consents:', error);
    }
  };

  const handleRejectNonEssential = async () => {
    try {
      await Promise.all([
        updateConsent('analytics', false),
        updateConsent('marketing', false),
        updateConsent('data_processing', true), // Still need basic data processing for app to work
      ]);
      setShowBanner(false);
    } catch (error) {
      console.error('Error rejecting consents:', error);
    }
  };

  if (!showBanner || !user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Privacy & Cookie Preferences</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBanner(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            We use cookies and process personal data to improve your experience. 
            You can customize your preferences or accept all cookies.
          </p>

          {showDetails && (
            <div className="space-y-4 mb-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="data_processing"
                  checked={tempConsents.data_processing}
                  onCheckedChange={(checked) =>
                    setTempConsents(prev => ({ ...prev, data_processing: !!checked }))
                  }
                />
                <Label htmlFor="data_processing" className="text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Data Processing (Required)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Process your callsheet and contact data to provide core functionality
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analytics"
                  checked={tempConsents.analytics}
                  onCheckedChange={(checked) =>
                    setTempConsents(prev => ({ ...prev, analytics: !!checked }))
                  }
                />
                <Label htmlFor="analytics" className="text-sm">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Analytics</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Help us improve by analyzing how you use the application
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing"
                  checked={tempConsents.marketing}
                  onCheckedChange={(checked) =>
                    setTempConsents(prev => ({ ...prev, marketing: !!checked }))
                  }
                />
                <Label htmlFor="marketing" className="text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Marketing Communications</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive updates about new features and industry insights
                  </p>
                </Label>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Customize'}
            </Button>
            {showDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveConsents}
              >
                Save Preferences
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectNonEssential}
            >
              Reject Non-Essential
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
