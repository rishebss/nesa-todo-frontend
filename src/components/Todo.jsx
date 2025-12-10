import React, { useState, useEffect } from 'react';
import { todoApi } from '@/services/api';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Search,
  X,
  Eye,
  CheckSquare,
  Square,
  ArrowUpRight,
  Tag,
  User,
  Save,
  CalendarDays,
  Timer,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Todo = () => {
  // State management
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Selected todo
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'pending'
  });

  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'pending'
  });

  // Load todos
  const loadTodos = async () => {
    setLoading(true);
    try {
      const { page, limit } = pagination;
      const response = await todoApi.getTodos(page, limit, filters.status);
      setTodos(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      toast.error('Failed to load todos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTodos();
  }, [pagination.page, filters.status]);

  // Status badge colors with stronger overdue
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

  // Card background based on status
  const getCardBackground = (status, isOverdue) => {
    if (isOverdue) {
      return "bg-gradient-to-br from-red-950/40 via-red-900/30 to-red-950/40 border-red-700/50 hover:border-red-600";
    }
    
    switch(status) {
      case 'completed':
        return "bg-gradient-to-br from-green-950/20 via-gray-900/30 to-gray-950/30 border-green-700/30 hover:border-green-600/50";
      case 'in-progress':
        return "bg-gradient-to-br from-blue-950/20 via-gray-900/30 to-gray-950/30 border-blue-700/30 hover:border-blue-600/50";
      default:
        return "bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-gray-950/30 border-gray-700 hover:border-gray-600";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate if overdue
  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilters({ ...filters, status });
    setPagination({ ...pagination, page: 1 });
  };

  // Handle create todo
  const handleCreateSubmit = async () => {
    if (!createFormData.title.trim() || !createFormData.description.trim() || !createFormData.deadline) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await todoApi.createTodo(createFormData);
      toast.success('Todo created successfully');
      setCreateDialogOpen(false);
      setCreateFormData({
        title: '',
        description: '',
        deadline: '',
        status: 'pending'
      });
      loadTodos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  // Handle edit todo (inline in dialog)
  const handleEditSubmit = async () => {
    if (!editFormData.title.trim() || !editFormData.description.trim() || !editFormData.deadline) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await todoApi.updateTodo(selectedTodo.id, editFormData);
      toast.success('Todo updated successfully');
      setIsEditing(false);
      loadTodos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

// Handle delete
const handleDelete = async (id) => {
  console.log('🔄 Delete initiated for ID:', id);
  
  if (!window.confirm('Are you sure you want to delete this todo?')) return;

  try {
    // Log the ID to check format
    console.log('📤 Sending delete request for ID:', id);
    console.log('📤 Full todo object:', selectedTodo);
    
    // Try multiple ID formats
    const todoId = id || selectedTodo?.id || selectedTodo?._id;
    console.log('🔍 Using ID for deletion:', todoId);
    
    if (!todoId) {
      toast.error('Cannot delete: No ID found');
      return;
    }

    const response = await todoApi.deleteTodo(todoId);
    console.log('✅ Delete response:', response.data);
    
    toast.success('Todo deleted successfully');
    setViewDialogOpen(false);
    loadTodos();
  } catch (error) {
    console.error('❌ Delete error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Show more specific error messages
    if (error.response?.status === 404) {
      toast.error('Todo not found. It may have already been deleted.');
    } else if (error.response?.status === 400) {
      toast.error('Invalid todo ID format');
    } else {
      toast.error(`Failed to delete todo: ${error.response?.data?.error || error.message}`);
    }
  }
};
  // Handle view
  const handleView = (todo) => {
    setSelectedTodo(todo);
    setEditFormData({
      title: todo.title,
      description: todo.description,
      deadline: todo.deadline.split('T')[0] + 'T' + todo.deadline.split('T')[1].substring(0, 5),
      status: todo.status
    });
    setIsEditing(false);
    setViewDialogOpen(true);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckSquare className="h-4 w-4" />;
      case 'in-progress': return <ArrowUpRight className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-100 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Task Dashboard
          </h2>
          <p className="text-gray-400">Manage your tasks efficiently</p>
        </div>
        
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4" />
          Create New Task
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
          { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
          { value: 'completed', label: 'Completed', color: 'bg-green-500' },
          { value: 'overdue', label: 'Overdue', color: 'bg-red-500' }
        ].map((option) => (
          <div key={option.value} className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{option.label}</p>
                <p className="text-2xl font-bold text-gray-100">0</p>
              </div>
              <div className={`h-10 w-10 rounded-full ${option.color}/20 flex items-center justify-center`}>
                {option.value === 'overdue' ? (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                ) : (
                  getStatusIcon(option.value)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/30 backdrop-blur-sm border-gray-800 mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300">Quick Filters</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { value: '', label: 'All Todos' },
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.status === option.value
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <div className="md:ml-auto flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todo Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading tasks...</p>
          </div>
        </div>
      ) : todos.length === 0 ? (
        <Card className="bg-gray-900/30 backdrop-blur-sm border-gray-800">
          <CardContent className="py-20 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first task</p>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {todos.map((todo) => {
              const overdue = isOverdue(todo.deadline) && todo.status !== 'completed';
              
              return (
                <Card 
                  key={todo.id}
                  className={`group ${getCardBackground(todo.status, overdue)} 
                    backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] 
                    hover:shadow-2xl cursor-pointer relative overflow-hidden
                    ${overdue ? 'hover:border-red-500 shadow-red-900/20' : ''}`}
                  onClick={() => handleView(todo)}
                >
                  {/* Overdue warning stripe */}
                  {overdue && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 animate-pulse" />
                  )}
                  
                  <CardContent className="p-6">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold line-clamp-1 ${
                          overdue ? 'text-red-200' : 'text-gray-100'
                        }`}>
                          {todo.title}
                        </h3>
                        <p className={`text-sm mt-1 line-clamp-2 ${
                          overdue ? 'text-red-300/80' : 'text-gray-400'
                        }`}>
                          {todo.description}
                        </p>
                      </div>
                      <div className="ml-2">
                        {getStatusBadge(todo.status, overdue)}
                      </div>
                    </div>

                    {/* Deadline with strong overdue indicator */}
                    <div className={`flex items-center gap-2 text-sm mb-4 p-3 rounded-lg ${
                      overdue 
                        ? 'bg-red-900/30 border border-red-700/50' 
                        : 'bg-gray-800/30'
                    }`}>
                      <Calendar className={`h-4 w-4 ${overdue ? 'text-red-400' : 'text-gray-500'}`} />
                      <div>
                        <p className={`font-medium ${overdue ? 'text-red-300' : 'text-gray-300'}`}>
                          {formatDate(todo.deadline)} at {formatTime(todo.deadline)}
                        </p>
                        {overdue && (
                          <p className="text-xs text-red-400 font-semibold flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            OVERDUE - NEEDS ATTENTION
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                      <span>Created {new Date(todo.createdAt).toLocaleDateString()}</span>
                      {overdue && (
                        <Timer className="h-3 w-3 text-red-400 animate-pulse" />
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`w-full ${
                        overdue 
                          ? 'border-red-700/50 hover:bg-red-900/30 text-red-300 hover:text-red-200' 
                          : 'border-gray-700 hover:bg-gray-800 text-gray-300 group-hover:border-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(todo);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800 pt-8">
              <div className="text-sm text-gray-400">
                Page {pagination.page} of {pagination.totalPages} •{' '}
                {pagination.total} total tasks
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="border-gray-700 hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[40px] ${
                          pagination.page === pageNum
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            : "border-gray-700 hover:bg-gray-800"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="border-gray-700 hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* CREATE NEW TASK DIALOG */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
          
          <div className="space-y-5 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Task Title *
              </label>
              <Input
                value={createFormData.title}
                onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                placeholder="What needs to be done?"
                className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Description *
              </label>
              <Textarea
                value={createFormData.description}
                onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                placeholder="Add details about this task..."
                rows="3"
                className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
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
                  value={createFormData.deadline}
                  onChange={(e) => setCreateFormData({ ...createFormData, deadline: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <Select 
                  value={createFormData.status} 
                  onValueChange={(value) => setCreateFormData({ ...createFormData, status: value })}
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
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW/EDIT TASK DIALOG */}
      <Dialog open={viewDialogOpen} onOpenChange={(open) => {
        setViewDialogOpen(open);
        if (!open) {
          setIsEditing(false);
          // Reset form when closing
          if (selectedTodo && !isEditing) {
            setEditFormData({
              title: selectedTodo.title,
              description: selectedTodo.description,
              deadline: selectedTodo.deadline.split('T')[0] + 'T' + selectedTodo.deadline.split('T')[1].substring(0, 5),
              status: selectedTodo.status
            });
          }
        }
      }}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md sm:max-w-xl">
          {selectedTodo && (
            <>
              {/* Dialog Header - Clean */}
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
                {/* Title - Clean */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Task Title
                  </label>
                  {isEditing ? (
                    <Input
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      placeholder="Task title"
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                      <p className="text-gray-100">{selectedTodo.title}</p>
                    </div>
                  )}
                </div>

                {/* Description - Clean */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Description
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      placeholder="Task description"
                      rows="3"
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 min-h-[80px]">
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedTodo.description}</p>
                    </div>
                  )}
                </div>

                {/* Status & Deadline - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    {isEditing ? (
                      <Select 
                        value={editFormData.status} 
                        onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
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
                        selectedTodo.status === 'completed' ? 'bg-green-900/20 border-green-700/30' :
                        selectedTodo.status === 'in-progress' ? 'bg-blue-900/20 border-blue-700/30' :
                        'bg-yellow-900/20 border-yellow-700/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedTodo.status)}
                          <span className={`font-medium ${
                            selectedTodo.status === 'completed' ? 'text-green-400' :
                            selectedTodo.status === 'in-progress' ? 'text-blue-400' :
                            'text-yellow-400'
                          }`}>
                            {selectedTodo.status.charAt(0).toUpperCase() + selectedTodo.status.slice(1)}
                          </span>
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
                        onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                        className="bg-gray-800/50 border-gray-700 text-white"
                      />
                    ) : (
                      <div className={`p-3 rounded-lg border ${
                        isOverdue(selectedTodo.deadline) && selectedTodo.status !== 'completed' 
                          ? 'bg-red-900/20 border-red-700/30' 
                          : 'bg-gray-800/30 border-gray-700'
                      }`}>
                        <p className={`font-medium ${
                          isOverdue(selectedTodo.deadline) && selectedTodo.status !== 'completed' 
                            ? 'text-red-400' 
                            : 'text-gray-100'
                        }`}>
                          {formatDate(selectedTodo.deadline)} at {formatTime(selectedTodo.deadline)}
                        </p>
                        {isOverdue(selectedTodo.deadline) && selectedTodo.status !== 'completed' && (
                          <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Overdue
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Overdue Warning */}
                {!isEditing && isOverdue(selectedTodo.deadline) && selectedTodo.status !== 'completed' && (
                  <div className="p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-300">This task is overdue!</p>
                        <p className="text-sm text-red-400/80 mt-1">
                          It was due on {formatDate(selectedTodo.deadline)} and is now {Math.floor((new Date() - new Date(selectedTodo.deadline)) / (1000 * 60 * 60 * 24))} days late.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created</p>
                    <p className="text-gray-300">{formatDate(selectedTodo.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <p className="text-gray-300">{formatDate(selectedTodo.updatedAt)}</p>
                  </div>
                </div>
              </div>
              
              {/* Dialog Footer - Clean */}
              <DialogFooter className="gap-3 pt-4 border-t border-gray-800">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-gray-700 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEditSubmit}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="border-gray-700 hover:bg-gray-800 gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Task
                    </Button>
                    <Button
                      onClick={() => handleDelete(selectedTodo.id)}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Todo;