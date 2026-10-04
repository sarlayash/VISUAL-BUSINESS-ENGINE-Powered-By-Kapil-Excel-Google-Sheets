import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyDFvEswxZx8Ih-7BEZIFz59bd85_hK59tQ",
  authDomain: "visual-business-engineer.firebaseapp.com",
  projectId: "visual-business-engineer",
  storageBucket: "visual-business-engineer.firebasestorage.app",
  messagingSenderId: "768568165852",
  appId: "1:768568165852:web:98522ad3184b3f914cfb19",
  measurementId: "G-626HDEH2E7"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics safely
let analyticsInstance: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {});
}

export { analyticsInstance };

// Real Google Sign-In via Firebase Popup
export async function signInWithGoogleFirebase(): Promise<{
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      uid: user.uid,
      displayName: user.displayName || 'Google Learner',
      email: user.email || '',
      photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Learner')}&background=F59E0B&color=07080B&bold=true`,
    };
  } catch (error: any) {
    console.error('Firebase Google Sign-In error:', error);
    throw error;
  }
}

// Sign out from Firebase
export async function signOutFirebase(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Firebase sign out error:', error);
  }
}

// Listen for auth state changes
export function onFirebaseAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
