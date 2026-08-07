const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Welcome route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HelpDesk Lite REST API',
    version: '1.0.0',
    status: 'Healthy'
  });
});

// Register routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`  HelpDesk Lite Express Backend Server Running`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
  await testConnection();
});
