
import React, { createContext, useContext } from 'react';
import { CallsheetData, Contact, ScheduleItem } from '@/types/callsheet';
import { useCallsheets } from '@/hooks/useCallsheets';
import { useContacts } from '@/hooks/useContacts';

interface CallsheetContextType {
  callsheets: CallsheetData[];
  loading: boolean;
  error: string | null;
  addCallsheet: (callsheet: Omit<CallsheetData, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateCallsheet: (id: string, updates: Partial<CallsheetData>) => Promise<void>;
  deleteCallsheet: (id: string) => Promise<void>;
  duplicateCallsheet: (id: string) => Promise<any>;
  getCallsheet: (id: string) => CallsheetData | undefined;
  refetch: () => Promise<void>;
  // Contact management methods
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => Promise<any>; // Changed return type to match actual implementation
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
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
  const { 
    callsheets, 
    loading, 
    error, 
    addCallsheet, 
    updateCallsheet, 
    deleteCallsheet,
    duplicateCallsheet,
    refetch 
  } = useCallsheets();

  const {
    contacts,
    addContact,
    updateContact,
    deleteContact
  } = useContacts();

  const getCallsheet = (id: string): CallsheetData | undefined => {
    return callsheets.find(callsheet => callsheet.id === id);
  };

  return (
    <CallsheetContext.Provider value={{
      callsheets,
      loading,
      error,
      addCallsheet,
      updateCallsheet,
      deleteCallsheet,
      duplicateCallsheet,
      getCallsheet,
      refetch,
      contacts,
      addContact,
      updateContact,
      deleteContact,
    }}>
      {children}
    </CallsheetContext.Provider>
  );
};

// Export the types so they can be imported from this module
export type { CallsheetData, Contact, ScheduleItem };
