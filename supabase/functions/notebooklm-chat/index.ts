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

    const { message, documents, context } = await req.json();
    
    console.log('NotebookLM chat request:', { message, documents: documents?.length, contextLength: context?.length });

    // Build context from previous messages
    let conversationContext = '';
    if (context && context.length > 0) {
      conversationContext = context.map((msg: any) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
    }

    // Create NotebookLM-style system prompt
    const systemPrompt = `You are a NotebookLM-style AI assistant designed to help users practice document analysis and research skills. 

Key behaviors:
- Analyze uploaded documents and provide insights
- Cite sources when referencing information
- Ask follow-up questions to deepen understanding
- Provide summaries, comparisons, and thematic analysis
- Encourage critical thinking about the content

Available documents: ${documents?.length ? documents.join(', ') : 'None uploaded yet'}

Previous conversation:
${conversationContext}

Respond in a helpful, educational manner that demonstrates best practices for document analysis and research.`;

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
                text: `${systemPrompt}\n\nUser: ${message}`
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
    
    // Simulate source citations for practice
    const sources = documents?.length > 0 ? documents.slice(0, 2) : [];

    return new Response(JSON.stringify({ 
      response: generatedResponse,
      sources: sources
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