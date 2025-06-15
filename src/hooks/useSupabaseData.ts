
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Simple hook for basic Supabase data fetching
export const useSupabaseData = (
  table: string,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: result, error } = await (supabase as any)
          .from(table)
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setData(result || []);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${table}:`, err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, user, ...dependencies]);

  const refetch = async () => {
    if (user) {
      setLoading(true);
      try {
        const { data: result, error } = await (supabase as any)
          .from(table)
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setData(result || []);
        setError(null);
      } catch (err) {
        console.error(`Error refetching ${table}:`, err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  return { data, loading, error, refetch };
};

// TODO: Add hooks for:
// - useProjects()
// - useCallsheets(projectId?)
// - useContacts()
// - Real-time subscriptions with useEffect cleanup
