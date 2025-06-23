
import React, { useState } from 'react';
import { CallsheetForm } from './CallsheetForm';
import { CallsheetList } from './CallsheetList';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCallsheet } from '@/contexts/CallsheetContext';
import { MasterPDFSettings } from './MasterPDFSettings';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Calendar, Settings } from 'lucide-react';

export function Dashboard() {
  const { callsheets } = useCallsheet();
  const { user } = useAuth();
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

  // Get user's display name
  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
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
      <div className="container mx-auto px-6 py-8 space-y-6">
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
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, {getDisplayName()}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your film production callsheets and keep your crew organized.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Callsheets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callsheets.length}</div>
            <p className="text-xs text-muted-foreground">
              {callsheets.length === 1 ? 'callsheet' : 'callsheets'} created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Shoots</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {callsheets.filter(cs => new Date(cs.shootDate) >= new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              scheduled this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {callsheets.length > 0 ? 'Active' : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              last updated today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Your Callsheets</h2>
            <p className="text-muted-foreground">
              Create and manage callsheets for your film productions
            </p>
          </div>
          <div className="space-x-2">
            <Button onClick={handleCreateNew} size="lg">
              <FileText className="mr-2 h-4 w-4" />
              Create New Callsheet
            </Button>
            <Button variant="secondary" onClick={() => setView('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Callsheets List */}
        <CallsheetList callsheets={callsheets} onEdit={handleEditCallsheet} />
      </div>
    </div>
  );
}
