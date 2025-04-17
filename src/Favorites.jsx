import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from './firebase';
import Navbar from './Navbar';
import { uploadImage } from './firebaseHelpers';
import {
  getDocs,
  collection,
  query,
  orderBy,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  increment
} from 'firebase/firestore';

export default function Favorites() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const fileInputRef = useRef();
  const [toast, setToast] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') return navigate('/');

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.emailVerified) {
      alert('🚫 يجب تفعيل البريد الإلكتروني أولاً.');
      return navigate('/');
    }

    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    const q = query(collection(db, 'favorites'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
  };

  const handleAddPost = async () => {
    if (newPost.trim() === '' && !image && !video) return;

    let imageURL = null;
    let videoURL = null;

    if (image) imageURL = await uploadImage(image, 'favorites/images/');
    if (video) videoURL = await uploadImage(video, 'favorites/videos/');

    const id = Date.now().toString();
    const post = {
      content: newPost,
      image: imageURL,
      video: videoURL,
      date: new Date().toLocaleString(),
      likes: 0,
      comments: [],
    };

    await setDoc(doc(db, 'favorites', id), post);
    setPosts([{ id, ...post }, ...posts]);
    setNewPost('');
    setImage(null);
    setVideo(null);
    fileInputRef.current.value = '';
    showToast('✅ تم إضافة المنشور للمفضلة');
  };

  const handleLike = async (id) => {
    setLikes(prev => ({ ...prev, [id]: true }));

    const updated = posts.map(post => {
      if (post.id === id) return { ...post, likes: post.likes + 1 };
      return post;
    });

    setPosts(updated);

    try {
      await updateDoc(doc(db, 'favorites', id), {
        likes: increment(1)
      });
    } catch (err) {
      console.error('فشل في تحديث الإعجاب:', err);
    }
  };

  const handleDelete = async (id) => {
    const updated = posts.filter(post => post.id !== id);
    setPosts(updated);

    try {
      await deleteDoc(doc(db, 'favorites', id));
      showToast('🗑️ تم حذف المنشور من المفضلة');
    } catch (err) {
      console.error('فشل في حذف المنشور:', err);
    }
  };

  const handleComment = async (id, comment) => {
    if (!comment.trim()) return;

    const updated = { ...comments, [id]: '' };
    const postIndex = posts.findIndex(p => p.id === id);
    const updatedPosts = [...posts];
    updatedPosts[postIndex].comments = updatedPosts[postIndex].comments || [];
    updatedPosts[postIndex].comments.push(comment);
    setPosts(updatedPosts);
    setComments(updated);

    try {
      await updateDoc(doc(db, 'favorites', id), {
        comments: arrayUnion(comment),
      });
    } catch (err) {
      console.error('فشل في حفظ التعليق:', err);
    }
  };

  const showToast = (message) => {
    setToast(message);
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
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">المفضلة</h2>

          <textarea
            className="w-full p-3 rounded bg-zinc-800 text-white mb-3"
            placeholder="اكتب شيئًا..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />

          <input
            type="file"
            accept="image/*,video/mp4"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file?.type.startsWith('image/')) setImage(file);
              else if (file?.type.startsWith('video/')) setVideo(file);
            }}
            className="w-full mb-3 text-sm text-gray-300"
          />

          <button
            onClick={handleAddPost}
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-400 mb-6"
          >
            إضافة
          </button>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-zinc-900 p-4 rounded-xl shadow">
                {post.image && <img src={post.image} alt="post" className="w-full mb-3 rounded" />}
                {post.video && <video src={post.video} controls className="w-full mb-3 rounded" />}
                <p className="mb-2 whitespace-pre-line">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{post.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(post.id)}
                      disabled={likes[post.id]}
                      className="text-yellow-400 hover:scale-110 transition"
                    >
                      ❤️ {post.likes}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      حذف
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    value={comments[post.id] || ''}
                    onChange={(e) => setComments({ ...comments, [post.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleComment(post.id, comments[post.id]);
                    }}
                    placeholder="اكتب تعليق..."
                    className="w-full p-2 mt-2 bg-zinc-800 rounded text-sm"
                  />
                  {post.comments?.length > 0 && (
                    <div className="mt-2 space-y-1 text-sm text-gray-300">
                      {post.comments.map((c, i) => (
                        <div key={i} className="bg-zinc-800 p-2 rounded">💬 {c}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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