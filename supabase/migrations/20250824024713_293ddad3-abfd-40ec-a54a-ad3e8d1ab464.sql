-- Fix the function security issue by setting search_path
CREATE OR REPLACE FUNCTION public.update_daily_usage(
  p_user_id UUID,
  p_minutes INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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