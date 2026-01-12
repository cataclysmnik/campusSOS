import { Timestamp, FieldValue } from 'firebase/firestore';

// ===========================
// User Types
// ===========================

export type UserRole = 'student' | 'staff' | 'admin' | 'responder';
export type UserStatus = 'active' | 'suspended' | 'inactive';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber?: string;
  department?: string;
  studentId?: string;
  staffId?: string;
  photoURL?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

// ===========================
// Incident Types
// ===========================

export type IncidentStatus = 'submitted' | 'verified' | 'assigned' | 'in-progress' | 'resolved' | 'closed' | 'rejected';

export type IncidentCategory = 
  | 'medical-emergency'
  | 'fire'
  | 'harassment'
  | 'theft'
  | 'vandalism'
  | 'lost-item'
  | 'found-item'
  | 'lab-accident'
  | 'facility-issue'
  | 'security-concern'
  | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Location {
  building: string;
  floor?: string;
  room?: string;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface StatusHistory {
  timestamp: Timestamp | FieldValue;
  updatedBy: string;
  notes?: string;
}

export interface Incident {
  id: string;
  reportedBy: string;
  reporterName: string;
  reporterEmail: string;
  category: IncidentCategory;
  title: string;
  description: string;
  location: Location;
  severity: SeverityLevel;
  status: IncidentStatus;
  imageUrls?: string[];
  isAnonymous: boolean;
  
  // Assignment
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: Timestamp | FieldValue;
  
  // Status tracking
  statusHistory?: {
    [key in IncidentStatus]?: StatusHistory;
  };
  
  // Verification
  verifiedBy?: string;
  verifiedAt?: Timestamp | FieldValue;
  verificationNotes?: string;
  
  // Resolution
  resolvedBy?: string;
  resolvedAt?: Timestamp | FieldValue;
  resolutionNotes?: string;
  
  // Timestamps
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

// ===========================
// Incident Update Types
// ===========================

export type UpdateType = 'comment' | 'status_change' | 'assignment' | 'verification' | 'resolution';

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  userId: string;
  userName: string;
  type: UpdateType;
  message: string;
  oldValue?: string;
  newValue?: string;
  createdAt: Timestamp | FieldValue;
}

// ===========================
// Notification Types
// ===========================

export type NotificationType = 
  | 'incident_created'
  | 'incident_assigned'
  | 'incident_status_changed'
  | 'incident_comment'
  | 'incident_resolved';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  incidentId?: string;
  read: boolean;
  createdAt: Timestamp | FieldValue;
}

// ===========================
// Response Team Types
// ===========================

export interface ResponderProfile extends UserProfile {
  role: 'responder';
  specialization: IncidentCategory[];
  availability: 'available' | 'busy' | 'offline';
  activeIncidents: string[];
  totalResolved: number;
}

// ===========================
// Statistics Types
// ===========================

export interface IncidentStats {
  total: number;
  byStatus: Record<IncidentStatus, number>;
  byCategory: Record<IncidentCategory, number>;
  bySeverity: Record<SeverityLevel, number>;
  averageResolutionTime: number;
  activeIncidents: number;
}

// ===========================
// Form Types
// ===========================

export interface IncidentFormData {
  category: IncidentCategory;
  title: string;
  description: string;
  location: Location;
  severity: SeverityLevel;
  isAnonymous: boolean;
  images?: File[];
}

export interface UserRegistrationData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  department?: string;
  studentId?: string;
  staffId?: string;
}
