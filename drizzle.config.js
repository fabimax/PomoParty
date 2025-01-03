export default {
  schema: './backend/databaseSchema.js',
  out: './migrations',
  dbCredentials: {
    url: 'database.sqlite'
  },
  dialect: 'sqlite'
}; 
