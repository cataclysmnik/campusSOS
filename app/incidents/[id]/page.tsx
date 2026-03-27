'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { getIncident, subscribeToIncident, updateIncidentStatus } from '@/lib/firebase/firestore';
import { Incident, IncidentStatus } from '@/types/firebase';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'verify' | 'assign' | 'status' | 'reject'>('verify');
  const [actionNotes, setActionNotes] = useState('');
  const [actionStatus, setActionStatus] = useState<IncidentStatus>('verified');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!incidentId) return;

    // Subscribe to real-time updates
    const unsubscribe = subscribeToIncident(incidentId, (data) => {
      setIncident(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [incidentId]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'submitted': return 'badge-warning';
      case 'verified': return 'badge-primary';
      case 'assigned': return 'badge-primary';
      case 'in-progress': return 'badge-primary';
      case 'resolved': return 'badge-success';
      case 'closed': return 'badge-success';
      case 'rejected': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return 'var(--text-tertiary)';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--danger)';
      case 'high': return 'var(--warning)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--bg-tertiary)';
    }
  };

  const openActionModal = (type: 'verify' | 'assign' | 'status' | 'reject') => {
    setActionType(type);
    setShowActionModal(true);
  };

  const handleAction = async () => {
    if (!user || !incident) return;

    setActionLoading(true);
    try {
      if (actionType === 'verify') {
        await updateIncidentStatus(incident.id, 'verified', user.uid, actionNotes || 'Incident verified by admin');
      } else if (actionType === 'reject') {
        await updateIncidentStatus(incident.id, 'rejected', user.uid, actionNotes || 'Incident rejected');
      } else if (actionType === 'status') {
        await updateIncidentStatus(incident.id, actionStatus, user.uid, actionNotes || 'Status updated');
      }

      setShowActionModal(false);
      setActionNotes('');
    } catch (error) {
      console.error('Action error:', error);
      alert('Failed to perform action. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
          <Navbar />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: 'var(--text-secondary)' }}>Loading incident details...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!incident) {
    return (
      <ProtectedRoute>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
          <Navbar />
          <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Incident Not Found
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                The incident you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
        <Navbar />

        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => router.back()}
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Main Content */}
          <div className="card" style={{ overflow: 'hidden' }}>
            {/* Header Section */}
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
              padding: '2rem',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {incident.title}
                  </h1>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Reported by {incident.reporterName} • {
                      incident.createdAt && typeof incident.createdAt === 'object' && 'toDate' in incident.createdAt
                        ? new Date(incident.createdAt.toDate()).toLocaleString()
                        : 'N/A'
                    }
                  </p>
                </div>
                <span className={`badge ${getStatusBadgeClass(incident.status)}`} style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                  {incident.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {/* Category */}
              <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Category</h3>
                <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {incident.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
              </div>

              {/* Severity */}
              <div style={{ borderRadius: '0.5rem', padding: '1rem', backgroundColor: getSeverityBg(incident.severity), color: 'white' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Severity</h3>
                <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {incident.severity.toUpperCase()}
                </p>
              </div>

              {/* Location */}
              <div style={{ gridColumn: '1 / -1', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Location</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <p style={{ color: 'var(--text-primary)' }}>
                    <span style={{ fontWeight: '600' }}>Building:</span> {incident.location.building}
                  </p>
                  {incident.location.floor && (
                    <p style={{ color: 'var(--text-primary)' }}>
                      <span style={{ fontWeight: '600' }}>Floor:</span> {incident.location.floor}
                    </p>
                  )}
                  {incident.location.room && (
                    <p style={{ color: 'var(--text-primary)' }}>
                      <span style={{ fontWeight: '600' }}>Room:</span> {incident.location.room}
                    </p>
                  )}
                  {incident.location.description && (
                    <p style={{ color: 'var(--text-primary)' }}>
                      <span style={{ fontWeight: '600' }}>Details:</span> {incident.location.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ padding: '0 2rem 2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{incident.description}</p>
            </div>

            {/* Images */}
            <div style={{ padding: '0 2rem 2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Images</h3>
              {incident.imageUrls && incident.imageUrls.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {incident.imageUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block' }}
                    >
                      <img
                        src={url}
                        alt={`Incident image ${index + 1}`}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                        className="incident-image"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  No images attached to this incident.
                </p>
              )}
            </div>

            {/* Status Timeline */}
            {incident.statusHistory && (
              <div style={{ padding: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>Status History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(incident.statusHistory).map(([status, history]) => (
                    <div key={status} style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                      <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', marginTop: '0.375rem', flexShrink: 0 }} className={`badge ${getStatusBadgeClass(status)}`}></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {history.timestamp && typeof history.timestamp === 'object' && 'toDate' in history.timestamp
                            ? new Date(history.timestamp.toDate()).toLocaleString()
                            : 'N/A'}
                        </p>
                        {history.notes && (
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{history.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Actions */}
            {userProfile && ['admin', 'responder'].includes(userProfile.role) && (
              <div style={{ padding: '0 2rem 2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>Admin Actions</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {incident.status === 'submitted' && (
                    <button
                      onClick={() => openActionModal('verify')}
                      className="btn btn-success"
                    >
                      Verify Incident
                    </button>
                  )}
                  <button
                    onClick={() => openActionModal('status')}
                    className="btn btn-primary"
                  >
                    Update Status
                  </button>
                  {incident.status !== 'rejected' && incident.status !== 'closed' && (
                    <button
                      onClick={() => openActionModal('reject')}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Modal */}
        {showActionModal && (
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1001,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: '28rem', width: '100%' }}>
              <div className="card-header">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {actionType === 'verify' && 'Verify Incident'}
                  {actionType === 'reject' && 'Reject Incident'}
                  {actionType === 'status' && 'Update Status'}
                </h3>
              </div>

              <div className="card-body">
                {actionType === 'status' && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="label">New Status</label>
                    <select
                      value={actionStatus}
                      onChange={(e) => setActionStatus(e.target.value as IncidentStatus)}
                      className="select"
                    >
                      <option value="verified">Verified</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                )}

                <label className="label">
                  Notes {actionType === 'reject' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={3}
                  className="textarea"
                  placeholder={
                    actionType === 'verify'
                      ? 'Add verification notes...'
                      : actionType === 'reject'
                      ? 'Reason for rejection...'
                      : 'Add status update notes...'
                  }
                />
              </div>

              <div className="card-footer" style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleAction}
                  disabled={actionLoading || (actionType === 'reject' && !actionNotes)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {actionLoading ? 'Processing...' : 'Confirm'}
                </button>
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionNotes('');
                  }}
                  disabled={actionLoading}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .incident-image:hover {
            opacity: 0.9;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
