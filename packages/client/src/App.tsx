import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { endpointApi } from './api'
import { FakeEndpoint } from './types'
import EndpointList from './components/EndpointList'
import EndpointForm from './components/EndpointForm'
import './styles.css'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEndpoint, setEditingEndpoint] = useState<FakeEndpoint | null>(null)
  const queryClient = useQueryClient()

  const { data: endpoints = [], isLoading, error } = useQuery({
    queryKey: ['endpoints'],
    queryFn: endpointApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: endpointApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endpoints'] })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: endpointApi.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endpoints'] })
    },
  })

  const handleFormSubmit = () => {
    setIsFormOpen(false)
    setEditingEndpoint(null)
    queryClient.invalidateQueries({ queryKey: ['endpoints'] })
  }

  const handleEdit = (endpoint: FakeEndpoint) => {
    setEditingEndpoint(endpoint)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id)
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h2 style={{ color: '#ef4444' }}>Error</h2>
          <p>Failed to load endpoints. Make sure the server is running.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>
            <span className="header-emoji">🎯</span>
            Fakepoint
          </h1>
          <p>Create and manage fake API endpoints for development</p>
        </div>
      </header>

      <div className="container">
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                📋 Fake Endpoints
              </h2>
              <p className="card-subtitle">
                {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} configured
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingEndpoint(null)
                setIsFormOpen(true)
              }}
            >
              ✨ New Endpoint
            </button>
          </div>

          {isLoading ? (
            <div className="loading">Loading endpoints...</div>
          ) : (
            <EndpointList
              endpoints={endpoints}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              isDeleting={deleteMutation.isPending}
              isToggling={toggleMutation.isPending}
            />
          )}
        </div>

        <div className="card">
          <h3 className="card-title">🚀 Server Information</h3>
          <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
            <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
                <strong style={{ color: '#667eea' }}>🔗 Server URL:</strong> 
                <code style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '4px 8px', borderRadius: '6px', marginLeft: '8px', fontFamily: 'JetBrains Mono, Monaco, monospace' }}>
                  http://localhost:3001
                </code>
              </div>
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <strong style={{ color: '#10b981' }}>⚙️ Management API:</strong> 
                <code style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px', marginLeft: '8px', fontFamily: 'JetBrains Mono, Monaco, monospace' }}>
                  http://localhost:3001/api/management
                </code>
              </div>
              <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                <strong style={{ color: '#f59e0b' }}>💡 How to use:</strong> Send requests to your configured endpoints using any HTTP client (curl, Postman, etc.)
                <br />
                <strong style={{ color: '#f59e0b' }}>📝 Example:</strong> 
                <code style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: '6px', marginLeft: '8px', fontFamily: 'JetBrains Mono, Monaco, monospace' }}>
                  curl http://localhost:3001/users
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <EndpointForm
          endpoint={editingEndpoint}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingEndpoint(null)
          }}
        />
      )}
    </div>
  )
}

export default App 