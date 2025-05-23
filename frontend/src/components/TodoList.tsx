import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { EditTodo } from './EditTodo';
import { CreateTodo } from './CreateTodo';

interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
}

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/todos');
      const data = await response.json();
      if (data.success) {
        setTodos(data.todos);
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchTodos(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTodo = async (updatedTodo: Partial<Todo>) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${updatedTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      const data = await response.json();
      if (data.success) {
        fetchTodos(); // Refresh the list
        setIsEditDialogOpen(false);
        setEditTodo(null);
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const getPriorityColor = (priority: string): "error" | "warning" | "success" | "default" => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {todos.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Typography color="text.secondary">
            No todos yet. Create one to get started!
          </Typography>
        </Paper>
      ) : (
        <List sx={{ width: '100%' }}>
          {todos.map((todo, index) => (
            <React.Fragment key={todo.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem
                sx={{
                  bgcolor: '#E3F2FD', // Light blue background
                  '&:hover': {
                    bgcolor: '#90CAF9', // Darker blue on hover
                    transition: 'background-color 0.2s ease',
                  },
                  borderRadius: 1,
                  mb: 0.5,
                  position: 'relative', // Ensure proper positioning of buttons
                  pr: 12, // Add padding on right side for buttons
                }}
                secondaryAction={
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: 1,
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(todo)}
                      size="small"
                      sx={{
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                        color: '#000000',
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(todo.id)}
                      size="small"
                      color="error"
                      sx={{
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Typography
                    sx={{
                      minWidth: '32px',
                      color: '#000000',
                      fontWeight: 'medium',
                      mr: 2,
                    }}
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </Typography>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          component="span"
                          variant="subtitle1"
                          sx={{
                            textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                            color: todo.status === 'completed' ? '#666666' : '#000000',
                          }}
                        >
                          {todo.title}
                        </Typography>
                        <Chip
                          label={todo.priority}
                          color={getPriorityColor(todo.priority)}
                          size="small"
                          sx={{ 
                            height: '20px',
                            color: '#000000',
                            fontWeight: 500
                          }}
                        />
                        {todo.status === 'completed' && (
                          <Chip
                            label="Completed"
                            color="success"
                            size="small"
                            sx={{ 
                              height: '20px',
                              color: '#000000',
                              fontWeight: 500
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {todo.description && (
                          <Typography
                            variant="body2"
                            sx={{ 
                              whiteSpace: 'pre-wrap',
                              color: '#333333'
                            }}
                          >
                            {todo.description}
                          </Typography>
                        )}
                        {todo.dueDate && (
                          <Typography
                            variant="caption"
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5,
                              color: new Date(todo.dueDate) < new Date() ? '#d32f2f' : '#333333',
                              fontWeight: 500
                            }}
                          >
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}

      <EditTodo
        todo={editTodo}
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditTodo(null);
        }}
        onSave={handleUpdateTodo}
      />

      <CreateTodo onTodoCreated={fetchTodos} />
    </Box>
  );
}; 