import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Zap,
  Crown,
  ChevronDown
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
  isPremium?: boolean;
}

const prebuiltGPTs: PrebuiltGPT[] = [
  // Free agents (available to all registered members)
  {
    id: 'spiral-study-buddy',
    name: 'Spiral the Study Buddy',
    description: 'Comprehensive K-12 homework helper across all subjects. Math, science, English, history & more - tailored by grade level.',
    icon: GraduationCap,
    category: 'Education',
    popular: true,
    rating: 4.9,
    usageCount: 850,
    isPremium: false
  },
  {
    id: 'family-night-agent',
    name: 'Family Night Agent',
    description: 'Create engaging family storybooks and plan memorable activities for all ages.',
    icon: BookOpen,
    category: 'Family',
    rating: 4.6,
    usageCount: 420,
    isPremium: false
  },
  {
    id: 'finance-agent',
    name: 'Finance Agent',
    description: 'Financial literacy coach specializing in 4 core topics: Budgeting, Credit, Home Buying & Investment Basics.',
    icon: DollarSign,
    category: 'Finance',
    rating: 4.5,
    usageCount: 380,
    isPremium: false
  },
  // Premium agents
  {
    id: 'wizard-gary-payton',
    name: 'Wizard (Gary Payton)',
    description: 'Your global guide for everything. Get expert advice on any topic with personalized responses.',
    icon: Compass,
    category: 'General',
    rating: 4.8,
    usageCount: 1200,
    popular: true,
    isPremium: true
  },
  {
    id: 'notebooklm-practice',
    name: 'NotebookLM Practice',
    description: 'Level up your skills in NotebookLM with interactive tutorials and practice sessions.',
    icon: BookOpen,
    category: 'Practice',
    rating: 4.7,
    usageCount: 650,
    isPremium: true
  },
  {
    id: 'movie-agent',
    name: 'Movie Agent',
    description: 'Turn your creative ideas into compelling short films with AI assistance.',
    icon: Film,
    category: 'Creative',
    rating: 4.4,
    usageCount: 320,
    isPremium: false
  },
  {
    id: 'music-agent',
    name: 'Music Agent',
    description: 'Create beats, write lyrics & compose soundtracks for any project.',
    icon: Music,
    category: 'Creative',
    rating: 4.3,
    usageCount: 290,
    isPremium: true
  },
  {
    id: 'website-agent',
    name: 'Website Agent',
    description: 'Build and publish professional websites without coding knowledge.',
    icon: Globe,
    category: 'Development',
    rating: 4.2,
    usageCount: 510,
    isPremium: true
  }
];

const categories = ['All', 'General', 'Education', 'Practice', 'Family', 'Finance', 'Creative', 'Development'];

interface PrebuiltGPTsInterfaceProps {
  onGPTSelect: (gpt: { id: string; name: string; type: 'prebuilt' }) => void;
  isDemo?: boolean;
  onUpgrade?: () => void;
}

export const PrebuiltGPTsInterface = ({ onGPTSelect, isDemo = false, onUpgrade }: PrebuiltGPTsInterfaceProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'usage' | 'rating' | 'name' | 'category' | 'price'>('usage');
  const [showPremium, setShowPremium] = useState(false);

  const filteredGPTs = prebuiltGPTs
    .filter(gpt => {
      const matchesSearch = gpt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gpt.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || gpt.category === selectedCategory;
      const matchesPremiumFilter = showPremium || !gpt.isPremium;
      return matchesSearch && matchesCategory && matchesPremiumFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'price':
          // Sort by premium status: free items first, then premium
          if (a.isPremium === b.isPremium) return 0;
          return a.isPremium ? 1 : -1;
        default: // usage
          return (b.usageCount || 0) - (a.usageCount || 0);
      }
    });

  const handleGPTClick = (gpt: PrebuiltGPT) => {
    if (gpt.isPremium) {
      // Do nothing for premium GPTs - they're disabled
      return;
    }
    if (isDemo && onUpgrade) {
      onUpgrade();
    } else {
      onGPTSelect({ id: gpt.id, name: gpt.name, type: 'prebuilt' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Platform GPTs</h1>
        </div>
         <p className="text-muted-foreground">
          Practice prompting skills with our specialized AI assistants. Three agents included with membership, premium options available.
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
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Sort by: {sortBy === 'usage' ? 'Usage' : sortBy === 'rating' ? 'Rating' : sortBy === 'category' ? 'Category' : sortBy === 'price' ? 'Price' : 'Alphabetical'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('usage')}>
                  Usage
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Alphabetical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('category')}>
                  Category
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>
                  Rating
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price')}>
                  Price
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center space-x-2">
              <Switch
                id="premium-mode"
                checked={showPremium}
                onCheckedChange={setShowPremium}
              />
              <Label htmlFor="premium-mode" className="text-sm">Show Premium</Label>
            </div>
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

      {/* GPT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGPTs.map((gpt) => {
          const IconComponent = gpt.icon;
          return (
            <Card 
              key={gpt.id} 
              className={`hover:shadow-lg transition-all group border-2 ${
                gpt.isPremium 
                  ? 'opacity-60 cursor-not-allowed border-muted' 
                  : 'cursor-pointer hover:border-primary/20'
              }`}
              onClick={() => handleGPTClick(gpt)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg transition-smooth ${
                    gpt.isPremium 
                      ? 'bg-muted/50' 
                      : 'bg-primary/10 group-hover:bg-primary/20'
                  }`}>
                    <IconComponent className={`h-5 w-5 ${
                      gpt.isPremium ? 'text-muted-foreground' : 'text-primary'
                    }`} />
                  </div>
                  <div className="flex gap-1">
                    {gpt.isPremium && (
                      <Badge variant="default" className="gap-1 h-5 bg-amber-500 hover:bg-amber-600">
                        <Crown className="h-2.5 w-2.5" />
                        Premium
                      </Badge>
                    )}
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
                <CardTitle className={`text-lg transition-smooth ${
                  gpt.isPremium 
                    ? 'text-muted-foreground' 
                    : 'group-hover:text-primary'
                }`}>
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
                <Button 
                  className="w-full mt-3" 
                  size="sm" 
                  disabled={isDemo || gpt.isPremium}
                  variant={gpt.isPremium ? "outline" : "default"}
                >
                  {isDemo ? 'Demo Mode' : gpt.isPremium ? 'Coming Soon' : 'Start Chat'}
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