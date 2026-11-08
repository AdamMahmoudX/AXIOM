import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const envOrDefault = (value: string | undefined, fallback: string): string =>
  value?.trim() || fallback;

const firebaseConfig = {
  apiKey: envOrDefault(import.meta.env.VITE_FIREBASE_API_KEY, 'AIzaSyB6imXnaKm8cBeyxz68asDPr5Xbqrfxwgk'),
  authDomain: envOrDefault(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 'axiom-41aad.firebaseapp.com'),
  projectId: envOrDefault(import.meta.env.VITE_FIREBASE_PROJECT_ID, 'axiom-41aad'),
  storageBucket: envOrDefault(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 'axiom-41aad.firebasestorage.app'),
  messagingSenderId: envOrDefault(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, '227963676883'),
  appId: envOrDefault(import.meta.env.VITE_FIREBASE_APP_ID, '1:227963676883:web:8f288dd0b11ccdaad5cc26'),
  measurementId: envOrDefault(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, 'G-F0XDNXQ7JE'),
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
