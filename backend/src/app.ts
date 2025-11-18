/**
 * Express Application Setup (for Vercel serverless)
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { appConfig } from './config/config';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import planRoutes from './routes/plan.routes';
import productRoutes from './routes/product.routes';
import quoteRoutes from './routes/quote.routes';
import seedRoutes from './routes/seed.routes';

/**
 * Initialize Express application
 */
const app: Application = express();

/**
 * Global Middleware
 */

// Security headers
app.use(helmet());

// CORS - Allow multiple origins
const allowedOrigins = [
  appConfig.cors.origin,
  'https://sanitary-platform.vercel.app', // Permanent production domain
  /https:\/\/frontend-.*\.vercel\.app$/,  // Preview deployments
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is allowed
      const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return allowed === origin || allowed === '*';
        }
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (appConfig.server.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: appConfig.rateLimit.windowMs,
  max: appConfig.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

/**
 * Health Check
 */
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: appConfig.server.env,
  });
});

/**
 * API Routes
 */
const API_PREFIX = `/api/${appConfig.server.apiVersion}`;

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/plans`, planRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/quotes`, quoteRoutes);

// Temporary seed route (remove after first use)
if (appConfig.server.env === 'production') {
  app.use(`${API_PREFIX}/seed`, seedRoutes);
}

/**
 * Root endpoint
 */
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Sanitary Platform API',
    version: appConfig.server.apiVersion,
    documentation: '/api-docs',
  });
});

/**
 * Error Handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
