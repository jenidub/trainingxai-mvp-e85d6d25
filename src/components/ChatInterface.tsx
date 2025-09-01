import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Bot, User, Sparkles, Code, FileText, Image, Type } from 'lucide-react';
import NotebookLMPractice from './NotebookLMPractice';
import PromptingImpactSlider from './PromptingImpactSlider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatSession {
  id: string;
  gpt_type: string;
  gpt_id: string;
  gpt_name: string;
  title: string;
  created_at: string;
  thread_id?: string;
}

interface ChatInterfaceProps {
  selectedGPT?: {
    id: string;
    name: string;
    type: 'prebuilt' | 'custom';
  } | null;
  onInterfaceChange?: (interfaceType: 'prebuilt' | 'custom' | 'training') => void;
}

export const ChatInterface = ({ selectedGPT, onInterfaceChange }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('chat-text-size') || 'text-sm';
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Save text size preference to localStorage
  useEffect(() => {
    localStorage.setItem('chat-text-size', textSize);
  }, [textSize]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    }
  }, [currentSession]);

  // Create new session when GPT is selected
  useEffect(() => {
    if (selectedGPT && user) {
      createNewSession(selectedGPT);
    }
  }, [selectedGPT, user]);

  const createNewSession = async (gpt: { id: string; name: string; type: 'prebuilt' | 'custom' }) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user?.id,
          gpt_type: gpt.type,
          gpt_id: gpt.id,
          gpt_name: gpt.name,
          title: `Chat with ${gpt.name}`,
        })
        .select()
        .single();

      if (error) throw error;
      setCurrentSession(data);
      setMessages([]);
      
      // Add welcome message
      const welcomeMessage = {
        session_id: data.id,
        role: 'assistant' as const,
        content: `Hello! I'm ${gpt.name}. How can I help you today?`,
      };
      
      await saveMessage(welcomeMessage);
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to start new conversation",
        variant: "destructive",
      });
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessage = async (messageData: { session_id: string; role: 'user' | 'assistant'; content: string }) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      setMessages(prev => [...prev, data as Message]);
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentSession || !user) return;
    
    setLoading(true);
    const userMessage = message;
    setMessage('');

    try {
      // Save user message
      await saveMessage({
        session_id: currentSession.id,
        role: 'user',
        content: userMessage,
      });

      // Get AI response from edge function
      const aiResponse = await getAIResponse(userMessage, currentSession);
      await saveMessage({
        session_id: currentSession.id,
        role: 'assistant',
        content: aiResponse,
      });
    } catch (error) {
      console.error('Error in conversation:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      
      // Save an error message to the conversation
      try {
        await saveMessage({
          session_id: currentSession.id,
          role: 'assistant',
          content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        });
      } catch (saveError) {
        console.error('Error saving error message:', saveError);
      }
    } finally {
      setLoading(false);
    }
  };

  const getAIResponse = async (userMessage: string, session: ChatSession): Promise<string> => {
    try {
      // Get custom GPT data if needed
      let assistantId = null;
      if (session.gpt_type === 'custom') {
        const { data: customGPT } = await supabase
          .from('custom_gpts')
          .select('assistant_id')
          .eq('id', session.gpt_id)
          .single();
        
        assistantId = customGPT?.assistant_id || null;
      }

      // Call the chat completion edge function (now using Assistants API)
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: {
          message: userMessage,
          gptName: session.gpt_name,
          gptType: session.gpt_type,
          assistantId: assistantId,
          threadId: session.thread_id
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (!data.success) {
        throw new Error(data.error || 'AI response failed');
      }

      // Update session with thread_id if it was created
      if (data.thread_id && !session.thread_id) {
        await supabase
          .from('chat_sessions')
          .update({ thread_id: data.thread_id })
          .eq('id', session.id);
        
        // Update local session state
        setCurrentSession(prev => prev ? { ...prev, thread_id: data.thread_id } : null);
      }

      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
  };

  // Handle practice modes
  if (selectedGPT?.id === 'notebooklm-practice') {
    return <NotebookLMPractice />;
  }

  if (!selectedGPT) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Welcome Area */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5 pt-8">
          <div className="text-center max-w-2xl px-6">
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-2xl gradient-primary mb-4 shadow-glow">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Welcome to Prompt to Success
              </h1>
              <p className="text-xl text-muted-foreground mb-4 italic">
                We Take the 'I Don't Know' Out of AI
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Your AI-powered coding and training environment. Practice with platform GPTs or create your own custom AI assistants.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card 
                className="p-4 hover:shadow-card transition-smooth cursor-pointer group"
                onClick={() => onInterfaceChange?.('prebuilt')}
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth w-fit mb-3">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Platform GPTs</h3>
                <p className="text-sm text-muted-foreground">Expert AI assistants for coding, learning, and creativity</p>
              </Card>

              <Card 
                className="p-4 hover:shadow-card transition-smooth cursor-pointer group"
                onClick={() => onInterfaceChange?.('custom')}
              >
                <div className="p-2 rounded-lg bg-brand-secondary/10 group-hover:bg-brand-secondary/20 transition-smooth w-fit mb-3">
                  <Code className="h-5 w-5 text-brand-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Custom GPTs</h3>
                <p className="text-sm text-muted-foreground">Build specialized AI agents for your unique needs</p>
              </Card>

              <Card 
                className="p-4 hover:shadow-card transition-smooth cursor-pointer group"
                onClick={() => onInterfaceChange?.('training')}
              >
                <div className="p-2 rounded-lg bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-smooth w-fit mb-3">
                  <FileText className="h-5 w-5 text-brand-accent" />
                </div>
                <h3 className="font-semibold mb-2">Training Zone</h3>
                <p className="text-sm text-muted-foreground">Interactive learning with real-time feedback</p>
              </Card>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Code className="h-3 w-3 mr-1" />
                Coding Focus
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Image className="h-3 w-3 mr-1" />
                Visual Learning
              </Badge>
            </div>

            <PromptingImpactSlider 
              initialYears={2}
              ctaHref="/auth"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="border-b border-border p-4 bg-card/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{selectedGPT.name}</h2>
              <p className="text-sm text-muted-foreground">
                {currentSession ? 'Ready to chat' : 'Starting conversation...'}
              </p>
            </div>
          </div>
          
          {/* Text Size Selector */}
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <Select value={textSize} onValueChange={setTextSize}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-xs">Small</SelectItem>
                <SelectItem value="text-sm">Medium</SelectItem>
                <SelectItem value="text-base">Large</SelectItem>
                <SelectItem value="text-lg">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="p-2 rounded-lg bg-primary text-white">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <Card className={`max-w-[70%] p-4 ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card'
            }`}>
              <p className={textSize}>{msg.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {new Date(msg.created_at).toLocaleTimeString()}
              </p>
            </Card>
            {msg.role === 'user' && (
              <div className="p-2 rounded-lg bg-muted">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="p-2 rounded-lg bg-primary text-white">
              <Bot className="h-4 w-4" />
            </div>
            <Card className="max-w-[70%] p-4 bg-card">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">●</div>
                <div className="animate-pulse delay-100">●</div>
                <div className="animate-pulse delay-200">●</div>
                <span className={`${textSize} text-muted-foreground ml-2`}>Thinking...</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-6">
        <div className="flex gap-3">
          <Input
            placeholder={`Chat with ${selectedGPT.name}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
            className="flex-1"
            disabled={loading || !currentSession}
          />
          <Button 
            onClick={handleSendMessage}
            className="gradient-primary text-white border-0 shadow-primary"
            disabled={!message.trim() || loading || !currentSession}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Your conversations are automatically saved to your account
        </p>
      </div>
    </div>
  );
};