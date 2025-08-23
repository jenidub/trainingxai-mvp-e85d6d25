import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, Code, FileText, Image } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI training assistant. Choose a GPT from the sidebar to start practicing, or create your own custom GPT. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'assistant',
        content: 'That\'s a great question! Let me help you with that. This is where the AI would provide a detailed response based on the selected GPT\'s expertise.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Welcome Area */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5">
        <div className="text-center max-w-2xl px-6">
          <div className="mb-6">
            <div className="inline-flex p-4 rounded-2xl gradient-primary mb-4 shadow-glow">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Welcome to TrainingX.ai
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Your AI-powered coding and training environment. Practice with prebuilt GPTs or create your own custom AI assistants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 hover:shadow-card transition-smooth cursor-pointer group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth w-fit mb-3">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Prebuilt GPTs</h3>
              <p className="text-sm text-muted-foreground">Expert AI assistants for coding, learning, and creativity</p>
            </Card>

            <Card className="p-4 hover:shadow-card transition-smooth cursor-pointer group">
              <div className="p-2 rounded-lg bg-brand-secondary/10 group-hover:bg-brand-secondary/20 transition-smooth w-fit mb-3">
                <Code className="h-5 w-5 text-brand-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Custom GPTs</h3>
              <p className="text-sm text-muted-foreground">Build specialized AI agents for your unique needs</p>
            </Card>

            <Card className="p-4 hover:shadow-card transition-smooth cursor-pointer group">
              <div className="p-2 rounded-lg bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-smooth w-fit mb-3">
                <FileText className="h-5 w-5 text-brand-accent" />
              </div>
              <h3 className="font-semibold mb-2">Training Mode</h3>
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

      {/* Chat Messages */}
      <div className="flex-1 max-h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.type === 'assistant' && (
              <div className="p-2 rounded-lg bg-primary text-white">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <Card className={`max-w-[70%] p-4 ${
              msg.type === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card'
            }`}>
              <p className="text-sm">{msg.content}</p>
            </Card>
            {msg.type === 'user' && (
              <div className="p-2 rounded-lg bg-muted">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-6">
        <div className="flex gap-3">
          <Input
            placeholder="Type your message or question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            className="gradient-primary text-white border-0 shadow-primary"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Select a GPT from the sidebar to start a focused conversation
        </p>
      </div>
    </div>
  );
};