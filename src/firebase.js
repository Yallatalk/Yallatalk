import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// ✅ إعدادات Firebase من مشروعك الحالي
const firebaseConfig = {
  apiKey: "AIzaSyDYJ9sZCQggqVSrv-gvF3nW5ui04mzW4Xc",
  authDomain: "yallatalk-cfbc2.firebaseapp.com",
  projectId: "yallatalk-cfbc2",
  storageBucket: "yallatalk-cfbc2.appspot.com",
  messagingSenderId: "679777293957",
  appId: "1:679777293957:web:60e5f567e08ead6c3f3bec",
  measurementId: "G-D6Y8DK55JE"
};

// ✅ تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// ✅ تهيئة الخدمات
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// ✅ (اختياري) التحليلات
getAnalytics(app);
