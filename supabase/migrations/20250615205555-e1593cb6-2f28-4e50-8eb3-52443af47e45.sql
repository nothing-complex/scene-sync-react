
-- Create a simple callsheet shares table
CREATE TABLE public.callsheet_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  callsheet_id UUID NOT NULL REFERENCES public.callsheets(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_email TEXT NOT NULL,
  shared_with_user UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  can_edit BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(callsheet_id, shared_with_email)
);

-- Enable RLS
ALTER TABLE public.callsheet_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shares
CREATE POLICY "Users can view their own shares" 
ON public.callsheet_shares FOR SELECT 
USING (
  shared_by = auth.uid() OR 
  shared_with_user = auth.uid() OR 
  shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can create shares for their callsheets" 
ON public.callsheet_shares FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.callsheets 
    WHERE id = callsheet_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Shared users can update their shares" 
ON public.callsheet_shares FOR UPDATE 
USING (
  shared_with_user = auth.uid() OR 
  shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Update callsheets RLS to allow shared users to edit
DROP POLICY IF EXISTS "Users can view own callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can insert own callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can update own callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can delete own callsheets" ON public.callsheets;

-- New policies that include shared access
CREATE POLICY "Users can view own and shared callsheets" 
ON public.callsheets FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.callsheet_shares 
    WHERE callsheet_id = callsheets.id 
    AND (shared_with_user = auth.uid() OR shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    AND status = 'accepted'
  )
);

CREATE POLICY "Users can insert own callsheets" 
ON public.callsheets FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own and shared callsheets" 
ON public.callsheets FOR UPDATE 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.callsheet_shares 
    WHERE callsheet_id = callsheets.id 
    AND (shared_with_user = auth.uid() OR shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    AND status = 'accepted'
    AND can_edit = true
  )
);

CREATE POLICY "Users can delete own callsheets" 
ON public.callsheets FOR DELETE 
USING (user_id = auth.uid());

-- Add indexes
CREATE INDEX idx_callsheet_shares_callsheet_id ON public.callsheet_shares(callsheet_id);
CREATE INDEX idx_callsheet_shares_shared_with ON public.callsheet_shares(shared_with_email, shared_with_user);

-- Enable realtime for shares
ALTER TABLE public.callsheet_shares REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.callsheet_shares;
