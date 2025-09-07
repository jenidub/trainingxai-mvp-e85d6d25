import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Compass,
  GraduationCap,
  DollarSign,
  Globe,
  Music,
  Film,
  BookOpen,
  Plus,
  Sparkles,
  Bot,
  Zap,
  ChevronRight,
  ChevronDown,
  Smartphone,
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  Award,
  LayoutDashboard,
  Home
} from 'lucide-react';
import { CustomGPTManager } from './CustomGPTManager';

interface SidebarProps {
  onGPTSelect: (gpt: { id: string; name: string; type: 'prebuilt' | 'custom' }) => void;
  selectedGPT?: { id: string; name: string; type: 'prebuilt' | 'custom' } | null;
  onInterfaceChange: (interfaceType: 'chat' | 'prebuilt' | 'custom' | 'training' | 'dashboard' | 'platforms') => void;
  activeInterface: 'chat' | 'prebuilt' | 'custom' | 'training' | 'dashboard' | 'platforms';
  isDemo?: boolean;
}

const prebuiltGPTs = [
  {
    id: 'wizard-gary-payton',
    name: 'Wizard (Gary Payton)',
    description: 'Your global guide for everything',
    icon: Compass,
    category: 'General',
    popular: false
  },
  {
    id: 'family-night-agent',
    name: 'Family Night Agent',
    description: 'Create family storybooks',
    icon: BookOpen,
    category: 'Family'
  },
  {
    id: 'finance-agent',
    name: 'Finance Agent',
    description: 'Budget management & financial literacy',
    icon: DollarSign,
    category: 'Finance'
  },
  {
    id: 'movie-agent',
    name: 'Movie Agent',
    description: 'Turn ideas into short films',
    icon: Film,
    category: 'Creative'
  },
  {
    id: 'music-agent',
    name: 'Music Agent',
    description: 'Create beats, lyrics & soundtracks',
    icon: Music,
    category: 'Creative'
  },
  {
    id: 'notebooklm-practice',
    name: 'NotebookLM Practice',
    description: 'Level up your skills in NotebookLM',
    icon: BookOpen,
    category: 'Practice',
    popular: true
  },
  {
    id: 'spiral-study-buddy',
    name: 'Spiral the Study Buddy',
    description: 'Interactive help with school & soft skills',
    icon: GraduationCap,
    category: 'Education',
    popular: true
  },
  {
    id: 'website-agent',
    name: 'Website Agent',
    description: 'Build and publish websites',
    icon: Globe,
    category: 'Development'
  }
];

export const Sidebar = ({ onGPTSelect, selectedGPT, onInterfaceChange, activeInterface, isDemo = false }: SidebarProps) => {
  const handleGPTClick = (gpt: any) => {
    const gptData = { id: gpt.id, name: gpt.name, type: 'prebuilt' as const };
    onGPTSelect(gptData);
  };

  const handleHomeClick = () => {
    onInterfaceChange('chat');
  };

  return (
    <aside className="w-80 h-screen sticky top-0 border-r border-border bg-card/30 backdrop-blur-sm overflow-y-auto pt-20">
      <div className="p-6 space-y-6">
        {/* How It Works Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">The P2S Difference</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm text-foreground mb-1">Learn</h3>
                <p className="text-xs text-muted-foreground">Talk to interactive agents, get constant drills and scenarios.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm text-foreground mb-1">Apply</h3>
                <p className="text-xs text-muted-foreground">Test prompts directly in apps inside your Studio.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm text-foreground mb-1">Level Up</h3>
                <p className="text-xs text-muted-foreground">Earn badges, certificates, portfolio projects, and a take-home agent.</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Main Navigation */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">AI Studio</h2>
          
          {/* Home */}
          <Card 
            className={`p-3 border-2 hover:border-primary/40 transition-smooth cursor-pointer group ${
              activeInterface === 'chat' && !selectedGPT ? 'border-primary bg-primary/5' : 'border-primary/20'
            }`}
            onClick={handleHomeClick}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Home</h3>
                <p className="text-xs text-muted-foreground">Welcome & start here</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </div>
          </Card>
          
          {/* Dashboard */}
          <Card 
            className={`p-3 border-2 hover:border-primary/40 transition-smooth cursor-pointer group ${
              activeInterface === 'dashboard' ? 'border-primary bg-primary/5' : 'border-primary/20'
            }`}
            onClick={() => onInterfaceChange('dashboard')}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Dashboard</h3>
                <p className="text-xs text-muted-foreground">Progress & analytics</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </div>
          </Card>
          
          {/* Training Zone */}
          <Card 
            className={`p-3 border-2 hover:border-primary/40 transition-smooth cursor-pointer group ${
              activeInterface === 'training' ? 'border-primary bg-primary/5' : 'border-primary/20'
            }`}
            onClick={() => onInterfaceChange('training')}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Training Zone</h3>
                <p className="text-xs text-muted-foreground">Interactive learning</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </div>
          </Card>

          {/* Custom GPTs */}
          <Card 
            className={`p-3 border-2 hover:border-primary/40 transition-smooth cursor-pointer group ${
              activeInterface === 'custom' ? 'border-primary bg-primary/5' : 'border-primary/20'
            }`}
            onClick={() => onInterfaceChange('custom')}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Custom GPTs</h3>
                <p className="text-xs text-muted-foreground">Build custom agents</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </div>
          </Card>
          
          {/* Platform GPTs */}
          <Card 
            className={`p-3 border-2 hover:border-primary/40 transition-smooth cursor-pointer group ${
              activeInterface === 'prebuilt' ? 'border-primary bg-primary/5' : 'border-primary/20'
            }`}
            onClick={() => onInterfaceChange('prebuilt')}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Platform GPTs</h3>
                <p className="text-xs text-muted-foreground">Practice prompting skills</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </div>
          </Card>
        </div>

        <Separator />

        {/* AI Toolbox Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">AI Toolbox</h2>
          
          <Card 
            className={`p-3 border-2 hover:border-primary/40 transition-smooth cursor-pointer group ${
              activeInterface === 'platforms' ? 'border-primary bg-primary/5' : 'border-primary/20'
            }`}
            onClick={() => onInterfaceChange('platforms')}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Prompting Practice Zone</h3>
                <p className="text-xs text-muted-foreground">Prompt on top platforms</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </div>
          </Card>
        </div>

      </div>
    </aside>
  );
};