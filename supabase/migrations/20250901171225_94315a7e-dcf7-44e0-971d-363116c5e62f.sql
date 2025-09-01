-- Fix critical security vulnerability: Add missing INSERT RLS policy to subscribers table
-- This prevents unauthorized users from creating subscription records for other users

CREATE POLICY "Users can create their own subscription" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Optional: Add DELETE policy for completeness (users should be able to delete their own subscription)
CREATE POLICY "Users can delete their own subscription" 
ON public.subscribers 
FOR DELETE 
USING (auth.uid() = user_id);