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
  plannedDate?: string;
  week?: string; // YYYY-MM-DD (Monday of the week)
  search?: string;
  page?: number;
  limit?: number;
}

const getWeekRange = (mondayStr: string) => {
  const [year, month, day] = mondayStr.split('-').map(Number);
  const mon = new Date(Date.UTC(year, month - 1, day));
  const sun = new Date(mon);
  sun.setUTCDate(mon.getUTCDate() + 6);

  const format = (d: Date) => d.toISOString().split('T')[0];
  return {
    startStr: format(mon),
    endStr: format(sun),
  };
};

export class TaskService {
  static async getAll(options: TaskFilterOptions = {}) {
    const {
      category,
      priority,
      status,
      dayIndex,
      plannedDate,
      week,
      search,
      page = 1,
      limit = week ? 200 : 50,
    } = options;

    const conditions: Record<string, any>[] = [];

    if (category) conditions.push({ category });
    if (priority) conditions.push({ priority });
    if (status) conditions.push({ status });
    if (typeof dayIndex === 'number' && !isNaN(dayIndex)) conditions.push({ dayIndex });
    if (plannedDate) conditions.push({ plannedDate });

    if (week) {
      const { startStr, endStr } = getWeekRange(week);
      conditions.push({
        $or: [
          { plannedDate: { $gte: startStr, $lte: endStr } },
          { dayIndex: -1 }, // Include unscheduled backlog tasks
        ],
      });
    }

    if (search) {
      conditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};
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
