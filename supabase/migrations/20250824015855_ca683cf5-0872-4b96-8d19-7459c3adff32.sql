-- Create user_statistics table for real analytics data
CREATE TABLE public.user_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_time_minutes INTEGER NOT NULL DEFAULT 0,
  projects_completed INTEGER NOT NULL DEFAULT 0,
  certificates_earned INTEGER NOT NULL DEFAULT 0,
  training_time_minutes INTEGER NOT NULL DEFAULT 0,
  drills_completed INTEGER NOT NULL DEFAULT 0,
  prompts_written INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own statistics" 
ON public.user_statistics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own statistics" 
ON public.user_statistics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statistics" 
ON public.user_statistics 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_statistics_updated_at
BEFORE UPDATE ON public.user_statistics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create user statistics when a profile is created
CREATE OR REPLACE FUNCTION public.create_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_statistics (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;