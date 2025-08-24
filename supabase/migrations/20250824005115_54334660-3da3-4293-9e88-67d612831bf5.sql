-- Create training tracks table for available training programs
CREATE TABLE public.training_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user training progress table
CREATE TABLE public.user_training_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id UUID NOT NULL REFERENCES public.training_tracks(id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  badges_earned INTEGER NOT NULL DEFAULT 0,
  certificates_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Enable Row Level Security
ALTER TABLE public.training_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_training_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for training_tracks (publicly readable)
CREATE POLICY "Training tracks are viewable by everyone" 
ON public.training_tracks 
FOR SELECT 
USING (true);

-- RLS Policies for user_training_progress
CREATE POLICY "Users can view their own training progress" 
ON public.user_training_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own training progress" 
ON public.user_training_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training progress" 
ON public.user_training_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own training progress" 
ON public.user_training_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_training_tracks_updated_at
BEFORE UPDATE ON public.training_tracks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_training_progress_updated_at
BEFORE UPDATE ON public.user_training_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default training tracks
INSERT INTO public.training_tracks (name, description) VALUES
('Prompt Engineering', 'Learn advanced techniques for crafting effective AI prompts'),
('AI Agent Building', 'Build intelligent AI agents for various applications'),
('Creative AI', 'Explore AI tools for creative projects and artistic endeavors'),
('Business AI', 'Apply AI solutions to business problems and workflows');