
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDataProcessingLog = () => {
  const { user } = useAuth();

  const logActivity = async (
    action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'share',
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await supabase.rpc('log_data_processing', {
        p_user_id: user.id,
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_details: details ? JSON.stringify(details) : null,
      });
    } catch (error) {
      console.error('Error logging data processing activity:', error);
    }
  };

  const getProcessingLog = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('data_processing_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching processing log:', error);
      return [];
    }
  };

  return {
    logActivity,
    getProcessingLog,
  };
};
