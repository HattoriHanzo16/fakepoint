import React, { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { endpointApi } from '../api'
import { FakeEndpoint, HttpMethod, CreateFakeEndpointRequest } from '../types'

interface EndpointFormProps {
  endpoint?: FakeEndpoint | null
  onSubmit: () => void
  onCancel: () => void
}

const EndpointForm: React.FC<EndpointFormProps> = ({
  endpoint,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    method: 'GET' as HttpMethod,
    path: '',
    status: 200,
    headers: '{}',
    body: '{}',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (endpoint) {
      setFormData({
        name: endpoint.name,
        method: endpoint.method,
        path: endpoint.path,
        status: endpoint.response.status,
        headers: JSON.stringify(endpoint.response.headers || {}, null, 2),
        body: JSON.stringify(endpoint.response.body, null, 2),
      })
    }
  }, [endpoint])

  const createMutation = useMutation({
    mutationFn: endpointApi.create,
    onSuccess: () => {
      onSubmit()
    },
    onError: (error: any) => {
      console.error('Create error:', error)
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error })
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      endpointApi.update(id, data),
    onSuccess: () => {
      onSubmit()
    },
    onError: (error: any) => {
      console.error('Update error:', error)
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error })
      }
    },
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.path.trim()) {
      newErrors.path = 'Path is required'
    } else if (!formData.path.startsWith('/')) {
      newErrors.path = 'Path must start with /'
    }

    if (formData.status < 100 || formData.status > 599) {
      newErrors.status = 'Status code must be between 100 and 599'
    }

    try {
      JSON.parse(formData.headers)
    } catch {
      newErrors.headers = 'Headers must be valid JSON'
    }

    try {
      JSON.parse(formData.body)
    } catch {
      newErrors.body = 'Response body must be valid JSON'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const requestData: CreateFakeEndpointRequest = {
        name: formData.name.trim(),
        method: formData.method,
        path: formData.path.trim(),
        response: {
          status: formData.status,
          headers: JSON.parse(formData.headers),
          body: JSON.parse(formData.body),
        },
      }

      if (endpoint) {
        updateMutation.mutate({ id: endpoint.id, data: requestData })
      } else {
        createMutation.mutate(requestData)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ general: 'Failed to submit form' })
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const presetBodies = [
    { name: 'User Object', value: '{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com"\n}' },
    { name: 'Array of Users', value: '[\n  {\n    "id": 1,\n    "name": "John Doe"\n  },\n  {\n    "id": 2,\n    "name": "Jane Smith"\n  }\n]' },
    { name: 'Error Response', value: '{\n  "error": "Not found",\n  "message": "The requested resource was not found"\n}' },
    { name: 'Success Message', value: '{\n  "success": true,\n  "message": "Operation completed successfully"\n}' },
  ]

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {endpoint ? '✏️ Edit Endpoint' : '✨ Create New Endpoint'}
          </h2>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.general && (
              <div style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {errors.general}
              </div>
            )}

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Get Users"
                />
                {errors.name && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">HTTP Method</label>
                <select
                  className="form-select"
                  value={formData.method}
                  onChange={(e) => handleInputChange('method', e.target.value)}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Path</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.path}
                  onChange={(e) => handleInputChange('path', e.target.value)}
                  placeholder="/users"
                />
                {errors.path && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.path}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Status Code</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', parseInt(e.target.value) || 200)}
                  min="100"
                  max="599"
                />
                {errors.status && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.status}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Response Headers (JSON)</label>
              <textarea
                className="form-input form-textarea"
                value={formData.headers}
                onChange={(e) => handleInputChange('headers', e.target.value)}
                placeholder='{"Content-Type": "application/json"}'
                style={{ height: '80px' }}
              />
              {errors.headers && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.headers}</div>}
            </div>

            <div className="form-group">
              <div className="flex flex-between flex-center" style={{ marginBottom: '8px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Response Body (JSON)</label>
                <select
                  onChange={(e) => {
                    const preset = presetBodies.find(p => p.name === e.target.value)
                    if (preset) {
                      handleInputChange('body', preset.value)
                    }
                  }}
                  style={{ 
                    fontSize: '12px', 
                    padding: '4px 8px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px',
                    background: 'white'
                  }}
                >
                  <option value="">Choose preset...</option>
                  {presetBodies.map(preset => (
                    <option key={preset.name} value={preset.name}>{preset.name}</option>
                  ))}
                </select>
              </div>
              <textarea
                className="form-input form-textarea"
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder='{"message": "Hello World"}'
                style={{ minHeight: '150px' }}
              />
              {errors.body && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.body}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              ❌ Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Saving...' : (endpoint ? '💾 Update' : '🚀 Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EndpointForm 