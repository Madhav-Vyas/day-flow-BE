import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.connection.on('connected', () => {
      logger.success(`MongoDB connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    logger.warn('Continuing server execution. Ensure MongoDB is running and MONGODB_URI in .env is correct.');
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected through application termination');
  } catch (error) {
    logger.error('Error during MongoDB disconnection:', error);
  }
};
