import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Bot,
  Globe,
  Film,
  Music,
  Folder,
  Filter,
  Calendar,
  BarChart3,
  Camera,
  User,
  ChevronDown,
  Zap,
  Star,
  Activity
} from 'lucide-react';
import { UserProfile } from './UserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export const DashboardInterface = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('weekly');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  const portfolioCategories = [
    { id: 'all', name: 'All Projects', icon: Folder },
    { id: 'custom-gpts', name: 'Custom GPTs', icon: Bot },
    { id: 'apps', name: 'Apps', icon: Zap },
    { id: 'websites', name: 'Websites', icon: Globe },
    { id: 'books', name: 'Books', icon: BookOpen },
    { id: 'movies', name: 'Movies', icon: Film },
    { id: 'music', name: 'Music Tracks', icon: Music },
  ];

  const mockTrainingData = [
    { track: 'Prompt Engineering', level: 'Intermediate', progress: 65 },
    { track: 'AI Agent Building', level: 'Beginner', progress: 25 },
    { track: 'Creative AI', level: 'Advanced', progress: 85 },
    { track: 'Business AI', level: 'Beginner', progress: 15 },
  ];

  const mockPortfolioItems = [
    { id: 1, name: 'Customer Service Bot', category: 'custom-gpts', date: '2024-01-15', type: 'Custom GPT' },
    { id: 2, name: 'Portfolio Website', category: 'websites', date: '2024-01-10', type: 'Website' },
    { id: 3, name: 'Marketing Campaign App', category: 'apps', date: '2024-01-08', type: 'App' },
    { id: 4, name: 'Ambient Soundscape', category: 'music', date: '2024-01-05', type: 'Music Track' },
  ];

  const mockAnalytics = {
    totalTime: '47h 32m',
    avgDailyTime: '2h 15m',
    projectsCompleted: 12,
    certificatesEarned: 3,
    trainingTime: '23h 45m',
    drillsCompleted: 156,
    promptsWritten: 1247,
  };

  const filteredPortfolio = portfolioFilter === 'all' 
    ? mockPortfolioItems 
    : mockPortfolioItems.filter(item => item.category === portfolioFilter);

  return (
    <div className="flex-1 h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/10">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">
              Your Studio. Your Progress. Your Future.
            </h1>
            <div className="flex items-center justify-center gap-6">
              <UserProfile 
                trigger={
                  <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                        <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {getInitials(profile?.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-full">
                        <Camera className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {profile?.display_name || 'Welcome!'}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                }
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">Studio Member</span>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Level 2 Creator
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="training" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="training" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Training Zone
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Training Zone Progress */}
          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTrainingData.map((track, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{track.track}</h3>
                      <Badge 
                        variant={track.level === 'Advanced' ? 'default' : track.level === 'Intermediate' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {track.level}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{track.progress}%</span>
                      </div>
                      <Progress value={track.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <span>3/5 Badges</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>1/2 Certificates</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Portfolio View */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Your Portfolio</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {portfolioCategories.find(cat => cat.id === portfolioFilter)?.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {portfolioCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category.id}
                      onClick={() => setPortfolioFilter(category.id)}
                      className="flex items-center gap-2"
                    >
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolio.map((item) => (
                <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        {portfolioCategories.find(cat => cat.id === item.category)?.icon && (
                          <div className="h-6 w-6 text-primary">
                            {(() => {
                              const IconComponent = portfolioCategories.find(cat => cat.id === item.category)?.icon;
                              return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
                            })()}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics View */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTimeRange('weekly')}>
                    Weekly
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange('monthly')}>
                    Monthly
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange('annual')}>
                    Annual
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Time</p>
                    <p className="text-2xl font-bold text-foreground">{mockAnalytics.totalTime}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Daily</p>
                    <p className="text-2xl font-bold text-foreground">{mockAnalytics.avgDailyTime}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Folder className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Projects</p>
                    <p className="text-2xl font-bold text-foreground">{mockAnalytics.projectsCompleted}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Trophy className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Certificates</p>
                    <p className="text-2xl font-bold text-foreground">{mockAnalytics.certificatesEarned}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Training Stats</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Training Time</span>
                      <span className="font-medium">{mockAnalytics.trainingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Drills Completed</span>
                      <span className="font-medium">{mockAnalytics.drillsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Prompts Written</span>
                      <span className="font-medium">{mockAnalytics.promptsWritten}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 lg:col-span-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Platform Usage Trends</h3>
                  <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Usage chart visualization would go here</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};