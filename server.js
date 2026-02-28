const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contact.routes');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

dotenv.config();

const app = express();

app.use(requestLogger);

app.use(express.json({ limit: '10kb' }));

// middleware - CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
        : [];

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /\.netlify\.app$/.test(origin) ||
      isAllowed
        ? callback(null, true)
        : callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// connect database
connectDB(process.env.MONGO_URI);

// routes
app.use('/api/contact', contactRoutes);

// health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// error handler middleware
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on port ${PORT} [${NODE_ENV}]`);
  console.log(`📧 Email: ${process.env.EMAIL_USER || 'NOT SET'}`);
  console.log(`🗄️  Database: ${process.env.MONGO_URI ? 'Connected' : 'NOT SET'}`);
  console.log(`🌐 CORS: ${process.env.CORS_ORIGIN || 'All vercel/netlify origins'}\n`);
});

// graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});