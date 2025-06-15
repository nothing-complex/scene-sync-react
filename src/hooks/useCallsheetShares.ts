
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

// Use the database type directly to ensure compatibility
export type CallsheetShare = Tables<'callsheet_shares'>;

export const useCallsheetShares = () => {
  const [shares, setShares] = useState<CallsheetShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const channelRef = useRef<any>(null);

  const fetchShares = async () => {
    if (!user) {
      setShares([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('callsheet_shares')
        .select('*')
        .or(`shared_by.eq.${user.id},shared_with_user.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setShares(data || []);
    } catch (err) {
      console.error('Error fetching shares:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching shares');
    } finally {
      setLoading(false);
    }
  };

  const shareCallsheet = async (callsheetId: string, email: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      
      const { data, error: shareError } = await supabase
        .from('callsheet_shares')
        .insert({
          callsheet_id: callsheetId,
          shared_by: user.id,
          shared_with_email: email.toLowerCase(),
          can_edit: true
        })
        .select()
        .single();

      if (shareError) throw shareError;

      await fetchShares(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error sharing callsheet:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while sharing the callsheet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const respondToShare = async (shareId: string, status: 'accepted' | 'declined') => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      
      const updateData: any = { status };
      if (status === 'accepted') {
        updateData.accepted_at = new Date().toISOString();
        updateData.shared_with_user = user.id;
      }

      const { error: updateError } = await supabase
        .from('callsheet_shares')
        .update(updateData)
        .eq('id', shareId);

      if (updateError) throw updateError;

      await fetchShares(); // Refresh the list
    } catch (err) {
      console.error('Error responding to share:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while responding to the share';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getPendingShares = () => {
    return shares.filter(share => 
      share.status === 'pending' && 
      share.shared_with_email === user?.email
    );
  };

  const getAcceptedShares = () => {
    return shares.filter(share => share.status === 'accepted');
  };

  useEffect(() => {
    fetchShares();

    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Set up real-time subscription for shares - fix the subscription issue
    if (user?.id) {
      channelRef.current = supabase
        .channel(`callsheet_shares_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'callsheet_shares'
          },
          () => {
            fetchShares();
          }
        )
        .subscribe();
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]); // Add user.id as dependency to avoid subscription conflicts

  return {
    shares,
    loading,
    error,
    shareCallsheet,
    respondToShare,
    getPendingShares,
    getAcceptedShares,
    refetch: fetchShares,
  };
};
