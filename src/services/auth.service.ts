import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  deleteUser,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      createdAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
    });

    // Create default settings document
    await setDoc(doc(db, 'users', user.uid, 'settings', 'userSettings'), {
      userId: user.uid,
      theme: 'system',
      fontSize: 'medium',
      lockTimeout: 1,
      biometricEnabled: false,
      pinEnabled: false,
      screenshotBlocked: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return user;
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));
  }
};

export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Update last login time
    await setDoc(
      doc(db, 'users', userCredential.user.uid),
      { lastLoginAt: Timestamp.now() },
      { merge: true }
    );

    return userCredential.user;
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));
  }
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));
  }
};

export const deleteAccount = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    // Note: Firestore data and Supabase images should be deleted before this
    await deleteUser(user);
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));
  }
};

// Map Firebase Auth error codes to user-friendly messages
const mapAuthError = (errorCode: string): string => {
  const errorMap: Record<string, string> = {
    'auth/invalid-email': 'The email address is not valid.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/requires-recent-login': 'This operation requires recent authentication. Please sign in again.',
  };

  return errorMap[errorCode] || 'An unexpected error occurred. Please try again.';
};
