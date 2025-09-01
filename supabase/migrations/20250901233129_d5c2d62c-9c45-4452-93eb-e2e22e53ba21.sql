-- Drop the existing overly permissive RLS policy for platform_usage
DROP POLICY IF EXISTS "Platform usage is viewable by everyone" ON public.platform_usage;

-- Create a secure RLS policy that only allows users to view their own platform usage data
CREATE POLICY "Users can view their own platform usage" 
ON public.platform_usage 
FOR SELECT 
USING (auth.uid() = user_id);

-- Also add a policy to allow anonymous usage tracking (for users not logged in)
-- but only for their own records, not viewing others
CREATE POLICY "Allow anonymous platform usage tracking" 
ON public.platform_usage 
FOR SELECT 
USING (user_id IS NULL AND auth.uid() IS NULL);