import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlatformData {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon_name: string;
  popular: boolean;
  averageRating: number;
  usageCount: number;
}

export const usePlatforms = () => {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch platforms with their aggregated ratings and usage counts
      const { data, error } = await supabase
        .from('platforms')
        .select(`
          *,
          platform_ratings(rating),
          platform_usage(id)
        `);

      if (error) throw error;

      // Process the data to calculate averages and counts
      const processedPlatforms = data?.map(platform => {
        const ratings = platform.platform_ratings || [];
        const usageRecords = platform.platform_usage || [];
        
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
          : 0;
        
        const usageCount = usageRecords.length;

        return {
          id: platform.id,
          name: platform.name,
          description: platform.description,
          category: platform.category,
          url: platform.url,
          icon_name: platform.icon_name,
          popular: platform.popular,
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          usageCount
        };
      }) || [];

      setPlatforms(processedPlatforms);
    } catch (err) {
      console.error('Error fetching platforms:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch platforms');
    } finally {
      setLoading(false);
    }
  };

  const trackPlatformUsage = async (platformId: string) => {
    try {
      const { error } = await supabase
        .from('platform_usage')
        .insert({
          platform_id: platformId,
          action_type: 'click'
        });

      if (error) throw error;
      
      // Refresh platforms data to update usage counts
      await fetchPlatforms();
    } catch (err) {
      console.error('Error tracking platform usage:', err);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  return {
    platforms,
    loading,
    error,
    refetch: fetchPlatforms,
    trackPlatformUsage
  };
};