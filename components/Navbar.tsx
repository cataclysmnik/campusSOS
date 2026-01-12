'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
      position: 'fixed',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 2rem)',
      maxWidth: '80rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      border: '1px solid var(--border-color)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      transition: 'all 0.3s ease'
    }} className="navbar-float">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        height: '4.5rem',
        gap: '2rem',
        padding: '0 1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <Link href="/dashboard" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'var(--text-primary)'
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.025em' }}>CampusSOS</span>
          </Link>

          <div style={{ 
            display: 'flex', 
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
        </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            position: 'relative'
          }} ref={menuRef}>
            <button
              onClick={toggleMenu}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s ease'
              }}
              className="user-info"
            >
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'transform 0.2s ease'
              }}
              className="avatar-button">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div style={{ 
                display: 'none',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.25rem'
              }} className="user-details">
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {userProfile?.displayName || user.email}
                </p>
                {userProfile && (
                  <span className={`badge ${getRoleBadgeClass(userProfile.role)}`} style={{ fontSize: '0.75rem' }}>
                    {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                  </span>
                )}
              </div>
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: '3.5rem',
                right: 0,
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '12rem',
                padding: '0.5rem',
                zIndex: 1001
              }} className="user-menu">
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  <button className="btn btn-ghost" style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    fontSize: '0.875rem'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile Settings
                  </button>
                </Link>

                {mounted && (
                  <button
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                      setMenuOpen(false);
                    }}
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      fontSize: '0.875rem'
                    }}
                  >
                    {theme === 'dark' ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                        Light Mode
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        Dark Mode
                      </>
                    )}
                  </button>
                )}

                <div style={{
                  height: '1px',
                  backgroundColor: 'var(--border-color)',
                  margin: '0.5rem 0'
                }} />

                <button onClick={handleLogout} className="btn btn-ghost" style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  fontSize: '0.875rem',
                  color: 'var(--danger)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }