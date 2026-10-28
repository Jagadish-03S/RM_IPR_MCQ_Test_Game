import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { studentRouter } from './routes/student';
import { adminRouter } from './routes/admin';
import { downloadsRouter } from './routes/downloads';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      // In development, allow localhost on any port
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local Windows development
    },
    credentials: true,
    exposedHeaders: ['Content-Disposition']
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'RM & IPR MCQ Test Game Backend Engine',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/student', studentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/downloads', downloadsRouter);

// Serve Built React Frontend Static Files (Single-Host Production Deployment)
import path from 'path';
import fs from 'fs';

const clientDistPath = path.resolve(__dirname, '../../client/dist');
const altClientDistPath = path.resolve(process.cwd(), 'client/dist');
const publicDistPath = fs.existsSync(clientDistPath)
  ? clientDistPath
  : fs.existsSync(altClientDistPath)
  ? altClientDistPath
  : null;

if (publicDistPath) {
  app.use(express.static(publicDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(publicDistPath, 'index.html'));
  });
}

// 404 Handler for Unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` RM & IPR MCQ Assessment Server Running on Port ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(` Allowed Origin: ${CLIENT_ORIGIN}`);
  console.log(`=======================================================`);
});

export default app;

