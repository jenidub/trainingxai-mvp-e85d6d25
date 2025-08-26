import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  task_id?: number;
  progress_data: any;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressState {
  completedTaskIds: number[];
  startedAt: string;
  finishedAt?: string;
  certificateId?: string;
  learnerName?: string;
  lastUsedModel?: string;
}

export const useUserProgress = (courseId: string) => {
  const [progress, setProgress] = useState<ProgressState>({
    completedTaskIds: [],
    startedAt: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load progress from database
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_course_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();

        if (error) {
          console.error('Error loading progress:', error);
          return;
        }

        if (data) {
          const progressData = data.progress_data as any;
          // Ensure the data has the correct structure
          const safeProgress: ProgressState = {
            completedTaskIds: progressData?.completedTaskIds || [],
            startedAt: progressData?.startedAt || new Date().toISOString(),
            finishedAt: progressData?.finishedAt,
            certificateId: progressData?.certificateId,
            learnerName: progressData?.learnerName,
            lastUsedModel: progressData?.lastUsedModel,
          };
          setProgress(safeProgress);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user, courseId]);

  // Save progress to database
  const saveProgress = async (newProgress: ProgressState) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your progress.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress_data: newProgress as any,
          completed_at: newProgress.finishedAt || null
        });

      if (error) {
        console.error('Error saving progress:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save your progress. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setProgress(newProgress);
      
      // Also save to localStorage as backup
      localStorage.setItem(`${courseId}_progress`, JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Save task completion
  const saveTaskCompletion = async (taskId: number, taskData: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          task_id: taskId,
          progress_data: taskData as any,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving task completion:', error);
      }
    } catch (error) {
      console.error('Error saving task completion:', error);
    }
  };

  // Get course progress overview
  const getCourseOverview = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return null;

    try {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('course_id, progress_data, completed_at')
        .eq('user_id', targetUserId)
        .is('task_id', null); // Only get overall course progress, not individual tasks

      if (error) {
        console.error('Error loading course overview:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error loading course overview:', error);
      return null;
    }
  };

  return {
    progress,
    setProgress,
    saveProgress,
    saveTaskCompletion,
    getCourseOverview,
    isLoading,
    isAuthenticated: !!user
  };
};