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
  Activity,
  Palette,
  Code,
  Download
} from 'lucide-react';
import { UserProfile } from './UserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { generateTrainingReport, generatePortfolioReport, generateAnalyticsReport } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first training module', icon: Star },
  { id: 2, title: 'Prompt Master', description: 'Master all fundamentals lessons', icon: Trophy },
  { id: 3, title: 'Creative Genius', description: 'Excel in creative AI applications', icon: Palette },
  { id: 4, title: 'Builder', description: 'Create your first custom GPT', icon: Code },
];

export const DashboardInterface = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [trainingFilter, setTrainingFilter] = useState('core-skills');
  const [timeRange, setTimeRange] = useState('weekly');

  // Generate time-based data based on selected range
  const generateTimeData = () => {
    const now = new Date();
    const data = [];
    
    switch (timeRange) {
      case 'today':
        // Hourly data for today
        for (let i = 0; i < 24; i++) {
          data.push({
            period: `${i.toString().padStart(2, '0')}:00`,
            minutes: Math.floor(Math.random() * 60) + 10, // 10-70 minutes
            hours: ((Math.floor(Math.random() * 60) + 10) / 60).toFixed(1)
          });
        }
        break;
      case 'weekly':
        // Daily data for the week
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach(day => {
          const minutes = Math.floor(Math.random() * 200) + 30; // 30-230 minutes
          data.push({
            period: day,
            minutes,
            hours: (minutes / 60).toFixed(1)
          });
        });
        break;
      case 'monthly':
        // Weekly data for the month
        for (let i = 1; i <= 4; i++) {
          const minutes = Math.floor(Math.random() * 800) + 200; // 200-1000 minutes
          data.push({
            period: `Week ${i}`,
            minutes,
            hours: (minutes / 60).toFixed(1)
          });
        }
        break;
      case 'annual':
        // Monthly data for the year
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach(month => {
          const minutes = Math.floor(Math.random() * 2000) + 500; // 500-2500 minutes
          data.push({
            period: month,
            minutes,
            hours: (minutes / 60).toFixed(1)
          });
        });
        break;
      default:
        break;
    }
    return data;
  };

  // Calculate appropriate tick interval for Y-axis based on data range
  const getYAxisTickInterval = (data: any[]) => {
    const maxMinutes = Math.max(...data.map(d => d.minutes));
    if (maxMinutes <= 100) return 20;
    if (maxMinutes <= 300) return 50;
    if (maxMinutes <= 600) return 100;
    if (maxMinutes <= 1200) return 200;
    return 500;
  };

  useEffect(() => {
    if (user) {
      loadProfile();
      loadTrainingData();
      loadProjects();
      loadAnalytics();
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

  const loadTrainingData = async () => {
    if (!user) return;
    
    setLoadingTraining(true);
    
    try {
      // First get all training tracks
      const { data: tracks, error: tracksError } = await supabase
        .from('training_tracks')
        .select('*')
        .order('name');
      
      if (tracksError) {
        console.error('Error loading training tracks:', tracksError);
        setLoadingTraining(false);
        return;
      }
      
      // Then get user's progress for each track
      const { data: userProgress, error: progressError } = await supabase
        .from('user_training_progress')
        .select(`
          *,
          training_tracks (
            name,
            description
          )
        `)
        .eq('user_id', user.id);
      
      if (progressError) {
        console.error('Error loading user progress:', progressError);
      }
      
      // Combine the data - show all tracks with user's progress if available
      const combinedData = tracks?.map(track => {
        const userTrackProgress = userProgress?.find(up => up.track_id === track.id);
        return {
          track: track.name,
          level: userTrackProgress?.level || 'Beginner',
          progress: userTrackProgress?.progress || 0,
          badges_earned: userTrackProgress?.badges_earned || 0,
          certificates_earned: userTrackProgress?.certificates_earned || 0
        };
      }) || [];
      
      setTrainingData(combinedData);
    } catch (error) {
      console.error('Error loading training data:', error);
    } finally {
      setLoadingTraining(false);
    }
  };

  const loadProjects = async () => {
    if (!user) return;
    
    setLoadingProjects(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading projects:', error);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadAnalytics = async () => {
    if (!user) return;
    
    setLoadingAnalytics(true);
    
    try {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error loading analytics:', error);
        // Create default analytics if none exist
        const { data: newStats, error: createError } = await supabase
          .from('user_statistics')
          .insert([{ user_id: user.id }])
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating analytics:', createError);
        } else {
          setAnalytics(newStats);
        }
      } else {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatAvgDaily = (totalMinutes: number, days: number = 7) => {
    const avgMinutes = Math.floor(totalMinutes / days);
    return formatTime(avgMinutes);
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

  const trainingCategories = [
    { id: 'all', name: 'All Tracks', icon: Target },
    { id: 'core-skills', name: 'Core Skills', icon: Star },
    { id: 'advanced', name: 'Advanced Training', icon: Trophy },
    { id: 'specialized', name: 'Specialized Tracks', icon: Zap },
  ];

  const [trainingData, setTrainingData] = useState<any[]>([]);
  const [loadingTraining, setLoadingTraining] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);


  const filteredPortfolio = portfolioFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === portfolioFilter);

  // Filter training data based on selected category
  const getFilteredTrainingData = () => {
    if (trainingFilter === 'all') return trainingData;
    
    // Simple filtering logic based on track names and characteristics
    return trainingData.filter(track => {
      const trackName = track.track.toLowerCase();
      switch (trainingFilter) {
        case 'core-skills':
          return trackName.includes('fundamentals') || 
                 trackName.includes('basics') || 
                 trackName.includes('core') ||
                 trackName.includes('essential') ||
                 track.level === 'Beginner';
        case 'advanced':
          return track.level === 'Advanced' || 
                 trackName.includes('advanced') ||
                 trackName.includes('expert');
        case 'specialized':
          return trackName.includes('specialized') || 
                 trackName.includes('custom') ||
                 trackName.includes('specific');
        default:
          return true;
      }
    });
  };

  const filteredTrainingData = getFilteredTrainingData();

  return (
    <div className="flex-1 h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/10">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">
              Your Studio. Your Progress. Your Future.
            </h1>
            <div className="flex w-full">
              <div className="w-1/2 flex justify-center">
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
              </div>
              <div className="w-1/2 flex justify-center">
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
        </div>

        {/* Achievements Section */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-6">
              {/* Text Section - 15% */}
              <div className="w-[15%] space-y-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Achievements
                </h2>
                <p className="text-xs text-muted-foreground leading-tight">
                  Unlock badges as you progress through your training
                </p>
              </div>
              
              {/* Achievement Items - 85% */}
              <div className="w-[85%]">
                <div className="grid grid-cols-4 gap-3">
                  {achievements.map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div 
                        key={achievement.id}
                        className="text-center p-3 rounded-lg border border-muted opacity-60"
                      >
                        <div className="p-1.5 rounded-full bg-muted w-fit mx-auto mb-2">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <h4 className="font-medium text-xs mb-1">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground leading-tight">{achievement.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>

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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Training Zone</h2>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    try {
                      toast.promise(
                        generateTrainingReport(
                          filteredTrainingData, 
                          user?.email,
                          trainingCategories.find(cat => cat.id === trainingFilter)?.name
                        ), 
                        {
                          loading: 'Generating professional training report...',
                          success: 'Training report downloaded successfully!',
                          error: 'Failed to generate training report'
                        }
                      );
                    } catch (error) {
                      console.error('Download error:', error);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {trainingCategories.find(cat => cat.id === trainingFilter)?.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {trainingCategories.map((category) => (
                      <DropdownMenuItem 
                        key={category.id}
                        onClick={() => setTrainingFilter(category.id)}
                        className="flex items-center gap-2"
                      >
                        <category.icon className="h-4 w-4" />
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div id="training-zone-content">
            {loadingTraining ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="flex gap-4">
                        <div className="h-4 bg-muted rounded w-20"></div>
                        <div className="h-4 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredTrainingData.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {trainingFilter === 'all' ? 'Start Your Training Journey' : `No ${trainingCategories.find(cat => cat.id === trainingFilter)?.name} Found`}
                    </h3>
                    <p className="text-muted-foreground">
                      {trainingFilter === 'all' 
                        ? 'Choose from our training tracks to begin building your AI skills.' 
                        : 'Try selecting a different filter or check back later for new training content.'}
                    </p>
                  </div>
                  <Button>Browse Training Tracks</Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTrainingData.map((track, index) => (
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
                          <span>{track.badges_earned || 0}/5 Badges</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{track.certificates_earned || 0}/2 Certificates</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            </div>
          </TabsContent>

          {/* Portfolio View */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Your Portfolio</h2>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    try {
                      toast.promise(
                        generatePortfolioReport(
                          filteredPortfolio, 
                          user?.email,
                          portfolioCategories.find(cat => cat.id === portfolioFilter)?.name
                        ), 
                        {
                          loading: 'Generating professional portfolio report...',
                          success: 'Portfolio report downloaded successfully!',
                          error: 'Failed to generate portfolio report'
                        }
                      );
                    } catch (error) {
                      console.error('Download error:', error);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
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
            </div>
            
            <div id="portfolio-content">
            
            {filteredPortfolio.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects yet</p>
              </div>
            ) : (
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
                          Created {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            </div>
          </TabsContent>

          {/* Analytics View */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    try {
                      toast.promise(
                        generateAnalyticsReport(
                          analytics, 
                          user?.email,
                          timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
                        ), 
                        {
                          loading: 'Generating professional analytics report...',
                          success: 'Analytics report downloaded successfully!',
                          error: 'Failed to generate analytics report'
                        }
                      );
                    } catch (error) {
                      console.error('Download error:', error);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTimeRange('today')}>
                      Today
                    </DropdownMenuItem>
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
            </div>

            <div id="analytics-content">

            {loadingAnalytics ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10">
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Time</p>
                        <p className="text-lg font-bold text-foreground">
                          {analytics ? formatTime(analytics.total_time_minutes) : '0h 0m'}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-green-500/10">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Daily</p>
                        <p className="text-lg font-bold text-foreground">
                          {analytics ? formatAvgDaily(analytics.total_time_minutes) : '0h 0m'}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/10">
                        <Folder className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Projects</p>
                        <p className="text-lg font-bold text-foreground">
                          {analytics ? analytics.projects_completed : 0}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-orange-500/10">
                        <Trophy className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Certificates</p>
                        <p className="text-lg font-bold text-foreground">
                          {analytics ? analytics.certificates_earned : 0}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <h3 className="font-medium text-foreground">Training Stats</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Training Time</span>
                          <span className="text-sm font-medium">
                            {analytics ? formatTime(analytics.training_time_minutes) : '0h 0m'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Drills Completed</span>
                          <span className="text-sm font-medium">
                            {analytics ? analytics.drills_completed : 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Prompts Written</span>
                          <span className="text-sm font-medium">
                            {analytics ? analytics.prompts_written : 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 lg:col-span-2">
                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground">Platform Usage Trends</h3>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateTimeData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="period" 
                              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                            />
                            <YAxis 
                              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                              tickFormatter={(value) => `${Math.round(value)}`}
                              interval={getYAxisTickInterval(generateTimeData())}
                              domain={['dataMin', 'dataMax']}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--popover))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                fontSize: '12px'
                              }}
                              labelStyle={{ color: 'hsl(var(--foreground))' }}
                              formatter={(value: any, name: string) => [
                                `${Math.round(value)} minutes`,
                                'Time on Platform'
                              ]}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="minutes" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                              activeDot={{ r: 4, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};