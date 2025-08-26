import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageSquare, Clock, Lightbulb, TrendingUp, Users, Target, ArrowRight } from "lucide-react";

interface FundamentalsPageProps {
  onContinue: () => void;
}

export const FundamentalsPage = ({ onContinue }: FundamentalsPageProps) => {
  const sections = [
    {
      icon: Brain,
      title: "What is Artificial Intelligence?",
      bullets: [
        "AI recognizes patterns in data to make predictions and decisions",
        "It simulates human thinking processes like learning and problem-solving",
        "AI is already part of your daily life through apps and services",
        "It processes information faster than humans and learns from experience"
      ],
      example: "Netflix recommending shows based on your viewing history"
    },
    {
      icon: MessageSquare,
      title: "What are Large Language Models?",
      bullets: [
        "Trained on vast amounts of text from books, articles, and websites",
        "Generate human-like language and understand context",
        "Examples include ChatGPT, Claude, and Google Bard",
        "Can write, analyze, translate, and answer questions"
      ],
      example: "\"Explain photosynthesis in kid language\" → AI provides simple, age-appropriate explanation"
    },
    {
      icon: Clock,
      title: "Benefits of Using AI",
      bullets: [
        "Save hours of time on research and content creation",
        "Generate ideas and overcome creative blocks",
        "Get instant explanations on complex topics",
        "Automate repetitive writing and analysis tasks"
      ],
      example: "Draft a comprehensive study guide in minutes instead of hours"
    },
    {
      icon: Lightbulb,
      title: "What is AI Prompting?",
      bullets: [
        "Instructions you give to AI to get the output you want",
        "The quality of your prompt directly affects the response quality",
        "Good prompts specify tone, format, and level of detail",
        "Better prompts lead to more useful and accurate results"
      ],
      example: "\"You are a math tutor. Explain fractions to a 5th grader using pizza examples.\""
    },
    {
      icon: TrendingUp,
      title: "Why is AI Prompting in Demand?",
      bullets: [
        "AI tools are being adopted across all industries rapidly",
        "Companies need employees who can effectively use AI",
        "Prompt engineering is becoming a high-value skill",
        "Those who master prompting gain significant competitive advantages"
      ],
      example: "Marketing teams using AI to generate dozens of ad headlines in minutes"
    },
    {
      icon: Users,
      title: "Careers Enhanced by Prompting Skills",
      bullets: [
        "Healthcare: Medical documentation and patient communication",
        "Education: Lesson planning and personalized learning materials",
        "Business: Market research and strategic analysis",
        "Technology: Code documentation and user experience writing"
      ],
      example: "HR professionals using AI to write compelling job descriptions and interview questions"
    },
    {
      icon: Target,
      title: "Basics of an Effective Prompt",
      bullets: [
        "Be specific about what you want and how you want it formatted",
        "Use constraints like word limits, tone, and target audience",
        "Structure your request with clear steps or sections",
        "Provide examples to guide the AI's understanding"
      ],
      example: "\"Summarize the Civil War for high school students in exactly 5 bullet points, focusing on causes and key outcomes.\""
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Prompt Engineering Fundamentals
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master the essential concepts and techniques for effective AI communication. 
          Build a strong foundation for advanced prompting skills.
        </p>
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card key={index} className="border border-border/50 hover:border-border transition-colors">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-2 text-foreground/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-primary">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Example:</p>
                  <p className="text-foreground/90 italic">{section.example}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <Button 
          onClick={onContinue}
          size="lg"
          className="text-lg px-8 py-3"
        >
          Continue to Course Intro
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};