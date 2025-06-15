
import { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Copy, FileText, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallsheet } from '@/contexts/CallsheetContext';
import { CallsheetForm } from './CallsheetForm';

interface DashboardProps {
  onCreateNew: () => void;
}

export const Dashboard = ({ onCreateNew }: DashboardProps) => {
  const { callsheets, duplicateCallsheet, deleteCallsheet } = useCallsheet();
  const [editingCallsheet, setEditingCallsheet] = useState<string | null>(null);

  if (editingCallsheet) {
    return (
      <CallsheetForm 
        callsheetId={editingCallsheet}
        onBack={() => setEditingCallsheet(null)} 
      />
    );
  }

  const handleExportPDF = (callsheetId: string) => {
    // This would integrate with a PDF generation library
    console.log('Exporting PDF for callsheet:', callsheetId);
    // For now, we'll just show an alert
    alert('PDF export functionality would be implemented here with a library like jsPDF or Puppeteer');
  };

  const handleEmailDistribution = (callsheetId: string) => {
    // This would integrate with an email service
    console.log('Opening email distribution for callsheet:', callsheetId);
    alert('Email distribution functionality would be implemented here with an email service API');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Callsheets</h1>
          <p className="text-gray-600 mt-1">Manage your film production callsheets</p>
        </div>
        <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          New Callsheet
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Callsheets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callsheets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {callsheets.filter(cs => {
                const callsheetDate = new Date(cs.shootDate);
                const now = new Date();
                return callsheetDate.getMonth() === now.getMonth() && 
                       callsheetDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {callsheets.filter(cs => new Date(cs.shootDate) > new Date()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Callsheets List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Callsheets</h2>
        
        {callsheets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No callsheets yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first callsheet</p>
              <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                Create First Callsheet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {callsheets.map((callsheet) => (
              <Card key={callsheet.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {callsheet.projectTitle}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(callsheet.shootDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Call: {callsheet.generalCallTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {callsheet.location}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Cast: {callsheet.cast.length} • Crew: {callsheet.crew.length} • 
                        Scenes: {callsheet.schedule.length}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCallsheet(callsheet.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateCallsheet(callsheet.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportPDF(callsheet.id)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this callsheet?')) {
                            deleteCallsheet(callsheet.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
