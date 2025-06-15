
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CallsheetForm } from '@/components/CallsheetForm';
import { ContactsManager } from '@/components/ContactsManager';
import { CallsheetProvider } from '@/contexts/CallsheetContext';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onCreateNew={() => setActiveView('create')} />;
      case 'create':
        return <CallsheetForm onBack={() => setActiveView('dashboard')} />;
      case 'contacts':
        return <ContactsManager onBack={() => setActiveView('dashboard')} />;
      default:
        return <Dashboard onCreateNew={() => setActiveView('create')} />;
    }
  };

  return (
    <CallsheetProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-auto">
          {renderActiveView()}
        </main>
      </div>
    </CallsheetProvider>
  );
};

export default Index;
