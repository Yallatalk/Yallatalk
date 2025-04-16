import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';

export default function LanguageSettings() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('ar');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/');
      return;
    }

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      alert('🚫 يجب تفعيل البريد الإلكتروني أولاً.');
      navigate('/');
      return;
    }

    const saved = localStorage.getItem('appLang');
    if (saved) setLanguage(saved);
  }, [navigate]);

  const handleChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem('appLang', lang);
    showToast('✅ تم تغيير اللغة بنجاح');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white py-24 px-4 relative">
        <div className="max-w-md mx-auto bg-zinc-900 p-6 rounded-2xl shadow space-y-6">
          <h2 className="text-xl font-bold text-yellow-400 text-center">إعدادات اللغة</h2>

          <select
            value={language}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800 text-white"
          >
            <option value="ar">العربية</option>
            <option value="en">الإنجليزية</option>
            <option value="ja">اليابانية</option>
            <option value="ko">الكورية</option>
          </select>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 bg-yellow-400 text-black px-4 py-2 rounded shadow text-sm animate-bounce">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}