'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getIncidents } from '@/lib/firebase/firestore';
import { Incident } from '@/types/firebase';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      if (!user) return;

      try {
        const userIncidents = await getIncidents({
          userId: user.uid,
          limitCount: 10,
        });
        setIncidents(userIncidents);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'in-progress':
        return 'bg-indigo-100 text-indigo-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile?.displayName || 'User'}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your reported incidents
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/incidents/new"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">🚨</div>
              <h3 className="text-xl font-semibold mb-2">Report Incident</h3>
              <p className="text-blue-100">Submit a new emergency or incident</p>
            </Link>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">Total Reports</h3>
              <p className="text-3xl font-bold text-blue-600">{incidents.length}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-4xl mb-3">⏳</div>
              <h3 className="text-xl font-semibold mb-2">Active Cases</h3>
              <p className="text-3xl font-bold text-orange-600">
                {incidents.filter((i) => !['resolved', 'closed', 'rejected'].includes(i.status)).length}
              </p>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Incidents</h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading incidents...</p>
              </div>
            ) : incidents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No incidents yet</h3>
                <p className="text-gray-600 mb-6">You haven't reported any incidents</p>
                <Link
                  href="/incidents/new"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Report Your First Incident
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <Link
                    key={incident.id}
                    href={`/incidents/${incident.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{incident.description.substring(0, 150)}...</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📍 {incident.location.building}</span>
                          <span>📂 {incident.category.replace('-', ' ')}</span>
                          <span className={`font-semibold ${getSeverityColor(incident.severity)}`}>
                            ⚠️ {incident.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {incident.createdAt && typeof incident.createdAt === 'object' && 'toDate' in incident.createdAt
                          ? new Date(incident.createdAt.toDate()).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
