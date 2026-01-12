'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { user, userProfile } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-lg text-gray-900">{userProfile?.fullName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <p className="text-lg font-semibold text-blue-600">{userProfile?.role.toUpperCase()}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-lg text-gray-900">{userProfile?.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Student/Staff ID</label>
                <p className="text-lg text-gray-900">{userProfile?.studentId || 'Not provided'}</p>
              </div>

              {userProfile?.role === 'student' || userProfile?.role === 'staff' ? (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ You are currently registered as a <strong>{userProfile.role}</strong>. 
                    To access the admin dashboard, you need to register a new account with the <strong>admin</strong> or <strong>responder</strong> role.
                  </p>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ You have <strong>{userProfile?.role}</strong> access. You can access the admin dashboard at <a href="/admin" className="underline">/admin</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
