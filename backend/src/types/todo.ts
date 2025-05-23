export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoDTO {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  completed?: boolean;
} 