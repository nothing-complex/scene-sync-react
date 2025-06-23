
import React, { useState } from 'react';
import { CallsheetForm } from './CallsheetForm';
import { CallsheetList } from './CallsheetList';
import { Button } from "@/components/ui/button"
import { useCallsheet } from '@/contexts/CallsheetContext';
import { MasterPDFSettings } from './MasterPDFSettings';

export function Dashboard() {
  const { callsheets } = useCallsheet();
  const [selectedCallsheetId, setSelectedCallsheetId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'form' | 'settings'>('list');

  const selectedCallsheet = selectedCallsheetId ? callsheets.find(cs => cs.id === selectedCallsheetId) : undefined;

  const handleEditCallsheet = (id: string) => {
    setSelectedCallsheetId(id);
    setView('form');
  };

  const handleCreateNew = () => {
    setSelectedCallsheetId(null);
    setView('form');
  };

  const handleBackToList = () => {
    setSelectedCallsheetId(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <CallsheetForm 
        callsheet={selectedCallsheet}
        onBack={handleBackToList}
      />
    );
  }

  if (view === 'settings') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button variant="outline" onClick={handleBackToList}>
            Back to Dashboard
          </Button>
        </div>
        <MasterPDFSettings onBack={handleBackToList} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Callsheets</h1>
        <div className="space-x-2">
          <Button onClick={handleCreateNew}>
            Create New
          </Button>
          <Button variant="secondary" onClick={() => setView('settings')}>
            Settings
          </Button>
        </div>
      </div>
      <CallsheetList callsheets={callsheets} onEdit={handleEditCallsheet} />
    </div>
  );
}
