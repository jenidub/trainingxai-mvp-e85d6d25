-- Create platforms table to store AI platform information
CREATE TABLE public.platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform_ratings table to store user ratings
CREATE TABLE public.platform_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_id UUID NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  user_id UUID, -- Allow anonymous ratings for now
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform_usage table to track usage counts
CREATE TABLE public.platform_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_id UUID NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  user_id UUID, -- Allow anonymous usage tracking for now
  action_type TEXT NOT NULL DEFAULT 'click', -- 'click', 'view', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for platforms (public read access)
CREATE POLICY "Platforms are viewable by everyone" 
ON public.platforms 
FOR SELECT 
USING (true);

-- Create policies for platform_ratings (public read access, authenticated write)
CREATE POLICY "Platform ratings are viewable by everyone" 
ON public.platform_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create platform ratings" 
ON public.platform_ratings 
FOR INSERT 
WITH CHECK (true); -- Allow anonymous ratings for now

-- Create policies for platform_usage (public read access, public insert for tracking)
CREATE POLICY "Platform usage is viewable by everyone" 
ON public.platform_usage 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create platform usage records" 
ON public.platform_usage 
FOR INSERT 
WITH CHECK (true); -- Allow anonymous usage tracking

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_platforms_updated_at
BEFORE UPDATE ON public.platforms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_platform_ratings_updated_at
BEFORE UPDATE ON public.platform_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial platform data
INSERT INTO public.platforms (name, description, category, url, icon_name, popular) VALUES
('Claude AI', 'Anthropic''s AI assistant focused on helpful, harmless, and honest interactions.', 'Generative AI', 'https://claude.ai', 'Brain', true),
('ChatGPT', 'OpenAI''s conversational AI for natural language processing and creative tasks.', 'Generative AI', 'https://chat.openai.com', 'Bot', true),
('Gamma', 'AI-powered presentation and document creation platform for visual storytelling.', 'Generative AI', 'https://gamma.app', 'Presentation', false),
('Notebook LM', 'Google''s AI-powered note-taking and research assistant for knowledge work.', 'Agentic AI', 'https://notebooklm.google.com', 'BookOpen', false);

-- Insert some sample ratings and usage data
INSERT INTO public.platform_ratings (platform_id, rating) 
SELECT id, 4.7 FROM public.platforms WHERE name = 'Claude AI'
UNION ALL
SELECT id, 4.8 FROM public.platforms WHERE name = 'ChatGPT'
UNION ALL
SELECT id, 4.5 FROM public.platforms WHERE name = 'Gamma'
UNION ALL
SELECT id, 4.6 FROM public.platforms WHERE name = 'Notebook LM';

-- Insert sample usage data
INSERT INTO public.platform_usage (platform_id, action_type)
SELECT p.id, 'click'
FROM public.platforms p, generate_series(1, 
  CASE p.name 
    WHEN 'Claude AI' THEN 1850
    WHEN 'ChatGPT' THEN 2400
    WHEN 'Gamma' THEN 950
    WHEN 'Notebook LM' THEN 1200
  END
) series;