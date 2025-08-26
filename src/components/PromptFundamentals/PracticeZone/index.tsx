import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  RotateCcw, 
  Award, 
  Lightbulb,
  BookOpen,
  Target,
  Clock,
  Copy
} from "lucide-react";
import { practiceTasks, PracticeTask } from "./tasks";
import { validatePrompt, ValidationResult } from "@/lib/promptChecks";
import { Certificate } from "./Certificate";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type PracticeZoneProps = {
  onFinished?: (certificateId: string) => void;
  brandName?: string;
  showHintsByDefault?: boolean;
  allowSkip?: boolean;
  gptModel?: string;
};

interface ProgressState {
  completedTaskIds: number[];
  startedAt: string;
  finishedAt?: string;
  certificateId?: string;
  learnerName?: string;
  lastUsedModel?: string;
}

export const PracticeZone = ({
  onFinished,
  brandName = "Somos Ujima",
  showHintsByDefault = false,
  allowSkip = true,
  gptModel = "gpt-4o-mini"
}: PracticeZoneProps) => {
  console.log('PracticeZone component rendered');
  
  const [currentTaskId, setCurrentTaskId] = useState(1);
  const [userPrompt, setUserPrompt] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [aiResponse, setAiResponse] = useState("");
  const [isCheckingPrompt, setIsCheckingPrompt] = useState(false);
  const [showHints, setShowHints] = useState(showHintsByDefault);
  const [progress, setProgress] = useState<ProgressState>({
    completedTaskIds: [],
    startedAt: new Date().toISOString()
  });
  const [showCertificate, setShowCertificate] = useState(false);
  
  const { toast } = useToast();
  
  const currentTask = practiceTasks.find(task => task.id === currentTaskId);
  const progressPercentage = (progress.completedTaskIds.length / practiceTasks.length) * 100;
  const isTaskCompleted = progress.completedTaskIds.includes(currentTaskId);
  const allTasksCompleted = progress.completedTaskIds.length === practiceTasks.length;

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('promptEngineering_progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed);
        
        // If all tasks are completed, show certificate option
        if (parsed.completedTaskIds.length === practiceTasks.length) {
          setShowCertificate(true);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newProgress: ProgressState) => {
    setProgress(newProgress);
    localStorage.setItem('promptEngineering_progress', JSON.stringify(newProgress));
  };

  const handleRunCheck = async () => {
    if (!currentTask || !userPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please write a prompt before checking.",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingPrompt(true);
    
    try {
      // Validate prompt structure
      const results = validatePrompt(userPrompt, currentTask.validationRules);
      setValidationResults(results);
      
      // Call AI to get response
      console.log('Calling edge function with prompt:', userPrompt.substring(0, 50) + '...');
      
      const { data, error } = await supabase.functions.invoke('prompt-checker', {
        body: {
          prompt: userPrompt,
          model: gptModel
        }
      });
      
      console.log('Edge function response:', { data, error });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (data?.success) {
        setAiResponse(data.response);
        
        // Check if all validations passed
        const allPassed = results.every(result => result.passed);
        
        if (allPassed && !isTaskCompleted) {
          // Mark task as completed
          const newProgress = {
            ...progress,
            completedTaskIds: [...progress.completedTaskIds, currentTaskId],
            lastUsedModel: gptModel
          };
          
          // If this was the last task, mark as finished
          if (newProgress.completedTaskIds.length === practiceTasks.length) {
            newProgress.finishedAt = new Date().toISOString();
          }
          
          saveProgress(newProgress);
          
          toast({
            title: "Task Completed! ✅",
            description: `You've successfully completed task ${currentTaskId}`,
          });
        }
      } else {
        setAiResponse(`Error: ${data?.error || 'Unknown error'}`);
        toast({
          title: "AI Request Failed",
          description: "There was an error getting the AI response. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking prompt:', error);
      setAiResponse('Error: Failed to get AI response');
      toast({
        title: "Request Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingPrompt(false);
    }
  };

  const handleTaskSelect = (taskId: number) => {
    setCurrentTaskId(taskId);
    setUserPrompt("");
    setValidationResults([]);
    setAiResponse("");
  };

  const handleRetry = () => {
    setValidationResults([]);
    setAiResponse("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleCertificateFinish = (certificateId: string) => {
    const finalProgress = {
      ...progress,
      certificateId,
      finishedAt: new Date().toISOString()
    };
    saveProgress(finalProgress);
    
    if (onFinished) {
      onFinished(certificateId);
    }
  };

  if (showCertificate && allTasksCompleted) {
    return (
      <Certificate
        onFinished={handleCertificateFinish}
        brandName={brandName}
        completedTaskCount={progress.completedTaskIds.length}
        totalTasks={practiceTasks.length}
      />
    );
  }

  if (!currentTask) {
    return <div>Task not found</div>;
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-auto">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Task #{currentTask.id}: {currentTask.title}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Progress: {progress.completedTaskIds.length}/{practiceTasks.length}
              </div>
              <Progress value={progressPercentage} className="w-32 h-2" />
              {isTaskCompleted && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Task Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTaskSelect(Math.max(1, currentTaskId - 1))}
              disabled={currentTaskId === 1}
            >
              ← Previous Task
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">Task #{currentTask.id}</Badge>
              <Badge className={
                currentTask.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                currentTask.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {currentTask.difficulty}
              </Badge>
              <Badge variant="secondary">{currentTask.category}</Badge>
              {isTaskCompleted && (
                <Badge className="bg-green-500 text-white">
                  ✓ Completed
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTaskSelect(Math.min(practiceTasks.length, currentTaskId + 1))}
              disabled={currentTaskId === practiceTasks.length}
            >
              Next Task →
            </Button>
          </div>
        </CardContent>
      </Card>

      {allTasksCompleted && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Congratulations!</h3>
            <p className="text-sm text-muted-foreground mb-3">
              You've completed all tasks!
            </p>
            <Button 
              onClick={() => setShowCertificate(true)}
              className="w-full"
            >
              View Certificate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="flex-1 space-y-4 min-h-0">
        {/* Current Task Details */}
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="text-xl">{currentTask.title}</CardTitle>
              <p className="text-muted-foreground">{currentTask.description}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Instructions
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {currentTask.instructions}
                </p>
              </div>
              
              {currentTask.expectedElements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Expected Elements:</h4>
                  <ul className="text-sm space-y-1">
                    {currentTask.expectedElements.map((element, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Prompt Editor */}
        <div className="flex-shrink-0">
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Prompt</span>
              <div className="flex gap-2">
                {userPrompt && (
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHints(!showHints)}
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  {showHints ? 'Hide' : 'Show'} Hints
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-none">
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Write your prompt here..."
              className="min-h-32 resize-none"
            />
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleRunCheck}
                disabled={!userPrompt.trim() || isCheckingPrompt}
                className="flex items-center gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                {isCheckingPrompt ? 'Checking...' : 'Run Check'}
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <Clock className="h-4 w-4 inline mr-1" />
                Model: {gptModel}
              </div>
            </div>
          </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        {(validationResults.length > 0 || aiResponse) && (
          <div className="flex-shrink-0">
            <div className="grid md:grid-cols-2 gap-4">
            {/* Feedback Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validation Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-80 overflow-y-auto">
                {validationResults.map((result, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{result.message}</p>
                      {!result.passed && result.hint && showHints && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          💡 {result.hint}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Response Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>AI Response</span>
                  {aiResponse && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(aiResponse)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-80 overflow-y-auto">
                {aiResponse ? (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap" aria-label="Example AI Output">
                      {aiResponse}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <PlayCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Run a prompt check to see AI response</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </div>
        )}

        {/* Hint for Stuck Users */}
        {validationResults.some(r => !r.passed) && (
          <div className="flex-shrink-0">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Stuck? Click "I need help with this prompt" in the chat for personalized hints and guidance!
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};