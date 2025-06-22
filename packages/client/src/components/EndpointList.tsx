import React from 'react'
import { FakeEndpoint } from '../types'

interface EndpointListProps {
  endpoints: FakeEndpoint[]
  onEdit: (endpoint: FakeEndpoint) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  isDeleting: boolean
  isToggling: boolean
}

const EndpointList: React.FC<EndpointListProps> = ({
  endpoints,
  onEdit,
  onDelete,
  onToggle,
  isDeleting,
  isToggling,
}) => {
  if (endpoints.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎯</div>
        <h3>No endpoints configured yet</h3>
        <p>Create your first fake endpoint to get started</p>
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: 'rgba(102, 126, 234, 0.05)', 
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <p style={{ fontSize: '13px', color: '#667eea', fontWeight: '500' }}>
            💡 Pro tip: Start with a simple GET endpoint like <code>/users</code> or <code>/api/posts</code>
          </p>
        </div>
      </div>
    )
  }

  const getMethodBadgeClass = (method: string) => {
    return `badge badge-method ${method.toLowerCase()}`
  }

  const formatResponsePreview = (body: any) => {
    if (typeof body === 'string') {
      return body.length > 50 ? body.substring(0, 50) + '...' : body
    }
    const json = JSON.stringify(body)
    return json.length > 50 ? json.substring(0, 50) + '...' : json
  }

  return (
    <div className="endpoint-list">
      {endpoints.map((endpoint) => (
        <div key={endpoint.id} className="endpoint-item">
          <div className="endpoint-header">
            <div>
              <div className="flex flex-center gap-2">
                <span className={getMethodBadgeClass(endpoint.method)}>
                  {endpoint.method}
                </span>
                <span className="endpoint-path">{endpoint.path}</span>
                <span className={`badge ${endpoint.enabled ? 'badge-success' : 'badge-secondary'}`}>
                  {endpoint.enabled ? 'enabled' : 'disabled'}
                </span>
              </div>
              <div className="endpoint-name">{endpoint.name}</div>
            </div>
            <div className="endpoint-actions">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onToggle(endpoint.id)}
                disabled={isToggling}
                title={endpoint.enabled ? 'Disable endpoint' : 'Enable endpoint'}
              >
                {endpoint.enabled ? '🔴 Disable' : '🟢 Enable'}
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => onEdit(endpoint)}
                title="Edit endpoint"
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(endpoint.id)}
                disabled={isDeleting}
                title="Delete endpoint"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
          
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            <div className="flex gap-4" style={{ marginBottom: '8px' }}>
              <span><strong>Status:</strong> {endpoint.response.status}</span>
              <span><strong>Created:</strong> {new Date(endpoint.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <strong>Response preview:</strong>
              <code style={{ 
                background: '#f8fafc', 
                padding: '4px 8px', 
                borderRadius: '4px',
                display: 'block',
                marginTop: '4px',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                {formatResponsePreview(endpoint.response.body)}
              </code>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EndpointList 