import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import fs from 'fs';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './utils/seed.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import livestockRoutes from './routes/livestockRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import landRoutes from './routes/landRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import marketPriceRoutes from './routes/marketPriceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Uploads directory
const uploadsPath = path.resolve('uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Socket.IO handling
io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their notification channel`);
  });

  socket.on('send_chat_message', (data) => {
    io.to(`user_${data.recipientId}`).emit('receive_chat_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market-prices', marketPriceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'MARUTHAM Agriculture Ecosystem API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build in production / standalone
const clientDistPath = path.resolve('../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving static client production bundle from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server
export const serverReady = connectDB().then(async () => {
  // Auto-seed database if empty
  try {
    await seedDatabase(false);
  } catch (seedErr) {
    console.warn('Seeding note:', seedErr.message);
  }

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`🌾 MARUTHAM Server running on http://127.0.0.1:${PORT}`);
      console.log(`📡 Socket.IO initialized for real-time messaging`);
      resolve(server);
    });
  });
});

export { app, server, io };
