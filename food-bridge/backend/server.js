import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import { startExpiryJob } from './utils/expiryJob.js';
import { generalLimiter, authLimiter } from './middleware/rateLimiter.js'; // ← import not require

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app        = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin:      'http://localhost:5173',
    methods:     ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin:      'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ── Rate limiters applied before routes ──
app.use(generalLimiter);                        // global — all routes
app.use('/api/auth/login',    authLimiter);     // strict — login
app.use('/api/auth/register', authLimiter);     // strict — register

// ── Routes ──
app.use('/api/auth',  authRoutes);
app.use('/api/food',  foodRoutes);
app.use('/uploads',   express.static(path.join(__dirname, 'uploads')));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`[Socket] User ${userId} joined room user_${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

connectDB().then(() => {
  startExpiryJob();
  httpServer.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});