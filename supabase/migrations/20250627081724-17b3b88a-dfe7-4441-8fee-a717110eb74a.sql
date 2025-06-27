
-- Create a table to store master PDF settings per user
CREATE TABLE public.master_pdf_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add Row Level Security (RLS) to ensure users can only see their own settings
ALTER TABLE public.master_pdf_settings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own settings
CREATE POLICY "Users can view their own master PDF settings" 
  ON public.master_pdf_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own settings
CREATE POLICY "Users can create their own master PDF settings" 
  ON public.master_pdf_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own settings
CREATE POLICY "Users can update their own master PDF settings" 
  ON public.master_pdf_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.master_pdf_settings 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
