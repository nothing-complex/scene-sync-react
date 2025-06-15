
-- Fix RLS policies to avoid direct auth.users access
-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own shares" ON public.callsheet_shares;
DROP POLICY IF EXISTS "Shared users can update their shares" ON public.callsheet_shares;
DROP POLICY IF EXISTS "Users can view own and shared callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can update own and shared callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can create shares for their callsheets" ON public.callsheet_shares;

-- Create simpler, working policies that don't access auth.users
CREATE POLICY "Users can view their own shares" 
ON public.callsheet_shares FOR SELECT 
USING (
  shared_by = auth.uid() OR 
  shared_with_user = auth.uid()
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
  shared_with_user = auth.uid()
);

-- Fix callsheets policies
CREATE POLICY "Users can view own and shared callsheets" 
ON public.callsheets FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.callsheet_shares 
    WHERE callsheet_id = callsheets.id 
    AND shared_with_user = auth.uid()
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
    AND shared_with_user = auth.uid()
    AND status = 'accepted'
    AND can_edit = true
  )
);

CREATE POLICY "Users can delete own callsheets" 
ON public.callsheets FOR DELETE 
USING (user_id = auth.uid());
