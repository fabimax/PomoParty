import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './databaseSchema.js';

const sqlite = new Database('database.sqlite');
export default drizzle(sqlite, { schema });
