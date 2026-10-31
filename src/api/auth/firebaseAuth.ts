import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';

const googleProvider = new GoogleAuthProvider();

// Helper to convert phone number to a valid email format for Firebase Auth
const phoneToEmail = (phone: string) => `${phone.replace(/[^0-9+]/g, '')}@xenex.auth.com`;

export const loginWithPhone = async (phone: string, pass: string) => {
  const result = await signInWithEmailAndPassword(auth, phoneToEmail(phone), pass);
  return result.user;
};

export const registerWithPhone = async (phone: string, pass: string) => {
  const result = await createUserWithEmailAndPassword(auth, phoneToEmail(phone), pass);
  return result.user;
};

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
