import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  Users, 
  BookOpen,
  ArrowRight,
  Trophy,
  Rocket,
  Brain
} from 'lucide-react';

export type CelebrationPageProps = {
  brandName?: string;
  prebuiltGptsUrl?: string;
  agentBuilderUrl?: string;
  workshopSignupUrl?: string;
  mascotImageUrl?: string;
  onContinue?: () => void;
};

// Removed Confetti component for accessibility and to eliminate flickering

export const CelebrationPage: React.FC<CelebrationPageProps> = ({
  brandName = "Somos Ujima",
  prebuiltGptsUrl = "/prebuilt-gpts",
  agentBuilderUrl = "/agent-builder", 
  workshopSignupUrl = "/workshop-signup",
  mascotImageUrl,
  onContinue
}) => {
  // Removed confetti state and useEffect for better accessibility

  const nextSteps = [
    {
      icon: BookOpen,
      title: "Practice with Prebuilt GPTs",
      description: "Explore our curated GPTs for study, writing, business, and more.",
      buttonText: "Try a Prebuilt GPT",
      url: prebuiltGptsUrl,
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Rocket,
      title: "Create Your Own Agent", 
      description: "Apply your prompting skills by designing your own AI.",
      buttonText: "Start Building",
      url: agentBuilderUrl,
      color: "from-green-500 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen w-full relative overflow-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
      {/* Static decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 via-pink-500/5 via-orange-500/5 to-red-500/5 pointer-events-none" />
      
      <motion.div 
        className="relative z-10 w-full max-w-4xl mx-auto p-6 pt-12 pb-12 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, staggerChildren: 0.3 }}
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Mascot/Trophy Animation */}
          <motion.div 
            className="flex justify-center mb-8"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Congratulations! 🎉
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            You have successfully completed the{' '}
            <span className="font-semibold text-foreground">Prompt Engineering Fundamentals Course!</span>
          </motion.p>

          {/* Achievement Badge */}
          <motion.div
            className="flex justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <Brain className="h-4 w-4 mr-2" />
              Course Completed
            </Badge>
          </motion.div>
        </motion.div>

        {/* Message Block */}
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The next step is to continue your learning — try one of our prebuilt GPTs or dive right in and start creating your own custom AI agent.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps Section */}
        <motion.div 
          className="space-y-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-3xl font-bold text-center text-foreground">
            What's Next?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {nextSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="h-full border-2 border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                    <div className={`h-2 bg-gradient-to-r ${step.color}`} />
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${step.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        className="w-full group-hover:scale-105 transition-transform duration-200"
                        onClick={() => window.location.href = step.url}
                      >
                        {step.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Workshop CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-50" />
              <CardContent className="relative p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground">
                  Ready to Level Up?
                </h3>
                
                <p className="text-lg text-muted-foreground">
                  Accelerate your learning with a live workshop led by our team!
                </p>
                
                <Button 
                  size="lg"
                  className="text-lg px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.href = workshopSignupUrl}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Sign Up for a Workshop
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Continue Button */}
        {onContinue && (
          <motion.div 
            className="text-center pt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
          >
            <Button 
              variant="outline"
              onClick={onContinue}
              className="text-lg px-8 py-3"
            >
              Continue Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};