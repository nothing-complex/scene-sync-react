
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CallsheetData, Contact, ScheduleItem } from '@/types/callsheet';

export const useCallsheets = () => {
  const [callsheets, setCallsheets] = useState<CallsheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  const fetchCallsheets = async () => {
    if (!user) {
      console.log('No user found, setting empty callsheets');
      setCallsheets([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching callsheets for user:', user.id);
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('callsheets')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Callsheets fetch result:', { data, error: fetchError });

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw fetchError;
      }

      const mappedCallsheets: CallsheetData[] = (data || []).map(row => {
        console.log('Mapping callsheet row:', row);
        return {
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
        };
      });

      console.log('Mapped callsheets:', mappedCallsheets);
      setCallsheets(mappedCallsheets);
    } catch (err) {
      console.error('Error in fetchCallsheets:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching callsheets';
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addCallsheet = async (callsheetData: Omit<CallsheetData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      console.log('Adding callsheet:', callsheetData);
      
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

      console.log('Insert data:', insertData);

      const { data, error: insertError } = await supabase
        .from('callsheets')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Successfully added callsheet:', data);
      await fetchCallsheets(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error adding callsheet:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while adding the callsheet';
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateCallsheet = async (id: string, updates: Partial<CallsheetData>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      console.log('Updating callsheet:', id, updates);
      
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

      console.log('Update data:', updateData);

      const { error: updateError } = await supabase
        .from('callsheets')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Successfully updated callsheet');
      await fetchCallsheets(); // Refresh the list
    } catch (err) {
      console.error('Error updating callsheet:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating the callsheet';
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteCallsheet = async (id: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      console.log('Deleting callsheet:', id);
      
      const { error: deleteError } = await supabase
        .from('callsheets')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      console.log('Successfully deleted callsheet');
      await fetchCallsheets(); // Refresh the list
    } catch (err) {
      console.error('Error deleting callsheet:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the callsheet';
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const duplicateCallsheet = async (id: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      console.log('Duplicating callsheet:', id);
      
      // First fetch the original callsheet
      const { data: original, error: fetchError } = await supabase
        .from('callsheets')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching original callsheet:', fetchError);
        throw fetchError;
      }

      // Create a copy with modified title
      const duplicateData = {
        project_title: `${original.project_title} (Copy)`,
        shoot_date: original.shoot_date,
        general_call_time: original.general_call_time,
        location: original.location,
        location_address: original.location_address,
        parking_instructions: original.parking_instructions,
        basecamp_location: original.basecamp_location,
        cast_members: original.cast_members,
        crew_members: original.crew_members,
        schedule: original.schedule,
        emergency_contacts: original.emergency_contacts,
        weather: original.weather,
        special_notes: original.special_notes,
        project_id: original.project_id,
        user_id: user.id,
      };

      console.log('Duplicate data:', duplicateData);

      const { data, error: insertError } = await supabase
        .from('callsheets')
        .insert(duplicateData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting duplicate:', insertError);
        throw insertError;
      }

      console.log('Successfully duplicated callsheet:', data);
      await fetchCallsheets(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error duplicating callsheet:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while duplicating the callsheet';
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    console.log('useCallsheets effect triggered, user:', user?.id);
    
    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Only proceed if user is available
    if (!user?.id) {
      console.log('No user ID, setting empty state');
      setCallsheets([]);
      setLoading(false);
      return;
    }

    // Fetch initial data
    fetchCallsheets();

    // Set up real-time subscription with proper cleanup prevention
    if (!isSubscribedRef.current) {
      const channelName = `callsheets_user_${user.id}_${Date.now()}`;
      console.log('Setting up real-time channel:', channelName);
      
      channelRef.current = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'callsheets'
          },
          (payload) => {
            console.log('Real-time callsheet change:', payload);
            fetchCallsheets();
          }
        )
        .subscribe();
      
      isSubscribedRef.current = true;
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up channel on unmount');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
    };
  }, [user?.id]);

  return {
    callsheets,
    loading,
    error,
    addCallsheet,
    updateCallsheet,
    deleteCallsheet,
    duplicateCallsheet,
    refetch: fetchCallsheets,
  };
};
