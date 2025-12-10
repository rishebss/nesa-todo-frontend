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
import { Plus, Calendar, Tag, FileText, Clock, ArrowUpRight, CheckSquare } from 'lucide-react';

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

  // Format date for datetime-local input
  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    // Format: YYYY-MM-DDTHH:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Handle date change - convert to ISO string
  const handleDeadlineChange = (value) => {
    if (!value) {
      onFormChange('deadline', null);
      return;
    }
    
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      onFormChange('deadline', date.toISOString());
    }
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
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Task Title *
              </label>
              <Input
                value={formData.title || ''}
                onChange={(e) => onFormChange('title', e.target.value)}
                placeholder="What needs to be done?"
                className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
                required
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title?.length || 0}/200 characters
              </p>
            </div>
            
            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => onFormChange('description', e.target.value)}
                placeholder="Add details about this task..."
                rows="3"
                className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description?.length || 0}/1000 characters
              </p>
            </div>
            
            {/* Status and Deadline Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Status
                </label>
                <Select 
                  value={formData.status || 'pending'} 
                  onValueChange={(value) => onFormChange('status', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="pending" className="text-yellow-400 hover:bg-gray-800 focus:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-400" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress" className="text-blue-400 hover:bg-gray-800 focus:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="completed" className="text-green-400 hover:bg-gray-800 focus:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        Completed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Deadline Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Deadline
                </label>
                <Input
                  type="datetime-local"
                  value={formatForDateTimeLocal(formData.deadline)}
                  onChange={(e) => handleDeadlineChange(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading}
                  min={new Date().toISOString().slice(0, 16)} // Prevent past dates
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading || !formData.title?.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Task
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoCreateModal;