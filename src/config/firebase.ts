import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB6imXraKm8cBayxz8asDPr5XbqrfXwgk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'axiom-41aad.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'axiom-41aad',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'axiom-41aad.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '227963676883',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:227963676883:web:8f288dd0b11ccdaad5cc26',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-F0XDNXQ7JE',
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
