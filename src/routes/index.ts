import { Router } from 'express';
import healthRoutes from './health.routes';
import taskRoutes from './task.routes';

const router = Router();

// API Index / Discovery
router.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to Day Flow Backend API (v1)',
    version: '1.0.0',
    documentation: {
      health: '/api/v1/health',
      tasks: '/api/v1/tasks',
    },
  });
});

// Mount modular sub-routers
router.use('/health', healthRoutes);
router.use('/tasks', taskRoutes);

export default router;
