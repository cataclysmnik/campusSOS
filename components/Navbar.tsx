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
  const mounted = true;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const handleMobileLinkClick = () => {
    closeMobileMenu();
  };

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

  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.paddingRight = scrollbarWidth + 'px';
    } else {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };

    if (mobileMenuOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 50);
      document.addEventListener('keydown', handleKey);
    }

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [mobileMenuOpen]);

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
    <nav
      style={{
        position: 'fixed',
        top: '0.75rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 1rem)',
        maxWidth: '80rem',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
      }}
      className="navbar-float"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '4rem',
          gap: '1rem',
          padding: '0 1rem',
        }}
      >
        {/* Logo and Desktop Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            minWidth: 0,
            flex: 1,
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                letterSpacing: '-0.025em',
              }}
              className="logo-text"
            >
              CampusSOS
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            className="nav-links"
          >
            <Link href="/dashboard">
              <button className="btn btn-ghost btn-sm">Dashboard</button>
            </Link>

            <Link href="/incidents/new">
              <button className="btn btn-ghost btn-sm">Report</button>
            </Link>

            {userProfile && ['admin', 'responder'].includes(userProfile.role) && (
              <Link href="/admin">
                <button className="btn btn-ghost btn-sm">Admin</button>
              </Link>
            )}
          </div>
        </div>

        {/* Right Side - Menu & Mobile Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              zIndex: 2000,
              position: 'relative',
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          {/* User Menu - Desktop */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              position: 'relative',
            }}
            ref={menuRef}
            className="desktop-user-menu"
          >
            <button
              onClick={toggleMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s ease',
              }}
              className="user-info"
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.25rem',
                }}
                className="user-details"
              >
                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {(userProfile?.displayName || user.email || '').split(' ')[0]}
                </p>
                {userProfile && (
                  <span className={`badge ${getRoleBadgeClass(userProfile.role)}`} style={{ fontSize: '0.65rem' }}>
                    {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                  </span>
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '3rem',
                  right: 0,
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: '12rem',
                  padding: '0.5rem',
                  zIndex: 1001,
                }}
                className="user-menu"
              >
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  <button
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      fontSize: '0.875rem',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
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
                      fontSize: '0.875rem',
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
                        Light
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        Dark
                      </>
                    )}
                  </button>
                )}

                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--border-color)',
                    margin: '0.5rem 0',
                  }}
                />

                <button
                  onClick={handleLogout}
                  className="btn btn-ghost"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    fontSize: '0.875rem',
                    color: 'var(--danger)',
                  }}
                >
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
          {/* Backdrop */}
          <div
            onClick={closeMobileMenu}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              animation: 'fadeIn 0.3s ease-out',
              cursor: 'pointer',
            }}
          />

          {/* Mobile Menu Panel - Full screen, scrollable content inside */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgb(10, 10, 10)',
              zIndex: 999,
              animation: isAnimating ? 'slideInUp 0.3s ease-out' : 'slideOutDown 0.3s ease-out',
              display: 'flex',
              flexDirection: 'column',
            }}
            className="mobile-menu-panel"
            id="mobile-menu-panel"
          >
            {/* Header with close button - Fixed */}
            <div
              style={{
                padding: '1.5rem 1.5rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Menu</span>
              <button
                ref={closeBtnRef}
                onClick={closeMobileMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s ease',
                  fontSize: '2rem',
                  lineHeight: 1,
                  width: '2.5rem',
                  height: '2.5rem',
                }}
                className="mobile-close-btn"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* User Card */}
              <div
                style={{
                  margin: '1.5rem',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                  borderRadius: '1rem',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      flexShrink: 0,
                    }}
                  >
                    {(userProfile?.displayName || userProfile?.studentId || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.2' }}>
                      {userProfile?.displayName || (userProfile?.role === 'student' && userProfile?.studentId ? userProfile.studentId : user.email)}
                    </p>
                    {userProfile && (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.35rem 0.75rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          borderRadius: '1rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.025em',
                        }}
                      >
                        {userProfile.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Links - Large Touch Targets */}
              <div
                style={{
                  padding: '0 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <Link href="/dashboard" onClick={handleMobileLinkClick} style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: 'white',
                      fontSize: '1.0625rem',
                      fontWeight: '500',
                      textAlign: 'left',
                    }}
                    className="mobile-nav-item"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <span>Dashboard</span>
                  </button>
                </Link>

                <Link href="/incidents/new" onClick={handleMobileLinkClick} style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                      border: 'none',
                      borderRadius: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: 'white',
                      fontSize: '1.0625rem',
                      fontWeight: '600',
                      textAlign: 'left',
                    }}
                    className="mobile-nav-item"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>Report Incident</span>
                  </button>
                </Link>

                {userProfile && ['admin', 'responder'].includes(userProfile.role) && (
                  <Link href="/admin" onClick={handleMobileLinkClick} style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.25rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: 'white',
                        fontSize: '1.0625rem',
                        fontWeight: '500',
                        textAlign: 'left',
                      }}
                      className="mobile-nav-item"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>Admin Panel</span>
                    </button>
                  </Link>
                )}
              </div>

              {/* Settings Section */}
              <div style={{ padding: '1.5rem 1.5rem 0 1.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                  Settings
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Link href="/profile" onClick={handleMobileLinkClick} style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '500',
                        textAlign: 'left',
                      }}
                      className="mobile-nav-item"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Profile Settings</span>
                    </button>
                  </Link>

                  {mounted && (
                    <button
                      onClick={() => {
                        setTheme(theme === 'dark' ? 'light' : 'dark');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '500',
                        textAlign: 'left',
                      }}
                      className="mobile-nav-item"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                        {theme === 'dark' ? (
                          <>
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                          </>
                        ) : (
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        )}
                      </svg>
                      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Logout - Sticky at bottom */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', flexShrink: 0 }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1.25rem',
                  background: 'rgba(239, 68, 68, 0.25)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#ff6b6b',
                  fontSize: '1.0625rem',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
                className="mobile-nav-item"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

@keyframes slideInUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes slideOutDown {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100%);
            opacity: 0;
          }
        }

        .mobile-nav-item:active {
          transform: scale(0.98);
        }

        .mobile-close-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }

          .mobile-menu-btn {
            display: flex !important;
          }

          .user-details p {
            display: none;
          }

          .user-details {
            align-items: center !important;
          }

          .mobile-nav-item:hover {
            background-color: var(--bg-tertiary) !important;
            transform: translateX(2px);
          }
        }

        @media (max-width: 480px) {
          .logo-text {
            display: none !important;
          }

          .mobile-nav-item:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </nav>
  );
}
