import Database from 'better-sqlite3';
import { DB_PATH } from './env.js';

type CredRow = { id: number; store: string; access_token: string };

const db = new Database(DB_PATH, { readonly: true });

export function getShopifyCreds(): CredRow {
  const row = db.prepare(`
    SELECT id, store, access_token
    FROM shopify_credentials
    WHERE id = 1
  `).get() as CredRow | undefined;

  if (!row) throw new Error('No Shopify credentials found for id=1 in main.db');
  return row;
}
