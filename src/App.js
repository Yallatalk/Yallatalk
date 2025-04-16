import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { googleSignIn, saveDataToFirestore } from './firebaseHelpers'; // ✅ استيراد الحفظ و Google

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        navigate('/home');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('❌ يرجى إدخال البريد وكلمة المرور');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert('🚫 يرجى تفعيل بريدك الإلكتروني أولاً قبل تسجيل الدخول.');
        return;
      }

      const username = email.split('@')[0];
      localStorage.setItem('username', username);
      localStorage.setItem('loggedIn', 'true');
      navigate('/home');
    } catch (error) {
      alert(`🚫 خطأ في تسجيل الدخول: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await googleSignIn();

      // حفظ بيانات المستخدم في Firestore
      await saveDataToFirestore('users', {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email,
        photo: user.photoURL || '',
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem('username', user.displayName || user.email.split('@')[0]);
      localStorage.setItem('loggedIn', 'true');
      alert('✅ تم تسجيل الدخول باستخدام Google');
      navigate('/home');
    } catch (error) {
      alert(`🚫 فشل تسجيل الدخول بـ Google: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-4">YallaTalk</h1>

        <input
          type="text"
          placeholder="البريد الإلكتروني"
          className="w-full mb-3 p-3 rounded bg-zinc-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full mb-4 p-3 rounded bg-zinc-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-yellow-500 text-black p-3 rounded font-semibold hover:bg-yellow-400"
          onClick={handleLogin}
        >
          تسجيل الدخول
        </button>

        <button
          className="w-full mt-3 bg-white text-black p-3 rounded font-semibold hover:bg-gray-200"
          onClick={handleGoogleLogin}
        >
          تسجيل الدخول بـ Google
        </button>

        <p className="text-center mt-4 text-sm text-gray-400">
          ما عندك حساب؟ <Link to="/register" className="text-yellow-400 underline">سجل الآن</Link>
        </p>

        <p className="text-center mt-2 text-sm text-yellow-400">
          <Link to="/reset-password" className="underline">نسيت كلمة المرور؟</Link>
        </p>
      </div>
    </div>
  );
}

export default App;