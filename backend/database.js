import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './databaseSchema.js';

const sqlite = new Database('sqlite.db');
export default drizzle(sqlite, { schema });
