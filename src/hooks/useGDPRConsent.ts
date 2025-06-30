
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ConsentData {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  data_processing: boolean;
}

export const useGDPRConsent = () => {
  const { user } = useAuth();
  const [consents, setConsents] = useState<ConsentData>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    data_processing: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConsents();
    }
  }, [user]);

  const fetchConsents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_consents')
        .select('consent_type, granted')
        .eq('user_id', user?.id);

      if (error) throw error;

      const consentMap: ConsentData = {
        essential: true,
        analytics: false,
        marketing: false,
        data_processing: false,
      };

      data?.forEach((consent) => {
        if (consent.consent_type in consentMap) {
          consentMap[consent.consent_type as keyof ConsentData] = consent.granted;
        }
      });

      setConsents(consentMap);
    } catch (error) {
      console.error('Error fetching consents:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = async (consentType: keyof ConsentData, granted: boolean) => {
    if (!user || consentType === 'essential') return;

    try {
      const { error } = await supabase.rpc('update_user_consent', {
        p_user_id: user.id,
        p_consent_type: consentType,
        p_granted: granted,
      });

      if (error) throw error;

      setConsents(prev => ({ ...prev, [consentType]: granted }));
    } catch (error) {
      console.error('Error updating consent:', error);
      throw error;
    }
  };

  return {
    consents,
    loading,
    updateConsent,
    refetch: fetchConsents,
  };
};
