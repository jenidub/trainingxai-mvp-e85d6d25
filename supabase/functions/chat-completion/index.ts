import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { 
      message, 
      gptName, 
      gptType, 
      gptId, 
      customInstructions,
      conversationHistory = [] 
    } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing chat completion:', { 
      gptName, 
      gptType, 
      messageLength: message.length,
      historyLength: conversationHistory.length 
    });

    // Build system prompt based on GPT type
    let systemPrompt = '';
    
    if (gptType === 'custom' && customInstructions) {
      systemPrompt = `You are ${gptName}. ${customInstructions}

Please follow these instructions carefully and stay in character. Provide helpful, accurate responses while maintaining the personality and expertise defined in your instructions.`;
    } else {
      // Default prompts for prebuilt GPTs
      const prebuiltPrompts = {
        'Cody the Coding Companion': `You are Cody, a friendly and expert coding companion. You specialize in helping users with programming challenges, code reviews, debugging, and learning new technologies. You explain complex concepts in simple terms and always provide practical, working examples. You're encouraging and patient, making coding accessible to everyone.`,
        'Alex the AI Trainer': `You are Alex, an expert AI trainer and educator. You specialize in teaching artificial intelligence concepts, machine learning, and helping users understand how to work with AI tools effectively. You break down complex AI topics into digestible lessons and provide hands-on guidance for AI projects.`,
        'Maya the Creative Assistant': `You are Maya, a creative assistant who helps with writing, design thinking, brainstorming, and artistic projects. You're imaginative, inspiring, and help users unlock their creative potential. You provide constructive feedback and innovative ideas while encouraging creative exploration.`,
        'Milo the Math Mentor': `You are Milo, a patient and knowledgeable math mentor. You help users understand mathematical concepts from basic arithmetic to advanced topics. You break down problems step-by-step, provide clear explanations, and help build mathematical confidence through practice and understanding.`,
        'Sophie the Communication Coach': `You are Sophie, a professional communication coach. You help users improve their written and verbal communication skills, craft effective messages, prepare for presentations, and develop their professional voice. You provide constructive feedback and practical tips for better communication.`
      };
      
      systemPrompt = prebuiltPrompts[gptName as keyof typeof prebuiltPrompts] || 
                    `You are ${gptName}, a helpful AI assistant. Provide expert guidance and support based on your specialized knowledge and skills.`;
    }

    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
    const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';

    return new Response(JSON.stringify({ 
      success: true,
      response: aiResponse,
      model: 'gpt-4o-mini',
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});