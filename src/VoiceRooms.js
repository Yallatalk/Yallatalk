import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from './firebase';
import Navbar from './Navbar';

export default function VoiceRooms() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') return navigate('/');

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      alert('🚫 يجب تفعيل البريد الإلكتروني أولاً.');
      return navigate('/');
    }

    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      if (parsed.darkMode) document.documentElement.classList.add('dark');
    }
  }, [navigate]);

  const handleCreateRoom = () => {
    setToast('🎤 تم إنشاء روم صوتي (وهمي)');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen bg-black text-white py-24 px-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md mx-auto bg-zinc-900 p-6 rounded-2xl shadow-xl text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            رومات صوتية
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            ما فيه رومات حالياً. اضغط الزر لتجرب ميزة وهمية!
          </p>

          <button
            onClick={handleCreateRoom}
            className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-400 transition"
          >
            🎙️ إنشاء روم صوتي
          </button>
        </motion.div>

        {toast && (
          <div className="fixed bottom-6 right-6 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg text-sm animate-bounce">
            {toast}
          </div>
        )}
      </motion.div>
    </>
  );
}