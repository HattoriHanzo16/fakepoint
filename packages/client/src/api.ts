import axios from 'axios';
import { FakeEndpoint, CreateFakeEndpointRequest, UpdateFakeEndpointRequest } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/management';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpointApi = {
  // Get all endpoints
  getAll: async (): Promise<FakeEndpoint[]> => {
    const response = await apiClient.get<FakeEndpoint[]>('/endpoints');
    return response.data;
  },

  // Get single endpoint
  getById: async (id: string): Promise<FakeEndpoint> => {
    const response = await apiClient.get<FakeEndpoint>(`/endpoints/${id}`);
    return response.data;
  },

  // Create new endpoint
  create: async (data: CreateFakeEndpointRequest): Promise<FakeEndpoint> => {
    const response = await apiClient.post<FakeEndpoint>('/endpoints', data);
    return response.data;
  },

  // Update endpoint
  update: async (id: string, data: UpdateFakeEndpointRequest): Promise<FakeEndpoint> => {
    const response = await apiClient.put<FakeEndpoint>(`/endpoints/${id}`, data);
    return response.data;
  },

  // Delete endpoint
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/endpoints/${id}`);
  },

  // Toggle endpoint enabled/disabled
  toggle: async (id: string): Promise<FakeEndpoint> => {
    const response = await apiClient.patch<FakeEndpoint>(`/endpoints/${id}/toggle`);
    return response.data;
  },
}; 