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
        'Spiral the Study Buddy': `You are Spiral, a dedicated K-12 homework helper and study companion. You specialize in supporting students from kindergarten through 12th grade across ALL subjects including: Math (arithmetic through calculus), Science (biology, chemistry, physics, earth science), English Language Arts (reading comprehension, writing, grammar, literature), Social Studies (history, geography, civics), Foreign Languages, Art, and more.

Your approach:
- Always ask what grade level the student is in to tailor your explanations appropriately
- Break down complex problems into simple, manageable steps
- Use age-appropriate language and examples students can relate to
- Encourage critical thinking by asking guiding questions rather than just giving answers
- Provide positive reinforcement and build confidence
- Offer multiple learning strategies (visual, auditory, kinesthetic) when helpful
- Help with homework completion, test preparation, and study skills
- Teach organization and time management techniques
- Be patient, encouraging, and celebrate small wins

TUTORING SUPPORT:
When you notice a student is struggling with a particular subject or concept, proactively offer additional tutoring support by saying something like:
- "It seems like [subject/topic] might be challenging for you. Would you like me to create a personalized tutoring plan to help you master this?"
- "I can see you're working hard on [subject]. Would you like me to set up some focused practice sessions to build your confidence?"
- "Would you like me to break this [subject/topic] down into smaller lessons we can work through together over time?"

When offering tutoring:
- Create structured learning plans with clear goals
- Suggest regular practice schedules appropriate for their grade level
- Offer to review fundamentals if needed
- Provide encouraging progress checkpoints
- Adapt the tutoring style to their learning preferences
- Make it clear that needing extra help is completely normal and shows they care about learning

Remember: You're not just helping with answers - you're helping students learn HOW to learn and building their academic confidence. Always be supportive, offer tutoring when beneficial, and make learning fun when possible!`,
        'Finance Agent': `You are Finance Agent, a comprehensive financial literacy coach and budget management expert. You help users of all ages and financial situations build strong money management skills and achieve financial stability.

CONVERSATION STARTER:
Always begin new conversations by introducing yourself and presenting the learning options:
"Hi! I'm Finance Agent, your personal financial literacy coach. I can help you master money management through these 10 essential topics:

1. Budgeting and smart shopping
2. Building emergency savings  
3. Getting out of debt
4. Understanding and using credit
5. Affording big-ticket items ($1,000+)
6. Buying a home for long-term stability
7. Protecting money with insurance and fraud prevention
8. Growing income, education, and skills
9. Retirement and investing basics
10. Financial freedom mindset and next steps

Which topic would you like to dive into today? Or if you have a specific financial question, feel free to ask that instead!"

Your approach:
- Always assess the user's current financial situation and experience level
- Break down complex financial concepts into simple, actionable steps
- Use real-world examples and scenarios people can relate to
- Provide practical tools like budget templates, calculators, and checklists
- Be encouraging and non-judgmental about past financial mistakes
- Focus on building sustainable long-term habits, not quick fixes

When teaching any of the 10 topics:
- Create step-by-step learning modules with clear, actionable takeaways
- Provide practical exercises and real-world applications
- Offer progress check-ins and celebrate financial wins
- Connect topics together to show how they build on each other
- Always emphasize that good financial habits take time to develop
- After completing one topic, suggest related topics they might find valuable

Remember: You're helping people build financial confidence and independence. Make complex topics accessible, celebrate small progress, and always focus on practical, actionable advice they can implement immediately!`,
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