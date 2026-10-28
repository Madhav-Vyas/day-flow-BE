import { Schema, model, Document } from 'mongoose';

export type TaskCategory =
  | 'Feature'
  | 'Bug'
  | 'Enhancement'
  | 'Meetings'
  | 'Documentation'
  | 'Refactoring';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface ITask extends Document {
  category: TaskCategory;
  title: string;
  code?: string | null;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dayIndex: number; // -1 = Backlog, 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri
  plannedDate?: string | null; // e.g. "2026-10-28" or null for unscheduled backlog
  estimatedHours: number; // decimal hours (e.g. 2.33, 1.5)
  actualHours: number; // decimal hours (e.g. 0, 1.25)
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    category: {
      type: String,
      required: [true, 'Task category is required'],
      enum: {
        values: [
          'Feature',
          'Bug',
          'Enhancement',
          'Meetings',
          'Documentation',
          'Refactoring',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [255, 'Title cannot exceed 255 characters'],
    },
    code: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        message: '{VALUE} is not a valid priority level',
      },
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: {
        values: ['TODO', 'IN_PROGRESS', 'DONE'],
        message: '{VALUE} is not a valid status',
      },
      default: 'TODO',
    },
    dayIndex: {
      type: Number,
      required: [true, 'dayIndex is required'],
      min: [-1, 'dayIndex must be between -1 and 4'],
      max: [4, 'dayIndex must be between -1 and 4'],
      default: -1,
    },
    plannedDate: {
      type: String,
      trim: true,
      default: null,
    },
    estimatedHours: {
      type: Number,
      required: [true, 'estimatedHours is required'],
      min: [0, 'estimatedHours cannot be negative'],
      default: 0,
    },
    actualHours: {
      type: Number,
      min: [0, 'actualHours cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Query indexes
taskSchema.index({ dayIndex: 1 });
taskSchema.index({ plannedDate: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ createdAt: -1 });

export const TaskModel = model<ITask>('Task', taskSchema);
