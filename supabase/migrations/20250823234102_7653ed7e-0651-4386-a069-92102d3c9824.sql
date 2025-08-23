-- Fix security vulnerability: Remove overly permissive RLS policy
-- The "Service can manage all subscriptions" policy with USING condition 'true' 
-- allows anyone to access all subscription data, which is a security risk.
-- Edge functions using the service role key will automatically bypass RLS,
-- so this broad policy is unnecessary and dangerous.

DROP POLICY IF EXISTS "Service can manage all subscriptions" ON public.subscribers;

-- The existing user-specific policies are sufficient:
-- 1. "Users can view their own subscription" - SELECT with (auth.uid() = user_id)
-- 2. "Users can update their own subscription" - UPDATE with (auth.uid() = user_id)
-- 
-- Edge functions will continue to work because they use the service role key
-- which automatically bypasses RLS policies for administrative operations.