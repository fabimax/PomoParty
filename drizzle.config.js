export default {
  schema: './backend/databaseSchema.js',
  out: './migrations',
  dbCredentials: {
    url: 'sqlite.db'
  },
  dialect: 'sqlite'
}; 
