
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Basic hook for Supabase data fetching with authentication
export const useSupabaseData = <T>(
  table: string,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T[]>([]);
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
        const { data: result, error } = await supabase
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

  return { data, loading, error, refetch: () => {
    if (user) {
      // Trigger re-fetch by updating dependencies
    }
  }};
};

// TODO: Add hooks for:
// - useProjects() - fetch user's projects and memberships
// - useProjectMembers(projectId) - fetch members of a specific project
// - useCallsheets(projectId?) - fetch callsheets with optional project filter
// - useContacts() - fetch user's contacts
// - useRealtime(table, callback) - subscribe to real-time updates
