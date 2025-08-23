import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User, LogOut, BookOpen, TrendingUp, Users, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from './UserProfile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Header = () => {
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
    },
    {
      title: "Advanced Prompting", 
      description: "Learn to earn from your projects",
      icon: TrendingUp,
    },
    {
      title: "Educator Certification",
      description: "Empower yourself and others",
      icon: Users,
    }
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Logo */}
        <div className="flex items-center gap-3">
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
        
        {/* Center - Workshops */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground hidden md:block">Workshops:</span>
          </div>
          <div className="flex gap-2">
            {workshops.map((workshop, index) => {
              const IconComponent = workshop.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:border-primary/50 transition-smooth group"
                >
                  <div className="p-1 rounded bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                    <IconComponent className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-medium text-xs hidden lg:block">{workshop.title}</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 h-3">paid</Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <UserProfile 
                trigger={
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(user.user_metadata?.display_name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm hidden md:block">
                      {user.user_metadata?.display_name || user.email}
                    </span>
                  </Button>
                }
              />
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:block">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleSignIn}>
                <User className="h-4 w-4 md:mr-2" />
                <span className="hidden md:block">Sign In</span>
              </Button>
              <Button size="sm" className="gradient-primary text-white border-0 shadow-primary" onClick={handleSignIn}>
                <span className="hidden md:block">Get Started</span>
                <span className="md:hidden">Start</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};