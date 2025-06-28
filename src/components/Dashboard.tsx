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
        <div className="p-12 editorial-spacing">
          {/* Editorial Welcome Section */}
          <div className="mb-16">
            <div className="flex items-start justify-between mb-12">
              <div className="max-w-2xl">
                <h1 className="hero-text mb-6">
                  {greeting}, {getUserFirstName()}.
                </h1>
                <p className="editorial-body text-muted-foreground">
                  Ready to orchestrate your next cinematic masterpiece? Let's bring your vision to life with precision and artistry.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={onCreateNew} 
                  className="btn-primary text-lg"
                  size="lg"
                  disabled={loading}
                >
                  <Plus className="w-5 h-5 mr-3" />
                  New Production
                </Button>
              </div>
            </div>

            {/* Share Invitations */}
            <div className="mb-12">
              <ShareInvitations />
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-12 rounded-xl border-l-4">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="flex items-center justify-between text-base">
                  <span>{error}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refetch}
                    className="ml-4 rounded-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Editorial Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              <Card className="editorial-card border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">Total Productions</CardTitle>
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <div className="text-4xl font-playfair font-semibold text-foreground mb-2">{callsheets.length}</div>
                      <p className="text-sm text-muted-foreground font-sans">All time</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="editorial-card border-l-4 border-l-accent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">This Month</CardTitle>
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <div className="text-4xl font-playfair font-semibold text-foreground mb-2">
                        {callsheets.filter(cs => {
                          const callsheetDate = new Date(cs.shootDate);
                          const now = new Date();
                          return callsheetDate.getMonth() === now.getMonth() && 
                                 callsheetDate.getFullYear() === now.getFullYear();
                        }).length}
                      </div>
                      <p className="text-sm text-muted-foreground font-sans">Active projects</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="editorial-card border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">Upcoming</CardTitle>
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <div className="text-4xl font-playfair font-semibold text-foreground mb-2">
                        {callsheets.filter(cs => new Date(cs.shootDate) > new Date()).length}
                      </div>
                      <p className="text-sm text-muted-foreground font-sans">This week</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="editorial-card border-l-4 border-l-accent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">Active Talent</CardTitle>
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <div className="text-4xl font-playfair font-semibold text-foreground mb-2">
                        {callsheets.reduce((total, cs) => total + cs.cast.length, 0)}
                      </div>
                      <p className="text-sm text-muted-foreground font-sans">Cast members</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Productions List */}
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="section-heading">Recent Productions</h2>
              {callsheets.length > 0 && !loading && (
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-sans">
                  View all productions
                </Button>
              )}
            </div>
            
            {loading && callsheets.length === 0 ? (
              <Card className="editorial-card">
                <CardContent className="p-20 text-center">
                  <LoadingSpinner size="lg" text="Loading your productions..." />
                </CardContent>
              </Card>
            ) : callsheets.length === 0 ? (
              <Card className="editorial-card">
                <CardContent className="p-20 text-center editorial-spacing">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-playfair font-medium text-foreground mb-4">Begin Your Cinematic Journey</h3>
                  <p className="editorial-body text-muted-foreground mb-8 max-w-lg mx-auto">
                    Create your first professional callsheet and start managing film productions with elegance and precision.
                  </p>
                  <Button 
                    onClick={onCreateNew} 
                    className="btn-primary text-lg"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Create First Production
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8">
                {callsheets.map((callsheet) => (
                  <Card key={callsheet.id} className="editorial-card border-l-4 border-l-primary overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-8">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-2xl font-playfair font-medium text-foreground mb-6">
                              {callsheet.projectTitle}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-sans font-medium text-muted-foreground">Shoot Date</p>
                                  <p className="font-sans text-foreground">{new Date(callsheet.shootDate).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center">
                                  <Clock className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                  <p className="text-sm font-sans font-medium text-muted-foreground">Call Time</p>
                                  <p className="font-sans text-foreground">{callsheet.generalCallTime}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                                  <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-sans font-medium text-muted-foreground">Location</p>
                                  <p className="font-sans text-foreground truncate">{callsheet.location}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-8 text-sm text-muted-foreground font-sans">
                              <span className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{callsheet.cast.length} cast</span>
                              </span>
                              <span className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{callsheet.crew.length} crew</span>
                              </span>
                              <span className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>{callsheet.schedule.length} scenes</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-8">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 hover:bg-accent/20 rounded-xl"
                              onClick={() => setEditingCallsheet(callsheet.id)}
                              disabled={actionLoading !== null}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 hover:bg-accent/20 rounded-xl"
                              onClick={() => handleShare(callsheet.id, callsheet.projectTitle)}
                              disabled={actionLoading !== null}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 hover:bg-accent/20 rounded-xl"
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
                              className="h-10 w-10 p-0 hover:bg-accent/20 rounded-xl"
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
                              className="h-10 w-10 p-0 hover:bg-accent/20 rounded-xl"
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
                              className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
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
