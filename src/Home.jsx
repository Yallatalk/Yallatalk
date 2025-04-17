import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from './firebase';
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [username, setUsername] = useState('');
  const [toast, setToast] = useState('');
  const [followed, setFollowed] = useState(() => {
    const saved = localStorage.getItem('followedUsers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') return navigate('/');

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.emailVerified) {
      alert(t('verifyEmail'));
      return navigate('/');
    }

    const name = localStorage.getItem('username');
    if (name) setUsername(name);
  }, [navigate, t]);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleFollow = (name) => {
    if (!followed.includes(name)) {
      const updated = [...followed, name];
      setFollowed(updated);
      localStorage.setItem('followedUsers', JSON.stringify(updated));
      showToast(`${t('followed')} ${name}`);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const users = [
    { name: "أحمد", flag: "🇸🇦", lang: t('lang_ar') },
    { name: "Yuki", flag: "🇯🇵", lang: t('lang_jp') },
    { name: "Sofia", flag: "🇪🇸", lang: t('lang_es') },
    { name: "Alex", flag: "🇺🇸", lang: t('lang_en') },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.lang.includes(search)
  );

  return (
    <>
      <Navbar />
      <motion.div className="min-h-screen bg-black text-white py-24 px-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-yellow-400">
              {t('welcome')}, {username || t('user')} 👋
            </h2>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition"
            >
              {t('logout')}
            </button>
          </div>

          <input
            type="text"
            placeholder={t('searchUser')}
            className="w-full mb-6 p-3 rounded bg-zinc-800 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-3">
            {filteredUsers.map((user, index) => (
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
                <div className="flex gap-2">
                  <Link
                    to="/chat"
                    className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    {t('chat')}
                  </Link>
                  <button
                    onClick={() => handleFollow(user.name)}
                    disabled={followed.includes(user.name)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-500 disabled:opacity-50"
                  >
                    {followed.includes(user.name) ? t('followedBtn') : t('follow')}
                  </button>
                </div>
              </motion.div>
            ))}
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