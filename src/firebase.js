import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBw51xYupn3p6LVI6bb2Wn5mqRdWOtSS3w",
  authDomain: "yallatalk-ec91c.firebaseapp.com",
  projectId: "yallatalk-ec91c",
  storageBucket: "yallatalk-ec91c.appspot.com",
  messagingSenderId: "1068180444046",
  appId: "1:1068180444046:web:7fbb4b5d1dd82310db0adf",
  measurementId: "G-WQG5S71HW9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(); // ✅ إضافة تسجيل Google