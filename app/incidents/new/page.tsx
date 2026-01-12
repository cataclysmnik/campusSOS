'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { createIncident } from '@/lib/firebase/firestore';
import { uploadIncidentImages } from '@/lib/firebase/storage';
import { IncidentCategory, SeverityLevel, Location } from '@/types/firebase';

export default function NewIncidentPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  const [formData, setFormData] = useState({
    category: '' as IncidentCategory | '',
    title: '',
    description: '',
    severity: 'medium' as SeverityLevel,
    isAnonymous: false,
    location: {
      building: '',
      floor: '',
      room: '',
      description: '',
    } as Location,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories: { value: IncidentCategory; label: string; emoji: string }[] = [
    { value: 'medical-emergency', label: 'Medical Emergency', emoji: '🏥' },
    { value: 'fire', label: 'Fire', emoji: '🔥' },
    { value: 'harassment', label: 'Harassment', emoji: '⚠️' },
    { value: 'theft', label: 'Theft', emoji: '🚨' },
    { value: 'vandalism', label: 'Vandalism', emoji: '🔨' },
    { value: 'lost-item', label: 'Lost Item', emoji: '🔍' },
    { value: 'found-item', label: 'Found Item', emoji: '📦' },
    { value: 'lab-accident', label: 'Lab Accident', emoji: '🧪' },
    { value: 'facility-issue', label: 'Facility Issue', emoji: '🔧' },
    { value: 'security-concern', label: 'Security Concern', emoji: '🛡️' },
    { value: 'other', label: 'Other', emoji: '📝' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file count
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Validate file size and type
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be under 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
    }

    setError('');
    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user || !userProfile) {
      setError('You must be logged in to report an incident');
      return;
    }

    if (!formData.category) {
      setError('Please select an incident category');
      return;
    }

    if (!formData.location.building) {
      setError('Please specify the building location');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Create incident data
      const incidentData = {
        reportedBy: user.uid,
        reporterName: formData.isAnonymous ? 'Anonymous' : userProfile.displayName,
        reporterEmail: formData.isAnonymous ? 'anonymous@campus.edu' : userProfile.email,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        severity: formData.severity,
        status: 'submitted' as const,
        isAnonymous: formData.isAnonymous,
      };

      // Create incident in Firestore
      const incidentId = await createIncident(incidentData);
      setUploadProgress(30);

      // Upload images if any
      let imageUrls: string[] = [];
      if (images.length > 0) {
        setUploadProgress(40);
        imageUrls = await uploadIncidentImages(images, incidentId, user.uid);
        setUploadProgress(80);
      }

      setUploadProgress(100);

      // Success - redirect to incident details
      setTimeout(() => {
        router.push(`/incidents/${incidentId}`);
      }, 500);

    } catch (err: any) {
      console.error('Error submitting incident:', err);
      setError('Failed to submit incident. Please try again.');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Incident</h1>
              <p className="text-gray-600">
                Provide details about the incident. All fields marked with * are required.
              </p>
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-semibold">
                  🚨 For life-threatening emergencies, call Campus Security immediately: 911
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.category === cat.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.emoji}</div>
                      <div className="text-sm font-medium">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary of the incident"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide detailed information about what happened..."
                />
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location.building" className="block text-sm font-medium text-gray-700 mb-1">
                    Building *
                  </label>
                  <input
                    type="text"
                    id="location.building"
                    name="location.building"
                    required
                    value={formData.location.building}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Science Building"
                  />
                </div>

                <div>
                  <label htmlFor="location.floor" className="block text-sm font-medium text-gray-700 mb-1">
                    Floor (Optional)
                  </label>
                  <input
                    type="text"
                    id="location.floor"
                    name="location.floor"
                    value={formData.location.floor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2nd Floor"
                  />
                </div>

                <div>
                  <label htmlFor="location.room" className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="location.room"
                    name="location.room"
                    value={formData.location.room}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Room 201"
                  />
                </div>

                <div>
                  <label htmlFor="location.description" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Location Details
                  </label>
                  <input
                    type="text"
                    id="location.description"
                    name="location.description"
                    value={formData.location.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Near main entrance"
                  />
                </div>
              </div>

              {/* Severity */}
              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                  Severity Level *
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low - Minor issue</option>
                  <option value="medium">Medium - Moderate concern</option>
                  <option value="high">High - Serious issue</option>
                  <option value="critical">Critical - Immediate attention required</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (Optional, max 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={images.length >= 5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 5 images, each under 5MB
                </p>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
                  Submit anonymously (your identity will be hidden)
                </label>
              </div>

              {/* Progress Bar */}
              {loading && uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
