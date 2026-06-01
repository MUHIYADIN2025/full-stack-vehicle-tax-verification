import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/index.js';

// Routes
import officerRoutes from './routes/officerRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import checkpointRoutes from './routes/checkpointRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import logRoutes from './routes/logRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: config.environment,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/checkpoints', checkpointRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', logRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.environment}`);
  console.log(`🔗 MongoDB: ${config.mongoUri}`);
});
