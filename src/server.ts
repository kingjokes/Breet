import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { initializeConnections } from './config';

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize database and Redis connections
    await initializeConnections();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
