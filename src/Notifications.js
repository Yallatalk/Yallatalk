import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from './firebase';
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

export default function Notifications() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') return navigate('/');

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      alert(t('verifyEmail'));
      return navigate('/');
    }

    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      if (parsed.darkMode) document.documentElement.classList.add('dark');
    }
  }, [navigate, t]);

  const alerts = [
    t('notification.friendRequest'),
    t('notification.newMessages'),
    t('notification.liveStarted'),
    t('notification.newJapaneseUser'),
  ];

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen bg-black text-white py-24 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto">
          <motion.h2
            className="text-2xl font-bold text-yellow-400 mb-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('notifications')}
          </motion.h2>

          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900 p-4 rounded-xl shadow hover:bg-zinc-800 transition"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-sm text-white">{alert}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}