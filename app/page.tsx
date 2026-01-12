import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
      marginTop: '-6.5rem',
      paddingTop: '6.5rem'
    }}>
      {/* Hero Section */}
      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            color: 'var(--text-primary)', 
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Campus Emergency<br />Reporting System
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--text-secondary)', 
            marginBottom: '3rem', 
            maxWidth: '42rem', 
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            Report and track campus emergencies and incidents in real-time.
            Connect with campus security and get help when you need it.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register">
              <button className="btn btn-primary btn-lg">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="btn btn-outline btn-lg">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem', 
          marginTop: '5rem' 
        }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }}>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Real-Time Updates
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Get instant notifications about the status of your reports and emergency alerts
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Location-Based
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Report incidents with precise campus locations for faster response
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Secure & Private
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Your safety is our priority. All reports are handled confidentially
              </p>
            </div>
          </div>
        </div>

        {/* Incident Types */}
        <div className="card" style={{ marginTop: '5rem' }}>
          <div className="card-header">
            <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center' }}>
              What Can You Report?
            </h2>
          </div>
          <div className="card-body">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '2rem' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--danger)', margin: '0 auto 0.5rem' }}>
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Medical Emergency</h4>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--warning)', margin: '0 auto 0.5rem' }}>
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Fire Incident</h4>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--danger)', margin: '0 auto 0.5rem' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v4m0 4h.01" />
                </svg>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Security Concern</h4>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', margin: '0 auto 0.5rem' }}>
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Facility Issue</h4>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--danger)', margin: '0 auto 0.5rem' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Harassment</h4>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', margin: '0 auto 0.5rem' }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Lost & Found</h4>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--warning)', margin: '0 auto 0.5rem' }}>
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                </svg>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Lab Accident</h4>
              </div>
              <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', margin: '0 auto 0.5rem' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Other Issues</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="alert alert-error" style={{ 
          marginTop: '3rem',
          textAlign: 'center',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          <span>
            For life-threatening emergencies, always call Campus Security: <strong style={{ fontSize: '1.5rem' }}>911</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
