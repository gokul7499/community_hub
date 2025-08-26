import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import usersRoutes from './routes/users.js';
import eventsRoutes from './routes/events.js';
import emergencyRoutes from './routes/emergency.js';
import achievementsRoutes from './routes/achievements.js';
import chatRoutes from './routes/chat.js';
import { notFound, errorHandler } from './utils/errors.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'Community Help Hub API', version: '1.0.0' });
});

// API routes – must match frontend constants
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/chat', chatRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));

const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Community Help Hub API is ready!`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
