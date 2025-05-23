import { Request, Response } from 'express';
import { TodoService } from '../services/todo.service';
import { CreateTodoDTO } from '../types/todo';

export class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  getAllTodos = async (req: Request, res: Response) => {
    try {
      const todos = await this.todoService.getAllTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  };

  createTodo = async (req: Request, res: Response) => {
    try {
      const todoData: CreateTodoDTO = req.body;
      const newTodo = await this.todoService.createTodo(todoData);
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create todo' });
    }
  };

  deleteTodo = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.todoService.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  };

  summarizeTodos = async (req: Request, res: Response) => {
    try {
      const summary = await this.todoService.summarizeAndSendToSlack();
      res.json({ message: 'Summary sent to Slack successfully', summary });
    } catch (error) {
      res.status(500).json({ error: 'Failed to summarize and send to Slack' });
    }
  };
} 