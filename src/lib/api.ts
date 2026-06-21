import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';

/**
 * A ready-to-return JSON response for when MongoDB cannot be reached.
 * 503 (Service Unavailable) tells the client the failure is transient
 * and worth retrying, rather than a generic 500.
 */
export function dbUnavailableResponse() {
  return NextResponse.json(
    {
      error: 'The database is currently unavailable. Please try again shortly.',
      code: 'DB_UNAVAILABLE',
    },
    { status: 503 }
  );
}

/**
 * Opens the MongoDB connection for an API route.
 *
 * On success it returns `null`, so callers can do:
 *
 *   const dbError = await ensureDatabase();
 *   if (dbError) return dbError;
 *
 * On failure (missing MONGODB_URI, unreachable Atlas cluster, IP not on the
 * Atlas allowlist, local mongod not running, etc.) it logs the underlying
 * error and returns a clean 503 JSON response instead of letting the route
 * throw an unhandled 500.
 */
export async function ensureDatabase(): Promise<NextResponse | null> {
  try {
    await connectToDatabase();
    return null;
  } catch (error) {
    console.error('Database connection failed for API route', error);
    return dbUnavailableResponse();
  }
}
