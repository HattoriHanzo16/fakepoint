export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FakeEndpoint {
  id: string;
  name: string;
  method: HttpMethod;
  path: string;
  response: {
    status: number;
    headers?: Record<string, string>;
    body: any;
  };
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFakeEndpointRequest {
  name: string;
  method: HttpMethod;
  path: string;
  response: {
    status: number;
    headers?: Record<string, string>;
    body: any;
  };
}

export interface UpdateFakeEndpointRequest {
  name?: string;
  method?: HttpMethod;
  path?: string;
  response?: {
    status?: number;
    headers?: Record<string, string>;
    body?: any;
  };
  enabled?: boolean;
} 