'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return null;
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'badge-danger';
      case 'responder':
        return 'badge-success';
      default:
        return 'badge-primary';
    }
  };

  return (
    <nav style={{ 
      backgroundColor: 'var(--bg-primary)', 
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          height: '4rem',
          gap: '1rem'
        }}>
          <Link href="/dashboard" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'var(--text-primary)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>CampusSOS</span>
          </Link>

          <div style={{ 
            display: 'none', 
            alignItems: 'center', 
            gap: '0.5rem'
          }} className="nav-links">
            <Link href="/dashboard">
              <button className="btn btn-ghost btn-sm">Dashboard</button>
            </Link>
            
            <Link href="/incidents/new">
              <button className="btn btn-ghost btn-sm">Report Incident</button>
            </Link>

            {userProfile && ['admin', 'responder'].includes(userProfile.role) && (
              <Link href="/admin">
                <button className="btn btn-ghost btn-sm">Admin Panel</button>
              </Link>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem'
          }}>
            <Link href="/profile">
              <button className="btn btn-ghost btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </Link>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem'
            }} className="user-info">
              <div style={{ 
                width: '2rem', 
                height: '2rem', 
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'none' }} className="user-details">
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {userProfile?.fullName || user.email}
                </p>
                {userProfile && (
                  <span className={`badge ${getRoleBadgeClass(userProfile.role)}`}>
                    {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                  </span>
                )}
              </div>
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="btn btn-ghost btn-icon"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            )}

            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .nav-links {
            display: flex !important;
          }
          .user-details {
            display: block !important;
          }
        }
        @media (max-width: 640px) {
          .logout-text {
            display: none;
          }
          .user-info {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
