import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  Search, 
  Filter, 
  Star, 
  Compass,
  BookOpen,
  DollarSign,
  Film,
  Music,
  GraduationCap,
  Globe,
  Zap 
} from 'lucide-react';

interface PrebuiltGPT {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  popular?: boolean;
  rating?: number;
  usageCount?: number;
}

const prebuiltGPTs: PrebuiltGPT[] = [
  {
    id: 'wizard-gary-payton',
    name: 'Wizard (Gary Payton)',
    description: 'Your global guide for everything. Get expert advice on any topic with personalized responses.',
    icon: Compass,
    category: 'General',
    rating: 4.8,
    usageCount: 1200
  },
  {
    id: 'spiral-study-buddy',
    name: 'Spiral the Study Buddy',
    description: 'Interactive help with school & soft skills. Perfect for students of all ages.',
    icon: GraduationCap,
    category: 'Education',
    popular: true,
    rating: 4.9,
    usageCount: 850
  },
  {
    id: 'notebooklm-practice',
    name: 'NotebookLM Practice',
    description: 'Level up your skills in NotebookLM with interactive tutorials and practice sessions.',
    icon: BookOpen,
    category: 'Practice',
    popular: true,
    rating: 4.7,
    usageCount: 650
  },
  {
    id: 'family-night-agent',
    name: 'Family Night Agent',
    description: 'Create engaging family storybooks and plan memorable activities for all ages.',
    icon: BookOpen,
    category: 'Family',
    rating: 4.6,
    usageCount: 420
  },
  {
    id: 'finance-agent',
    name: 'Finance Agent',
    description: 'Budget management & financial literacy coach. Learn to manage money effectively.',
    icon: DollarSign,
    category: 'Finance',
    rating: 4.5,
    usageCount: 380
  },
  {
    id: 'movie-agent',
    name: 'Movie Agent',
    description: 'Turn your creative ideas into compelling short films with AI assistance.',
    icon: Film,
    category: 'Creative',
    rating: 4.4,
    usageCount: 320
  },
  {
    id: 'music-agent',
    name: 'Music Agent',
    description: 'Create beats, write lyrics & compose soundtracks for any project.',
    icon: Music,
    category: 'Creative',
    rating: 4.3,
    usageCount: 290
  },
  {
    id: 'website-agent',
    name: 'Website Agent',
    description: 'Build and publish professional websites without coding knowledge.',
    icon: Globe,
    category: 'Development',
    rating: 4.2,
    usageCount: 510
  }
];

const categories = ['All', 'General', 'Education', 'Practice', 'Family', 'Finance', 'Creative', 'Development'];

interface PrebuiltGPTsInterfaceProps {
  onGPTSelect: (gpt: { id: string; name: string; type: 'prebuilt' }) => void;
}

export const PrebuiltGPTsInterface = ({ onGPTSelect }: PrebuiltGPTsInterfaceProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'name'>('popular');

  const filteredGPTs = prebuiltGPTs
    .filter(gpt => {
      const matchesSearch = gpt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gpt.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || gpt.category === selectedCategory;
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

  const handleGPTClick = (gpt: PrebuiltGPT) => {
    onGPTSelect({ id: gpt.id, name: gpt.name, type: 'prebuilt' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Prebuilt GPTs</h1>
        </div>
        <p className="text-muted-foreground">
          Choose from our collection of specialized AI assistants ready to help with specific tasks.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search GPTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Sort by: {sortBy === 'popular' ? 'Usage' : sortBy === 'rating' ? 'Rating' : 'Name'}
          </Button>
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

      {/* GPT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGPTs.map((gpt) => {
          const IconComponent = gpt.icon;
          return (
            <Card 
              key={gpt.id} 
              className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/20"
              onClick={() => handleGPTClick(gpt)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    {gpt.popular && (
                      <Badge variant="default" className="gap-1 h-5">
                        <Zap className="h-2.5 w-2.5" />
                        Popular
                      </Badge>
                    )}
                    <Badge variant="outline" className="h-5">
                      {gpt.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                  {gpt.name}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {gpt.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {gpt.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{gpt.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {gpt.usageCount?.toLocaleString()} uses
                  </div>
                </div>
                <Button className="w-full mt-3" size="sm">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredGPTs.length === 0 && (
        <Card className="p-8 text-center">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No GPTs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find the perfect GPT for your needs.
          </p>
        </Card>
      )}
    </div>
  );
};