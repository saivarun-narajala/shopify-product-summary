import 'dotenv/config';

export const PORT = Number(process.env.PORT ?? 3000);
export const DB_PATH = process.env.DB_PATH ?? './main.db';
export const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS ?? 60_000);
