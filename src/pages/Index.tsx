
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CallsheetForm } from '@/components/CallsheetForm';
import { ContactsManager } from '@/components/ContactsManager';
import { MasterPDFSettings } from '@/components/MasterPDFSettings';
import { CallsheetProvider } from '@/contexts/CallsheetContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onCreateNew={() => setActiveView('create')} />;
      case 'create':
        return <CallsheetForm onBack={() => setActiveView('dashboard')} />;
      case 'contacts':
        return <ContactsManager onBack={() => setActiveView('dashboard')} />;
      case 'pdf-settings':
        return <MasterPDFSettings onBack={() => setActiveView('dashboard')} />;
      default:
        return <Dashboard onCreateNew={() => setActiveView('create')} />;
    }
  };

  return (
    <CallsheetProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-auto">
          {/* Header with user info */}
          <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
          {renderActiveView()}
        </main>
      </div>
    </CallsheetProvider>
  );
};

export default Index;
