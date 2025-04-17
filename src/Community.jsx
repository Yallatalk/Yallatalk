import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from './firebase';
import Navbar from './Navbar';

export default function Community() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [joined, setJoined] = useState(() => {
    const saved = localStorage.getItem('joinedCommunities');
    return saved ? JSON.parse(saved) : [];
  });

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

    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [navigate]);

  const languages = [
    { name: 'العربية', flag: '🇸🇦', desc: 'مجتمع يتحدث العربية من مختلف أنحاء العالم' },
    { name: 'الإنجليزية', flag: '🇺🇸', desc: 'تحدث مع ناطقين باللغة الإنجليزية لتحسين مهاراتك' },
    { name: 'اليابانية', flag: '🇯🇵', desc: 'عش تجربة تعلم اليابانية مع متحدثين أصليين' },
    { name: 'الكورية', flag: '🇰🇷', desc: 'استكشف الثقافة واللغة الكورية مع الآخرين' },
  ];

  const handleJoin = (lang) => {
    if (!joined.includes(lang)) {
      const updated = [...joined, lang];
      setJoined(updated);
      localStorage.setItem('joinedCommunities', JSON.stringify(updated));
      showToast(`✅ انضممت إلى مجتمع ${lang}`);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <Navbar />

      <motion.div
        className="min-h-screen bg-black text-white py-24 px-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto">
          <motion.h2
            className="text-3xl font-bold text-yellow-400 mb-6 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            مجتمع اللغات
          </motion.h2>

          <div className="space-y-4">
            {languages.map((lang, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900 p-4 rounded-xl shadow flex flex-col gap-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-lg">
                    {lang.name} {lang.flag}
                  </div>
                  <button
                    className={`px-3 py-1 rounded font-semibold transition ${
                      joined.includes(lang.name)
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-yellow-400 text-black hover:bg-yellow-500'
                    }`}
                    disabled={joined.includes(lang.name)}
                    onClick={() => handleJoin(lang.name)}
                  >
                    {joined.includes(lang.name) ? 'تم الانضمام' : 'استكشف'}
                  </button>
                </div>
                <p className="text-sm text-gray-400">{lang.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 bg-yellow-400 text-black px-4 py-2 rounded shadow text-sm animate-bounce">
            {toast}
          </div>
        )}
      </motion.div>
    </>
  );
}