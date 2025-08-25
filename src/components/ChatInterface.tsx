import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, Code, FileText, Image } from 'lucide-react';
import NotebookLMPractice from './NotebookLMPractice';
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
  const { user } = useAuth();
  const { toast } = useToast();

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

      // Simulate AI response (replace with actual AI integration)
      setTimeout(async () => {
        try {
          const aiResponse = generateAIResponse(userMessage, currentSession.gpt_name);
          await saveMessage({
            session_id: currentSession.id,
            role: 'assistant',
            content: aiResponse,
          });
        } catch (error) {
          console.error('Error saving AI response:', error);
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const generateAIResponse = (userMessage: string, gptName: string): string => {
    const responses = {
      'Cody the Coding Companion': `Great question about coding! As your coding companion, I'd suggest breaking this down step by step. Let me help you with that implementation.`,
      'Alex the AI Trainer': `Excellent topic for AI learning! Let me explain this concept in a way that builds your understanding progressively.`,
      'Maya the Creative Assistant': `I love the creative direction you're thinking! Let's explore some innovative approaches to bring your vision to life.`,
      'Milo the Math Mentor': `Perfect math problem! Let me walk you through the solution methodology step by step.`,
      'Sophie the Communication Coach': `That's a great communication challenge! Let me help you craft a clear and effective approach.`,
    };

    return responses[gptName as keyof typeof responses] || 
           `Thanks for your message! As ${gptName}, I'm here to help you with specialized guidance and expertise.`;
  };

  // Handle practice modes
  if (selectedGPT?.id === 'notebooklm-practice') {
    return <NotebookLMPractice />;
  }

  if (!selectedGPT) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Welcome Area */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5">
          <div className="text-center max-w-2xl px-6">
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-2xl gradient-primary mb-4 shadow-glow">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Welcome to Prompt to Success
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Your AI-powered coding and training environment. Practice with prebuilt GPTs or create your own custom AI assistants.
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
                <h3 className="font-semibold mb-2">Prebuilt GPTs</h3>
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

            <div className="flex flex-wrap items-center justify-center gap-2">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="border-b border-border p-4 bg-card/50">
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
              <p className="text-sm">{msg.content}</p>
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
                <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
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