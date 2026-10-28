import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { sendResponse } from '../utils/apiResponse';
import { TaskCategory, TaskPriority, TaskStatus } from '../models/task.model';

export class TaskController {
  static async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, priority, status, dayIndex, search, page, limit } = req.query;

      const result = await TaskService.getAll({
        category: category as TaskCategory | undefined,
        priority: priority as TaskPriority | undefined,
        status: status as TaskStatus | undefined,
        dayIndex: dayIndex !== undefined ? parseInt(dayIndex as string, 10) : undefined,
        search: search as string | undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      sendResponse({
        res,
        statusCode: 200,
        message: 'Tasks retrieved successfully',
        data: result.tasks,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const task = await TaskService.getById(id);

      sendResponse({
        res,
        statusCode: 200,
        message: 'Task retrieved successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await TaskService.create(req.body);

      sendResponse({
        res,
        statusCode: 201,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const updated = await TaskService.update(id, req.body);

      sendResponse({
        res,
        statusCode: 200,
        message: 'Task updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const deleted = await TaskService.delete(id);

      sendResponse({
        res,
        statusCode: 200,
        message: 'Task deleted successfully',
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  }
}
