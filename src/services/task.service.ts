import {
  TaskModel,
  ITask,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '../models/task.model';
import { ApiError } from '../utils/apiError';

export interface TaskFilterOptions {
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
  dayIndex?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export class TaskService {
  static async getAll(options: TaskFilterOptions = {}) {
    const { category, priority, status, dayIndex, search, page = 1, limit = 50 } = options;
    const query: Record<string, any> = {};

    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (typeof dayIndex === 'number' && !isNaN(dayIndex)) query.dayIndex = dayIndex;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      TaskModel.find(query).sort({ dayIndex: 1, createdAt: -1 }).skip(skip).limit(limit),
      TaskModel.countDocuments(query),
    ]);

    return {
      tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string): Promise<ITask> {
    const task = await TaskModel.findById(id);
    if (!task) {
      throw ApiError.notFound(`Task with ID '${id}' not found`);
    }
    return task;
  }

  static async create(data: Partial<ITask>): Promise<ITask> {
    const task = await TaskModel.create(data);
    return task;
  }

  static async update(id: string, data: Partial<ITask>): Promise<ITask> {
    const task = await TaskModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      throw ApiError.notFound(`Task with ID '${id}' not found`);
    }
    return task;
  }

  static async delete(id: string): Promise<ITask> {
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) {
      throw ApiError.notFound(`Task with ID '${id}' not found`);
    }
    return task;
  }
}
