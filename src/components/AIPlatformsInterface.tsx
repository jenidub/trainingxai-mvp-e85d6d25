import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Zap,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { PlatformReadyDialog } from './PlatformReadyDialog';
import { usePlatforms } from '@/hooks/usePlatforms';
import { supabase } from '@/integrations/supabase/client';

// Platform logo component
const PlatformLogo = ({ platform }: { platform: AIPlatform }) => {
  const getLogoUrl = (platformName: string) => {
    const logoPath = `${platformName.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
    return supabase.storage.from('platform-logos').getPublicUrl(logoPath).data.publicUrl;
  };

  return (
    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
      <img 
        src={getLogoUrl(platform.name)} 
        alt={`${platform.name} logo`}
        className="h-5 w-5 object-contain"
        onError={(e) => {
          // Fallback to a placeholder with platform initial
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="h-5 w-5 bg-primary/20 rounded flex items-center justify-center text-[10px] font-bold text-primary leading-none">
              ${platform.name.charAt(0)}
            </div>
          `;
        }}
      />
    </div>
  );
};

interface AIPlatform {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon_name: string;
  popular: boolean;
  averageRating: number;
  usageCount: number;
}

interface AIPlatformsInterfaceProps {
  isDemo?: boolean;
}

export const AIPlatformsInterface = ({ isDemo = false }: AIPlatformsInterfaceProps) => {
  const { platforms, loading, error, trackPlatformUsage } = usePlatforms();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'usage' | 'rating' | 'name' | 'category'>('usage');
  const [selectedPlatform, setSelectedPlatform] = useState<AIPlatform | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get categories from actual platform data
  const categories = ['All', ...Array.from(new Set(platforms.map(p => p.category)))];

  const filteredPlatforms = platforms
    .filter(platform => {
      const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          platform.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || platform.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default: // usage
          return (b.usageCount || 0) - (a.usageCount || 0);
      }
    });

  const handlePlatformClick = async (platform: AIPlatform) => {
    // Track usage
    await trackPlatformUsage(platform.id);
    
    setSelectedPlatform(platform);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading platforms...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Error loading platforms</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Prompting Practice Zone</h1>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Sort by: {sortBy === 'usage' ? 'Usage' : sortBy === 'rating' ? 'Rating' : sortBy === 'category' ? 'Category' : 'Name'}
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
              </DropdownMenuContent>
            </DropdownMenu>
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
          return (
            <Card 
              key={platform.id} 
              className="hover:shadow-lg transition-all group border-2 cursor-pointer hover:border-primary/20"
              onClick={() => handlePlatformClick(platform)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <PlatformLogo platform={platform} />
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
                    {platform.averageRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{platform.averageRating}</span>
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