import { Router } from 'express';
import { prisma } from '../config/database';
import { TodoSummarizer } from '../services/summarizer';
import axios from 'axios';

const router = Router();
const summarizer = new TodoSummarizer();

interface SummaryResult {
  success: boolean;
  summary: string;
  todoCount?: number;
  dateRange?: {
    start?: string;
    end?: string;
  };
  slackSent?: boolean;
  slackError?: string;
}

// Shared function for generating summaries
async function generateSummary(dateRange?: { startDate?: string; endDate?: string }): Promise<SummaryResult> {
  // Build the where clause for prisma query
  const whereClause: any = {};
  if (dateRange?.startDate || dateRange?.endDate) {
    whereClause.dueDate = {};
    if (dateRange.startDate) whereClause.dueDate.gte = new Date(dateRange.startDate);
    if (dateRange.endDate) whereClause.dueDate.lte = new Date(dateRange.endDate);
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
    return {
      success: true,
      summary: "No todos found for the specified period."
    };
  }

  // Generate summary using our Gemini-based summarizer
  const summary = await summarizer.summarizeTodos(todos);

  return {
    success: true,
    summary,
    todoCount: todos.length,
    dateRange: {
      start: dateRange?.startDate,
      end: dateRange?.endDate
    }
  };
}

// Function to send summary to Slack
async function sendToSlack(summary: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('Slack webhook URL is not configured');
  }

  const message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📋 Todo Summary",
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: summary
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Generated at ${new Date().toLocaleString()}`
          }
        ]
      }
    ]
  };

  try {
    await axios.post(webhookUrl, message);
    return true;
  } catch (error) {
    console.error('Failed to send message to Slack:', error);
    throw new Error('Failed to send message to Slack');
  }
}

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    });
    res.json({ success: true, todos });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const todo = await prisma.todo.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'pending',
        priority: req.body.priority || 'medium',
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
      }
    });
    res.json({ success: true, todo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req, res) => {
  try {
    // First check if the todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id: req.params.id }
    });

    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    // Validate status and priority if provided
    const status = req.body.status;
    const priority = req.body.priority;

    if (status && !['pending', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be either "pending" or "completed"'
      });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid priority. Must be "low", "medium", or "high"'
      });
    }

    // Update the todo
    const updatedTodo = await prisma.todo.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title || undefined,
        description: req.body.description || undefined,
        status: status || undefined,
        priority: priority || undefined,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined
      }
    });

    res.json({
      success: true,
      todo: updatedTodo,
      message: 'Todo updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update todo',
      details: error.message
    });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: req.params.id }
    });
    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }
    await prisma.todo.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/todos/summarize - Get a summary of all todos
router.get('/summarize', async (req, res) => {
  try {
    const dateRange = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined
    };

    const result = await generateSummary(dateRange);
    
    // Send to Slack if webhook is configured
    try {
      await sendToSlack(result.summary);
      result.slackSent = true;
    } catch (error: any) {
      result.slackSent = false;
      result.slackError = error.message;
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error generating summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate summary',
      details: error.message
    });
  }
});

// POST /api/todos/summarize - Get a summary of all todos (with body parameters)
router.post('/summarize', async (req, res) => {
  try {
    const result = await generateSummary(req.body);
    
    // Send to Slack if webhook is configured
    try {
      await sendToSlack(result.summary);
      result.slackSent = true;
    } catch (error: any) {
      result.slackSent = false;
      result.slackError = error.message;
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error generating summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate summary',
      details: error.message
    });
  }
});

export { router as todoRoutes }; 