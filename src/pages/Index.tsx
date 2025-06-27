
import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { CallsheetForm } from '@/components/CallsheetForm';
import { LandingPage } from '@/components/LandingPage';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Index() {
  const { user, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);

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

  if (showForm) {
    return (
      <CallsheetForm 
        onBack={() => setShowForm(false)} 
      />
    );
  }

  return (
    <Dashboard 
      onCreateNew={() => setShowForm(true)} 
    />
  );
}
