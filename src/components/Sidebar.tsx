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
  Award
} from 'lucide-react';
import { CustomGPTManager } from './CustomGPTManager';

interface SidebarProps {
  onGPTSelect: (gpt: { id: string; name: string; type: 'prebuilt' | 'custom' }) => void;
  selectedGPT?: { id: string; name: string; type: 'prebuilt' | 'custom' } | null;
}

const prebuiltGPTs = [
  {
    id: 'notebooklm-practice',
    name: 'NotebookLM Practice',
    description: 'Level up your skills in NotebookLM',
    icon: BookOpen,
    category: 'Practice',
    popular: true
  },
  {
    id: 'wizard-gary-payton',
    name: 'Wizard (Gary Payton)',
    description: 'Your global guide for everything',
    icon: Compass,
    category: 'General',
    popular: false
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
    id: 'finance-agent',
    name: 'Finance Agent',
    description: 'Budget management & financial literacy',
    icon: DollarSign,
    category: 'Finance'
  },
  {
    id: 'website-agent',
    name: 'Website Agent',
    description: 'Build and publish websites',
    icon: Globe,
    category: 'Development'
  },
  {
    id: 'music-agent',
    name: 'Music Agent',
    description: 'Create beats, lyrics & soundtracks',
    icon: Music,
    category: 'Creative'
  },
  {
    id: 'movie-agent',
    name: 'Movie Agent',
    description: 'Turn ideas into short films',
    icon: Film,
    category: 'Creative'
  },
  {
    id: 'family-night-agent',
    name: 'Family Night Agent',
    description: 'Create family storybooks',
    icon: BookOpen,
    category: 'Family'
  }
];

export const Sidebar = ({ onGPTSelect, selectedGPT }: SidebarProps) => {
  const handleGPTClick = (gpt: any) => {
    const gptData = { id: gpt.id, name: gpt.name, type: 'prebuilt' as const };
    onGPTSelect(gptData);
  };

  return (
    <aside className="w-80 h-[calc(100vh-4rem)] border-r border-border bg-card/30 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        {/* Custom GPT Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Custom GPTs</h2>
            <CustomGPTManager onGPTSelect={onGPTSelect} />
          </div>
          
          <Card className="p-4 gradient-muted border-primary/20 hover:border-primary/40 transition-smooth cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">App Builder</h3>
                <p className="text-xs text-muted-foreground">Create apps step by step</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </div>
          </Card>
          
          <Card className="p-4 gradient-muted border-primary/20 hover:border-primary/40 transition-smooth cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Build Your Own GPT</h3>
                <p className="text-xs text-muted-foreground">Customize AI for your needs</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </div>
          </Card>
        </div>

        <Separator />

        {/* Prebuilt GPTs Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Prebuilt GPTs</h2>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedGPT?.type === 'prebuilt' ? selectedGPT.name : 'Select a GPT'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-80 overflow-y-auto bg-popover border border-border">
              {prebuiltGPTs.map((gpt) => (
                <DropdownMenuItem
                  key={gpt.id}
                  onClick={() => handleGPTClick(gpt)}
                  className="p-3 cursor-pointer flex items-start gap-3 hover:bg-accent"
                >
                  <div className="p-1.5 rounded-md bg-muted">
                    <gpt.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">{gpt.name}</h3>
                      {gpt.popular && (
                        <Badge variant="secondary" className="text-[10px] py-0 px-1 h-3.5">
                          <Zap className="h-2 w-2 mr-0.5" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-tight mb-1">{gpt.description}</p>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">{gpt.category}</Badge>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator />

        {/* How It Works Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">How It Works</h2>
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

        {/* Sign Up for Our Workshops Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Sign Up for Our Workshops</h2>
          </div>
          
          <div className="space-y-2">
            <Card className="p-3 cursor-pointer hover:border-primary/30 transition-smooth group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">Prompting Basics</h3>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">paid</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Your entry point, learn core skills</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 cursor-pointer hover:border-primary/30 transition-smooth group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">Advanced Prompting</h3>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">paid</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Learn to earn from your projects</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 cursor-pointer hover:border-primary/30 transition-smooth group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">Educator Certification</h3>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">paid</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Empower yourself and others.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </aside>
  );
};