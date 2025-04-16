import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayRemove,
  arrayUnion
} from 'firebase/firestore';

export default function Explore() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [currentUID, setCurrentUID] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') return navigate('/');

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.emailVerified) {
      alert(t('verifyEmail'));
      return navigate('/');
    }

    setCurrentUID(currentUser.uid);
    fetchUsers(currentUser.uid);
    fetchFollowing(currentUser.uid);
  }, [navigate, t]);

  const fetchUsers = async (uid) => {
    const snapshot = await getDocs(collection(db, 'users'));
    const data = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.uid !== uid);
    setUsers(data);
  };

  const fetchFollowing = async (uid) => {
    try {
      const docSnap = await getDoc(doc(db, 'following', uid));
      if (docSnap.exists()) {
        setFollowing(docSnap.data().list || []);
      }
    } catch (err) {
      console.error('فشل في جلب المتابَعين:', err);
    }
  };

  const handleFollow = async (uidToFollow) => {
    if (!currentUID) return;

    let updatedList;
    const isFollowing = following.includes(uidToFollow);

    try {
      const ref = doc(db, 'following', currentUID);

      if (isFollowing) {
        updatedList = following.filter(uid => uid !== uidToFollow);
        await updateDoc(ref, {
          list: arrayRemove(uidToFollow)
        });
        showToast(t('unfollowed'));
      } else {
        updatedList = [...following, uidToFollow];
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          await updateDoc(ref, {
            list: arrayUnion(uidToFollow)
          });
        } else {
          await setDoc(ref, { uid: currentUID, list: [uidToFollow] });
        }
        showToast(t('followed'));
      }

      setFollowing(updatedList);
    } catch (err) {
      console.error('فشل في التحديث:', err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

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
            className="text-3xl font-bold text-yellow-400 mb-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('exploreUsers')}
          </motion.h2>

          <input
            type="text"
            placeholder={`🔍 ${t('searchUser')}`}
            className="w-full mb-4 p-3 rounded bg-zinc-800 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <p className="text-sm text-gray-400 mb-4 text-center">
            {filteredUsers.length} {t('user')}{filteredUsers.length !== 1 && 'ين'}
          </p>

          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.uid}
                  className="bg-zinc-900 p-4 rounded-xl shadow flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full border border-yellow-400" />
                  <div className="flex-1">
                    <p className="font-bold text-yellow-400">{user.name}</p>
                    <p className="text-sm text-gray-400">{t('speaks')}: {user.language}</p>
                  </div>
                  <button
                    onClick={() => handleFollow(user.uid)}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      following.includes(user.uid)
                        ? 'bg-red-600 text-white hover:bg-red-500'
                        : 'bg-yellow-400 text-black hover:bg-yellow-500'
                    }`}
                  >
                    {following.includes(user.uid) ? t('unfollow') : t('follow')}
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">{t('noUsersFound')}</p>
          )}
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