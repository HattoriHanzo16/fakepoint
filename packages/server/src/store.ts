import { FakeEndpoint } from './types';

class EndpointStore {
  private endpoints: Map<string, FakeEndpoint> = new Map();

  getAll(): FakeEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  getById(id: string): FakeEndpoint | undefined {
    return this.endpoints.get(id);
  }

  getByPathAndMethod(path: string, method: string): FakeEndpoint | undefined {
    return Array.from(this.endpoints.values()).find(
      endpoint => endpoint.path === path && endpoint.method === method && endpoint.enabled
    );
  }

  create(endpoint: FakeEndpoint): FakeEndpoint {
    this.endpoints.set(endpoint.id, endpoint);
    return endpoint;
  }

  update(id: string, updates: Partial<FakeEndpoint>): FakeEndpoint | undefined {
    const existing = this.endpoints.get(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    
    this.endpoints.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.endpoints.delete(id);
  }

  clear(): void {
    this.endpoints.clear();
  }
}

export const endpointStore = new EndpointStore(); 