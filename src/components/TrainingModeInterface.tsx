import { useState } from 'react';
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
  Star,
  Play,
  Award,
  ChevronRight,
  Lock,
  CheckCircle
} from 'lucide-react';
import NotebookLMPractice from './NotebookLMPractice';

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
    category: 'Core Skills'
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
    category: 'Core Skills'
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
    category: 'Development'
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
    category: 'Creative'
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
    category: 'Business'
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
    category: 'Practice'
  }
];

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first training module', icon: Star },
  { id: 2, title: 'Prompt Master', description: 'Master all fundamentals lessons', icon: Trophy },
  { id: 3, title: 'Creative Genius', description: 'Excel in creative AI applications', icon: Palette },
  { id: 4, title: 'Builder', description: 'Create your first custom GPT', icon: Code },
];

interface TrainingModeInterfaceProps {
  onModuleSelect?: (moduleId: string) => void;
}

export const TrainingModeInterface = ({ onModuleSelect }: TrainingModeInterfaceProps) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Core Skills', 'Development', 'Creative', 'Business', 'Practice'];

  const filteredModules = trainingModules.filter(module => 
    activeCategory === 'All' || module.category === activeCategory
  );

  const handleModuleClick = (moduleId: string) => {
    const module = trainingModules.find(m => m.id === moduleId);
    if (module && !module.isLocked) {
      if (moduleId === 'notebooklm-mastery') {
        setSelectedModule(moduleId);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0/6</div>
              <div className="text-sm text-muted-foreground">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Certificates Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0h</div>
              <div className="text-sm text-muted-foreground">Time Invested</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Training Modules</h2>
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
                module.isLocked 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:border-primary/20'
              }`}
              onClick={() => handleModuleClick(module.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg transition-smooth ${
                    module.isLocked 
                      ? 'bg-muted' 
                      : 'bg-primary/10 group-hover:bg-primary/20'
                  }`}>
                    {module.isLocked ? (
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
                  </div>
                </div>
                <CardTitle className={`text-lg transition-smooth ${
                  !module.isLocked ? 'group-hover:text-primary' : ''
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
                    disabled={module.isLocked}
                    variant={module.isCompleted ? 'outline' : 'default'}
                  >
                    {module.isLocked ? (
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

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
          <CardDescription>
            Unlock badges as you progress through your training
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div 
                  key={achievement.id}
                  className="text-center p-4 rounded-lg border border-muted opacity-60"
                >
                  <div className="p-2 rounded-full bg-muted w-fit mx-auto mb-2">
                    <IconComponent className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};