import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Send, Bot, User, Sparkles, Code, FileText, Image, Lock, Crown, Star } from 'lucide-react';
import NotebookLMPractice from './NotebookLMPractice';

interface DemoChatInterfaceProps {
  selectedGPT?: {
    id: string;
    name: string;
    type: 'prebuilt' | 'custom';
  } | null;
  onInterfaceChange?: (interfaceType: 'prebuilt' | 'custom' | 'training') => void;
  onUpgrade: () => void;
}

export const DemoChatInterface = ({ selectedGPT, onInterfaceChange, onUpgrade }: DemoChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const handleChatAttempt = () => {
    setShowUpgradeDialog(true);
  };

  // Handle practice modes
  if (selectedGPT?.id === 'notebooklm-practice') {
    return (
      <div className="relative">
        <NotebookLMPractice />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <Card className="p-6 max-w-md text-center border-2 border-primary">
            <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
            <p className="text-muted-foreground mb-4">
              Interactive NotebookLM practice is available for premium users only.
            </p>
            <Button onClick={onUpgrade} className="gradient-primary text-white border-0">
              Upgrade to Premium
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedGPT) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-brand-accent/10 border-b border-border p-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Demo Mode</span>
              <Badge variant="secondary" className="text-xs">Limited Access</Badge>
            </div>
            <Button 
              size="sm" 
              onClick={onUpgrade}
              className="gradient-primary text-white border-0"
            >
              <Crown className="h-3 w-3 mr-1" />
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* Welcome Area */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5">
          <div className="text-center max-w-2xl px-6">
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-2xl gradient-primary mb-4 shadow-glow">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Welcome to Prompt to Success Demo
              </h1>
              <p className="text-xl text-muted-foreground mb-4 italic">
                We Take the 'I Don't Know' Out of AI
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Explore our AI-powered training platform. Upgrade to unlock full chat functionality and premium features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card 
                className="p-4 hover:shadow-card transition-smooth cursor-pointer group relative"
                onClick={() => onInterfaceChange?.('prebuilt')}
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth w-fit mb-3">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Prebuilt GPTs</h3>
                <p className="text-sm text-muted-foreground">Expert AI assistants for coding, learning, and creativity</p>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="h-2 w-2 mr-1" />
                    Demo
                  </Badge>
                </div>
              </Card>

              <Card 
                className="p-4 hover:shadow-card transition-smooth cursor-pointer group relative"
                onClick={() => onInterfaceChange?.('custom')}
              >
                <div className="p-2 rounded-lg bg-brand-secondary/10 group-hover:bg-brand-secondary/20 transition-smooth w-fit mb-3">
                  <Code className="h-5 w-5 text-brand-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Custom GPTs</h3>
                <p className="text-sm text-muted-foreground">Build specialized AI agents for your unique needs</p>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="h-2 w-2 mr-1" />
                    Demo
                  </Badge>
                </div>
              </Card>

              <Card 
                className="p-4 hover:shadow-card transition-smooth cursor-pointer group relative"
                onClick={() => onInterfaceChange?.('training')}
              >
                <div className="p-2 rounded-lg bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-smooth w-fit mb-3">
                  <FileText className="h-5 w-5 text-brand-accent" />
                </div>
                <h3 className="font-semibold mb-2">Training Zone</h3>
                <p className="text-sm text-muted-foreground">Interactive learning with real-time feedback</p>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    <Lock className="h-2 w-2 mr-1" />
                    Demo
                  </Badge>
                </div>
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

            <Card className="p-4 bg-gradient-to-r from-primary/5 to-brand-accent/5 border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Unlock Full Access</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create an account to access all features, save your progress, and start training with AI.
              </p>
              <Button onClick={onUpgrade} className="w-full gradient-primary text-white border-0">
                Sign Up for Free
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-brand-accent/10 border-b border-border p-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Demo Mode</span>
            <Badge variant="secondary" className="text-xs">Chat Disabled</Badge>
          </div>
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="gradient-primary text-white border-0"
          >
            <Crown className="h-3 w-3 mr-1" />
            Upgrade Now
          </Button>
        </div>
      </div>

      {/* Chat Header */}
      <div className="border-b border-border p-4 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">{selectedGPT.name}</h2>
            <p className="text-sm text-muted-foreground">Demo preview - Chat unavailable</p>
          </div>
        </div>
      </div>

      {/* Demo Chat Preview */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
        {/* Sample messages to show what the interface looks like */}
        <div className="flex gap-3 justify-start">
          <div className="p-2 rounded-lg bg-primary text-white">
            <Bot className="h-4 w-4" />
          </div>
          <Card className="max-w-[70%] p-4 bg-card opacity-60">
            <p className="text-sm">Hello! I'm {selectedGPT.name}. How can I help you today?</p>
            <p className="text-xs opacity-70 mt-2">Demo message</p>
          </Card>
        </div>

        <div className="flex gap-3 justify-end">
          <Card className="max-w-[70%] p-4 bg-primary text-primary-foreground opacity-60">
            <p className="text-sm">This is what your messages would look like</p>
            <p className="text-xs opacity-70 mt-2">Demo message</p>
          </Card>
          <div className="p-2 rounded-lg bg-muted">
            <User className="h-4 w-4" />
          </div>
        </div>

        {/* Overlay for chat restriction */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <Card className="p-6 max-w-sm text-center border-2 border-primary">
            <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chat Feature Locked</h3>
            <p className="text-muted-foreground mb-4">
              Create a free account to start chatting with our AI assistants and unlock all features.
            </p>
            <Button onClick={onUpgrade} className="w-full gradient-primary text-white border-0 mb-2">
              Sign Up for Free
            </Button>
            <Button 
              variant="outline" 
              onClick={handleChatAttempt}
              className="w-full"
            >
              Learn More
            </Button>
          </Card>
        </div>
      </div>

      {/* Input Area - Disabled */}
      <div className="border-t border-border p-6 bg-muted/30">
        <div className="flex gap-3 opacity-50">
          <Input
            placeholder="Chat is disabled in demo mode..."
            className="flex-1"
            disabled
          />
          <Button 
            className="gradient-primary text-white border-0"
            disabled
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          <Lock className="h-3 w-3 inline mr-1" />
          Sign up to unlock chat functionality and save your conversations
        </p>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Unlock Full Access
            </DialogTitle>
            <DialogDescription className="text-left space-y-3">
              <p>Get unlimited access to all features with a free Prompt to Success account:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Chat with all AI assistants
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Create custom GPTs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Interactive training modules
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Progress tracking and analytics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Save and export your work
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button onClick={onUpgrade} className="flex-1 gradient-primary text-white border-0">
              Sign Up for Free
            </Button>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Continue Demo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};