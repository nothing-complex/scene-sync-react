
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CallsheetForm } from '@/components/CallsheetForm';
import { ContactsManager } from '@/components/ContactsManager';
import { MasterPDFSettings } from '@/components/MasterPDFSettings';
import { PrivacyPage } from '@/components/PrivacyPage';
import { CallsheetProvider } from '@/contexts/CallsheetContext';
import { LandingPage } from '@/components/LandingPage';
import { ConsentBanner } from '@/components/gdpr/ConsentBanner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { user, signOut } = useAuth();

  // Show landing page for non-authenticated users
  if (!user) {
    return <LandingPage />;
  }

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
      case 'privacy':
        return <PrivacyPage onBack={() => setActiveView('dashboard')} />;
      default:
        return <Dashboard onCreateNew={() => setActiveView('create')} />;
    }
  };

  return (
    <CallsheetProvider>
      <div className="flex h-screen bg-background">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-auto">
          {/* Header with user info */}
          <div className="bg-card border-b border-border/30 px-6 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-normal">
                Welcome, {user?.email}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center space-x-2 font-normal"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
          {renderActiveView()}
        </main>
      </div>
      <ConsentBanner />
    </CallsheetProvider>
  );
};

export default Index;
