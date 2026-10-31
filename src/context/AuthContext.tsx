import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { USER_ROLES } from '../constants/roles';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot_password';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot_password') => void;
  
  // Actions
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  canAccessModule: (moduleId: string) => boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  uid: 'admin-master-uid',
  email: 'harmonyestampadosr@gmail.com',
  displayName: 'Maestro Impresor (Admin)',
  role: 'administrador',
  photoURL: '/src/assets/images/avatar_master_printer_1793415150877.jpg',
  emailVerified: true,
  createdAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('estampapro_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    return userProfile?.role || 'administrador';
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  // Change role and persist
  const setCurrentRole = (newRole: UserRole) => {
    setCurrentRoleState(newRole);
    if (userProfile) {
      const updated = { ...userProfile, role: newRole };
      setUserProfile(updated);
      localStorage.setItem('estampapro_user_profile', JSON.stringify(updated));
    }
  };

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        // Fetch or create Firestore user profile
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserProfile(data);
            setCurrentRoleState(data.role || 'administrador');
            localStorage.setItem('estampapro_user_profile', JSON.stringify(data));
          } else {
            // Determine role: if owner email, assign administrador
            const initialRole: UserRole = 
              firebaseUser.email === 'harmonyestampadosr@gmail.com' ? 'administrador' : 'disenador';

            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario Textil',
              role: initialRole,
              photoURL: firebaseUser.photoURL || '/src/assets/images/avatar_master_printer_1793415150877.jpg',
              emailVerified: firebaseUser.emailVerified,
              createdAt: new Date().toISOString()
            };

            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            setCurrentRoleState(initialRole);
            localStorage.setItem('estampapro_user_profile', JSON.stringify(newProfile));
          }
        } catch (error) {
          console.warn('Firestore user fetch notice (using authenticated state):', error);
          // Fallback to authenticated user info
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Usuario Textil',
            role: firebaseUser.email === 'harmonyestampadosr@gmail.com' ? 'administrador' : currentRole,
            photoURL: firebaseUser.photoURL || '/src/assets/images/avatar_master_printer_1793415150877.jpg',
            emailVerified: firebaseUser.emailVerified,
            createdAt: new Date().toISOString()
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        // If no user signed in, we keep our default active workshop profile in development
        // or allow user to open sign-in modal
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      setCurrentUser(cred.user);
      setIsAuthModalOpen(false);
    } catch (err: unknown) {
      setIsLoading(false);
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, role: UserRole = 'disenador') => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: name,
        role: email === 'harmonyestampadosr@gmail.com' ? 'administrador' : role,
        photoURL: '/src/assets/images/avatar_master_printer_1793415150877.jpg',
        emailVerified: cred.user.emailVerified,
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      } catch (dbErr) {
        console.warn('Could not write user profile to firestore immediately', dbErr);
      }

      setUserProfile(newProfile);
      setCurrentRoleState(newProfile.role);
      localStorage.setItem('estampapro_user_profile', JSON.stringify(newProfile));
      setIsAuthModalOpen(false);
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      // Reset to default workshop profile
      setUserProfile(DEFAULT_PROFILE);
      setCurrentRoleState('administrador');
      localStorage.removeItem('estampapro_user_profile');
    } catch (err: unknown) {
      console.error('Error logging out', err);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const verifyEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const canAccessModule = (moduleId: string): boolean => {
    const roleConfig = USER_ROLES[currentRole];
    if (!roleConfig) return true;
    return roleConfig.allowedModules.includes(moduleId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        currentRole,
        setCurrentRole,
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginWithEmail,
        registerWithEmail,
        logout,
        sendPasswordReset,
        verifyEmail,
        canAccessModule
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
