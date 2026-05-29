import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis._mongoose ?? { conn: null, promise: null };

if (!globalThis._mongoose) {
  globalThis._mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI in environment variables');
  }

  const fallbackUri = 'mongodb://127.0.0.1:27017/moon_charm';
  const connectionOptions = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 2000,
  };

  cached.promise ??= mongoose.connect(mongoUri, {
    ...connectionOptions,
  }).catch(async (error) => {
    if (!mongoUri.startsWith('mongodb+srv://')) {
      throw error;
    }

    console.warn('MongoDB Atlas connection failed, falling back to local MongoDB.', error);
    return mongoose.connect(fallbackUri, {
      ...connectionOptions,
    });
  });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
