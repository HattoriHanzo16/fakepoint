import express from 'express';
import cors from 'cors';
import managementRoutes from './routes/management';
import { fakeEndpointMiddleware } from './middleware/fakeEndpoint';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Apply fake endpoint middleware first (before management routes)
app.use(fakeEndpointMiddleware);

// Management API routes
app.use('/api/management', managementRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `No fake endpoint configured for ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Fakepoint server running on http://localhost:${PORT}`);
  console.log(`📋 Management API available at http://localhost:${PORT}/api/management`);
}); 