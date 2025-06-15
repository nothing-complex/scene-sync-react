
-- Drop policies that might exist (some may not exist, that's ok)
DROP POLICY IF EXISTS "Users can view their own callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can insert their own callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can update their own callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can delete their own callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can view shares where they are involved" ON public.callsheet_shares;
DROP POLICY IF EXISTS "Users can create shares for their callsheets" ON public.callsheet_shares;
DROP POLICY IF EXISTS "Users can update shares where they are the recipient" ON public.callsheet_shares;
DROP POLICY IF EXISTS "Users can delete shares they created" ON public.callsheet_shares;

-- Also drop any policies from the previous migration
DROP POLICY IF EXISTS "Users can view their own shares" ON public.callsheet_shares;
DROP POLICY IF EXISTS "Shared users can update their shares" ON public.callsheet_shares;
DROP POLICY IF EXISTS "Users can view own and shared callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can insert own callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can update own and shared callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can delete own callsheets" ON public.callsheets;

-- Ensure RLS is enabled
ALTER TABLE public.callsheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callsheet_shares ENABLE ROW LEVEL SECURITY;

-- Create fresh policies for callsheets with unique names
CREATE POLICY "callsheets_select_own" 
ON public.callsheets FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "callsheets_insert_own" 
ON public.callsheets FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "callsheets_update_own" 
ON public.callsheets FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "callsheets_delete_own" 
ON public.callsheets FOR DELETE 
USING (user_id = auth.uid());

-- Create fresh policies for callsheet_shares with unique names
CREATE POLICY "shares_select_involved" 
ON public.callsheet_shares FOR SELECT 
USING (
  shared_by = auth.uid() OR 
  shared_with_user = auth.uid()
);

CREATE POLICY "shares_insert_own" 
ON public.callsheet_shares FOR INSERT 
WITH CHECK (shared_by = auth.uid());

CREATE POLICY "shares_update_recipient" 
ON public.callsheet_shares FOR UPDATE 
USING (shared_with_user = auth.uid());

CREATE POLICY "shares_delete_creator" 
ON public.callsheet_shares FOR DELETE 
USING (shared_by = auth.uid());
