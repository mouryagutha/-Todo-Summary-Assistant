import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { Todo as PrismaTodo } from '@prisma/client';

// Load environment variables
dotenv.config();

type Todo = PrismaTodo;

export class TodoSummarizer {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not set in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
  }

  private createSummaryPrompt(todos: Todo[]): string {
    const todoList = todos.map(todo => {
      const status = todo.status === 'completed' ? '✅' : '⏳';
      const priority = `[${todo.priority.toUpperCase()}]`;
      const dueDate = todo.dueDate ? `(Due: ${todo.dueDate.toLocaleDateString()})` : '';
      
      return `${status} ${priority} ${todo.title} ${dueDate}\n${todo.description}`;
    }).join('\n\n');

    return `Please provide a concise summary of these todos, highlighting key priorities and deadlines:

${todoList}

Please format the summary to include:
1. Overall status (how many completed vs pending)
2. High priority items that need attention
3. Upcoming deadlines
4. Key areas of focus

Keep the summary professional and actionable.`;
  }

  async summarizeTodos(todos: Todo[]): Promise<string> {
    try {
      if (!todos || todos.length === 0) {
        return "No todos to summarize.";
      }

      const prompt = this.createSummaryPrompt(todos);
      console.log('Generating summary...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      return summary;
    } catch (error: any) {
      console.error('Failed to generate summary:', error);
      throw new Error('Failed to generate todo summary: ' + error.message);
    }
  }
} 