import {
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, runTransaction } from 'firebase/firestore';
import { DEFAULT_ROLE_PERMISSIONS, type User, type UserRole } from '../../types/user';
import { generateSessionId } from '../../utils/authHelpers';
import { firebaseAuth, firestore, isFirebaseConfigured } from '../../config/firebase';

export const isFirebaseAuthConfigured = isFirebaseConfigured;

const isUserRole = (value: unknown): value is UserRole =>
  value === 'owner' || value === 'admin' || value === 'manager' || value === 'employee';

const getOrCreateFirebaseUser = async (
  firebaseUser: FirebaseUser,
  rememberMe: boolean,
): Promise<User> => {
  const email = firebaseUser.email?.trim().toLowerCase();
  if (!email) {
    throw new Error('حساب Google لا يتضمن عنوان بريد إلكتروني.');
  }

  const userRef = doc(firestore, 'users', firebaseUser.uid);
  const now = new Date().toISOString();

  return runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(userRef);
    const existing = snapshot.exists() ? snapshot.data() as Partial<User> : undefined;
    const role = isUserRole(existing?.role) ? existing.role : 'employee';

    const profile: Omit<User, 'rememberMe' | 'sessionId'> = {
      id: firebaseUser.uid,
      username: existing?.username || email.split('@')[0],
      email,
      role,
      fullName: firebaseUser.displayName || existing?.fullName || email,
      ...(firebaseUser.photoURL || existing?.avatar
        ? { avatar: firebaseUser.photoURL || existing?.avatar }
        : {}),
      permissions: existing?.permissions || DEFAULT_ROLE_PERMISSIONS.employee,
      authStatus: existing?.authStatus || 'pending_approval',
      createdAt: existing?.createdAt || now,
      lastLogin: now,
      oauthProvider: 'google',
      googleId: firebaseUser.uid,
    };
    const user: User = {
      ...profile,
      rememberMe,
      sessionId: generateSessionId(),
    };

    transaction.set(userRef, profile, { merge: true });
    return user;
  });
};

export const signInWithGoogle = async (rememberMe = false): Promise<User> => {
  if (!isFirebaseConfigured) {
    throw new Error('إعدادات Firebase غير مكتملة.');
  }

  await setPersistence(
    firebaseAuth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence,
  );
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(firebaseAuth, provider);

  return getOrCreateFirebaseUser(credential.user, rememberMe);
};

export const restoreFirebaseUser = (
  firebaseUser: FirebaseUser,
  rememberMe: boolean,
): Promise<User> => getOrCreateFirebaseUser(firebaseUser, rememberMe);
