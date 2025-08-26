import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Award, Download, Printer, Calendar, User, Hash } from "lucide-react";

interface CertificateProps {
  onFinished?: (certificateId: string) => void;
  brandName?: string;
  completedTaskCount: number;
  totalTasks: number;
}

export const Certificate = ({ 
  onFinished, 
  brandName = "Somos Ujima",
  completedTaskCount,
  totalTasks 
}: CertificateProps) => {
  const [learnerName, setLearnerName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const today = new Date();
  const certificateId = `PEF-FP-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    setIsGenerating(true);
    // Simulate download generation
    setTimeout(() => {
      setIsGenerating(false);
      // In a real implementation, this would generate a PDF
      alert("Certificate download would start here (PDF generation not implemented in demo)");
    }, 2000);
  };

  const handleFinish = () => {
    if (onFinished) {
      onFinished(certificateId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Certificate Customization */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personalize Your Certificate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="learnerName">Your Name</Label>
            <Input
              id="learnerName"
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              placeholder="Enter your full name"
              className="max-w-md"
            />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {today.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              {certificateId}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Preview */}
      <Card className="border-2 border-primary/30 print:border-none print:shadow-none">
        <CardContent className="p-12 space-y-8 text-center print:p-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Award className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground print:text-black">
                Certificate of Completion
              </h1>
              <h2 className="text-2xl font-semibold text-primary print:text-gray-800">
                Fundamentals of Prompt Engineering
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground print:text-gray-700">
              This certifies that
            </p>
            
            <div className="py-4 border-b-2 border-primary/20 print:border-gray-300">
              <p className="text-3xl font-bold text-foreground print:text-black">
                {learnerName || "________________"}
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground print:text-gray-700">
                has successfully completed all {totalTasks} practice tasks in the
              </p>
              <p className="text-xl font-semibold text-foreground print:text-black">
                Prompt Engineering Fundamentals Course
              </p>
              <p className="text-base text-muted-foreground print:text-gray-700">
                demonstrating proficiency in AI communication, 
                prompt structure, and educational AI applications.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="font-semibold text-foreground print:text-black">{brandName}</p>
                <p className="text-sm text-muted-foreground print:text-gray-600">Issuing Organization</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground print:text-black">{today.toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground print:text-gray-600">Date of Completion</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/20 print:border-gray-300">
              <Badge variant="outline" className="text-xs print:border-gray-400">
                Certificate ID: {certificateId}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
        <Button 
          onClick={handlePrint}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Certificate
        </Button>
        
        <Button 
          onClick={handleDownload}
          variant="outline"
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Download PDF"}
        </Button>
        
        <Button 
          onClick={handleFinish}
          className="flex items-center gap-2"
        >
          <Award className="h-4 w-4" />
          Complete Course
        </Button>
      </div>
    </div>
  );
};