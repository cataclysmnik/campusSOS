'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleGuard from '@/components/RoleGuard';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { getIncidents, updateIncidentStatus, assignIncident, subscribeToIncidents } from '@/lib/firebase/firestore';
import { Incident, IncidentStatus, IncidentCategory, SeverityLevel } from '@/types/firebase';

export default function AdminPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IncidentCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'all'>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'verify' | 'assign' | 'status' | 'reject'>('verify');
  const [actionNotes, setActionNotes] = useState('');
  const [actionStatus, setActionStatus] = useState<IncidentStatus>('verified');

  useEffect(() => {
    // Subscribe to real-time incidents
    const unsubscribe = subscribeToIncidents((data) => {
      setIncidents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...incidents];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (inc) =>
          inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inc.location.building.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((inc) => inc.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((inc) => inc.category === categoryFilter);
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter((inc) => inc.severity === severityFilter);
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchQuery, statusFilter, categoryFilter, severityFilter]);

  const stats = {
    total: incidents.length,
    submitted: incidents.filter((i) => i.status === 'submitted').length,
    verified: incidents.filter((i) => i.status === 'verified').length,
    assigned: incidents.filter((i) => i.status === 'assigned').length,
    inProgress: incidents.filter((i) => i.status === 'in-progress').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    critical: incidents.filter((i) => i.severity === 'critical').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleAction = async () => {
    if (!selectedIncident || !user) return;

    try {
      if (actionType === 'verify') {
        await updateIncidentStatus(selectedIncident.id, 'verified', user.uid, actionNotes);
      } else if (actionType === 'reject') {
        await updateIncidentStatus(selectedIncident.id, 'rejected', user.uid, actionNotes);
      } else if (actionType === 'status') {
        await updateIncidentStatus(selectedIncident.id, actionStatus, user.uid, actionNotes);
      }

      setShowActionModal(false);
      setActionNotes('');
      setSelectedIncident(null);
    } catch (error) {
      console.error('Action error:', error);
      alert('Failed to perform action. Please try again.');
    }
  };

  const openActionModal = (incident: Incident, type: 'verify' | 'assign' | 'status' | 'reject') => {
    setSelectedIncident(incident);
    setActionType(type);
    setShowActionModal(true);
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'responder']}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage and monitor all campus incidents</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg shadow p-4">
                <p className="text-sm text-yellow-700 mb-1">Submitted</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.submitted}</p>
              </div>
              <div className="bg-blue-50 rounded-lg shadow p-4">
                <p className="text-sm text-blue-700 mb-1">Verified</p>
                <p className="text-2xl font-bold text-blue-800">{stats.verified}</p>
              </div>
              <div className="bg-purple-50 rounded-lg shadow p-4">
                <p className="text-sm text-purple-700 mb-1">Assigned</p>
                <p className="text-2xl font-bold text-purple-800">{stats.assigned}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg shadow p-4">
                <p className="text-sm text-indigo-700 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-indigo-800">{stats.inProgress}</p>
              </div>
              <div className="bg-green-50 rounded-lg shadow p-4">
                <p className="text-sm text-green-700 mb-1">Resolved</p>
                <p className="text-2xl font-bold text-green-800">{stats.resolved}</p>
              </div>
              <div className="bg-red-50 rounded-lg shadow p-4">
                <p className="text-sm text-red-700 mb-1">Critical</p>
                <p className="text-2xl font-bold text-red-800">{stats.critical}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search by title, description, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'all')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="verified">Verified</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Severity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value as SeverityLevel | 'all')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || severityFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setSeverityFilter('all');
                  }}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Incidents List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Incidents ({filteredIncidents.length})
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading incidents...</p>
                </div>
              ) : filteredIncidents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-600">No incidents found matching your filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Incident
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Severity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredIncidents.map((incident) => (
                        <tr key={incident.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* Thumbnail if images exist */}
                              {incident.imageUrls && incident.imageUrls.length > 0 && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={incident.imageUrls[0]}
                                    alt="Incident"
                                    className="h-12 w-12 rounded-lg object-cover"
                                  />
                                  {incident.imageUrls.length > 1 && (
                                    <span className="text-xs text-gray-500 mt-1 block text-center">
                                      +{incident.imageUrls.length - 1}
                                    </span>
                                  )}
                                </div>
                              )}
                              <div>
                                <div 
                                  className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                                  onClick={() => router.push(`/incidents/${incident.id}`)}
                                >
                                  {incident.title}
                                </div>
                                <div className="text-sm text-gray-500">{incident.reporterName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{incident.location.building}</div>
                            <div className="text-sm text-gray-500">{incident.location.room}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${getSeverityColor(incident.severity)}`}>
                              {incident.severity.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                              {incident.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {incident.createdAt && typeof incident.createdAt === 'object' && 'toDate' in incident.createdAt
                              ? new Date(incident.createdAt.toDate()).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              {incident.status === 'submitted' && (
                                <button
                                  onClick={() => openActionModal(incident, 'verify')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Verify
                                </button>
                              )}
                              <button
                                onClick={() => openActionModal(incident, 'status')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => router.push(`/incidents/${incident.id}`)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Action Modal */}
          {showActionModal && selectedIncident && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {actionType === 'verify' && 'Verify Incident'}
                  {actionType === 'reject' && 'Reject Incident'}
                  {actionType === 'status' && 'Update Status'}
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Incident: {selectedIncident.title}</p>
                  
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

                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAction}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setShowActionModal(false);
                      setActionNotes('');
                      setSelectedIncident(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
