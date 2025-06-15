
-- Enable RLS on all tables if not already enabled
ALTER TABLE public.callsheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Users can view callsheets for their projects" ON public.callsheets;
DROP POLICY IF EXISTS "Users can create callsheets" ON public.callsheets;
DROP POLICY IF EXISTS "Users can update callsheets in their projects" ON public.callsheets;
DROP POLICY IF EXISTS "Users can delete callsheets in their projects" ON public.callsheets;

DROP POLICY IF EXISTS "Users can view their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can create contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete their own contacts" ON public.contacts;

DROP POLICY IF EXISTS "Users can view projects they're members of" ON public.projects;
DROP POLICY IF EXISTS "Project owners can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;

DROP POLICY IF EXISTS "Users can view project members for their projects" ON public.project_members;

-- Create comprehensive RLS policies for callsheets
CREATE POLICY "Users can view their own callsheets" ON public.callsheets 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own callsheets" ON public.callsheets 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own callsheets" ON public.callsheets 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own callsheets" ON public.callsheets 
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for contacts
CREATE POLICY "Users can view their own contacts" ON public.contacts 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contacts" ON public.contacts 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts" ON public.contacts 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" ON public.contacts 
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for projects (for future collaboration features)
CREATE POLICY "Users can view projects they created" ON public.projects 
FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create projects" ON public.projects 
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own projects" ON public.projects 
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own projects" ON public.projects 
FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for project_members (for future collaboration)
CREATE POLICY "Users can view project members for their projects" ON public.project_members 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS handle_updated_at ON public.callsheets;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.callsheets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.contacts;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.projects;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
