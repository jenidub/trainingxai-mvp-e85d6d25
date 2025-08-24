import { PDFTemplate } from './pdfTemplates';

interface AnalyticsData {
  total_time_minutes?: number;
  sessions_count?: number;
  avg_session_minutes?: number;
  achievements_count?: number;
  projects_count?: number;
  certificates_earned?: number;
}

interface TrainingTrack {
  track: string;
  level: string;
  progress: number;
  badges_earned: number;
  certificates_earned: number;
}

interface Project {
  id: string;
  name: string;
  category: string;
  type: string;
  created_at: string;
}

export const generateTrainingReport = async (
  trainingData: TrainingTrack[], 
  userEmail?: string,
  filterType: string = 'Core Skills'
) => {
  const template = new PDFTemplate();
  
  // Add header
  template.addHeader({
    title: 'Training Zone Report',
    subtitle: `${filterType} Progress Overview`,
    generatedDate: new Date().toLocaleDateString(),
    userEmail
  });

  // Training Summary Section
  template.addSection('Training Summary');
  
  const totalTracks = trainingData.length;
  const completedTracks = trainingData.filter(track => track.progress === 100).length;
  const totalBadges = trainingData.reduce((sum, track) => sum + track.badges_earned, 0);
  const totalCertificates = trainingData.reduce((sum, track) => sum + track.certificates_earned, 0);
  const avgProgress = totalTracks > 0 ? Math.round(trainingData.reduce((sum, track) => sum + track.progress, 0) / totalTracks) : 0;

  template.addMetricCard('Total Training Tracks', totalTracks.toString(), `${filterType} filter applied`);
  template.addMetricCard('Completed Tracks', completedTracks.toString(), `${Math.round((completedTracks/totalTracks) * 100)}% completion rate`);
  template.addMetricCard('Badges Earned', totalBadges.toString(), 'Across all tracks');
  template.addMetricCard('Certificates Earned', totalCertificates.toString(), 'Professional certifications');
  template.addMetricCard('Average Progress', `${avgProgress}%`, 'Across all active tracks');

  // Detailed Progress Section
  template.addSection('Detailed Track Progress');
  
  if (trainingData.length > 0) {
    const headers = ['Track Name', 'Level', 'Progress', 'Badges', 'Certificates'];
    const rows = trainingData.map(track => [
      track.track,
      track.level,
      `${track.progress}%`,
      `${track.badges_earned}/5`,
      `${track.certificates_earned}/2`
    ]);
    
    template.addTable(headers, rows);
  } else {
    template.addText('No training data available for the selected filter.', 12, [107, 114, 128]);
  }

  template.save('training-zone-report.pdf');
};

export const generatePortfolioReport = async (
  projects: Project[], 
  userEmail?: string,
  filterType: string = 'All Projects'
) => {
  const template = new PDFTemplate();
  
  // Add header
  template.addHeader({
    title: 'Portfolio Report',
    subtitle: `${filterType} Overview`,
    generatedDate: new Date().toLocaleDateString(),
    userEmail
  });

  // Portfolio Summary Section
  template.addSection('Portfolio Summary');
  
  const totalProjects = projects.length;
  const projectsByCategory = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostActiveCategory = Object.entries(projectsByCategory)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  template.addMetricCard('Total Projects', totalProjects.toString(), `${filterType} filter applied`);
  template.addMetricCard('Categories', Object.keys(projectsByCategory).length.toString(), 'Different project types');
  template.addMetricCard('Most Active Category', mostActiveCategory, 'Highest project count');

  // Projects by Category Section
  if (Object.keys(projectsByCategory).length > 0) {
    template.addSection('Projects by Category');
    
    const headers = ['Category', 'Project Count', 'Percentage'];
    const rows = Object.entries(projectsByCategory).map(([category, count]) => [
      category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count.toString(),
      `${Math.round((count / totalProjects) * 100)}%`
    ]);
    
    template.addTable(headers, rows);
  }

  // Detailed Projects Section
  template.addSection('Project Details');
  
  if (projects.length > 0) {
    const headers = ['Project Name', 'Category', 'Type', 'Created Date'];
    const rows = projects.slice(0, 20).map(project => [ // Limit to first 20 projects
      project.name,
      project.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      project.type,
      new Date(project.created_at).toLocaleDateString()
    ]);
    
    template.addTable(headers, rows);
    
    if (projects.length > 20) {
      template.addText(`... and ${projects.length - 20} more projects`, 10, [107, 114, 128]);
    }
  } else {
    template.addText('No projects available for the selected filter.', 12, [107, 114, 128]);
  }

  template.save('portfolio-report.pdf');
};

export const generateAnalyticsReport = async (
  analytics: AnalyticsData, 
  userEmail?: string,
  timeRange: string = 'Weekly'
) => {
  const template = new PDFTemplate();
  
  // Add header
  template.addHeader({
    title: 'Analytics Report',
    subtitle: `${timeRange} Performance Overview`,
    generatedDate: new Date().toLocaleDateString(),
    userEmail
  });

  // Analytics Summary Section
  template.addSection('Performance Metrics');
  
  const totalHours = Math.floor((analytics.total_time_minutes || 0) / 60);
  const totalMinutes = (analytics.total_time_minutes || 0) % 60;
  const avgSessionTime = Math.round(analytics.avg_session_minutes || 0);
  
  template.addMetricCard('Total Time', `${totalHours}h ${totalMinutes}m`, `${timeRange.toLowerCase()} activity`);
  template.addMetricCard('Sessions', (analytics.sessions_count || 0).toString(), 'Learning sessions');
  template.addMetricCard('Avg Session', `${avgSessionTime} min`, 'Average session duration');
  template.addMetricCard('Achievements', (analytics.achievements_count || 0).toString(), 'Unlocked achievements');
  template.addMetricCard('Active Projects', (analytics.projects_count || 0).toString(), 'Current projects');
  template.addMetricCard('Certificates', (analytics.certificates_earned || 0).toString(), 'Earned certificates');

  // Performance Insights Section
  template.addSection('Performance Insights');
  
  const insights = [];
  
  if ((analytics.total_time_minutes || 0) > 300) {
    insights.push('🎯 Excellent engagement! You\'ve spent significant time learning this period.');
  }
  
  if ((analytics.avg_session_minutes || 0) > 30) {
    insights.push('📚 Great focus! Your sessions are substantial and productive.');
  }
  
  if ((analytics.sessions_count || 0) > 10) {
    insights.push('🔥 Consistent learner! You maintain regular learning sessions.');
  }
  
  if ((analytics.achievements_count || 0) > 5) {
    insights.push('🏆 Achievement hunter! You\'re making great progress.');
  }

  if (insights.length === 0) {
    insights.push('📈 Keep building your learning momentum! Every session counts.');
  }

  insights.forEach(insight => {
    template.addText(insight, 12, [34, 197, 94]);
  });

  template.save('analytics-report.pdf');
};

// Legacy functions for backward compatibility
export const downloadTrainingReport = async () => {
  // This will be called from the component with actual data
  console.log('Use generateTrainingReport with actual data instead');
};

export const downloadPortfolioReport = async () => {
  // This will be called from the component with actual data
  console.log('Use generatePortfolioReport with actual data instead');
};

export const downloadAnalyticsReport = async () => {
  // This will be called from the component with actual data
  console.log('Use generateAnalyticsReport with actual data instead');
};