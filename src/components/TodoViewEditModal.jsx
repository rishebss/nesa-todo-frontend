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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Edit2, 
  Trash2, 
  Save, 
  FileText, 
  Tag, 
  User, 
  Calendar, 
  AlertTriangle,
  Square,
  ArrowUpRight,
  CheckSquare,
  CheckCircle,
  Clock,
  Timer
} from 'lucide-react';

const TodoViewEditModal = ({
  open,
  onOpenChange,
  todo,
  isEditing,
  setIsEditing,
  editFormData,
  onEditFormChange,
  onSaveEdit,
  onDelete,
  onCancelEdit,
  loading = false,
  deleteLoading = false
}) => {
  if (!todo) return null;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckSquare className="h-4 w-4" />;
      case 'in-progress': return <ArrowUpRight className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status, isOverdue) => {
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="gap-1 animate-pulse bg-red-600 hover:bg-red-700">
          <AlertTriangle className="h-3 w-3" />
          OVERDUE
        </Badge>
      );
    }
    
    switch(status) {
      case 'completed':
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> In Progress</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const overdue = isOverdue(todo.deadline) && todo.status !== 'completed';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md sm:max-w-xl">
        <DialogHeader>
          <div className="flex justify-between items-center mb-2">
            <DialogTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              {isEditing ? 'Edit Task' : 'Task Details'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            {isEditing ? 'Update the task details below' : 'View and manage your task'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Task Title
            </label>
            {isEditing ? (
              <Input
                value={editFormData.title}
                onChange={(e) => onEditFormChange('title', e.target.value)}
                placeholder="Task title"
                className="bg-gray-800/50 border-gray-700 text-white"
                disabled={loading}
              />
            ) : (
              <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                <p className="text-gray-100">{todo.title}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Description
            </label>
            {isEditing ? (
              <Textarea
                value={editFormData.description}
                onChange={(e) => onEditFormChange('description', e.target.value)}
                placeholder="Task description"
                rows="3"
                className="bg-gray-800/50 border-gray-700 text-white"
                disabled={loading}
              />
            ) : (
              <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 min-h-[80px]">
                <p className="text-gray-300 whitespace-pre-wrap">{todo.description}</p>
              </div>
            )}
          </div>

          {/* Status & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              {isEditing ? (
                <Select 
                  value={editFormData.status} 
                  onValueChange={(value) => onEditFormChange('status', value)}
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
              ) : (
                <div className={`p-3 rounded-lg border ${
                  todo.status === 'completed' ? 'bg-green-900/20 border-green-700/30' :
                  todo.status === 'in-progress' ? 'bg-blue-900/20 border-blue-700/30' :
                  'bg-yellow-900/20 border-yellow-700/30'
                }`}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(todo.status)}
                    <span className={`font-medium ${
                      todo.status === 'completed' ? 'text-green-400' :
                      todo.status === 'in-progress' ? 'text-blue-400' :
                      'text-yellow-400'
                    }`}>
                      {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(todo.status, overdue)}
                  </div>
                </div>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Deadline
              </label>
              {isEditing ? (
                <Input
                  type="datetime-local"
                  value={editFormData.deadline}
                  onChange={(e) => onEditFormChange('deadline', e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white"
                  disabled={loading}
                />
              ) : (
                <div className={`p-3 rounded-lg border ${
                  overdue 
                    ? 'bg-red-900/20 border-red-700/30' 
                    : 'bg-gray-800/30 border-gray-700'
                }`}>
                  <p className={`font-medium ${
                    overdue ? 'text-red-400' : 'text-gray-100'
                  }`}>
                    {formatDate(todo.deadline)} at {formatTime(todo.deadline)}
                  </p>
                  {overdue && (
                    <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Overdue
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          

    
        </div>
        
        {/* Dialog Footer */}
        <DialogFooter className="gap-3 pt-4 border-t border-gray-800">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={onCancelEdit}
                className="border-gray-700 hover:bg-gray-800"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={onSaveEdit}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-gray-700 hover:bg-gray-800 gap-2"
                disabled={loading}
              >
                <Edit2 className="h-4 w-4" />
                Edit Task
              </Button>
              <Button
                onClick={() => onDelete(todo.id || todo._id)}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 gap-2"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TodoViewEditModal;