
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  addCallsheet: (callsheet: Omit<CallsheetData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCallsheet: (id: string, callsheet: Partial<CallsheetData>) => void;
  deleteCallsheet: (id: string) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  duplicateCallsheet: (id: string) => void;
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
  const [callsheets, setCallsheets] = useState<CallsheetData[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCallsheets = localStorage.getItem('callsheets');
    const savedContacts = localStorage.getItem('contacts');
    
    if (savedCallsheets) {
      setCallsheets(JSON.parse(savedCallsheets));
    }
    
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Add some default contacts
      const defaultContacts = [
        {
          id: '1',
          name: 'John Director',
          role: 'Director',
          phone: '(555) 123-4567',
          email: 'john@production.com',
          department: 'Direction'
        },
        {
          id: '2',
          name: 'Sarah Producer',
          role: 'Producer',
          phone: '(555) 234-5678',
          email: 'sarah@production.com',
          department: 'Production'
        }
      ];
      setContacts(defaultContacts);
      localStorage.setItem('contacts', JSON.stringify(defaultContacts));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('callsheets', JSON.stringify(callsheets));
  }, [callsheets]);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addCallsheet = (callsheetData: Omit<CallsheetData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCallsheet: CallsheetData = {
      ...callsheetData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCallsheets(prev => [newCallsheet, ...prev]);
  };

  const updateCallsheet = (id: string, updates: Partial<CallsheetData>) => {
    setCallsheets(prev => prev.map(callsheet => 
      callsheet.id === id 
        ? { ...callsheet, ...updates, updatedAt: new Date().toISOString() }
        : callsheet
    ));
  };

  const deleteCallsheet = (id: string) => {
    setCallsheets(prev => prev.filter(callsheet => callsheet.id !== id));
  };

  const duplicateCallsheet = (id: string) => {
    const originalCallsheet = callsheets.find(c => c.id === id);
    if (originalCallsheet) {
      const { id: _, createdAt: __, updatedAt: ___, ...callsheetData } = originalCallsheet;
      addCallsheet({
        ...callsheetData,
        projectTitle: `${callsheetData.projectTitle} (Copy)`,
      });
    }
  };

  const addContact = (contactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
    };
    setContacts(prev => [newContact, ...prev]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  return (
    <CallsheetContext.Provider value={{
      callsheets,
      contacts,
      addCallsheet,
      updateCallsheet,
      deleteCallsheet,
      addContact,
      updateContact,
      deleteContact,
      duplicateCallsheet,
    }}>
      {children}
    </CallsheetContext.Provider>
  );
};
