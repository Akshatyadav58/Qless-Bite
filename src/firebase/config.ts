import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDoH2tQcqDJc-K3s2P_bmMK4L-pj5Sl8d0",
  authDomain: "qless-bite.firebaseapp.com",
  projectId: "qless-bite",
  storageBucket: "qless-bite.firebasestorage.app",
  messagingSenderId: "599079547605",
  appId: "1:599079547605:web:55663339ef10f68788685c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;