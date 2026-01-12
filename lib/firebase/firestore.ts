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

/**
 * Create a new incident report
 */
export const createIncident = async (incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const incidentRef = await addDoc(collection(db, 'incidents'), {
      ...incidentData,
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
      return { id: incidentDoc.id, ...incidentDoc.data() } as Incident;
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
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

    const q = query(collection(db, 'incidents'), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Incident[];
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
 * Real-time incident listener
 */
export const subscribeToIncident = (
  incidentId: string,
  callback: (incident: Incident | null) => void
) => {
  return onSnapshot(doc(db, 'incidents', incidentId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Incident);
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

  const q = query(collection(db, 'incidents'), ...constraints);

  return onSnapshot(q, (querySnapshot) => {
    const incidents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Incident[];
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
