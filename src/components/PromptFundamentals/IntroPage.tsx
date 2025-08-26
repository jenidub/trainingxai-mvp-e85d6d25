import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  Award, 
  CheckSquare, 
  Edit3, 
  Play, 
  RotateCcw,
  Lightbulb,
  ArrowRight,
  BookOpen
} from "lucide-react";

interface IntroPageProps {
  onEnterPractice: () => void;
  onBackToFundamentals: () => void;
}

export const IntroPage = ({ onEnterPractice, onBackToFundamentals }: IntroPageProps) => {
  const expectations = [
    {
      icon: Target,
      title: "20 Practice Tasks",
      description: "From basics to advanced prompting techniques",
      badge: "Hands-on"
    },
    {
      icon: TrendingUp,
      title: "Progressive Difficulty",
      description: "Each step builds on the last for steady growth",
      badge: "Structured"
    },
    {
      icon: Award,
      title: "Certificate Award",
      description: "Finish all tasks to unlock your certificate",
      badge: "Achievement"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Read the task carefully",
      description: "Understand what's being asked and the desired output format"
    },
    {
      number: "2", 
      title: "Write your prompt in the editor",
      description: "Craft your response using the techniques you've learned"
    },
    {
      number: "3",
      title: "Click Run Check for feedback", 
      description: "Get instant feedback on your prompt's effectiveness"
    },
    {
      number: "4",
      title: "Revise until you pass",
      description: "Use the feedback to improve and perfect your prompt"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to the Practice Zone
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete 20 hands-on tasks to earn your Fundamentals Certificate.
          </p>
        </div>
        <div className="flex justify-center">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
            Interactive Learning Experience
          </Badge>
        </div>
      </div>

      {/* What to Expect Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center text-foreground">
          What to Expect
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {expectations.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className="text-center border border-border/50 hover:border-border transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Instructions Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center text-foreground">
          How It Works
        </h2>
        <div className="grid gap-4">
          {steps.map((step, index) => (
            <Card key={index} className="border border-border/50">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                  {step.number}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tip Callout */}
      <Card className="bg-muted/30 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Pro Tip</h3>
              <p className="text-muted-foreground">
                If you're stuck, click <span className="font-medium text-foreground">"Ask Spiral"</span> for a hint. 
                Our AI assistant is here to guide you through challenging tasks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="space-y-4 text-center pt-4">
        <Button 
          onClick={onEnterPractice}
          size="lg"
          className="text-lg px-8 py-3 mb-4"
        >
          <Play className="mr-2 h-5 w-5" />
          Enter the Practice Zone
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <div>
          <Button 
            variant="outline"
            onClick={onBackToFundamentals}
            className="text-sm"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Review Fundamentals Again
          </Button>
        </div>
      </div>
    </div>
  );
};