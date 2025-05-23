import express from 'express';
import cors from 'cors';
import { todoRoutes } from './routes/todo.routes';
import summaryRoutes from './routes/summary.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/summary', summaryRoutes);

export default app; 