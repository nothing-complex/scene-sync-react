
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CallsheetData, Contact, ScheduleItem } from '@/contexts/CallsheetContext';

export const useCallsheets = () => {
  const [callsheets, setCallsheets] = useState<CallsheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const channelRef = useRef<any>(null);

  const fetchCallsheets = async () => {
    if (!user) {
      setCallsheets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('callsheets')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedCallsheets: CallsheetData[] = (data || []).map(row => ({
        id: row.id,
        projectTitle: row.project_title,
        shootDate: row.shoot_date,
        generalCallTime: row.general_call_time,
        location: row.location,
        locationAddress: row.location_address,
        parkingInstructions: row.parking_instructions || '',
        basecampLocation: row.basecamp_location || '',
        cast: Array.isArray(row.cast_members) ? (row.cast_members as unknown as Contact[]) : [],
        crew: Array.isArray(row.crew_members) ? (row.crew_members as unknown as Contact[]) : [],
        schedule: Array.isArray(row.schedule) ? (row.schedule as unknown as ScheduleItem[]) : [],
        emergencyContacts: Array.isArray(row.emergency_contacts) ? (row.emergency_contacts as unknown as Contact[]) : [],
        weather: row.weather || '',
        specialNotes: row.special_notes || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        projectId: row.project_id,
        userId: row.user_id,
      }));

      setCallsheets(mappedCallsheets);
    } catch (err) {
      console.error('Error fetching callsheets:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching callsheets');
    } finally {
      setLoading(false);
    }
  };

  const addCallsheet = async (callsheetData: Omit<CallsheetData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      
      const insertData = {
        project_title: callsheetData.projectTitle,
        shoot_date: callsheetData.shootDate,
        general_call_time: callsheetData.generalCallTime,
        location: callsheetData.location,
        location_address: callsheetData.locationAddress,
        parking_instructions: callsheetData.parkingInstructions,
        basecamp_location: callsheetData.basecampLocation,
        cast_members: callsheetData.cast as any,
        crew_members: callsheetData.crew as any,
        schedule: callsheetData.schedule as any,
        emergency_contacts: callsheetData.emergencyContacts as any,
        weather: callsheetData.weather,
        special_notes: callsheetData.specialNotes,
        project_id: callsheetData.projectId,
        user_id: user.id,
      };

      const { data, error: insertError } = await supabase
        .from('callsheets')
        .insert(insertData)
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchCallsheets(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error adding callsheet:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while adding the callsheet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateCallsheet = async (id: string, updates: Partial<CallsheetData>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      
      const updateData: any = {};
      if (updates.projectTitle) updateData.project_title = updates.projectTitle;
      if (updates.shootDate) updateData.shoot_date = updates.shootDate;
      if (updates.generalCallTime) updateData.general_call_time = updates.generalCallTime;
      if (updates.location) updateData.location = updates.location;
      if (updates.locationAddress) updateData.location_address = updates.locationAddress;
      if (updates.parkingInstructions !== undefined) updateData.parking_instructions = updates.parkingInstructions;
      if (updates.basecampLocation !== undefined) updateData.basecamp_location = updates.basecampLocation;
      if (updates.cast) updateData.cast_members = updates.cast;
      if (updates.crew) updateData.crew_members = updates.crew;
      if (updates.schedule) updateData.schedule = updates.schedule;
      if (updates.emergencyContacts) updateData.emergency_contacts = updates.emergencyContacts;
      if (updates.weather !== undefined) updateData.weather = updates.weather;
      if (updates.specialNotes !== undefined) updateData.special_notes = updates.specialNotes;

      const { error: updateError } = await supabase
        .from('callsheets')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchCallsheets(); // Refresh the list
    } catch (err) {
      console.error('Error updating callsheet:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating the callsheet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteCallsheet = async (id: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('callsheets')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchCallsheets(); // Refresh the list
    } catch (err) {
      console.error('Error deleting callsheet:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the callsheet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    // Clean up any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Only proceed if user is available
    if (!user?.id) {
      setCallsheets([]);
      setLoading(false);
      return;
    }

    // Fetch initial data
    fetchCallsheets();

    // Set up real-time subscription with a unique channel name
    const channelName = `callsheets_user_${user.id}_${Date.now()}`;
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'callsheets'
        },
        () => {
          fetchCallsheets();
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

  return {
    callsheets,
    loading,
    error,
    addCallsheet,
    updateCallsheet,
    deleteCallsheet,
    refetch: fetchCallsheets,
  };
};
