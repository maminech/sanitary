/**
 * Main Application Entry Point (Local Server)
 */

import app from './app';
import { appConfig } from './config/config';
import { connectDatabase, disconnectDatabase } from './config/database';

/**
 * Start Server
 */
const PORT = appConfig.server.port;
const API_PREFIX = `/api/${appConfig.server.apiVersion}`;

const startServer = async () => {
  // Connect to MongoDB first
  await connectDatabase();

  const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Sanitary Platform API Server                        ║
║                                                           ║
║   Environment: ${appConfig.server.env.padEnd(42)} ║
║   Port: ${PORT.toString().padEnd(49)} ║
║   API Version: ${appConfig.server.apiVersion.padEnd(43)} ║
║                                                           ║
║   Health Check: http://localhost:${PORT}/health${' '.repeat(18)} ║
║   API Base: http://localhost:${PORT}${API_PREFIX}${' '.repeat(12)} ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

/**
 * Graceful Shutdown
 */
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');

  server.close(async () => {
    console.log('✅ HTTP server closed');

    try {
      await disconnectDatabase();
      console.log('✅ Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

// Start the server only when running locally
if (require.main === module) {
  startServer().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
}

