import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, MessageSquare, Lightbulb } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

const NotebookLMPractice = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const { toast } = useToast();

  const practicePrompts = [
    "Summarize the main themes in the uploaded documents",
    "What are the key findings or conclusions?",
    "Compare and contrast the different perspectives presented",
    "Generate questions based on the content for further research"
  ];

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedDocs(prev => [...prev, ...fileNames]);
      toast({
        title: "Documents uploaded",
        description: `${fileNames.length} document(s) ready for analysis`,
      });
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('notebooklm-chat', {
        body: { 
          message,
          documents: uploadedDocs,
          context: messages
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        sources: data.sources || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-lg">📚</span>
          </div>
          <div>
            <h2 className="font-semibold">NotebookLM Practice Space</h2>
            <p className="text-sm text-muted-foreground">Learn to analyze documents and ask better questions</p>
          </div>
          <Badge variant="secondary" className="ml-auto">Practice Mode</Badge>
        </div>
      </div>

      {/* Document Upload Area */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleDocumentUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Documents
              </Button>
            </label>
          </div>
          {uploadedDocs.length > 0 && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {uploadedDocs.length} document(s) uploaded
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Practice Tips */}
      <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-b">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Practice Tips</h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Try asking specific questions about your documents. Use the suggested prompts below to get started.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium mb-2">Suggested Prompts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {practicePrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="justify-start text-left h-auto py-2 px-3"
              onClick={() => sendMessage(prompt)}
              disabled={isLoading || uploadedDocs.length === 0}
            >
              <span className="text-xs">{prompt}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Ready to practice!</h3>
            <p className="text-sm text-muted-foreground">
              Upload some documents and start asking questions to practice NotebookLM-style analysis.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Card key={index} className={`p-4 ${message.role === 'user' ? 'ml-8 bg-primary/5' : 'mr-8'}`}>
              <div className="font-medium text-sm mb-2">
                {message.role === 'user' ? 'You' : 'NotebookLM Practice'}
              </div>
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Sources:</div>
                  <div className="flex flex-wrap gap-1">
                    {message.sources.map((source, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background/50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 min-h-[40px] max-h-32 resize-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            disabled={isLoading || uploadedDocs.length === 0}
          />
          <Button 
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim() || uploadedDocs.length === 0}
            size="sm"
          >
            Send
          </Button>
        </div>
        {uploadedDocs.length === 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Upload documents first to start the conversation
          </p>
        )}
      </div>
    </div>
  );
};

export default NotebookLMPractice;