import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User, LogOut, BookOpen, TrendingUp, Users, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from './UserProfile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  onHomeClick?: () => void;
  isDemo?: boolean;
  onUpgrade?: () => void;
}

export const Header = ({ onHomeClick, isDemo = false, onUpgrade }: HeaderProps = {}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const getInitials = (name: string | null | undefined, email: string | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const workshops = [
    {
      title: "Prompting Basics",
      description: "Your entry point, learn core skills",
      icon: BookOpen,
      url: "https://nuued-prompt-2-success-3ule8cx.gamma.site/"
    },
    {
      title: "Advanced Prompting", 
      description: "Learn to earn from your projects",
      icon: TrendingUp,
      url: "https://nuued-prompt-2-success-3ule8cx.gamma.site/"
    },
    {
      title: "Educator Certification",
      description: "Empower yourself and others",
      icon: Users,
    }
  ];

  return (
    <div>
      {/* Main Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-6">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-smooth" 
            onClick={onHomeClick}
          >
            <div className="gradient-primary p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-brand-accent bg-clip-text text-transparent">
                TrainingX.ai
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">AI Training Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isDemo ? (
              <>
                <Button variant="outline" size="sm" onClick={onUpgrade}>
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button size="sm" className="gradient-primary text-white border-0 shadow-primary" onClick={onUpgrade}>
                  Get Started
                </Button>
              </>
            ) : user ? (
              <>
                <UserProfile 
                  trigger={
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(user.user_metadata?.display_name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {user.user_metadata?.display_name || user.email}
                      </span>
                    </Button>
                  }
                />
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleSignIn}>
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button size="sm" className="gradient-primary text-white border-0 shadow-primary" onClick={handleSignIn}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Workshops Menu Bar */}
      <div className="bg-background border-b border-border/25">
        <div className="px-6 py-2">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Award className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Sign Up for Our Workshops</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {workshops.map((workshop, index) => {
                const IconComponent = workshop.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 h-10 px-3 justify-start hover:border-primary/50 transition-smooth group"
                    onClick={() => workshop.url && window.open(workshop.url, '_blank')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                        <IconComponent className="h-3 w-3 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-medium text-xs">{workshop.title}</h3>
                          <Badge variant="outline" className="text-[9px] py-0 px-1 h-3">paid</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">{workshop.description}</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};