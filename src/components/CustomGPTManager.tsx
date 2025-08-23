import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Save, X, Bot } from 'lucide-react';
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

interface CustomGPTManagerProps {
  onGPTSelect?: (gpt: { id: string; name: string; type: 'custom' }) => void;
}

export const CustomGPTManager = ({ onGPTSelect }: CustomGPTManagerProps) => {
  const [customGPTs, setCustomGPTs] = useState<CustomGPT[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      loadCustomGPTs();
    }
  }, [open, user]);

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
  };

  const cancelEdit = () => {
    setFormData({ name: '', description: '', instructions: '' });
    setEditing(null);
  };

  const handleGPTClick = (gpt: CustomGPT) => {
    if (onGPTSelect) {
      onGPTSelect({ id: gpt.id, name: gpt.name, type: 'custom' });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 transition-spring hover:shadow-primary">
          <Plus className="h-4 w-4 mr-1" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Custom GPTs</DialogTitle>
          <DialogDescription>
            Create and manage your custom AI assistants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create/Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editing ? 'Edit Custom GPT' : 'Create New Custom GPT'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gpt-name">Name</Label>
                  <Input
                    id="gpt-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., My Coding Assistant"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpt-description">Description (Optional)</Label>
                  <Input
                    id="gpt-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the GPT"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpt-instructions">Instructions</Label>
                <Textarea
                  id="gpt-instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Detailed instructions for how this GPT should behave..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveGPT} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
                </Button>
                {editing && (
                  <Button variant="outline" onClick={cancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Existing GPTs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Custom GPTs</h3>
            {customGPTs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No custom GPTs yet. Create your first one above!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {customGPTs.map((gpt) => (
                  <Card key={gpt.id} className="cursor-pointer hover:shadow-card transition-smooth">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1" onClick={() => handleGPTClick(gpt)}>
                          <CardTitle className="text-base">{gpt.name}</CardTitle>
                          {gpt.description && (
                            <CardDescription className="mt-1">
                              {gpt.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              editGPT(gpt);
                            }}
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
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {gpt.instructions}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        Created {new Date(gpt.created_at).toLocaleDateString()}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
