import mongoose from 'mongoose';

// custom modules
import config from '@/config';

// types
import type { ConnectOptions } from 'mongoose';

// Client option

const clientOptions: ConnectOptions = {
  dbName: 'your-db',
  appName: 'Your API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('MongoDB URI is not defined in the configuration.');
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    console.log('Connected to the database succesfully', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    console.log('Error connecting to database', err);
  }
};

export const dissconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from the database successfully', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    console.log('Error disconnecting from the database', err);
  }
};
