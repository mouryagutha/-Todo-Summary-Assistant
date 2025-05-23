import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import axios from 'axios';
import { Todo, CreateTodoDTO } from '../types/todo';

export class TodoService {
  private supabase;
  private openai;

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getAllTodos(): Promise<Todo[]> {
    const { data, error } = await this.supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createTodo(todoData: CreateTodoDTO): Promise<Todo> {
    const { data, error } = await this.supabase
      .from('todos')
      .insert([todoData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTodo(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async summarizeAndSendToSlack(): Promise<string> {
    // Get all pending todos
    const { data: todos, error } = await this.supabase
      .from('todos')
      .select('*')
      .eq('completed', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Generate summary using OpenAI
    const prompt = `Please provide a concise summary of the following todo items:\n${todos
      .map((todo) => `- ${todo.title}${todo.description ? `: ${todo.description}` : ''}`)
      .join('\n')}`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = completion.choices[0].message.content || 'No summary generated';

    // Send to Slack
    await axios.post(process.env.SLACK_WEBHOOK_URL!, {
      text: `📋 *Todo Summary*\n${summary}`,
    });

    return summary;
  }
} 