'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { createIncident } from '@/lib/firebase/firestore';
import { IncidentCategory, SeverityLevel, Location } from '@/types/firebase';
import { uploadIncidentImages } from '@/lib/firebase/storage';

function NewIncidentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userProfile } = useAuth();

  const [formData, setFormData] = useState(() => {
    const categoryParam = searchParams.get('category');
    return {
      category: (categoryParam as IncidentCategory) || ('' as IncidentCategory | ''),
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
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 5);

    const invalidTypeFile = fileArray.find((file) => {
      const lower = file.name.toLowerCase();
      const hasImageExtension = /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif)$/i.test(lower);
      return !(file.type.startsWith('image/') || hasImageExtension);
    });

    if (invalidTypeFile) {
      setError(`"${invalidTypeFile.name}" is not a supported image file.`);
      setSelectedFiles([]);
      return;
    }

    const oversizedFile = fileArray.find((file) => file.size > MAX_IMAGE_SIZE_BYTES);
    if (oversizedFile) {
      setError(`"${oversizedFile.name}" exceeds the 5MB image limit.`);
      setSelectedFiles([]);
      return;
    }

    setError('');
    setSelectedFiles(fileArray);
  };

  const categories: { value: IncidentCategory; label: string }[] = [
    { value: 'medical-emergency', label: 'Medical Emergency' },
    { value: 'fire', label: 'Fire' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'theft', label: 'Theft' },
    { value: 'vandalism', label: 'Vandalism' },
    { value: 'lost-item', label: 'Lost Item' },
    { value: 'found-item', label: 'Found Item' },
    { value: 'lab-accident', label: 'Lab Accident' },
    { value: 'facility-issue', label: 'Facility Issue' },
    { value: 'security-concern', label: 'Security Concern' },
    { value: 'other', label: 'Other' },
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
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

    try {
      let imageUrls: string[] = [];

      // If images were selected, upload them first and collect URLs
      if (selectedFiles.length > 0) {
        try {
          const tempId = `${user.uid}-${Date.now()}`;
          imageUrls = await uploadIncidentImages(selectedFiles, tempId, user.uid);
        } catch (uploadErr) {
          console.error('Error uploading images:', uploadErr);
          setError(uploadErr instanceof Error ? uploadErr.message : 'Failed to upload images. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Base incident data (including image URLs if any)
      const incidentData = {
        reportedBy: user.uid,
        reporterName: formData.isAnonymous ? 'Anonymous' : (userProfile?.displayName || user.displayName || 'User'),
        reporterEmail: formData.isAnonymous ? 'anonymous@campus.edu' : (userProfile?.email || user.email || ''),
        category: formData.category,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        severity: formData.severity,
        status: 'submitted' as const,
        isAnonymous: formData.isAnonymous,
        ...(imageUrls.length > 0 ? { imageUrls } : {}),
      } as const;

      // Create the incident with image URLs included
      const incidentId = await createIncident(incidentData);

      // Success - redirect to incident details
      setTimeout(() => {
        router.push(`/incidents/${incidentId}`);
      }, 500);

    } catch (err: unknown) {
      console.error('Error submitting incident:', err);
      setError('Failed to submit incident. Please try again.');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
        <Navbar />

        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="card" style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <div className="card-header">
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Report an Incident
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Provide details about the incident. All fields marked with * are required.
              </p>
              <div className="alert-error" style={{ marginTop: '1rem' }}>
                
              </div>
            </div>

            {error && (
              <div style={{ padding: '0 1.5rem' }}>
                <div className="alert-error" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Category Selection */}
              <div>
                <label className="label" style={{ marginBottom: '0.5rem' }}>
                  Incident Category *
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                      style={{
                        padding: '1rem',
                        border: formData.category === cat.value ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        textAlign: 'left',
                        backgroundColor: formData.category === cat.value ? 'var(--primary-light)' : 'var(--bg-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--text-primary)'
                      }}
                      className="category-button"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="label">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Brief summary of the incident"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea"
                  placeholder="Provide detailed information about what happened..."
                />
              </div>

              {/* Images */}
              <div>
                <label htmlFor="images" className="label">
                  Attach Images (optional)
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="input"
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                  You can upload up to 5 images to help responders understand the situation.
                </p>
                {selectedFiles.length > 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Selected {selectedFiles.length} image(s): {selectedFiles.map(f => f.name).join(', ')}
                  </p>
                )}
              </div>

              {/* Location */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <label htmlFor="location.building" className="label">
                    Building *
                  </label>
                  <input
                    type="text"
                    id="location.building"
                    name="location.building"
                    required
                    value={formData.location.building}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Science Building"
                  />
                </div>

                <div>
                  <label htmlFor="location.floor" className="label">
                    Floor (Optional)
                  </label>
                  <input
                    type="text"
                    id="location.floor"
                    name="location.floor"
                    value={formData.location.floor}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., 2nd Floor"
                  />
                </div>

                <div>
                  <label htmlFor="location.room" className="label">
                    Room Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="location.room"
                    name="location.room"
                    value={formData.location.room}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Room 201"
                  />
                </div>

                <div>
                  <label htmlFor="location.description" className="label">
                    Additional Location Details
                  </label>
                  <input
                    type="text"
                    id="location.description"
                    name="location.description"
                    value={formData.location.description}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Near main entrance"
                  />
                </div>
              </div>

              {/* Severity */}
              <div>
                <label htmlFor="severity" className="label">
                  Severity Level *
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="select"
                >
                  <option value="low">Low - Minor issue</option>
                  <option value="medium">Medium - Moderate concern</option>
                  <option value="high">High - Serious issue</option>
                  <option value="critical">Critical - Immediate attention required</option>
                </select>
              </div>

              {/* Anonymous Option */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                <label htmlFor="isAnonymous" style={{ fontSize: '0.875rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Submit anonymously (your identity will be hidden)
                </label>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.75rem 1.5rem' }}
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="btn btn-outline"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <style jsx>{`
          .category-button:hover {
            border-color: var(--primary);
            transform: translateY(-2px);
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}

export default function NewIncidentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewIncidentPageContent />
    </Suspense>
  );
}
