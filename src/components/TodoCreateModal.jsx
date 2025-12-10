import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Calendar, Tag, User, Square, ArrowUpRight, CheckSquare } from 'lucide-react';

const TodoCreateModal = ({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  loading = false
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-400" />
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new task to your todo list
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Task Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => onFormChange('title', e.target.value)}
                placeholder="What needs to be done?"
                className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                placeholder="Add details about this task..."
                rows="3"
                className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
                disabled={loading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Deadline *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => onFormChange('deadline', e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => onFormChange('status', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="pending" className="text-yellow-400 hover:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress" className="text-blue-400 hover:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="completed" className="text-green-400 hover:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Completed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 hover:bg-gray-800"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-white text-gray-900 hover:bg-gray-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Creating...
                </>
              ) : (
                <>
                  
                  Create Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoCreateModal;