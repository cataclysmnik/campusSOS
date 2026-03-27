import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { UserRole, UserProfile } from '@/types/firebase';

/**
 * Register a new user with email and password
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole = 'student'
): Promise<UserCredential> => {
  try {
    console.log('Registering user:', email, 'with role:', role);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Firebase Auth user created:', user.uid);

    // Update profile with display name
    await updateProfile(user, { displayName });
    console.log('Display name updated');

    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log('Firestore profile created for user:', user.uid, 'with role:', role);

    return userCredential;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Sign in existing user
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      console.log('Profile found for user:', uid, 'Role:', (userDoc.data() as UserProfile).role);
      return userDoc.data() as UserProfile;
    }
    console.log('No profile found for user:', uid);
    return null;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

/**
 * Get or create user profile
 * Creates a default profile if one doesn't exist
 * NOTE: After registration, the profile should already exist
 */
export const getOrCreateUserProfile = async (user: User): Promise<UserProfile | null> => {
  try {
    // Check multiple times for the profile in case it's being written to Firestore
    for (let i = 0; i < 4; i++) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        console.log('Profile found on attempt', i + 1, 'for:', user.email, 'Role:', profile.role);
        return profile;
      }
      
      // If this is a newly created auth user (within last 10 seconds), wait longer
      try {
        if (user.metadata?.creationTime) {
          const createdAt = user.metadata.creationTime;
          const createdAtMs = new Date(createdAt).getTime();

          if (Number.isNaN(createdAtMs)) {
            continue;
          }

          const now = Date.now();
          const ageSeconds = (now - createdAtMs) / 1000;
          
          console.log('User created', ageSeconds.toFixed(1), 'seconds ago');
          
          // If user was just created, be extra patient - they likely just registered
          if (ageSeconds < 10) {
            console.log('User appears to be newly registered, waiting longer for profile');
            if (i < 3) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            continue;
          }
        }
      } catch (metadataError) {
        console.log('Could not check user metadata:', metadataError);
      }
      
      if (i < 3) {
        // Wait 300ms before retrying
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // Profile doesn't exist after multiple checks, create a default one
    console.warn('No profile found for user:', user.uid, '- creating new profile with default role');
    
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || 'User',
      role: 'student', // Default role when profile doesn't exist
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), newProfile);
    console.log('New user profile created with default student role');
    return newProfile;
  } catch (error) {
    console.error('Get or create user profile error:', error);
    return null;
  }
};

/**
 * Set user role (admin function)
 * Used to promote users to admin/responder roles
 */
export const setUserRole = async (userId: string, role: UserRole): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await setDoc(userRef, { role, updatedAt: serverTimestamp() }, { merge: true });
      console.log('User role updated to:', role);
    } else {
      console.warn('User document does not exist, cannot update role');
    }
  } catch (error) {
    console.error('Set user role error:', error);
    throw error;
  }
};

/**
 * Auth state change listener
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
