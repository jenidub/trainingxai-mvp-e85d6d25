import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Download, 
  ExternalLink, 
  Lightbulb,
  Target,
  Zap,
  MessageSquare,
  FileText,
  Sparkles
} from 'lucide-react';

interface AIPlatform {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon_name?: string;
  popular?: boolean;
  rating?: number;
  usageCount?: number;
}

interface PlatformReadyDialogProps {
  platform: AIPlatform | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const platformTips: Record<string, string[]> = {
  chatgpt: [
    "Start with clear, specific instructions and provide context for better responses",
    "Use role-playing prompts like 'Act as a [profession]' for specialized knowledge",
    "Break complex tasks into smaller, sequential steps for better results",
    "Iterate and refine your prompts based on the AI's initial responses",
    "Use examples in your prompts to guide the desired output format and style"
  ],
  claude: [
    "Claude excels with detailed, structured prompts that include clear objectives",
    "Use markdown formatting in your prompts for better organization and clarity",
    "Leverage Claude's strong reasoning by asking for step-by-step explanations",
    "Be explicit about safety considerations and ethical boundaries in sensitive topics",
    "Take advantage of Claude's long context window for complex, multi-part tasks"
  ],
  notebooklm: [
    "Upload your documents first, then ask specific questions about the content",
    "Use natural language queries to explore connections between different sources",
    "Request summaries and key insights from your uploaded research materials",
    "Ask for citations and references to verify information accuracy",
    "Generate study guides and timelines from your source materials for better learning"
  ],
  gamma: [
    "Start with a clear presentation topic and target audience in mind",
    "Use descriptive prompts that include visual style preferences and branding",
    "Specify the number of slides and key sections you want in your presentation",
    "Request specific chart types and data visualizations for better impact",
    "Iterate on design elements by asking for style adjustments and layout changes"
  ]
};

export const PlatformReadyDialog = ({ platform, open, onOpenChange }: PlatformReadyDialogProps) => {
  if (!platform) return null;

  const tips = platformTips[platform.id] || [];

  const handleDownloadGuide = () => {
    // Placeholder for PDF download functionality
    console.log(`Downloading guide for ${platform.name}`);
  };

  const handleOpenPlatform = () => {
    window.open(platform.url, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                Get Ready to Practice on {platform.name}
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                Prepare yourself with expert tips and resources before you dive in
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Top 5 Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Top 5 Prompting Tips for {platform.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Resource Guide Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Resource Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Download className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{platform.name} Prompting Guide</h4>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive prompting strategies and examples
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadGuide}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Button */}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="w-full max-w-md" 
              onClick={handleOpenPlatform}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              You Are Ready - Open {platform.name}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};