-- Add assistant_id column to store OpenAI Assistant IDs
ALTER TABLE public.custom_gpts 
ADD COLUMN assistant_id text;

-- Add thread_id column to chat_sessions to store OpenAI Thread IDs
ALTER TABLE public.chat_sessions 
ADD COLUMN thread_id text;