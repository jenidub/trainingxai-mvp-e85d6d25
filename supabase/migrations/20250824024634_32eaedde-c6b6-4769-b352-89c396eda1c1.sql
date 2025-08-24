-- Create a table to track daily usage statistics
CREATE TABLE public.daily_usage_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  minutes_used INTEGER NOT NULL DEFAULT 0,
  sessions_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_usage_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own daily usage stats" 
ON public.daily_usage_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily usage stats" 
ON public.daily_usage_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily usage stats" 
ON public.daily_usage_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_usage_stats_updated_at
BEFORE UPDATE ON public.daily_usage_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update or insert daily usage
CREATE OR REPLACE FUNCTION public.update_daily_usage(
  p_user_id UUID,
  p_minutes INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.daily_usage_stats (user_id, date, minutes_used, sessions_count)
  VALUES (p_user_id, CURRENT_DATE, p_minutes, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    minutes_used = daily_usage_stats.minutes_used + p_minutes,
    sessions_count = daily_usage_stats.sessions_count + 1,
    updated_at = now();
END;
$$;