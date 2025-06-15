
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Calendar, User, Loader2 } from 'lucide-react';
import { useCallsheetShares } from '@/hooks/useCallsheetShares';
import { useCallsheets } from '@/hooks/useCallsheets';
import { useToast } from '@/components/ui/use-toast';

export const ShareInvitations = () => {
  const { getPendingShares, respondToShare } = useCallsheetShares();
  const { callsheets } = useCallsheets();
  const { toast } = useToast();
  const [responding, setResponding] = useState<string | null>(null);

  const pendingShares = getPendingShares();

  const handleResponse = async (shareId: string, status: 'accepted' | 'declined') => {
    try {
      setResponding(shareId);
      await respondToShare(shareId, status);
      
      toast({
        title: status === 'accepted' ? "Share accepted!" : "Share declined",
        description: status === 'accepted' 
          ? "You now have access to edit this callsheet." 
          : "The share invitation has been declined.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred while responding to the share.",
        variant: "destructive",
      });
    } finally {
      setResponding(null);
    }
  };

  if (pendingShares.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Pending Share Invitations</span>
          <Badge variant="secondary">{pendingShares.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingShares.map((share) => {
          const callsheet = callsheets.find(c => c.id === share.callsheet_id);
          
          return (
            <div key={share.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">
                  {callsheet?.projectTitle || 'Unknown Callsheet'}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    Shared by: {share.shared_by}
                  </span>
                  {callsheet && (
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(callsheet.shootDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResponse(share.id, 'declined')}
                  disabled={responding === share.id}
                >
                  {responding === share.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleResponse(share.id, 'accepted')}
                  disabled={responding === share.id}
                >
                  {responding === share.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
