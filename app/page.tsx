'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleCategoryClick = (category: string) => {
    if (!user) {
      // Not logged in - redirect to login with redirect URL encoded
      const redirectUrl = `/incidents/new?category=${category}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }
    // Logged in - go to incident form with category pre-selected
    router.push(`/incidents/new?category=${category}`);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.1) 0%, var(--bg-secondary) 50%), linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
      marginTop: '-6.5rem',
      paddingTop: '6.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 20s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 25s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />

      {/* Hero Section */}
      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 3s ease-in-out infinite'
            }} />
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
              style={{ 
                color: 'var(--primary)', 
                filter: 'drop-shadow(0 4px 6px rgba(37, 99, 235, 0.3))',
                position: 'relative',
                animation: 'iconBounce 3s ease-in-out infinite'
              }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: '900', 
            color: 'var(--text-primary)', 
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            Campus Emergency<br />Reporting System
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            color: 'var(--text-secondary)', 
            marginBottom: '3rem', 
            maxWidth: '42rem', 
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.7',
            animation: 'fadeInUp 0.8s ease-out 0.2s both'
          }}>
            Report and track campus emergencies and incidents in real-time.
            Connect with campus security and get help when you need it.
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            alignItems: 'center',
            animation: 'fadeInUp 0.8s ease-out 0.4s both'
          }}>
            <Link href="/register">
              <button className="btn btn-primary btn-lg" style={{
                fontSize: '1.125rem',
                padding: '0.875rem 2rem',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                animation: 'buttonGlow 2s ease-in-out infinite',
                height: '52px',
                minWidth: '160px'
              }}>
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="btn btn-outline btn-lg" style={{
                fontSize: '1.125rem',
                padding: '0.875rem 2rem',
                height: '52px',
                minWidth: '160px'
              }}>
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem', 
          marginTop: '6rem',
          animation: 'fadeInUp 0.8s ease-out 0.6s both'
        }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '';
          }}>
            <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Real-Time Updates
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Get instant notifications about the status of your reports and emergency alerts
              </p>
            </div>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '';
          }}>
            <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Location-Based
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Report incidents with precise campus locations for faster response
              </p>
            </div>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '';
          }}>
            <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Secure & Private
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Your safety is our priority. All reports are handled confidentially
              </p>
            </div>
          </div>
        </div>

        {/* Incident Types */}
        <div className="card" style={{ 
          marginTop: '6rem',
          background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          animation: 'fadeInUp 0.8s ease-out 0.8s both'
        }}>
          <div className="card-header" style={{ padding: '2.5rem 2rem 2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', 
              fontWeight: '800', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              What Can You Report?
            </h2>
            <p style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginTop: '0.5rem',
              fontSize: '1rem'
            }}>
              We handle a wide range of campus incidents and emergencies
            </p>
          </div>
          <div className="card-body" style={{ padding: '2rem 1rem', position: 'relative' }}>
            {/* Left Scroll Button */}
            <button
              onClick={scrollLeft}
              style={{
                position: 'absolute',
                left: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '2px solid var(--border-color)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.9)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Right Scroll Button */}
            <button
              onClick={scrollRight}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '2px solid var(--border-color)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.9)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div
              ref={scrollContainerRef}
              style={{ 
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                overflowY: 'visible',
                paddingBottom: '1rem',
                paddingTop: '1rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--border-color) transparent',
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory',
                marginLeft: '3rem',
                marginRight: '3rem'
              }} 
              className="scroll-container">
              <div className="card" style={{ 
                minWidth: '200px',
                maxWidth: '200px',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }} 
              onClick={() => handleCategoryClick('medical-emergency')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--danger)' }}>
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Medical Emergency</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Critical medical situations</p>
              </div>
              
              <div className="card" style={{ 
                minWidth: '200px',
                maxWidth: '200px',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }} 
              onClick={() => handleCategoryClick('fire')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(234, 88, 12, 0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(234, 88, 12, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--warning)' }}>
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Fire Incident</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Fire or smoke detected</p>
              </div>
              
              <div className="card" style={{ 
                minWidth: '200px',
                maxWidth: '200px',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }} 
              onClick={() => handleCategoryClick('security-concern')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--danger)' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v4m0 4h.01" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Security Concern</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Safety threats or risks</p>
              </div>
              
              <div className="card" style={{ 
                minWidth: '200px',
                maxWidth: '200px',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }} 
              onClick={() => handleCategoryClick('facility-issue')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary)' }}>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Facility Issue</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Building or equipment</p>
              </div>
              
              <div className="card" style={{ 
                minWidth: '200px',
                maxWidth: '200px',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }} 
              onClick={() => handleCategoryClick('harassment')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--danger)' }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Harassment</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Bullying or intimidation</p>
              </div>
              
              <div className="card" style={{ 
                minWidth: '200px',
                maxWidth: '200px',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }} 
              onClick={() => handleCategoryClick('lost-item')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary)' }}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Lost & Found</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Missing or found items</p>
              </div>
              
              <div className="card" style={{ 
                minWidth: '200px',
                maxWidth: '200px',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(234, 88, 12, 0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(234, 88, 12, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--warning)' }}>
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Lab Accident</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Laboratory incidents</p>
              </div>
              
              <div className="card" style={{ 
                minWidth: '200px',
                maxWidth: '200px',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary)' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Other Issues</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>General concerns</p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="alert alert-error" style={{ 
          marginTop: '4rem',
          textAlign: 'center',
          fontSize: '1.125rem',
          fontWeight: '600',
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
          border: '2px solid rgba(220, 38, 38, 0.3)',
          boxShadow: '0 10px 30px rgba(220, 38, 38, 0.15)',
          animation: 'fadeInUp 0.8s ease-out 1s both, alertPulse 2s ease-in-out 2s infinite'
        }}>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonGlow {
          0%, 100% {
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
          }
          50% {
            box-shadow: 0 10px 35px rgba(37, 99, 235, 0.5);
          }
        }

        @keyframes alertPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .scroll-container::-webkit-scrollbar {
          height: 8px;
        }

        .scroll-container::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 10px;
        }

        .scroll-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 10px;
        }

        .scroll-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
}
