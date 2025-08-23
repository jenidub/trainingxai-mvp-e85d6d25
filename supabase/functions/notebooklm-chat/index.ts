import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set');
    }

    const { message, level, context } = await req.json();
    
    console.log('Prompting practice request:', { message, level, contextLength: context?.length });

    // Build context from previous messages
    let conversationContext = '';
    if (context && context.length > 0) {
      conversationContext = context.map((msg: any) => 
        `${msg.role === 'user' ? 'User' : 'AI Instructor'}: ${msg.content}`
      ).join('\n');
    }

    // Create level-specific system prompts
    const levelPrompts = {
      1: `You are an AI instructor helping users master information generation prompts. 

Focus on:
- Teaching effective prompt structure for getting informative responses
- Helping users understand how to be specific and clear
- Showing techniques for getting comprehensive explanations
- Demonstrating how to ask for examples, comparisons, and step-by-step guides

Provide constructive feedback on their prompts and suggest improvements.`,

      2: `You are an AI instructor helping users learn to write prompts for building websites and applications.

Focus on:
- Teaching prompts for web development tasks
- Showing how to request specific code structures
- Helping with prompts for responsive design
- Demonstrating prompts for app functionality and features
- Teaching how to ask for debugging and optimization help

Provide practical examples and improvement suggestions.`,

      3: `You are an AI instructor helping users master AI agent creation through advanced prompting.

Focus on:
- Teaching how to define agent personalities and roles
- Showing prompts for specialized capabilities
- Demonstrating system prompt construction
- Helping with agent behavior specification
- Teaching integration and workflow prompts

Provide expert-level guidance and advanced techniques.`
    };

    const systemPrompt = levelPrompts[level as keyof typeof levelPrompts] || levelPrompts[1];

    const fullPrompt = `${systemPrompt}

Previous conversation:
${conversationContext}

Respond as an encouraging AI instructor. Provide helpful feedback and guidance for improving prompting skills at this level.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${fullPrompt}\n\nUser: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google API error:', errorData);
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google API response received');

    const generatedResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response.';
    
    return new Response(JSON.stringify({ 
      response: generatedResponse
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in notebooklm-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred processing your request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});