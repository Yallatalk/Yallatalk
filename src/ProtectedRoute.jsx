import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

export default function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  // إذا ما فيه مستخدم أو ما فعّل بريده، رجّعه لتسجيل الدخول
  if (!user || !user.emailVerified) {
    return <Navigate to="/" replace />;
  }

  // غير كذا، أعطه الوصول
  return children;
}
