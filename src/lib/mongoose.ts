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

  cached.promise ??= mongoose.connect(mongoUri, {
    bufferCommands: false,
  });

  cached.conn = await cached.promise;
  return cached.conn;
}
