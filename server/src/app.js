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

// Security & middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

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

