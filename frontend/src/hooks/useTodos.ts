import { useState, useEffect } from 'react';
import type { Todo, CreateTodoDTO, TodoState } from '../types/todo';
import { TodoAPI } from '../services/api';
import { useToast } from '@chakra-ui/react';

export const useTodos = () => {
  const [state, setState] = useState<TodoState>({
    todos: [],
    isLoading: false,
    error: null,
  });

  const toast = useToast();

  const fetchTodos = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const todos = await TodoAPI.getAllTodos();
      setState({ todos, isLoading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch todos',
      }));
    }
  };

  const createTodo = async (todoData: CreateTodoDTO) => {
    try {
      const newTodo = await TodoAPI.createTodo(todoData);
      setState(prev => ({
        ...prev,
        todos: [newTodo, ...prev.todos],
      }));
      toast({
        title: 'Todo created',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to create todo',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await TodoAPI.deleteTodo(id);
      setState(prev => ({
        ...prev,
        todos: prev.todos.filter(todo => todo.id !== id),
      }));
      toast({
        title: 'Todo deleted',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete todo',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const summarizeTodos = async () => {
    try {
      const result = await TodoAPI.summarizeTodos();
      if (result.error) throw new Error(result.error);
      toast({
        title: 'Summary sent to Slack',
        description: result.data,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to generate summary',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    ...state,
    createTodo,
    deleteTodo,
    summarizeTodos,
  };
}; 