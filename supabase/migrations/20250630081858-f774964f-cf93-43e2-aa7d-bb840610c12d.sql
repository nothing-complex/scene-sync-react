
-- Create table for user consent management
CREATE TABLE public.user_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('essential', 'analytics', 'marketing', 'data_processing')),
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE,
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, consent_type)
);

-- Create table for data processing audit log
CREATE TABLE public.data_processing_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'export', 'share')),
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for data retention policies
CREATE TABLE public.data_retention_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL UNIQUE,
  retention_days INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add GDPR-related fields to existing tables
ALTER TABLE public.contacts ADD COLUMN consent_obtained BOOLEAN DEFAULT false;
ALTER TABLE public.contacts ADD COLUMN consent_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.contacts ADD COLUMN data_source TEXT; -- 'user_input', 'imported', 'shared'

-- Add privacy fields to profiles
ALTER TABLE public.profiles ADD COLUMN privacy_settings JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN data_processing_consent BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN marketing_consent BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN last_privacy_update TIMESTAMP WITH TIME ZONE;

-- Enable RLS on new tables
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_processing_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_consents
CREATE POLICY "Users can view their own consents" 
  ON public.user_consents FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consents" 
  ON public.user_consents FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents" 
  ON public.user_consents FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for data_processing_log
CREATE POLICY "Users can view their own processing log" 
  ON public.data_processing_log FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert processing logs" 
  ON public.data_processing_log FOR INSERT 
  WITH CHECK (true); -- Allow system to log actions

-- RLS Policies for data_retention_policies (admin-only, but readable by all)
CREATE POLICY "Everyone can view retention policies" 
  ON public.data_retention_policies FOR SELECT 
  USING (true);

-- Insert default retention policies
INSERT INTO public.data_retention_policies (resource_type, retention_days, description) VALUES
('callsheets', 2555, '7 years retention for production records'),
('contacts', 1095, '3 years retention for contact information'),
('user_data', 2555, '7 years retention for user account data'),
('logs', 365, '1 year retention for audit logs');

-- Create function to log data processing activities
CREATE OR REPLACE FUNCTION public.log_data_processing(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
) 
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.data_processing_log (
    user_id, action, resource_type, resource_id, details
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id, p_details
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle consent updates
CREATE OR REPLACE FUNCTION public.update_user_consent(
  p_user_id UUID,
  p_consent_type TEXT,
  p_granted BOOLEAN
) 
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_consents (user_id, consent_type, granted, granted_at)
  VALUES (p_user_id, p_consent_type, p_granted, CASE WHEN p_granted THEN now() ELSE NULL END)
  ON CONFLICT (user_id, consent_type) 
  DO UPDATE SET 
    granted = p_granted,
    granted_at = CASE WHEN p_granted THEN now() ELSE user_consents.granted_at END,
    withdrawn_at = CASE WHEN NOT p_granted THEN now() ELSE NULL END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to automatically update updated_at timestamps
CREATE TRIGGER handle_user_consents_updated_at BEFORE UPDATE ON public.user_consents 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_data_retention_policies_updated_at BEFORE UPDATE ON public.data_retention_policies 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
