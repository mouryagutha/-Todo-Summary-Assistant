import { Router } from 'express';
import { SummaryController } from '../controllers/summary.controller';

const router = Router();
const summaryController = new SummaryController();

// GET /api/summary - Get a summary of todos (with optional date range)
router.get('/', summaryController.getSummary);

export default router; 