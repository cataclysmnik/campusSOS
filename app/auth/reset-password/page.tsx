'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const oobCode = useMemo(() => searchParams.get('oobCode') ?? '', [searchParams]);

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const isCodePresent = Boolean(oobCode);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!isCodePresent) {
			setError('Invalid or missing password reset code. Please request a new reset email.');
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long.');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		setLoading(true);
		try {
			await verifyPasswordResetCode(auth, oobCode);
			await confirmPasswordReset(auth, oobCode, password);
			setSuccess('Your password has been reset successfully. You can now sign in.');
			setPassword('');
			setConfirmPassword('');
		} catch (err: any) {
			console.error('Reset password error:', err);
			if (err?.code === 'auth/expired-action-code') {
				setError('This reset link has expired. Please request a new one.');
			} else if (err?.code === 'auth/invalid-action-code') {
				setError('This reset link is invalid. Please request a new one.');
			} else if (err?.code === 'auth/weak-password') {
				setError('Password is too weak. Please choose a stronger password.');
			} else {
				setError('Failed to reset password. Please try again.');
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
						Reset Password
					</h1>
					<p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
						Enter your new password below.
					</p>
				</div>

				<div className="card-body">
					<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						{error && <div className="alert-error">{error}</div>}
						{success && <div className="alert-success">{success}</div>}

						<div>
							<label htmlFor="password" className="label">
								New Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="input"
								placeholder="At least 6 characters"
								required
							/>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="label">
								Confirm New Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="input"
								placeholder="Re-enter your new password"
								required
							/>
						</div>

						<button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
							{loading ? 'Updating password...' : 'Reset Password'}
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
