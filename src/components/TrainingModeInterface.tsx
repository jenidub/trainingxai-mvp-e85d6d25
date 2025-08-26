import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Target, 
  Trophy, 
  BookOpen, 
  Code, 
  Palette, 
  BarChart3,
  Clock,
  Play,
  ChevronRight,
  Lock,
  CheckCircle,
  Crown
} from 'lucide-react';
import NotebookLMPractice from './NotebookLMPractice';
import { FundamentalsPage } from './PromptFundamentals/FundamentalsPage';
import { IntroPage } from './PromptFundamentals/IntroPage';
import { PracticeZone } from './PromptFundamentals/PracticeZone';
import { Switch } from "@/components/ui/switch";
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/contexts/AuthContext';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  isLocked: boolean;
  isCompleted: boolean;
  progress: number;
  category: string;
  isPremium?: boolean;
}

const trainingModules: TrainingModule[] = [
  {
    id: 'prompt-fundamentals',
    title: 'Prompt Engineering Fundamentals',
    description: 'Master the basics of AI prompting with hands-on exercises and real-world examples.',
    icon: BookOpen,
    difficulty: 'Beginner',
    duration: '2-3 hours',
    lessons: 8,
    isLocked: false,
    isCompleted: false,
    progress: 0,
    category: 'Core Skills',
    isPremium: false
  },
  {
    id: 'advanced-prompting',
    title: 'Advanced Prompting Techniques',
    description: 'Learn sophisticated prompting strategies for complex tasks and specialized domains.',
    icon: Target,
    difficulty: 'Intermediate',
    duration: '3-4 hours',
    lessons: 12,
    isLocked: true,
    isCompleted: false,
    progress: 0,
    category: 'Core Skills',
    isPremium: true
  },
  {
    id: 'custom-gpt-creation',
    title: 'Custom GPT Development',
    description: 'Build and deploy your own specialized AI assistants for unique use cases.',
    icon: Code,
    difficulty: 'Intermediate',
    duration: '4-5 hours',
    lessons: 15,
    isLocked: true,
    isCompleted: false,
    progress: 0,
    category: 'Development',
    isPremium: true
  },
  {
    id: 'creative-ai',
    title: 'Creative AI Applications',
    description: 'Explore AI for content creation, design, storytelling, and artistic projects.',
    icon: Palette,
    difficulty: 'Beginner',
    duration: '2-3 hours',
    lessons: 10,
    isLocked: false,
    isCompleted: false,
    progress: 0,
    category: 'Creative',
    isPremium: true
  },
  {
    id: 'business-automation',
    title: 'Business Process Automation',
    description: 'Apply AI to streamline workflows, automate tasks, and improve productivity.',
    icon: BarChart3,
    difficulty: 'Advanced',
    duration: '5-6 hours',
    lessons: 18,
    isLocked: true,
    isCompleted: false,
    progress: 0,
    category: 'Business',
    isPremium: true
  },
  {
    id: 'notebooklm-mastery',
    title: 'NotebookLM Mastery',
    description: 'Interactive practice space to perfect your prompting skills with instant feedback.',
    icon: GraduationCap,
    difficulty: 'Beginner',
    duration: 'Self-paced',
    lessons: 0,
    isLocked: false,
    isCompleted: false,
    progress: 0,
    category: 'Practice',
    isPremium: true
  }
];


interface TrainingModeInterfaceProps {
  onModuleSelect?: (moduleId: string) => void;
  isDemo?: boolean;
  onUpgrade?: () => void;
}

