'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/firebase/auth';

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!email.trim()) {
			setError('Please enter your email address.');
			return;
		}

		setLoading(true);
		try {
			await resetPassword(email.trim());
			setSuccess('Password reset email sent. Please check your inbox.');
		} catch (err: any) {
			console.error('Forgot password error:', err);
			if (err?.code === 'auth/user-not-found') {
				setError('No account found with this email address.');
			} else if (err?.code === 'auth/invalid-email') {
				setError('Please enter a valid email address.');
			} else if (err?.code === 'auth/too-many-requests') {
				setError('Too many requests. Please try again later.');
			} else {
				setError('Failed to send reset email. Please try again.');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '1rem',
				marginTop: '-6.5rem',
				background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
			}}
		>
			<div className="card" style={{ width: '100%', maxWidth: '28rem' }}>
				<div className="card-header" style={{ textAlign: 'center' }}>
					<h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
						Forgot Password
					</h1>
					<p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
						Enter your email and we’ll send you a password reset link.
					</p>
				</div>

				<div className="card-body">
					<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						{error && <div className="alert-error">{error}</div>}
						{success && <div className="alert-success">{success}</div>}

						<div>
							<label htmlFor="email" className="label">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="input"
								placeholder="student@university.edu"
								required
							/>
						</div>

						<button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
							{loading ? 'Sending...' : 'Send Reset Link'}
						</button>
					</form>
				</div>

				<div className="card-footer" style={{ textAlign: 'center' }}>
					<Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
						Back to login
					</Link>
				</div>
			</div>
		</div>
	);
}
