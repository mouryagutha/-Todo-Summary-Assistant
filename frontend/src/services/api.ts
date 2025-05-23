import axios from 'axios';
import type { Todo, CreateTodoDTO, ApiResponse } from '../types/todo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const TodoAPI = {
  async getAllTodos(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  async createTodo(todo: CreateTodoDTO): Promise<Todo> {
    const response = await api.post<Todo>('/todos', todo);
    return response.data;
  },

  async deleteTodo(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  },

  async summarizeTodos(): Promise<ApiResponse<string>> {
    try {
      const response = await api.post<{ message: string; summary: string }>('/todos/summarize');
      return { data: response.data.summary };
    } catch (error) {
      return { error: 'Failed to generate summary' };
    }
  },
}; 