import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from './firebase';
import Navbar from './Navbar';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function Followers() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [followed, setFollowed] = useState([]);
  const [currentUID, setCurrentUID] = useState(null);

  const followers = [
    { name: 'لين', flag: '🇸🇦' },
    { name: 'Yuta', flag: '🇯🇵' },
    { name: 'Emily', flag: '🇺🇸' },
  ];

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') return navigate('/');

    const user = auth.currentUser;
    if (!user || !user.emailVerified) {
      alert('🚫 يجب تفعيل البريد الإلكتروني أولاً.');
      return navigate('/');
    }

    setCurrentUID(user.uid);
    fetchFollowed(user.uid);
  }, [navigate]);

  const fetchFollowed = async (uid) => {
    try {
      const docRef = doc(db, 'followers', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFollowed(docSnap.data().list || []);
      }
    } catch (error) {
      console.error('فشل في جلب المتابعين:', error);
    }
  };

  const handleFollow = async (name) => {
    if (!followed.includes(name) && currentUID) {
      const updated = [...followed, name];
      setFollowed(updated);
      showToast(`✅ تابعت ${name}`);

      try {
        const docRef = doc(db, 'followers', currentUID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            list: arrayUnion(name),
          });
        } else {
          await setDoc(docRef, {
            uid: currentUID,
            list: [name],
          });
        }
      } catch (error) {
        console.error('فشل في الحفظ:', error);
      }
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
            قائمة المتابعين
          </motion.h2>

          <div className="space-y-3">
            {followers.map((follower, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900 p-4 rounded-xl shadow flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="font-semibold">{follower.name} {follower.flag}</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFollow(follower.name)}
                  disabled={followed.includes(follower.name)}
                  className={`px-3 py-1 rounded transition font-semibold ${
                    followed.includes(follower.name)
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-yellow-400 text-black hover:bg-yellow-500'
                  }`}
                >
                  {followed.includes(follower.name) ? 'تمت المتابعة' : 'متابعة'}
                </motion.button>
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