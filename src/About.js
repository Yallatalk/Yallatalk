import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

export default function About() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') navigate('/');
  }, [navigate]);

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen bg-black text-white py-24 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto bg-zinc-900 p-6 rounded-2xl shadow-lg space-y-6">
          <motion.h2
            className="text-3xl font-bold text-yellow-400 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('aboutTitle')}
          </motion.h2>

          <motion.p
            className="text-gray-300 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-yellow-400 font-semibold">YallaTalk</span> {t('aboutDescription')}
          </motion.p>

          <motion.p
            className="text-gray-400 text-xs text-center pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            © 2025 YallaTalk - {t('rightsReserved')}
          </motion.p>
        </div>
      </motion.div>
    </>
  );
}