export const TrainingModeInterface = ({ onModuleSelect, isDemo = false, onUpgrade }: TrainingModeInterfaceProps) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('fundamentals'); // Track current page within module
  const [activeCategory, setActiveCategory] = useState('All');
  const [showPremium, setShowPremium] = useState(false);
  const [courseOverview, setCourseOverview] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { getCourseOverview } = useUserProgress('prompt-fundamentals'); // We'll use this to get all course data

  // Load course progress overview
  useEffect(() => {
    const loadCourseOverview = async () => {
      if (!user) return;
      
      try {
        const overview = await getCourseOverview();
        setCourseOverview(overview || []);
      } catch (error) {
        console.error('Error loading course overview:', error);
      }
    };

    loadCourseOverview();
  }, [user, getCourseOverview]);

  // Calculate progress for a specific course
  const getCourseProgress = (courseId: string) => {
    const courseData = courseOverview.find(course => course.course_id === courseId);
    if (!courseData?.progress_data) return { progress: 0, isCompleted: false };
    
    const progressData = courseData.progress_data;
    if (courseId === 'prompt-fundamentals') {
      const totalTasks = 20; // Based on practiceTasks.length, but hardcoded to avoid import issues
      const completedTasks = progressData.completedTaskIds?.length || 0;
      return {
        progress: Math.round((completedTasks / totalTasks) * 100),
        isCompleted: completedTasks === totalTasks
      };
    }
    
    return { progress: 0, isCompleted: false };
  };

  const categories = ['All', 'Core Skills', 'Development', 'Creative', 'Business', 'Practice'];

  const filteredModules = trainingModules.map(module => {
    const courseProgress = getCourseProgress(module.id);
    return {
      ...module,
      progress: courseProgress.progress,
      isCompleted: courseProgress.isCompleted
    };
  }).filter(module => {
    const categoryMatch = activeCategory === 'All' || module.category === activeCategory;
    const premiumMatch = showPremium || !module.isPremium;
    return categoryMatch && premiumMatch;
  });

  const handleModuleClick = (moduleId: string) => {
    const module = trainingModules.find(m => m.id === moduleId);
    
    if (isDemo && onUpgrade) {
      onUpgrade();
      return;
    }
    
    if (module?.isPremium) {
      return; // Do nothing for premium modules
    }
    
    if (module && !module.isLocked) {
      if (moduleId === 'notebooklm-mastery' || moduleId === 'prompt-fundamentals') {
        setSelectedModule(moduleId);
        setCurrentPage('fundamentals'); // Reset to first page when entering module
      } else {
        // Handle other modules (future implementation)
        onModuleSelect?.(moduleId);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // If NotebookLM module is selected, show that component
  if (selectedModule === 'notebooklm-mastery') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b bg-background/50">
          <Button 
            variant="outline" 
            onClick={() => setSelectedModule(null)}
            className="mb-2"
          >
            ← Back to Training
          </Button>
        </div>
        <div className="flex-1">
          <NotebookLMPractice />
        </div>
      </div>
    );
  }

  // If Prompt Fundamentals module is selected, show that component
  if (selectedModule === 'prompt-fundamentals') {
    console.log('Current page in prompt-fundamentals:', currentPage);
    // For Practice Zone, use full screen layout without sidebar
    if (currentPage === 'practice') {
      return (
        <div className="h-screen w-full flex flex-col">
          <div className="p-4 border-b bg-background/50 flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedModule(null);
                setCurrentPage('fundamentals');
              }}
              className="mb-2"
            >
              ← Back to Training
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <PracticeZone 
              onFinished={(certificateId) => {
                console.log('Course completed with certificate:', certificateId);
                // Could navigate back to training or show success message
              }}
              brandName="Somos Ujima"
            />
          </div>
        </div>
      );
    }
    
    // For other pages, use regular layout
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b bg-background/50">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedModule(null);
              setCurrentPage('fundamentals');
            }}
            className="mb-2"
          >
            ← Back to Training
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {currentPage === 'fundamentals' && (
            <FundamentalsPage 
              onContinue={() => setCurrentPage('intro')}
            />
          )}
          {currentPage === 'intro' && (
            <IntroPage 
              onEnterPractice={() => {
                console.log('Setting current page to practice');
                setCurrentPage('practice');
              }}
              onBackToFundamentals={() => setCurrentPage('fundamentals')}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Training Zone</h1>
        </div>
        <p className="text-muted-foreground">
          Level up your AI skills through interactive training modules and hands-on practice.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Learning Journey</CardTitle>
              <CardDescription>Track your progress and achievements</CardDescription>
            </div>
            <Trophy className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {courseOverview.filter(course => course.completed_at).length}
              </div>
              <div className="text-sm text-muted-foreground">Courses Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {courseOverview.reduce((total, course) => {
                  const progressData = course.progress_data;
                  return total + (progressData?.completedTaskIds?.length || 0);
                }, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Training Modules</h2>
          <div className="flex items-center gap-3 pr-4">
            <span className="text-sm text-muted-foreground">Show Premium</span>
            <Switch
              checked={showPremium}
              onCheckedChange={setShowPremium}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="h-8"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Training Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card 
              key={module.id}
              className={`hover:shadow-lg transition-all cursor-pointer group border-2 ${
                module.isLocked || module.isPremium
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:border-primary/20'
              }`}
              onClick={() => handleModuleClick(module.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg transition-smooth ${
                    module.isLocked || module.isPremium
                      ? 'bg-muted' 
                      : 'bg-primary/10 group-hover:bg-primary/20'
                  }`}>
                    {module.isLocked || module.isPremium ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : module.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <IconComponent className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {module.category}
                    </Badge>
                    {module.isPremium && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className={`text-lg transition-smooth ${
                  !(module.isLocked || module.isPremium) ? 'group-hover:text-primary' : 'text-muted-foreground'
                }`}>
                  {module.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {module.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.duration}
                      </div>
                      {module.lessons > 0 && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {module.lessons} lessons
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={module.isLocked || isDemo || module.isPremium}
                    variant={module.isCompleted ? 'outline' : 'default'}
                  >
                    {isDemo ? (
                      'Demo Mode'
                    ) : module.isPremium ? (
                      'Coming Soon'
                    ) : module.isLocked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </>
                    ) : module.isCompleted ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {module.id === 'notebooklm-mastery' ? 'Start Practice' : 'Start Learning'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
};