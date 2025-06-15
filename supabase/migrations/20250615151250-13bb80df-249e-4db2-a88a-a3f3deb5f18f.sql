
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create project_members table for collaboration
CREATE TABLE public.project_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'contributor', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS on project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  department TEXT,
  character TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create callsheets table
CREATE TABLE public.callsheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_title TEXT NOT NULL,
  shoot_date TEXT NOT NULL,
  general_call_time TEXT NOT NULL,
  location TEXT NOT NULL,
  location_address TEXT NOT NULL,
  parking_instructions TEXT DEFAULT '',
  basecamp_location TEXT DEFAULT '',
  cast_members JSONB DEFAULT '[]'::jsonb,
  crew_members JSONB DEFAULT '[]'::jsonb,
  schedule JSONB DEFAULT '[]'::jsonb,
  emergency_contacts JSONB DEFAULT '[]'::jsonb,
  weather TEXT DEFAULT '',
  special_notes TEXT DEFAULT '',
  project_id UUID REFERENCES public.projects(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on callsheets
ALTER TABLE public.callsheets ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can view projects they're members of" ON public.projects 
FOR SELECT USING (
  id IN (
    SELECT project_id FROM public.project_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project owners can update projects" ON public.projects 
FOR UPDATE USING (
  id IN (
    SELECT project_id FROM public.project_members 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

CREATE POLICY "Authenticated users can create projects" ON public.projects 
FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create policies for project_members
CREATE POLICY "Users can view project members for their projects" ON public.project_members 
FOR SELECT USING (
  project_id IN (
    SELECT project_id FROM public.project_members 
    WHERE user_id = auth.uid()
  )
);

-- Create policies for contacts
CREATE POLICY "Users can view their own contacts" ON public.contacts 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create contacts" ON public.contacts 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts" ON public.contacts 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" ON public.contacts 
FOR DELETE USING (auth.uid() = user_id);

-- Create policies for callsheets
CREATE POLICY "Users can view callsheets for their projects" ON public.callsheets 
FOR SELECT USING (
  project_id IN (
    SELECT project_id FROM public.project_members 
    WHERE user_id = auth.uid()
  ) OR project_id IS NULL -- Allow viewing legacy callsheets without project
);

CREATE POLICY "Users can create callsheets" ON public.callsheets 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update callsheets in their projects" ON public.callsheets 
FOR UPDATE USING (
  project_id IN (
    SELECT project_id FROM public.project_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  ) OR (project_id IS NULL AND user_id = auth.uid()) -- Allow updating legacy callsheets
);

CREATE POLICY "Users can delete callsheets in their projects" ON public.callsheets 
FOR DELETE USING (
  project_id IN (
    SELECT project_id FROM public.project_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  ) OR (project_id IS NULL AND user_id = auth.uid()) -- Allow deleting legacy callsheets
);
