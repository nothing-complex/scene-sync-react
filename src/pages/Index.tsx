
import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { CallsheetForm } from '@/components/CallsheetForm';
import { LandingPage } from '@/components/LandingPage';
import { ContactsManager } from '@/components/ContactsManager';
import { useAuth } from '@/contexts/AuthContext';
import { CallsheetProvider } from '@/contexts/CallsheetContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Index() {
  const { user, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingCallsheetId, setEditingCallsheetId] = useState<string | undefined>();
  const [showContactsManager, setShowContactsManager] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <CallsheetProvider>
      {showContactsManager ? (
        <ContactsManager onBack={() => setShowContactsManager(false)} />
      ) : showForm ? (
        <CallsheetForm 
          callsheetId={editingCallsheetId}
          onBack={() => {
            setShowForm(false);
            setEditingCallsheetId(undefined);
          }} 
        />
      ) : (
        <Dashboard 
          onCreateNew={() => setShowForm(true)}
        />
      )}
    </CallsheetProvider>
  );
}
