'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, getCurrentUser, loginUser, logoutUser, registerUser, getOrCreateUserProfile } from '@/lib/firebase/auth';
import { UserProfile, UserRole } from '@/types/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Get or create user profile
        let profile = null;
        let attempts = 0;
        
        // Add a small initial delay to allow Firestore to sync after registration
        await new Promise(resolve => setTimeout(resolve, 200));
        
        while (!profile && attempts < 5) {
          try {
            profile = await getOrCreateUserProfile(firebaseUser);
            if (profile) {
              setUserProfile(profile);
              console.log('Profile loaded:', profile.email, 'Role:', profile.role);
              break;
            }
          } catch (error) {
            console.error('Error getting/creating user profile (attempt ' + (attempts + 1) + '):', error);
          }
          
          attempts++;
          if (!profile && attempts < 5) {
            // Wait 500ms before retrying
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (!profile) {
          console.error('Failed to load user profile after 5 attempts');
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await loginUser(email, password);
  };

  const register = async (email: string, password: string, displayName: string, role: UserRole) => {
    await registerUser(email, password, displayName, role);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
