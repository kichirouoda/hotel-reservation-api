import dotenv from 'dotenv';
import app from './app';
import db from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Test database connection
async function testDbConnection() {
  try {
    const client = await db.connect();
    console.log('Database connection successful');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await testDbConnection();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
