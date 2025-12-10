import React, { useState, useEffect } from 'react';
import { todoApi } from '@/services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Search,
  Eye,
  AlertCircle,
  Timer,
  AlertTriangle,
  CheckSquare,
  Square,
  ArrowUpRight,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import TodoCreateModal from './TodoCreateModal';
import TodoViewEditModal from './TodoViewEditModal';

const Todo = () => {
  // State management
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      // todoApi.getTodos expects a single params object
      const response = await todoApi.getTodos({ page, limit, status: filters.status });

      // Debug log to inspect response shape when troubleshooting filters
      // (api.js already logs requests/responses, this helps examine payload)
      // eslint-disable-next-line no-console
      console.debug('loadTodos response:', response?.data);

      // Response shape from backend: { success: true, data: [...], pagination: { total, totalPages, ... } }
      let items = response.data.data;
      // Defensive: if API returned a single object (e.g., from a test endpoint), wrap into array
      if (!Array.isArray(items) && items) items = [items];

      setTodos(items || []);

      const paginationData = response.data.pagination || {};
      setPagination(prev => ({
        ...prev,
        total: paginationData.total ?? prev.total,
        totalPages: paginationData.totalPages ?? prev.totalPages
      }));
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

  // Status badge colors
  const getStatusBadge = (status, isOverdue) => {
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="gap-1 animate-pulse bg-red-600 hover:bg-red-700">
          <AlertTriangle className="h-3 w-3" />
          OVERDUE
        </Badge>
      );
    }

    switch (status) {
      case 'completed':
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> In Progress</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    }
  };

  // Card background
  const getCardBackground = (status, isOverdue) => {
    if (isOverdue) {
      return "bg-gradient-to-br from-red-950/40 via-red-900/30 to-red-950/40 border-red-700/50 hover:border-red-600";
    }

    switch (status) {
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

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  // Filter change
  const handleFilterChange = (status) => {
    setFilters({ ...filters, status });
    setPagination({ ...pagination, page: 1 });
  };

  // Handle create form change
  const handleCreateFormChange = (field, value) => {
    setCreateFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle edit form change
  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle create todo
  const handleCreateSubmit = async () => {
    if (!createFormData.title.trim() || !createFormData.description.trim() || !createFormData.deadline) {
      toast.error('Please fill all required fields');
      return;
    }

    setModalLoading(true);
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
    } finally {
      setModalLoading(false);
    }
  };

  // Handle edit todo
  const handleEditSubmit = async () => {
    if (!editFormData.title.trim() || !editFormData.description.trim() || !editFormData.deadline) {
      toast.error('Please fill all required fields');
      return;
    }

    setModalLoading(true);
    try {
      await todoApi.updateTodo(selectedTodo.id || selectedTodo._id, editFormData);
      toast.success('Todo updated successfully');
      setIsEditing(false);
      loadTodos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    setDeleteLoading(true);
    try {
      const todoId = id || selectedTodo?.id || selectedTodo?._id;

      if (!todoId) {
        toast.error('Cannot delete: No ID found');
        return;
      }

      await todoApi.deleteTodo(todoId);
      toast.success('Todo deleted successfully');
      setViewDialogOpen(false);
      loadTodos();
    } catch (error) {
      console.error('Delete error:', error);

      if (error.response?.status === 404) {
        toast.error('Todo not found. It may have already been deleted.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid todo ID format');
      } else {
        toast.error(`Failed to delete todo: ${error.response?.data?.error || error.message}`);
      }
    } finally {
      setDeleteLoading(false);
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

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedTodo) {
      setEditFormData({
        title: selectedTodo.title,
        description: selectedTodo.description,
        deadline: selectedTodo.deadline.split('T')[0] + 'T' + selectedTodo.deadline.split('T')[1].substring(0, 5),
        status: selectedTodo.status
      });
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckSquare className="h-4 w-4" />;
      case 'in-progress': return <ArrowUpRight className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  return (
    <div id="todo-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Header */}
      <div className="flex flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-100">
            Task Dashboard
          </h2>
          <p className="text-gray-400">Manage your tasks efficiently</p>
        </div>

        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="gap-2 bg-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline"> Create Task</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex justify-center mb-8 mt-[-20px]">
        <div className="inline-flex bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-xl p-1 shadow-lg">
          {[
            { value: '', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' }
          ].map((option, index) => (
            <React.Fragment key={option.value}>
              {index > 0 && (
                <div className="w-px bg-gray-700/50 my-2"></div>
              )}
              <button
                onClick={() => handleFilterChange(option.value)}
                className={`px-3 sm:px-6 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${index === 0 ? 'rounded-l-lg' : index === 3 ? 'rounded-r-lg' : ''
                  } ${filters.status === option.value
                    ? 'bg-white/90 text-gray-900 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {option.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

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

          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {todos.map((todo) => {
              const overdue = isOverdue(todo.deadline) && todo.status !== 'completed';

              return (
                <Card
                  key={todo.id || todo._id}
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
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold line-clamp-1 ${overdue ? 'text-red-200' : 'text-gray-100'
                          }`}>
                          {todo.title}
                        </h3>
                        <p className={`text-sm mt-1 line-clamp-2 ${overdue ? 'text-red-300/80' : 'text-gray-400'
                          }`}>
                          {todo.description}
                        </p>
                      </div>
                      <div className="ml-2">
                        {getStatusBadge(todo.status, overdue)}
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 text-sm mb-4 p-3 rounded-lg ${overdue
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
                      className={`w-full ${overdue
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
                        className={`min-w-[40px] ${pagination.page === pageNum
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

      {/* Modals */}
      <TodoCreateModal
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        formData={createFormData}
        onFormChange={handleCreateFormChange}
        onSubmit={handleCreateSubmit}
        loading={modalLoading}
      />

      <TodoViewEditModal
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        todo={selectedTodo}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editFormData={editFormData}
        onEditFormChange={handleEditFormChange}
        onSaveEdit={handleEditSubmit}
        onDelete={handleDelete}
        onCancelEdit={handleCancelEdit}
        loading={modalLoading}
        deleteLoading={deleteLoading}
      />
    </div>
  );
};

export default Todo;