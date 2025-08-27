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
      assistantId,
      threadId
    } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing assistant chat:', { 
      gptName, 
      gptType, 
      assistantId,
      threadId,
      messageLength: message.length 
    });

    let currentThreadId = threadId;

    // Create thread if it doesn't exist
    if (!currentThreadId) {
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({}),
      });

      if (!threadResponse.ok) {
        const errorData = await threadResponse.text();
        console.error('Thread creation error:', threadResponse.status, errorData);
        throw new Error(`Failed to create thread: ${threadResponse.status}`);
      }

      const thread = await threadResponse.json();
      currentThreadId = thread.id;
      console.log('Created new thread:', currentThreadId);
    }

    // Add message to thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        role: 'user',
        content: message,
      }),
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.text();
      console.error('Message creation error:', messageResponse.status, errorData);
      throw new Error(`Failed to add message: ${messageResponse.status}`);
    }

    let finalAssistantId = assistantId;

    // For prebuilt GPTs, use default assistant behavior with custom instructions
    if (gptType === 'prebuilt' || !assistantId) {
      const prebuiltPrompts = {
        'Cody the Coding Companion': `You are Cody, a friendly and expert coding companion. You specialize in helping users with programming challenges, code reviews, debugging, and learning new technologies. You explain complex concepts in simple terms and always provide practical, working examples. You're encouraging and patient, making coding accessible to everyone.`,
        'Alex the AI Trainer': `You are Alex, an expert AI trainer and educator. You specialize in teaching artificial intelligence concepts, machine learning, and helping users understand how to work with AI tools effectively. You break down complex AI topics into digestible lessons and provide hands-on guidance for AI projects.`,
        'Maya the Creative Assistant': `You are Maya, a creative assistant who helps with writing, design thinking, brainstorming, and artistic projects. You're imaginative, inspiring, and help users unlock their creative potential. You provide constructive feedback and innovative ideas while encouraging creative exploration.`,
        'Milo the Math Mentor': `You are Milo, a patient and knowledgeable math mentor. You help users understand mathematical concepts from basic arithmetic to advanced topics. You break down problems step-by-step, provide clear explanations, and help build mathematical confidence through practice and understanding.`,
        'Sophie the Communication Coach': `You are Sophie, a professional communication coach. You help users improve their written and verbal communication skills, craft effective messages, prepare for presentations, and develop their professional voice. You provide constructive feedback and practical tips for better communication.`
      };
      
      const instructions = prebuiltPrompts[gptName as keyof typeof prebuiltPrompts] || 
                          `You are ${gptName}, a helpful AI assistant. Provide expert guidance and support based on your specialized knowledge and skills.`;

      // Create a temporary assistant for prebuilt GPTs
      const assistantResponse = await fetch('https://api.openai.com/v1/assistants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          name: gptName,
          instructions: instructions,
          temperature: 0.7,
        }),
      });

      if (assistantResponse.ok) {
        const assistant = await assistantResponse.json();
        finalAssistantId = assistant.id;
      }
    }

    if (!finalAssistantId) {
      throw new Error('No assistant available for this conversation');
    }

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: finalAssistantId,
      }),
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.text();
      console.error('Run creation error:', runResponse.status, errorData);
      throw new Error(`Failed to run assistant: ${runResponse.status}`);
    }

    const run = await runResponse.json();

    // Poll for completion
    let runStatus = run.status;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max

    while (runStatus !== 'completed' && runStatus !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        runStatus = statusData.status;
        attempts++;
      } else {
        break;
      }
    }

    if (runStatus !== 'completed') {
      throw new Error('Assistant run did not complete successfully');
    }

    // Get the messages from the thread
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!messagesResponse.ok) {
      const errorData = await messagesResponse.text();
      console.error('Messages retrieval error:', messagesResponse.status, errorData);
      throw new Error(`Failed to retrieve messages: ${messagesResponse.status}`);
    }

    const messagesData = await messagesResponse.json();
    const lastMessage = messagesData.data[0]; // Most recent message

    if (!lastMessage || lastMessage.role !== 'assistant') {
      throw new Error('No assistant response found');
    }

    const responseContent = lastMessage.content[0]?.text?.value || 'I apologize, but I was unable to generate a response. Please try again.';

    console.log('Assistant response received successfully');

    return new Response(JSON.stringify({ 
      success: true,
      response: responseContent,
      thread_id: currentThreadId,
      assistant_id: finalAssistantId
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