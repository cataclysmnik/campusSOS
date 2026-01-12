'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getIncidents } from '@/lib/firebase/firestore';
import { Incident } from '@/types/firebase';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      if (!user) return;

      try {
        const userIncidents = await getIncidents({
          userId: user.uid,
          limitCount: 10,
        });
        setIncidents(userIncidents);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [user]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'badge-warning';
      case 'verified':
        return 'badge-primary';
      case 'assigned':
      case 'in-progress':
        return 'badge-primary';
      case 'resolved':
      case 'closed':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#ca8a04';
      case 'low':
        return '#16a34a';
      default:
        return 'var(--text-tertiary)';
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
        <Navbar />

        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          {/* Welcome Section */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-body">
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Welcome back, {userProfile?.fullName || 'User'}!
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Here's an overview of your reported incidents
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <Link href="/incidents/new" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}>
                <div className="card-body">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ marginBottom: '0.75rem' }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                    Report Incident
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Submit a new emergency or incident
                  </p>
                </div>
              </div>
            </Link>

            <div className="card">
              <div className="card-body">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ marginBottom: '0.75rem' }}>
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Total Reports
                </h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                  {incidents.length}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" style={{ marginBottom: '0.75rem' }}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Active Cases
                </h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)' }}>
                  {incidents.filter((i) => !['resolved', 'closed', 'rejected'].includes(i.status)).length}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Your Recent Incidents
              </h2>
            </div>
            <div className="card-body">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    border: '3px solid var(--border-color)',
                    borderTopColor: 'var(--primary)',
                    borderRadius: '50%',
                    margin: '0 auto 1rem'
                  }} className="spinner" />
                  <p style={{ color: 'var(--text-secondary)' }}>Loading incidents...</p>
                </div>
              ) : incidents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    No incidents yet
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    You haven't reported any incidents
                  </p>
                  <Link href="/incidents/new">
                    <button className="btn btn-primary">Report Your First Incident</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {incidents.map((incident) => (
                    <Link
                      key={incident.id}
                      href={`/incidents/${incident.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={{ 
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'var(--bg-primary)',
                        cursor: 'pointer'
                      }}
                      className="incident-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                {incident.title}
                              </h3>
                              <span className={`badge ${getStatusBadgeClass(incident.status)}`}>
                                {incident.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                              {incident.description.substring(0, 150)}...
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {incident.location.building}
                              </span>
                              <span>{incident.category.replace('-', ' ')}</span>
                              <span style={{ fontWeight: '600', color: getSeverityColor(incident.severity) }}>
                                {incident.severity.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                            {incident.createdAt && typeof incident.createdAt === 'object' && 'toDate' in incident.createdAt
                              ? new Date(incident.createdAt.toDate()).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .spinner {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .incident-card:hover {
            box-shadow: var(--shadow-md);
            border-color: var(--primary);
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
