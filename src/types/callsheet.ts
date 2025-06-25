
export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  character?: string;
  department?: string;
  company?: string;
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
  projectId?: string;
  userId: string;
  emergencyNumber?: string; // Add this field to store the emergency number
}
