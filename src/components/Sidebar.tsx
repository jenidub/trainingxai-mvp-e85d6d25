import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  ChevronRight
} from 'lucide-react';
import { CustomGPTManager } from './CustomGPTManager';

interface SidebarProps {
  onGPTSelect: (gpt: { id: string; name: string; type: 'prebuilt' | 'custom' }) => void;
  selectedGPT?: { id: string; name: string; type: 'prebuilt' | 'custom' } | null;
}

const prebuiltGPTs = [
  {
    id: 'wizard-gary-payton',
    name: 'Wizard (Gary Payton)',
    description: 'Your global guide for everything',
    icon: Compass,
    category: 'General',
    popular: true
  },
  {
    id: 'spiral-study-buddy',
    name: 'Spiral Study Buddy',
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
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Build Your Own GPT</h3>
                <p className="text-xs text-muted-foreground">Customize AI for your specific needs</p>
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
          
          <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
            {prebuiltGPTs.map((gpt) => (
              <Card
                key={gpt.id}
                className={`p-2 cursor-pointer transition-smooth hover:shadow-card border-border/50 ${
                  selectedGPT?.id === gpt.id 
                    ? 'border-primary bg-primary/5 shadow-primary' 
                    : 'hover:border-primary/30'
                }`}
                onClick={() => handleGPTClick(gpt)}
              >
                <div className="flex items-start gap-2">
                  <div className={`p-1.5 rounded-md transition-smooth ${
                    selectedGPT?.id === gpt.id 
                      ? 'bg-primary text-white' 
                      : 'bg-muted group-hover:bg-primary/10'
                  }`}>
                    <gpt.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-medium text-xs truncate">{gpt.name}</h3>
                      {gpt.popular && (
                        <Badge variant="secondary" className="text-[10px] py-0 px-1 h-3.5">
                          <Zap className="h-2 w-2 mr-0.5" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">{gpt.description}</p>
                    <Badge variant="outline" className="text-[10px] mt-1 py-0 px-1.5 h-4">{gpt.category}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};