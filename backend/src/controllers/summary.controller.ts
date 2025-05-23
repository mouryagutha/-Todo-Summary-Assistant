import { Request, Response } from 'express';
import { TodoSummarizer } from '../services/summarizer';
import { prisma } from '../config/database';

export class SummaryController {
  private summarizer: TodoSummarizer;

  constructor() {
    this.summarizer = new TodoSummarizer();
  }

  getSummary = async (req: Request, res: Response) => {
    try {
      // Get date range from query params (optional)
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      // Build the where clause for prisma query
      const whereClause: any = {};
      if (startDate || endDate) {
        whereClause.dueDate = {};
        if (startDate) whereClause.dueDate.gte = startDate;
        if (endDate) whereClause.dueDate.lte = endDate;
      }

      // Fetch todos from database
      const todos = await prisma.todo.findMany({
        where: whereClause,
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' }
        ]
      });

      if (!todos || todos.length === 0) {
        return res.json({
          success: true,
          summary: "No todos found for the specified period."
        });
      }

      // Generate summary
      const summary = await this.summarizer.summarizeTodos(todos);

      res.json({
        success: true,
        summary,
        todoCount: todos.length,
        dateRange: {
          start: startDate,
          end: endDate
        }
      });

    } catch (error: any) {
      console.error('Error generating summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate summary',
        details: error.message
      });
    }
  };
} 