
import React, { createContext, useContext, useState } from 'react';
import { useCallsheets } from '@/hooks/useCallsheets';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/contexts/AuthContext';

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  department?: string;
  character?: string;
}

export interface CallsheetData {
  id: string;
  projectTitle: string;
  shootDate: string;
  generalCallTime: string;
  location: string;
  locationAddress: string;
  parkingInstructions: string;
  basecampLocation: string;
  cast: Contact[];
  crew: Contact[];
  schedule: ScheduleItem[];
  emergencyContacts: Contact[];
  weather: string;
  specialNotes: string;
  createdAt: string;
  updatedAt: string;
  // New fields for database integration
  projectId?: string;
  userId?: string;
}

export interface ScheduleItem {
  id: string;
  sceneNumber: string;
  intExt: 'INT' | 'EXT';
  description: string;
  location: string;
  pageCount: string;
  estimatedTime: string;
}

interface CallsheetContextType {
  callsheets: CallsheetData[];
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  addCallsheet: (callsheet: Omit<CallsheetData, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateCallsheet: (id: string, callsheet: Partial<CallsheetData>) => Promise<void>;
  deleteCallsheet: (id: string) => Promise<void>;
  addContact: (contact: Omit<Contact, 'id'>) => Promise<any>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  duplicateCallsheet: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const CallsheetContext = createContext<CallsheetContextType | undefined>(undefined);

export const useCallsheet = () => {
  const context = useContext(CallsheetContext);
  if (!context) {
    throw new Error('useCallsheet must be used within a CallsheetProvider');
  }
  return context;
};

export const CallsheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const callsheetHook = useCallsheets();
  const contactHook = useContacts();

  const duplicateCallsheet = async (id: string) => {
    try {
      setError(null);
      const originalCallsheet = callsheetHook.callsheets.find(c => c.id === id);
      if (originalCallsheet) {
        const { id: _, createdAt: __, updatedAt: ___, ...callsheetData } = originalCallsheet;
        await callsheetHook.addCallsheet({
          ...callsheetData,
          projectTitle: `${callsheetData.projectTitle} (Copy)`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while duplicating the callsheet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refetch = async () => {
    try {
      setError(null);
      await Promise.all([
        callsheetHook.refetch(),
        contactHook.refetch()
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while refreshing data';
      setError(errorMessage);
    }
  };

  // Combine loading states
  const loading = callsheetHook.loading || contactHook.loading;
  
  // Combine error states
  const combinedError = error || callsheetHook.error || contactHook.error;

  return (
    <CallsheetContext.Provider value={{
      callsheets: callsheetHook.callsheets,
      contacts: contactHook.contacts,
      loading,
      error: combinedError,
      addCallsheet: callsheetHook.addCallsheet,
      updateCallsheet: callsheetHook.updateCallsheet,
      deleteCallsheet: callsheetHook.deleteCallsheet,
      addContact: contactHook.addContact,
      updateContact: contactHook.updateContact,
      deleteContact: contactHook.deleteContact,
      duplicateCallsheet,
      refetch,
    }}>
      {children}
    </CallsheetContext.Provider>
  );
};
