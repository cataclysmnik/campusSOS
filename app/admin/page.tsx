'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleGuard from '@/components/RoleGuard';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { getIncidents, updateIncidentStatus, assignIncident, subscribeToIncidents, setIncidentNoticeboardStatus } from '@/lib/firebase/firestore';
import { Incident, IncidentStatus, IncidentCategory, SeverityLevel } from '@/types/firebase';

export default function AdminPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IncidentCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'all'>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'verify' | 'assign' | 'status' | 'reject'>('verify');
  const [actionNotes, setActionNotes] = useState('');
  const [actionStatus, setActionStatus] = useState<IncidentStatus>('verified');

  useEffect(() => {
    // Subscribe to real-time incidents
    const unsubscribe = subscribeToIncidents((data) => {
      setIncidents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...incidents];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (inc) =>
          inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.location.building.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((inc) => inc.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((inc) => inc.category === categoryFilter);
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter((inc) => inc.severity === severityFilter);
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchQuery, statusFilter, categoryFilter, severityFilter]);

  const stats = {
    total: incidents.length,
    submitted: incidents.filter((i) => i.status === 'submitted').length,
    verified: incidents.filter((i) => i.status === 'verified').length,
    assigned: incidents.filter((i) => i.status === 'assigned').length,
    inProgress: incidents.filter((i) => i.status === 'in-progress').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    critical: incidents.filter((i) => i.severity === 'critical').length,
  };

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

  const handleAction = async () => {
    if (!selectedIncident || !user) return;

    try {
      if (actionType === 'verify') {
        await updateIncidentStatus(selectedIncident.id, 'verified', user.uid, actionNotes);
      } else if (actionType === 'reject') {
        await updateIncidentStatus(selectedIncident.id, 'rejected', user.uid, actionNotes);
      } else if (actionType === 'status') {
        await updateIncidentStatus(selectedIncident.id, actionStatus, user.uid, actionNotes);
      }

      setShowActionModal(false);
      setActionNotes('');
      setSelectedIncident(null);
    } catch (error) {
      console.error('Action error:', error);
      alert('Failed to perform action. Please try again.');
    }
  };

  const handleToggleNoticeboard = async (incident: Incident) => {
    if (!userProfile || userProfile.role !== 'admin') return;

    try {
      await setIncidentNoticeboardStatus(incident.id, !incident.onNoticeboard);
    } catch (error) {
      console.error('Toggle noticeboard error:', error);
      alert('Failed to update noticeboard status. Please try again.');
    }
  };

  const openActionModal = (incident: Incident, type: 'verify' | 'assign' | 'status' | 'reject') => {
    setSelectedIncident(incident);
    setActionType(type);
    setShowActionModal(true);
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'responder']}>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
          <Navbar />

          <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Admin Dashboard
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Manage and monitor all campus incidents
              </p>
            </div>

            {/* Statistics Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.total}</p>
              </div>
              <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--warning)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Submitted</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)' }}>{stats.submitted}</p>
              </div>
              <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--primary)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Verified</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.verified}</p>
              </div>
              <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--primary)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Assigned</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.assigned}</p>
              </div>
              <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--primary)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>In Progress</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.inProgress}</p>
              </div>
              <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--success)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Resolved</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>{stats.resolved}</p>
              </div>
              <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--danger)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Critical</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--danger)' }}>{stats.critical}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {/* Search */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="label">Search</label>
                    <input
                      type="text"
                      placeholder="Search by title, description, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="label">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'all')}
                      className="select"
                    >
                      <option value="all">All Statuses</option>
                      <option value="submitted">Submitted</option>
                      <option value="verified">Verified</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Severity Filter */}
                  <div>
                    <label className="label">Severity</label>
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value as SeverityLevel | 'all')}
                      className="select"
                    >
                      <option value="all">All Levels</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || severityFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setSeverityFilter('all');
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: '1rem' }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {/* Incidents List */}
            <div className="card">
              <div className="card-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Incidents ({filteredIncidents.length})
                </h2>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    border: '3px solid var(--border-color)',
                    borderTopColor: 'var(--primary)',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{ color: 'var(--text-secondary)' }}>Loading incidents...</p>
                </div>
              ) : filteredIncidents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <p style={{ color: 'var(--text-secondary)' }}>No incidents found matching your filters</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <tr>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Incident
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Location
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Severity
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Status
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Date
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: 'var(--bg-primary)' }}>
                      {filteredIncidents.map((incident) => (
                        <tr key={incident.id} style={{ borderTop: '1px solid var(--border-color)' }} className="table-row">
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {incident.imageUrls && incident.imageUrls.length > 0 && (
                                <div style={{ flexShrink: 0 }}>
                                  <img
                                    src={incident.imageUrls[0]}
                                    alt="Incident"
                                    style={{ height: '3rem', width: '3rem', borderRadius: '0.5rem', objectFit: 'cover' }}
                                  />
                                  {incident.imageUrls.length > 1 && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem', display: 'block', textAlign: 'center' }}>
                                      +{incident.imageUrls.length - 1}
                                    </span>
                                  )}
                                </div>
                              )}
                              <div>
                                <div 
                                  style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--primary)', cursor: 'pointer' }}
                                  onClick={() => router.push(`/incidents/${incident.id}`)}
                                  className="incident-link"
                                >
                                  {incident.title}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{incident.reporterName}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{incident.location.building}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{incident.location.room}</div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: getSeverityColor(incident.severity) }}>
                              {incident.severity.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                            <span className={`badge ${getStatusBadgeClass(incident.status)}`}>
                              {incident.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {incident.createdAt && typeof incident.createdAt === 'object' && 'toDate' in incident.createdAt
                              ? new Date(incident.createdAt.toDate()).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              {incident.status === 'submitted' && (
                                <button
                                  onClick={() => openActionModal(incident, 'verify')}
                                  className="btn btn-sm btn-success"
                                >
                                  Verify
                                </button>
                              )}
                              <button
                                onClick={() => openActionModal(incident, 'status')}
                                className="btn btn-sm btn-outline"
                              >
                                Update
                              </button>
                              {userProfile?.role === 'admin' && (
                                <button
                                  onClick={() => handleToggleNoticeboard(incident)}
                                  className="btn btn-sm btn-ghost"
                                >
                                  {incident.onNoticeboard ? 'Remove from Noticeboard' : 'Add to Noticeboard'}
                                </button>
                              )}
                              <button
                                onClick={() => router.push(`/incidents/${incident.id}`)}
                                className="btn btn-sm btn-ghost"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Action Modal */}
          {showActionModal && selectedIncident && (
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
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Incident: {selectedIncident.title}
                  </p>
                  
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

                  <label className="label">Notes (Optional)</label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    rows={3}
                    className="textarea"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="card-footer" style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleAction}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setShowActionModal(false);
                      setActionNotes('');
                      setSelectedIncident(null);
                    }}
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
            .table-row:hover {
              background-color: var(--bg-secondary);
            }
            .incident-link:hover {
              text-decoration: underline;
            }
          `}</style>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
