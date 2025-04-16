import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { auth } from './firebase';
import { uploadImage } from './firebaseHelpers';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [settings, setSettings] = useState({
    name: '',
    language: 'العربية',
    bio: '',
    avatar: 'https://i.pravatar.cc/150?img=1'
  });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') return navigate('/');

    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      alert(t('verifyEmail'));
      return navigate('/');
    }

    const fetchUserData = async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          name: data.name || '',
          language: data.language || 'العربية',
          bio: data.bio || '',
          avatar: data.avatar || 'https://i.pravatar.cc/150?img=1'
        });
        setDarkMode(data.darkMode || false);
        setNotifications(data.notifications !== false);
        if (data.darkMode) document.documentElement.classList.add('dark');
      }
    };

    fetchUserData();
  }, [navigate, t]);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, 'avatars/');
      setSettings(prev => ({ ...prev, avatar: url }));
    } catch (error) {
      alert(t('uploadError'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const fullSettings = {
      ...settings,
      darkMode,
      notifications,
      email: user.email,
      uid: user.uid,
    };

    try {
      await setDoc(doc(db, 'users', user.uid), fullSettings);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      alert(t('settingsSaved'));
    } catch (error) {
      alert(t('settingsError'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(t('confirmDelete'));
    if (confirmDelete) {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white py-24 px-4">
        <div className="max-w-md mx-auto bg-zinc-900 p-6 rounded-2xl shadow space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-yellow-400">{t('personalSettings')}</h2>
            <Link to="/home" className="text-sm text-yellow-400 hover:underline">{t('home')}</Link>
          </div>

          <div className="text-center">
            <img
              src={settings.avatar}
              alt="صورة البروفايل"
              className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400 object-cover"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="avatar"
              placeholder={t('avatarURL')}
              value={settings.avatar}
              onChange={handleChange}
              className="w-full p-3 rounded bg-zinc-800 text-white"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />

            <input
              type="text"
              name="name"
              placeholder={t('fullName')}
              value={settings.name}
              onChange={handleChange}
              className="w-full p-3 rounded bg-zinc-800 text-white"
            />

            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full p-3 rounded bg-zinc-800 text-white"
            >
              <option value="العربية">{t('lang_ar')}</option>
              <option value="الإنجليزية">{t('lang_en')}</option>
              <option value="اليابانية">{t('lang_jp')}</option>
              <option value="الكورية">{t('lang_kr')}</option>
            </select>

            <textarea
              name="bio"
              placeholder={t('bio')}
              value={settings.bio}
              onChange={handleChange}
              className="w-full p-3 rounded bg-zinc-800 text-white h-24"
            />

            <div className="flex items-center justify-between bg-zinc-800 p-3 rounded">
              <label htmlFor="darkMode">{t('darkMode')}</label>
              <input
                id="darkMode"
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="accent-yellow-400 scale-125"
              />
            </div>

            <div className="flex items-center justify-between bg-zinc-800 p-3 rounded">
              <label htmlFor="notifications">{t('notifications')}</label>
              <input
                id="notifications"
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="accent-yellow-400 scale-125"
              />
            </div>

            <Link
              to="/language-settings"
              className="block text-center bg-zinc-700 hover:bg-zinc-600 p-3 rounded font-semibold text-yellow-400"
            >
              {t('languageSettings')}
            </Link>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-black p-3 rounded font-semibold hover:bg-yellow-400"
            >
              {t('saveSettings')}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-600 text-white p-3 rounded font-semibold hover:bg-red-500"
            >
              {t('logout')}
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full bg-red-800 text-white p-3 rounded font-semibold hover:bg-red-700"
            >
              {t('deleteAccount')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}