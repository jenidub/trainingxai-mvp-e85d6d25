import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Zap, Globe, Bot, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  level?: number;
}

const NotebookLMPractice = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const { toast } = useToast();

  const levels = [
    {
      id: 1,
      title: "Information Generation",
      description: "Master the art of writing prompts to generate informative content",
      icon: MessageSquare,
      color: "bg-blue-500",
      tasks: [
        "Write a prompt to explain a complex topic simply",
        "Create a prompt for generating a comprehensive guide",
        "Craft a prompt for comparing different concepts"
      ]
    },
    {
      id: 2,
      title: "Website & App Building",
      description: "Learn to prompt AI for building websites and applications",
      icon: Globe,
      color: "bg-green-500",
      tasks: [
        "Write prompts for creating website layouts",
        "Generate prompts for app functionality",
        "Master prompts for responsive design"
      ]
    },
    {
      id: 3,
      title: "AI Agent Creation",
      description: "Advanced prompting to create and configure AI agents",
      icon: Bot,
      color: "bg-purple-500",
      tasks: [
        "Design prompts for agent personalities",
        "Create specialized agent capabilities",
        "Build complete AI agent systems"
      ]
    }
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = { role: 'user', content: message, level: currentLevel };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('notebooklm-chat', {
        body: { 
          message,
          level: currentLevel,
          context: messages
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        level: currentLevel
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeLevel = () => {
    if (!completedLevels.includes(currentLevel)) {
      setCompletedLevels(prev => [...prev, currentLevel]);
      toast({
        title: "Level Complete!",
        description: `You've mastered Level ${currentLevel}: ${levels[currentLevel - 1].title}`,
      });
    }
  };

  const switchLevel = (levelId: number) => {
    if (levelId === 1 || completedLevels.includes(levelId - 1)) {
      setCurrentLevel(levelId);
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <h2 className="font-semibold">Prompting Practice Space</h2>
            <p className="text-sm text-muted-foreground">Master AI prompting through progressive levels</p>
          </div>
          <Badge variant="secondary" className="ml-auto">Practice Mode</Badge>
        </div>
      </div>

      {/* Level Selection */}
      <div className="p-4 border-b bg-muted/30">
        <h3 className="text-sm font-medium mb-3">Learning Path</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {levels.map((level) => {
            const isActive = currentLevel === level.id;
            const isCompleted = completedLevels.includes(level.id);
            const isLocked = level.id > 1 && !completedLevels.includes(level.id - 1);
            const IconComponent = level.icon;

            return (
              <Card 
                key={level.id}
                className={`p-3 cursor-pointer transition-all ${
                  isActive ? 'ring-2 ring-primary bg-primary/5' : 
                  isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                }`}
                onClick={() => !isLocked && switchLevel(level.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${level.color} flex items-center justify-center`}>
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-white" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <IconComponent className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{level.title}</h4>
                    <Badge variant="outline" className="text-xs mt-1">
                      Level {level.id}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{level.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Current Level Info */}
      <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-b">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Level {currentLevel}: {levels[currentLevel - 1].title}
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
              {levels[currentLevel - 1].description}
            </p>
            <div className="space-y-1">
              {levels[currentLevel - 1].tasks.map((task, index) => (
                <div key={index} className="text-xs text-blue-600 dark:text-blue-400">
                  • {task}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Ready to practice Level {currentLevel}!</h3>
            <p className="text-sm text-muted-foreground">
              Start by asking questions or writing prompts related to {levels[currentLevel - 1].title.toLowerCase()}.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <Card key={index} className={`p-4 ${message.role === 'user' ? 'ml-8 bg-primary/5' : 'mr-8'}`}>
                <div className="font-medium text-sm mb-2 flex items-center gap-2">
                  {message.role === 'user' ? 'You' : 'AI Instructor'}
                  {message.level && (
                    <Badge variant="outline" className="text-xs">
                      Level {message.level}
                    </Badge>
                  )}
                </div>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </Card>
            ))}
            {isLoading && (
              <Card className="mr-8 p-4">
                <div className="font-medium text-sm mb-2">AI Instructor</div>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">●</div>
                  <div className="animate-pulse delay-100">●</div>
                  <div className="animate-pulse delay-200">●</div>
                  <span className="text-sm text-muted-foreground ml-2">Analyzing your prompt...</span>
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background/50">
        <div className="flex gap-2 mb-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Practice ${levels[currentLevel - 1].title.toLowerCase()} prompts...`}
            className="flex-1 min-h-[40px] max-h-32 resize-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              size="sm"
            >
              Send
            </Button>
            {messages.length > 2 && !completedLevels.includes(currentLevel) && (
              <Button 
                onClick={completeLevel}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Complete Level
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Level {currentLevel}: Focus on {levels[currentLevel - 1].title.toLowerCase()}
        </p>
      </div>
    </div>
  );
};

export default NotebookLMPractice;