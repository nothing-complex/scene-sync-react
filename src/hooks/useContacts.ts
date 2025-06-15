
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Contact } from '@/contexts/CallsheetContext';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchContacts = async () => {
    if (!user) {
      setContacts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedContacts: Contact[] = (data || []).map(row => ({
        id: row.id,
        name: row.name,
        role: row.role,
        phone: row.phone,
        email: row.email || '',
        department: row.department || '',
        character: row.character || '',
      }));

      setContacts(mappedContacts);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData: Omit<Contact, 'id'>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('contacts')
        .insert({
          name: contactData.name,
          role: contactData.role,
          phone: contactData.phone,
          email: contactData.email || null,
          department: contactData.department || null,
          character: contactData.character || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchContacts(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error adding contact:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while adding the contact';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.role) updateData.role = updates.role;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.email !== undefined) updateData.email = updates.email || null;
      if (updates.department !== undefined) updateData.department = updates.department || null;
      if (updates.character !== undefined) updateData.character = updates.character || null;

      const { error: updateError } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchContacts(); // Refresh the list
    } catch (err) {
      console.error('Error updating contact:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating the contact';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteContact = async (id: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      await fetchContacts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting contact:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the contact';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts,
  };
};
