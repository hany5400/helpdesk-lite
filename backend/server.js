const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  'https://helpdesk-lite-frontend-ejr327kwe-polandagacy-4080s-projects.vercel.app',
  'https://helpdesk-lite-frontend-ou4c7xjwo-polandagacy-4080s-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without Origin (curl, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Allow exact known origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],

  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ===============================
// Body Middleware
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// MySQL Connection
// ===============================

const { testConnection } = require('./config/db');

// ===============================
// API Welcome Route
// ===============================

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HelpDesk Lite REST API',
    version: 'NEW-2026-08-12',
    status: 'Healthy',
    database: 'MySQL'
  });
});

// ===============================
// Auth Routes
// ===============================

app.use(
  '/api/auth',
  require(path.join(__dirname, 'routes', 'authRoutes'))
);

// ===============================
// Ticket Routes
// ===============================

app.use(
  '/api/tickets',
  require(path.join(__dirname, 'routes', 'ticketRoutes'))
);

// ===============================
// Support Routes
// ===============================

app.use(
  '/api/support',
  require(path.join(__dirname, 'routes', 'supportRoutes'))
);

// ===============================
// Manager Routes
// ===============================

app.use(
  '/api/manager',
  require(path.join(__dirname, 'routes', 'managerRoutes'))
);

// ===============================
// Global Error Handling
// ===============================

const { errorHandler, notFound } = require(
  path.join(__dirname, 'middleware', 'errorHandler')
);

app.use(notFound);
app.use(errorHandler);

// ===============================
// Local Development
// ===============================

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();

// ===============================
// Export for Vercel
// ===============================

module.exports = app;