import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState({
    name: '',
    language: '',
    learning: '',
    bio: '',
    avatar: '',
  });
  const [postCount, setPostCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') return navigate('/');

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.emailVerified) {
      alert(t('verifyEmail'));
      return navigate('/');
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } catch (error) {
        console.error('❌', error);
      }
    };

    fetchUserData();

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const followers = JSON.parse(localStorage.getItem('followers') || '[]');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    setPostCount(posts.length);
    setFollowersCount(followers.length);
    setFavoritesCount(favorites.length);
  }, [navigate, t]);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    setToast(t('loggedOut'));
    setTimeout(() => navigate('/'), 1500);
  };

  const handleLanguageChange = () => {
    alert(t('changeLanguageInfo'));
  };

  const handleChangeAvatar = () => {
    alert(t('changeAvatarInfo'));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white py-24 px-4 relative">
        <motion.div
          className="max-w-md mx-auto bg-zinc-900 p-6 rounded-3xl shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-yellow-400">{t('profile')}</h1>
            <Link to="/settings" className="text-sm text-yellow-400 hover:underline">✏️ {t('edit')}</Link>
          </div>

          <motion.img
            src={user.avatar || 'https://i.pravatar.cc/150?img=32'}
            alt="avatar"
            onClick={handleChangeAvatar}
            className="rounded-full w-32 h-32 mx-auto border-4 border-yellow-400 object-cover cursor-pointer hover:opacity-80 transition"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
          />

          <motion.h2
            className="text-center text-2xl font-bold text-yellow-400 mt-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {user.name || t('noName')}
          </motion.h2>

          <motion.p
            className="text-center text-sm text-gray-400 mt-1"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {user.language ? `${t('nativeLanguage')}: ${user.language}` : t('noLanguage')}
            <br />
            {user.learning && `${t('learning')}: ${user.learning}`}
          </motion.p>

          <motion.div
            className="mt-4 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-zinc-800 p-3 rounded-xl">
              {user.bio || t('noBio')}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-sm text-gray-300">
              <div className="bg-zinc-800 p-3 rounded-xl">
                {t('posts')}<br /><span className="text-yellow-400 font-bold">{postCount}</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-xl">
                {t('followers')}<br /><span className="text-yellow-400 font-bold">{followersCount}</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-xl">
                {t('favorites')}<br /><span className="text-yellow-400 font-bold">{favoritesCount}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <button
              onClick={handleLanguageChange}
              className="block w-full bg-zinc-700 text-yellow-300 py-2 rounded hover:bg-zinc-600 transition"
            >
              🌐 {t('changeLanguage')}
            </button>

            <Link
              to="/chat"
              className="inline-block bg-yellow-400 text-black font-bold px-6 py-2 rounded-full shadow hover:bg-yellow-500 transition"
            >
              {t('startChat')}
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 transition"
            >
              {t('logout')}
            </button>
          </motion.div>
        </motion.div>

        {toast && (
          <div className="fixed bottom-6 right-6 bg-yellow-400 text-black px-4 py-2 rounded shadow text-sm animate-bounce">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}