import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDYJ9sZCQggVSrv-gvF3nW5ui04mzW4Xc",
  authDomain: "yallatalk-cfbc2.firebaseapp.com",
  projectId: "yallatalk-cfbc2",
  storageBucket: "yallatalk-cfbc2.appspot.com",
  messagingSenderId: "679777293957",
  appId: "1:679777293957:web:60e6f567e08ead6c3f3bec",
  measurementId: "G-D6Y8DK55JE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
