import { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Copy, FileText, Trash2, Edit, Users, Camera, AlertCircle, RefreshCw, Share2, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallsheet } from '@/contexts/CallsheetContext';
import { CallsheetForm } from './CallsheetForm';
import { ShareCallsheetDialog } from './ShareCallsheetDialog';
import { ShareInvitations } from './ShareInvitations';
import { generateCallsheetPDF } from '@/services/pdfService';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { NetworkStatus } from '@/components/ui/network-status';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExcelExportService } from '@/services/excelService';

interface DashboardProps {
  onCreateNew: () => void;
}

export const Dashboard = ({ onCreateNew }: DashboardProps) => {
  const { callsheets, duplicateCallsheet, deleteCallsheet, loading, error, refetch } = useCallsheet();
  const { user } = useAuth();
  const [editingCallsheet, setEditingCallsheet] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [shareDialog, setShareDialog] = useState<{ isOpen: boolean; callsheetId: string; title: string }>({
    isOpen: false,
    callsheetId: '',
    title: ''
  });

  if (editingCallsheet) {
    return (
      <CallsheetForm 
        callsheetId={editingCallsheet}
        onBack={() => setEditingCallsheet(null)} 
      />
    );
  }

  const handleExportPDF = async (callsheetId: string) => {
    const callsheet = callsheets.find(cs => cs.id === callsheetId);
    if (callsheet) {
      console.log('Generating PDF for callsheet:', callsheetId);
      setActionLoading(`pdf-${callsheetId}`);
      try {
        await generateCallsheetPDF(callsheet);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDuplicate = async (callsheetId: string) => {
    try {
      setActionLoading(`duplicate-${callsheetId}`);
      await duplicateCallsheet(callsheetId);
    } catch (err) {
      console.error('Error duplicating callsheet:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (callsheetId: string) => {
    if (confirm('Are you sure you want to delete this callsheet?')) {
      try {
        setActionLoading(`delete-${callsheetId}`);
        await deleteCallsheet(callsheetId);
      } catch (err) {
        console.error('Error deleting callsheet:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleShare = (callsheetId: string, title: string) => {
    setShareDialog({
      isOpen: true,
      callsheetId,
      title
    });
  };

  const handleExportExcel = async (callsheetId: string) => {
    const callsheet = callsheets.find(cs => cs.id === callsheetId);
    if (callsheet) {
      console.log('Exporting Excel for callsheet:', callsheetId);
      setActionLoading(`excel-${callsheetId}`);
      try {
        ExcelExportService.exportSingleCallsheet(callsheet);
      } catch (error) {
        console.error('Error exporting Excel:', error);
        alert('Failed to export Excel. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleBulkExportExcel = () => {
    if (callsheets.length === 0) return;
    
    console.log('Exporting all callsheets to Excel');
    setActionLoading('bulk-excel');
    try {
      ExcelExportService.exportMultipleCallsheets(callsheets);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  
  // Get user's first name only
  const getUserFirstName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return 'User';
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <NetworkStatus />
        <div className="p-8">
          {/* Enhanced Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-light text-foreground mb-2">
                  {greeting}, {getUserFirstName()}.
                </h1>
                <p className="text-muted-foreground text-lg font-light">
                  Ready to create amazing productions today?
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={onCreateNew} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
                  size="lg"
                  disabled={loading}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Callsheet
                </Button>
              </div>
            </div>

            {/* Share Invitations */}
            <ShareInvitations />

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refetch}
                    className="ml-2"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="card-hover glass-effect border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Callsheets</CardTitle>
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <div className="text-3xl font-light text-foreground">{callsheets.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="card-hover glass-effect border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                  <div className="w-8 h-8 bg-accent/30 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <div className="text-3xl font-light text-foreground">
                        {callsheets.filter(cs => {
                          const callsheetDate = new Date(cs.shootDate);
                          const now = new Date();
                          return callsheetDate.getMonth() === now.getMonth() && 
                                 callsheetDate.getFullYear() === now.getFullYear();
                        }).length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Productions</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="card-hover glass-effect border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <div className="text-3xl font-light text-foreground">
                        {callsheets.filter(cs => new Date(cs.shootDate) > new Date()).length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">This week</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="card-hover glass-effect border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Cast</CardTitle>
                  <div className="w-8 h-8 bg-accent/30 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <div className="text-3xl font-light text-foreground">
                        {callsheets.reduce((total, cs) => total + cs.cast.length, 0)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">People</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Callsheets List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-foreground">Recent Productions</h2>
              {callsheets.length > 0 && !loading && (
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  View all
                </Button>
              )}
            </div>
            
            {loading && callsheets.length === 0 ? (
              <Card className="glass-effect border-0">
                <CardContent className="p-16 text-center">
                  <LoadingSpinner size="lg" text="Loading your callsheets..." />
                </CardContent>
              </Card>
            ) : callsheets.length === 0 ? (
              <Card className="glass-effect border-0">
                <CardContent className="p-16 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-light text-foreground mb-3">Start your first production</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto font-light">
                    Create professional callsheets and manage your film productions with ease
                  </p>
                  <Button 
                    onClick={onCreateNew} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-xl"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Callsheet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {callsheets.map((callsheet) => (
                  <Card key={callsheet.id} className="card-hover glass-effect border-0 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Colored accent bar */}
                        <div className="w-1 bg-primary"></div>
                        
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-medium text-foreground mb-3">
                                {callsheet.projectTitle}
                              </h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span>{new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <span>Call: {callsheet.generalCallTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span className="truncate">{callsheet.location}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  {callsheet.cast.length} cast
                                </span>
                                <span className="flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  {callsheet.crew.length} crew
                                </span>
                                <span className="flex items-center">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {callsheet.schedule.length} scenes
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-accent"
                                onClick={() => setEditingCallsheet(callsheet.id)}
                                disabled={actionLoading !== null}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-accent"
                                onClick={() => handleShare(callsheet.id, callsheet.projectTitle)}
                                disabled={actionLoading !== null}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-accent"
                                onClick={() => handleDuplicate(callsheet.id)}
                                disabled={actionLoading !== null}
                              >
                                {actionLoading === `duplicate-${callsheet.id}` ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-accent"
                                onClick={() => handleExportExcel(callsheet.id)}
                                disabled={actionLoading !== null}
                              >
                                {actionLoading === `excel-${callsheet.id}` ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <FileSpreadsheet className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-accent"
                                onClick={() => handleExportPDF(callsheet.id)}
                                disabled={actionLoading !== null}
                              >
                                {actionLoading === `pdf-${callsheet.id}` ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(callsheet.id)}
                                disabled={actionLoading !== null}
                              >
                                {actionLoading === `delete-${callsheet.id}` ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Share Dialog */}
        <ShareCallsheetDialog
          callsheetId={shareDialog.callsheetId}
          callsheetTitle={shareDialog.title}
          isOpen={shareDialog.isOpen}
          onClose={() => setShareDialog({ isOpen: false, callsheetId: '', title: '' })}
        />
      </div>
    </ErrorBoundary>
  );
};
