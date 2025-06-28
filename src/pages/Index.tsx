
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CallsheetForm } from '@/components/CallsheetForm';
import { ContactsManager } from '@/components/ContactsManager';
import { MasterPDFSettings } from '@/components/MasterPDFSettings';
import { CallsheetProvider } from '@/contexts/CallsheetContext';
import { LandingPage } from '@/components/LandingPage';
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
      default:
        return <Dashboard onCreateNew={() => setActiveView('create')} />;
    }
  };

  return (
    <CallsheetProvider>
      <div className="flex h-screen bg-background">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-auto">
          {/* Editorial Header */}
          <div className="bg-card border-b border-border/40 px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-sans font-medium text-foreground">
                  {user?.user_metadata?.full_name || 'Creative Professional'}
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center space-x-2 font-sans rounded-xl border-border/60 hover:bg-accent/20"
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
