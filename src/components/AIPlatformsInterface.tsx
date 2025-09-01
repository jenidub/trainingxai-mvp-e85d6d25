import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, BookOpen, Presentation } from 'lucide-react';
import { PlatformReadyDialog } from './PlatformReadyDialog';

interface AIPlatform {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  url: string;
}

const aiPlatforms: AIPlatform[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s conversational AI for natural language processing and creative tasks.',
    icon: Bot,
    category: 'Conversational AI',
    url: 'https://chat.openai.com'
  },
  {
    id: 'claude',
    name: 'Claude AI',
    description: 'Anthropic\'s AI assistant focused on helpful, harmless, and honest interactions.',
    icon: Brain,
    category: 'AI Assistant',
    url: 'https://claude.ai'
  },
  {
    id: 'notebooklm',
    name: 'Notebook LM',
    description: 'Google\'s AI-powered note-taking and research assistant for knowledge work.',
    icon: BookOpen,
    category: 'Research AI',
    url: 'https://notebooklm.google.com'
  },
  {
    id: 'gamma',
    name: 'Gamma',
    description: 'AI-powered presentation and document creation platform for visual storytelling.',
    icon: Presentation,
    category: 'Creative AI',
    url: 'https://gamma.app'
  }
];

interface AIPlatformsInterfaceProps {
  isDemo?: boolean;
}

export const AIPlatformsInterface = ({ isDemo = false }: AIPlatformsInterfaceProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<AIPlatform | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePlatformSelect = (platform: AIPlatform) => {
    setSelectedPlatform(platform);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">AI Platform Practice</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Put your newfound prompting skills to use on today's top AI platforms
          </p>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {aiPlatforms.map((platform) => (
            <Card 
              key={platform.id} 
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/40 cursor-pointer"
              onClick={() => handlePlatformSelect(platform)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <platform.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {platform.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {platform.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {platform.description}
                </CardDescription>
                
                <Button 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlatformSelect(platform);
                  }}
                >
                  Get Ready
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Practice your prompting skills across different AI platforms and discover their unique capabilities
          </p>
        </div>
      </div>

      {/* Platform Ready Dialog */}
      <PlatformReadyDialog 
        platform={selectedPlatform}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};