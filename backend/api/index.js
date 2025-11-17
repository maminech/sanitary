// Vercel serverless function entry point
const { connectDatabase } = require('../dist/config/database');

// Connect to database on cold start
let dbConnected = false;

async function ensureDbConnection() {
  if (!dbConnected) {
    await connectDatabase();
    dbConnected = true;
  }
}

module.exports = async (req, res) => {
  try {
    await ensureDbConnection();
    const app = require('../dist/app').default;
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
