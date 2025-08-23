import { Button } from '@/components/ui/button';
import { Sparkles, User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <div className="gradient-primary p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-brand-accent bg-clip-text text-transparent">
              TrainingX.ai
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">AI Training Platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button size="sm" className="gradient-primary text-white border-0 shadow-primary">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};