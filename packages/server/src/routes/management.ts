import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { endpointStore } from '../store';
import { CreateFakeEndpointRequest, UpdateFakeEndpointRequest, FakeEndpoint } from '../types';

const router = Router();

// Get all fake endpoints
router.get('/endpoints', (req, res) => {
  const endpoints = endpointStore.getAll();
  res.json(endpoints);
});

// Get a specific fake endpoint
router.get('/endpoints/:id', (req, res) => {
  const endpoint = endpointStore.getById(req.params.id);
  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.json(endpoint);
});

// Create a new fake endpoint
router.post('/endpoints', (req, res) => {
  try {
    const body: CreateFakeEndpointRequest = req.body;
    
    // Validate required fields
    if (!body.name || !body.method || !body.path) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, method, path' 
      });
    }

    // Check if endpoint with same path and method already exists
    const existing = endpointStore.getByPathAndMethod(body.path, body.method);
    if (existing) {
      return res.status(409).json({ 
        error: 'Endpoint with this path and method already exists' 
      });
    }

    const now = new Date();
    const endpoint: FakeEndpoint = {
      id: uuidv4(),
      name: body.name,
      method: body.method,
      path: body.path,
      response: {
        status: body.response?.status || 200,
        headers: body.response?.headers || {},
        body: body.response?.body || {}
      },
      enabled: true,
      createdAt: now,
      updatedAt: now
    };

    const created = endpointStore.create(endpoint);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a fake endpoint
router.put('/endpoints/:id', (req, res) => {
  try {
    const body: UpdateFakeEndpointRequest = req.body;
    const updated = endpointStore.update(req.params.id, body);
    
    if (!updated) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a fake endpoint
router.delete('/endpoints/:id', (req, res) => {
  const deleted = endpointStore.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.status(204).send();
});

// Toggle endpoint enabled/disabled
router.patch('/endpoints/:id/toggle', (req, res) => {
  const endpoint = endpointStore.getById(req.params.id);
  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }

  const updated = endpointStore.update(req.params.id, { 
    enabled: !endpoint.enabled 
  });
  
  res.json(updated);
});

export default router; 