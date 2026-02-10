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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Focus the close button and listen for Escape key when menu opens
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };

    if (mobileMenuOpen) {
      // focus close button
      setTimeout(() => closeBtnRef.current?.focus(), 50);
      document.addEventListener('keydown', handleKey);
    }

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setMenuOpen(false);
    closeMobileMenu();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const openMobileMenu = () => {
    setIsAnimating(true);
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setMobileMenuOpen(false);
    }, 300);
  };

  const handleMobileLinkClick = () => {
    closeMobileMenu();
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
            <span style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.025em' }} className="logo-text">CampusSOS</span>
          </Link>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem'
          }} className="nav-links desktop-nav">
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
          gap: '1rem'
        }}>
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--text-primary)',
              zIndex: 1001
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-panel"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            position: 'relative'
          }} ref={menuRef} className="desktop-user-menu">
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.25rem'
              }} className="user-details">
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {userProfile?.displayName || 
                   (userProfile?.role === 'student' && userProfile?.studentId ? userProfile.studentId : user.email)}
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
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop with fade animation */}
          <div
            onClick={closeMobileMenu}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 998,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              animation: 'fadeIn 0.3s ease-out',
              cursor: 'pointer'
            }}
          />
          
          {/* Mobile Menu Panel with slide animation */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              backgroundColor: 'var(--bg-primary)',
              zIndex: 999,
              overflowY: 'auto',
              animation: isAnimating ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-out',
              display: 'flex',
              flexDirection: 'column'
            }}
            className="mobile-menu-panel"
            id="mobile-menu-panel"
          >
            {/* Close button */}
            <div style={{
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <span style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700',
                color: 'var(--text-primary)'
              }}>Menu</span>
              <button
                ref={closeBtnRef}
                onClick={closeMobileMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                className="mobile-close-btn"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* User Info Card */}
            <div style={{
              margin: '1.5rem',
              padding: '1.25rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              borderRadius: '1rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  {(userProfile?.displayName || userProfile?.studentId || user.email || '?').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    marginBottom: '0.25rem',
                    lineHeight: '1.2'
                  }}>
                    {userProfile?.displayName || 
                     (userProfile?.role === 'student' && userProfile?.studentId ? userProfile.studentId : user.email)}
                  </p>
                  {userProfile && (
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      {userProfile.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Section */}
            <div style={{
              flex: 1,
              padding: '0 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>Navigation</p>

              <Link href="/dashboard" onClick={handleMobileLinkClick}>
                <button className="mobile-nav-item">
                  <div className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <span>Dashboard</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', opacity: 0.5 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </Link>
              
              <Link href="/incidents/new" onClick={handleMobileLinkClick}>
                <button className="mobile-nav-item" style={{ 
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                  color: 'white'
                }}>
                  <div className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <span style={{ fontWeight: '600' }}>Report Incident</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </Link>

              {userProfile && ['admin', 'responder'].includes(userProfile.role) && (
                <Link href="/admin" onClick={handleMobileLinkClick}>
                  <button className="mobile-nav-item">
                    <div className="mobile-nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <span>Admin Panel</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', opacity: 0.5 }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </Link>
              )}

              <div style={{ 
                height: '1px', 
                backgroundColor: 'var(--border-color)', 
                margin: '1rem 0' 
              }} />

              <p style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>Settings</p>

              <Link href="/profile" onClick={handleMobileLinkClick}>
                <button className="mobile-nav-item">
                  <div className="mobile-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span>Profile Settings</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', opacity: 0.5 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </Link>

              {mounted && (
                <button
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                  }}
                  className="mobile-nav-item"
                >
                  <div className="mobile-nav-icon">
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
                  </div>
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', opacity: 0.5 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>

            {/* Logout Button at Bottom */}
            <div style={{ 
              padding: '1.5rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <button 
                onClick={handleLogout} 
                className="mobile-nav-item" 
                style={{ 
                  color: 'var(--danger)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)'
                }}
              >
                <div className="mobile-nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <span style={{ fontWeight: '600' }}>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .mobile-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-primary);
          font-size: 0.9375rem;
          text-align: left;
        }

        .mobile-nav-item:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .mobile-nav-item:active {
          transform: translateX(4px) scale(0.98);
        }

        .mobile-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
        }

        .mobile-close-btn:hover {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }

        .mobile-close-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </nav>
  );
}