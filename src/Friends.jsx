import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

export default function Friends() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [toast, setToast] = useState('');

  const friends = [
    { name: "سارة", flag: "🇸🇦", lang: t('lang_ar') },
    { name: "Jin", flag: "🇰🇷", lang: t('lang_kr') },
    { name: "Carlos", flag: "🇲🇽", lang: t('lang_es') },
    { name: "Anna", flag: "🇩🇪", lang: "الألمانية" } // يمكن نضيف لاحقًا: lang_de
  ];

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/');
      return;
    }

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      alert(t('verifyEmail'));
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
  }, [navigate, t]);

  const showProfileToast = (name) => {
    setToast(`${t('openProfile')} ${name}`);
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('friendsList')} ({friends.length})
          </motion.h2>

          <div className="space-y-3">
            {friends.map((user, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl shadow"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div>
                  <div className="font-semibold">{user.name} {user.flag}</div>
                  <div className="text-sm text-gray-400">{t('speaks')}: {user.lang}</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500 transition"
                  onClick={() => showProfileToast(user.name)}
                >
                  {t('viewProfile')}
                </motion.button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/home" className="text-sm text-yellow-400 underline">{t('backHome')}</Link>
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg text-sm animate-bounce">
            {toast}
          </div>
        )}
      </motion.div>
    </>
  );
}