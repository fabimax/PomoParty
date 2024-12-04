export default {
  schema: './backend/db/schema.js',
  out: './backend/db/migrations',
  driver: 'better-sqlite3',
  dbCredentials: {
    url: 'sqlite.db'
  },
  dialect: 'sqlite'
}; 