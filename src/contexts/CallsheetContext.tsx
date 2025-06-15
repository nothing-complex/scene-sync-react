import React, { createContext, useContext } from 'react';
import { CallsheetData } from '@/types/callsheet';
import { useCallsheets } from '@/hooks/useCallsheets';

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
    }}>
      {children}
    </CallsheetContext.Provider>
  );
};
