'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { getIncident, subscribeToIncident, updateIncidentStatus } from '@/lib/firebase/firestore';
import { Incident, IncidentStatus } from '@/types/firebase';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'verify' | 'assign' | 'status' | 'reject'>('verify');
  const [actionNotes, setActionNotes] = useState('');
  const [actionStatus, setActionStatus] = useState<IncidentStatus>('verified');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!incidentId) return;

    // Subscribe to real-time updates
    const unsubscribe = subscribeToIncident(incidentId, (data) => {
      setIncident(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [incidentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'verified': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const openActionModal = (type: 'verify' | 'assign' | 'status' | 'reject') => {
    setActionType(type);
    setShowActionModal(true);
  };

  const handleAction = async () => {
    if (!user || !incident) return;

    setActionLoading(true);
    try {
      if (actionType === 'verify') {
        await updateIncidentStatus(incident.id, 'verified', user.uid, actionNotes || 'Incident verified by admin');
      } else if (actionType === 'reject') {
        await updateIncidentStatus(incident.id, 'rejected', user.uid, actionNotes || 'Incident rejected');
      } else if (actionType === 'status') {
        await updateIncidentStatus(incident.id, actionStatus, user.uid, actionNotes || 'Status updated');
      }

      setShowActionModal(false);
      setActionNotes('');
    } catch (error) {
      console.error('Action error:', error);
      alert('Failed to perform action. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading incident details...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!incident) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Incident Not Found</h2>
              <p className="text-gray-600 mb-6">The incident you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{incident.title}</h1>
                  <p className="text-blue-100">
                    Reported by {incident.reporterName} • {
                      incident.createdAt && typeof incident.createdAt === 'object' && 'toDate' in incident.createdAt
                        ? new Date(incident.createdAt.toDate()).toLocaleString()
                        : 'N/A'
                    }
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(incident.status)}`}>
                  {incident.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-8 grid md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {incident.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
              </div>

              {/* Severity */}
              <div className={`rounded-lg p-4 ${getSeverityColor(incident.severity)}`}>
                <h3 className="text-sm font-medium mb-1">Severity</h3>
                <p className="text-lg font-semibold">
                  {incident.severity.toUpperCase()}
                </p>
              </div>

              {/* Location */}
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                <div className="space-y-1">
                  <p className="text-gray-900">
                    <span className="font-semibold">Building:</span> {incident.location.building}
                  </p>
                  {incident.location.floor && (
                    <p className="text-gray-900">
                      <span className="font-semibold">Floor:</span> {incident.location.floor}
                    </p>
                  )}
                  {incident.location.room && (
                    <p className="text-gray-900">
                      <span className="font-semibold">Room:</span> {incident.location.room}
                    </p>
                  )}
                  {incident.location.description && (
                    <p className="text-gray-900">
                      <span className="font-semibold">Details:</span> {incident.location.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-8 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{incident.description}</p>
            </div>

            {/* Images */}
            {incident.imageUrls && incident.imageUrls.length > 0 && (
              <div className="px-8 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Images</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {incident.imageUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={url}
                        alt={`Incident image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Status Timeline */}
            {incident.statusHistory && (
              <div className="px-8 pb-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                <div className="space-y-4">
                  {Object.entries(incident.statusHistory).map(([status, history]) => (
                    <div key={status} className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${getStatusColor(status).split(' ')[0]}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {history.timestamp && typeof history.timestamp === 'object' && 'toDate' in history.timestamp
                            ? new Date(history.timestamp.toDate()).toLocaleString()
                            : 'N/A'}
                        </p>
                        {history.notes && (
                          <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Actions */}
            {userProfile && ['admin', 'responder'].includes(userProfile.role) && (
              <div className="px-8 pb-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {incident.status === 'submitted' && (
                    <button
                      onClick={() => openActionModal('verify')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Verify Incident
                    </button>
                  )}
                  <button
                    onClick={() => openActionModal('status')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Update Status
                  </button>
                  {incident.status !== 'rejected' && incident.status !== 'closed' && (
                    <button
                      onClick={() => openActionModal('reject')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Modal */}
        {showActionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {actionType === 'verify' && 'Verify Incident'}
                {actionType === 'reject' && 'Reject Incident'}
                {actionType === 'status' && 'Update Status'}
              </h3>

              <div className="mb-4">
                {actionType === 'status' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                    <select
                      value={actionStatus}
                      onChange={(e) => setActionStatus(e.target.value as IncidentStatus)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="verified">Verified</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                )}

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes {actionType === 'reject' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    actionType === 'verify'
                      ? 'Add verification notes...'
                      : actionType === 'reject'
                      ? 'Reason for rejection...'
                      : 'Add status update notes...'
                  }
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAction}
                  disabled={actionLoading || (actionType === 'reject' && !actionNotes)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Processing...' : 'Confirm'}
                </button>
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionNotes('');
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
