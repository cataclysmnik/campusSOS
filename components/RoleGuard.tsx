'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/firebase';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export default function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Checking permissions...
          </p>
        </div>
      </div>
    );
  }

  console.log('RoleGuard check - userProfile:', userProfile, 'allowedRoles:', allowedRoles);

  if (!userProfile || !allowedRoles.includes(userProfile.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // If userProfile is null but loading is complete, the user truly doesn't have access
    // If userProfile exists but role not in allowedRoles, deny access
    const isAccessDenied = !userProfile || !allowedRoles.includes(userProfile.role);
    
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bg-secondary)',
        padding: '1rem'
      }}>
        <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--danger)', margin: '0 auto 1rem' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Access Denied
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {!userProfile 
                  ? 'Unable to load your profile. Please try refreshing the page.' 
                  : `You don't have permission to access this page. Your role is: ${userProfile.role}`}
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
