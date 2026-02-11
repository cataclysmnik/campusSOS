'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { createIncident } from '@/lib/firebase/firestore';
import { uploadIncidentImages } from '@/lib/firebase/storage';
import { IncidentCategory, SeverityLevel, Location } from '@/types/firebase';

function NewIncidentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Check for category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFormData(prev => ({
        ...prev,
        category: categoryParam as IncidentCategory
      }));
    }
  }, [searchParams]);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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
    setUploadProgress(0);

    try {
      // Create incident data
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
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p style={{ fontWeight: '600', fontSize: '0.875rem', margin: 0 }}>
                    For life-threatening emergencies, call Campus Security immediately: 911
                  </p>
                </div>
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

              {/* Image Upload */}
              <div>
                <label className="label" style={{ marginBottom: '0.5rem' }}>
                  Images (Optional, max 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={images.length >= 5}
                  className="input"
                  style={{ cursor: 'pointer' }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                  Maximum 5 images, each under 5MB
                </p>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            backgroundColor: 'var(--danger)',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '0.25rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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

              {/* Progress Bar */}
              {loading && uploadProgress > 0 && (
                <div style={{ width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '9999px', height: '0.625rem', overflow: 'hidden' }}>
                  <div
                    style={{ 
                      backgroundColor: 'var(--primary)', 
                      height: '100%', 
                      borderRadius: '9999px', 
                      transition: 'width 0.3s ease',
                      width: `${uploadProgress}%`
                    }}
                  />
                </div>
              )}

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
