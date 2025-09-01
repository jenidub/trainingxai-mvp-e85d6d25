import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bot, 
  Search, 
  Filter, 
  Star, 
  Brain,
  BookOpen,
  Presentation,
  Zap
} from 'lucide-react';
import { PlatformReadyDialog } from './PlatformReadyDialog';

interface AIPlatform {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  url: string;
  popular?: boolean;
  rating?: number;
  usageCount?: number;
}

const aiPlatforms: AIPlatform[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s conversational AI for natural language processing and creative tasks.',
    icon: Bot,
    category: 'Generative AI',
    url: 'https://chat.openai.com',
    popular: true,
    rating: 4.8,
    usageCount: 2400
  },
  {
    id: 'claude',
    name: 'Claude AI',
    description: 'Anthropic\'s AI assistant focused on helpful, harmless, and honest interactions.',
    icon: Brain,
    category: 'Generative AI',
    url: 'https://claude.ai',
    popular: true,
    rating: 4.7,
    usageCount: 1850
  },
  {
    id: 'notebooklm',
    name: 'Notebook LM',
    description: 'Google\'s AI-powered note-taking and research assistant for knowledge work.',
    icon: BookOpen,
    category: 'Agentic AI',
    url: 'https://notebooklm.google.com',
    rating: 4.6,
    usageCount: 1200
  },
  {
    id: 'gamma',
    name: 'Gamma',
    description: 'AI-powered presentation and document creation platform for visual storytelling.',
    icon: Presentation,
    category: 'Generative AI',
    url: 'https://gamma.app',
    rating: 4.5,
    usageCount: 950
  }
];

const categories = ['All', 'Generative AI', 'Agentic AI'];

interface AIPlatformsInterfaceProps {
  isDemo?: boolean;
}

export const AIPlatformsInterface = ({ isDemo = false }: AIPlatformsInterfaceProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'name'>('popular');
  const [selectedPlatform, setSelectedPlatform] = useState<AIPlatform | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredPlatforms = aiPlatforms
    .filter(platform => {
      const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          platform.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || platform.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default: // popular
          return (b.usageCount || 0) - (a.usageCount || 0);
      }
    });

  const handlePlatformClick = (platform: AIPlatform) => {
    setSelectedPlatform(platform);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">AI Platform Practice</h1>
        </div>
        <p className="text-muted-foreground">
          Put your newfound prompting skills to use on today's top AI platforms
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search platforms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Sort by: {sortBy === 'popular' ? 'Usage' : sortBy === 'rating' ? 'Rating' : 'Name'}
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-8"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlatforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <Card 
              key={platform.id} 
              className="hover:shadow-lg transition-all group border-2 cursor-pointer hover:border-primary/20"
              onClick={() => handlePlatformClick(platform)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    {platform.popular && (
                      <Badge variant="default" className="gap-1 h-5">
                        <Zap className="h-2.5 w-2.5" />
                        Popular
                      </Badge>
                    )}
                    <Badge variant="outline" className="h-5">
                      {platform.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                  {platform.name}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {platform.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {platform.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{platform.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {platform.usageCount?.toLocaleString()} uses
                  </div>
                </div>
                <Button 
                  className="w-full mt-3" 
                  size="sm"
                  disabled={isDemo}
                >
                  {isDemo ? 'Demo Mode' : 'Get Ready'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPlatforms.length === 0 && (
        <Card className="p-8 text-center">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No platforms found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find the perfect platform for your needs.
          </p>
        </Card>
      )}

      {/* Platform Ready Dialog */}
      <PlatformReadyDialog 
        platform={selectedPlatform}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};