
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Simplified hook for Supabase data fetching with better error handling
export const useSupabaseData = <T extends Record<string, any>>(
  table: string,
  options: {
    select?: string;
    filter?: { column: string; value: any; operator?: string };
    orderBy?: { column: string; ascending?: boolean };
    dependencies?: any[];
  } = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const {
    select = '*',
    filter,
    orderBy,
    dependencies = []
  } = options;

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase.from(table as any).select(select);
        
        // Apply user filter by default
        query = query.eq('user_id', user.id);
        
        // Apply additional filter if provided
        if (filter) {
          const { column, value, operator = 'eq' } = filter;
          switch (operator) {
            case 'eq':
              query = query.eq(column, value);
              break;
            case 'neq':
              query = query.neq(column, value);
              break;
            case 'gt':
              query = query.gt(column, value);
              break;
            case 'gte':
              query = query.gte(column, value);
              break;
            case 'lt':
              query = query.lt(column, value);
              break;
            case 'lte':
              query = query.lte(column, value);
              break;
            case 'like':
              query = query.like(column, value);
              break;
            case 'ilike':
              query = query.ilike(column, value);
              break;
            default:
              query = query.eq(column, value);
          }
        }
        
        // Apply ordering if provided
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
        }

        const { data: result, error } = await query;

        if (error) throw error;
        setData((result as unknown as T[]) || []);
      } catch (err) {
        console.error(`Error fetching ${table}:`, err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, select, user, ...dependencies]);

  const refetch = async () => {
    if (user) {
      setLoading(true);
      try {
        let query = supabase.from(table as any).select(select);
        query = query.eq('user_id', user.id);
        
        if (filter) {
          const { column, value, operator = 'eq' } = filter;
          (query as any)[operator](column, value);
        }
        
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
        }

        const { data: result, error } = await query;

        if (error) throw error;
        setData((result as unknown as T[]) || []);
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

// Specialized hooks for specific tables with proper typing
export const useProjects = () => {
  return useSupabaseData('projects', {
    orderBy: { column: 'created_at', ascending: false }
  });
};

export const useCallsheetsData = (projectId?: string) => {
  return useSupabaseData('callsheets', {
    filter: projectId ? { column: 'project_id', value: projectId } : undefined,
    orderBy: { column: 'created_at', ascending: false }
  });
};

export const useContactsData = () => {
  return useSupabaseData('contacts', {
    orderBy: { column: 'created_at', ascending: false }
  });
};
