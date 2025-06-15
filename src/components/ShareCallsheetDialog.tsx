
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Share2, Loader2 } from 'lucide-react';
import { useCallsheetShares } from '@/hooks/useCallsheetShares';
import { useToast } from '@/components/ui/use-toast';

interface ShareCallsheetDialogProps {
  callsheetId: string;
  callsheetTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareCallsheetDialog = ({ 
  callsheetId, 
  callsheetTitle, 
  isOpen, 
  onClose 
}: ShareCallsheetDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const { shareCallsheet } = useCallsheetShares();
  const { toast } = useToast();

  const handleShare = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to share with.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSharing(true);
      await shareCallsheet(callsheetId, email);
      
      toast({
        title: "Callsheet shared!",
        description: `Shared "${callsheetTitle}" with ${email}. They will receive a notification to accept the share.`,
      });
      
      setEmail('');
      onClose();
    } catch (err) {
      toast({
        title: "Failed to share",
        description: err instanceof Error ? err.message : "An error occurred while sharing the callsheet.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share Callsheet</span>
          </DialogTitle>
          <DialogDescription>
            Share "{callsheetTitle}" with another user. They'll be able to view and edit the callsheet once they accept.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="share-email">Email address</Label>
            <Input
              id="share-email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleShare();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={isSharing}>
            {isSharing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
