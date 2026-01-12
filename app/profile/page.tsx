'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, userProfile } = useAuth();

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'badge-danger';
      case 'responder':
        return 'badge-primary';
      case 'staff':
        return 'badge-success';
      case 'student':
        return 'badge-warning';
      default:
        return 'badge-primary';
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
        <Navbar />
        
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="card" style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <div className="card-header">
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Your Profile
              </h1>
            </div>
            
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label">Email</label>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {user?.email}
                </p>
              </div>
              
              <div>
                <label className="label">Full Name</label>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {userProfile?.fullName}
                </p>
              </div>
              
              <div>
                <label className="label">Role</label>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className={`badge ${getRoleBadgeClass(userProfile?.role || '')}`} style={{ fontSize: '1rem' }}>
                    {userProfile?.role.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="label">Phone</label>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {userProfile?.phone || 'Not provided'}
                </p>
              </div>
              
              <div>
                <label className="label">Student/Staff ID</label>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {userProfile?.studentId || 'Not provided'}
                </p>
              </div>

              {userProfile?.role === 'student' || userProfile?.role === 'staff' ? (
                <div className="alert-warning" style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>
                      You are currently registered as a <strong>{userProfile.role}</strong>. 
                      To access the admin dashboard, you need to register a new account with the <strong>admin</strong> or <strong>responder</strong> role.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="alert-success" style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>
                      You have <strong>{userProfile?.role}</strong> access. You can access the admin dashboard at{' '}
                      <Link href="/admin" style={{ textDecoration: 'underline', color: 'inherit', fontWeight: '600' }}>
                        /admin
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
