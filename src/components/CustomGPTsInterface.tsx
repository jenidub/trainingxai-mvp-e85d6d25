import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Bot, 
  Search,
  MessageSquare,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomGPT {
  id: string;
  name: string;
  description: string | null;
  instructions: string;
  created_at: string;
}

interface CustomGPTsInterfaceProps {
  onGPTSelect: (gpt: { id: string; name: string; type: 'custom' }) => void;
  isDemo?: boolean;
  onUpgrade?: () => void;
}

export const CustomGPTsInterface = ({ onGPTSelect, isDemo = false, onUpgrade }: CustomGPTsInterfaceProps) => {
  const [customGPTs, setCustomGPTs] = useState<CustomGPT[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadCustomGPTs();
    }
  }, [user]);

  const loadCustomGPTs = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_gpts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomGPTs(data || []);
    } catch (error) {
      console.error('Error loading custom GPTs:', error);
      toast({
        title: "Error",
        description: "Failed to load custom GPTs",
        variant: "destructive",
      });
    }
  };

  const saveGPT = async () => {
    if (!user || !formData.name.trim() || !formData.instructions.trim()) {
      toast({
        title: "Error",
        description: "Name and instructions are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from('custom_gpts')
          .update({
            name: formData.name,
            description: formData.description || null,
            instructions: formData.instructions,
          })
          .eq('id', editing)
          .eq('user_id', user.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Custom GPT updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('custom_gpts')
          .insert({
            user_id: user.id,
            name: formData.name,
            description: formData.description || null,
            instructions: formData.instructions,
          });

        if (error) throw error;
        toast({
          title: "Success",
          description: "Custom GPT created successfully",
        });
      }

      setFormData({ name: '', description: '', instructions: '' });
      setEditing(null);
      setShowCreateForm(false);
      loadCustomGPTs();
    } catch (error) {
      console.error('Error saving GPT:', error);
      toast({
        title: "Error",
        description: "Failed to save custom GPT",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGPT = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom GPT?')) return;

    try {
      const { error } = await supabase
        .from('custom_gpts')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setCustomGPTs(prev => prev.filter(gpt => gpt.id !== id));
      toast({
        title: "Success",
        description: "Custom GPT deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting GPT:', error);
      toast({
        title: "Error",
        description: "Failed to delete custom GPT",
        variant: "destructive",
      });
    }
  };

  const editGPT = (gpt: CustomGPT) => {
    setFormData({
      name: gpt.name,
      description: gpt.description || '',
      instructions: gpt.instructions,
    });
    setEditing(gpt.id);
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setFormData({ name: '', description: '', instructions: '' });
    setEditing(null);
    setShowCreateForm(false);
  };

  const handleGPTClick = (gpt: CustomGPT) => {
    if (isDemo && onUpgrade) {
      onUpgrade();
    } else {
      onGPTSelect({ id: gpt.id, name: gpt.name, type: 'custom' });
    }
  };

  const filteredGPTs = customGPTs.filter(gpt =>
    gpt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gpt.description && gpt.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isDemo) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Custom GPTs</h1>
          </div>
          <p className="text-muted-foreground">
            Create and manage your personalized AI assistants tailored to your specific needs.
          </p>
        </div>

        {/* Demo Message */}
        <Card className="p-8 text-center border-2 border-primary">
          <Bot className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Custom GPT Creation</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Build specialized AI assistants for coding, writing, research, or any specific task. Create unlimited custom GPTs with a free account.
          </p>
          <Button onClick={onUpgrade} className="gradient-primary text-white border-0">
            Sign Up to Create Custom GPTs
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Custom GPTs</h1>
        </div>
        <p className="text-muted-foreground">
          Create and manage your personalized AI assistants tailored to your specific needs.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your GPTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New GPT
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>
              {editing ? 'Edit Custom GPT' : 'Create New Custom GPT'}
            </CardTitle>
            <CardDescription>
              {editing ? 'Update your AI assistant configuration' : 'Build your personalized AI assistant'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gpt-name">Name *</Label>
                <Input
                  id="gpt-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., My Coding Assistant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpt-description">Description</Label>
                <Input
                  id="gpt-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the GPT"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpt-instructions">Instructions *</Label>
              <Textarea
                id="gpt-instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Detailed instructions for how this GPT should behave, its personality, capabilities, and specific responses..."
                rows={6}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveGPT} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : editing ? 'Update GPT' : 'Create GPT'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GPTs Grid */}
      {filteredGPTs.length === 0 && !showCreateForm ? (
        <Card className="p-12 text-center">
          <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Custom GPTs Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first custom AI assistant to get started. You can build specialized GPTs for coding, writing, research, or any specific task you need help with.
          </p>
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First GPT
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGPTs.map((gpt) => (
            <Card 
              key={gpt.id} 
              className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/20"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        editGPT(gpt);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGPT(gpt.id);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div onClick={() => handleGPTClick(gpt)}>
                  <CardTitle className="text-lg group-hover:text-primary transition-smooth mb-2">
                    {gpt.name}
                  </CardTitle>
                  {gpt.description && (
                    <CardDescription className="text-sm leading-relaxed">
                      {gpt.description}
                    </CardDescription>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {gpt.instructions}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(gpt.created_at).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="h-5">Custom</Badge>
                  </div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleGPTClick(gpt)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};