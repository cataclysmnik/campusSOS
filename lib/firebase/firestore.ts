import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Incident, IncidentStatus, IncidentCategory } from '@/types/firebase';

const normalizeImageUrls = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.filter((url): url is string => typeof url === 'string');
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((url): url is string => typeof url === 'string');
      }
    } catch {
      return undefined;
    }
  }

  return undefined;
};

const mapIncidentDoc = (id: string, data: DocumentData): Incident => {
  const normalizedImageUrls = normalizeImageUrls(data.imageUrls);

  return {
    id,
    ...data,
    ...(normalizedImageUrls ? { imageUrls: normalizedImageUrls } : {}),
  } as Incident;
};

/**
 * Create a new incident report
 */
export const createIncident = async (incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const incidentRef = await addDoc(collection(db, 'incidents'), {
      ...incidentData,
      ...(incidentData.imageUrls
        ? { imageUrls: JSON.stringify(incidentData.imageUrls) }
        : {}),
      status: 'submitted',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return incidentRef.id;
  } catch (error) {
    console.error('Create incident error:', error);
    throw error;
  }
};

/**
 * Get incident by ID
 */
export const getIncident = async (incidentId: string): Promise<Incident | null> => {
  try {
    const incidentDoc = await getDoc(doc(db, 'incidents', incidentId));
    if (incidentDoc.exists()) {
      return mapIncidentDoc(incidentDoc.id, incidentDoc.data());
    }
    return null;
  } catch (error) {
    console.error('Get incident error:', error);
    throw error;
  }
};

/**
 * Get incidents with filters
 */
export const getIncidents = async (
  filters?: {
    userId?: string;
    status?: IncidentStatus;
    category?: IncidentCategory;
    assignedTo?: string;
    onNoticeboard?: boolean;
    limitCount?: number;
  }
): Promise<Incident[]> => {
  try {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.userId) {
      constraints.push(where('reportedBy', '==', filters.userId));
    }
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters?.assignedTo) {
      constraints.push(where('assignedTo', '==', filters.assignedTo));
    }
    if (typeof filters?.onNoticeboard === 'boolean') {
      constraints.push(where('onNoticeboard', '==', filters.onNoticeboard));
    }
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

    const q = query(collection(db, 'incidents'), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => mapIncidentDoc(doc.id, doc.data()));
  } catch (error) {
    console.error('Get incidents error:', error);
    throw error;
  }
};

/**
 * Update incident status
 */
export const updateIncidentStatus = async (
  incidentId: string,
  status: IncidentStatus,
  updatedBy: string,
  notes?: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'incidents', incidentId), {
      status,
      updatedAt: serverTimestamp(),
      [`statusHistory.${status}`]: {
        timestamp: serverTimestamp(),
        updatedBy,
        notes,
      },
    });
  } catch (error) {
    console.error('Update incident status error:', error);
    throw error;
  }
};

/**
 * Assign incident to responder
 */
export const assignIncident = async (
  incidentId: string,
  assignedTo: string,
  assignedBy: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'incidents', incidentId), {
      assignedTo,
      assignedBy,
      assignedAt: serverTimestamp(),
      status: 'assigned',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Assign incident error:', error);
    throw error;
  }
};

/**
 * Attach uploaded image URLs to an incident
 */
export const addIncidentImages = async (
  incidentId: string,
  imageUrls: string[]
): Promise<void> => {
  if (!imageUrls.length) return;
  try {
    const incidentRef = doc(db, 'incidents', incidentId);
    const existing = await getDoc(incidentRef);
    const prevUrls = existing.exists()
      ? normalizeImageUrls(existing.data().imageUrls) || []
      : [];

    await updateDoc(incidentRef, {
      imageUrls: JSON.stringify([...prevUrls, ...imageUrls]),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Add incident images error:', error);
    throw error;
  }
};

/**
 * Toggle incident noticeboard visibility
 */
export const setIncidentNoticeboardStatus = async (
  incidentId: string,
  onNoticeboard: boolean
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'incidents', incidentId), {
      onNoticeboard,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Set incident noticeboard status error:', error);
    throw error;
  }
};

/**
 * Real-time incident listener
 */
export const subscribeToIncident = (
  incidentId: string,
  callback: (incident: Incident | null) => void
) => {
  return onSnapshot(doc(db, 'incidents', incidentId), (doc) => {
    if (doc.exists()) {
      callback(mapIncidentDoc(doc.id, doc.data()));
    } else {
      callback(null);
    }
  });
};

/**
 * Real-time incidents listener with filters
 */
export const subscribeToIncidents = (
  callback: (incidents: Incident[]) => void,
  filters?: {
    userId?: string;
    status?: IncidentStatus;
    category?: IncidentCategory;
    onNoticeboard?: boolean;
  }
) => {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

  if (filters?.userId) {
    constraints.push(where('reportedBy', '==', filters.userId));
  }
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }
  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (typeof filters?.onNoticeboard === 'boolean') {
    constraints.push(where('onNoticeboard', '==', filters.onNoticeboard));
  }

  const q = query(collection(db, 'incidents'), ...constraints);

  return onSnapshot(q, (querySnapshot) => {
    const incidents = querySnapshot.docs.map(doc => mapIncidentDoc(doc.id, doc.data()));
    callback(incidents);
  });
};

/**
 * Add comment/update to incident
 */
export const addIncidentUpdate = async (
  incidentId: string,
  updateData: {
    userId: string;
    message: string;
    type: 'comment' | 'status_change' | 'assignment';
  }
): Promise<void> => {
  try {
    await addDoc(collection(db, 'incidents', incidentId, 'updates'), {
      ...updateData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Add incident update error:', error);
    throw error;
  }
};
