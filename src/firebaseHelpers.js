// firebaseHelpers.js
import { storage, db, auth, googleProvider } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithPopup } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

// 🔁 رفع صورة أو فيديو إلى Firebase Storage
export const uploadImage = async (file, path = 'images/') => {
  const storageRef = ref(storage, `${path}${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// 🔁 تسجيل الدخول باستخدام Google
export const googleSignIn = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

// 🔁 حفظ بيانات في Firestore (بـ ID تلقائي)
export const saveDataToFirestore = async (collectionName, data) => {
  const colRef = collection(db, collectionName);
  await addDoc(colRef, data);
};

// 🔁 إرسال إشعارات - تحتاج سيرفر خارجي
export const sendNotification = async (token, title, body) => {
  console.warn('🔔 sendNotification غير مفعل بعد - يتطلب إعداد FCM backend.');
};
