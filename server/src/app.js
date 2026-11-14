require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Trust reverse proxy (Nginx) so req.ip and https protocols are correctly identified
app.set('trust proxy', 1);

// Security & middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Dynamic CORS configuration
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://localhost:5000', 'https://calathx.com', 'https://www.calathx.com'];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, or same-origin Nginx proxy)
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(normalized) ||
        normalized.endsWith('.calathx.com') ||
        normalized === 'https://calathx.com'
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(compression());
app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting for general API (1500 req / 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Stricter rate limit on auth endpoints to prevent brute-force attacks (30 attempts / 15 mins)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'calathx-api', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/api/pages', require('./routes/pageRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/subscribers', require('./routes/subscriberRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api', require('./routes/seoRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`CalathX Server running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;

