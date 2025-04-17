import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, getFirestore, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import Navbar from './Navbar';
import { auth } from './firebase';

export default function Posts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [file, setFile] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const fileInputRef = useRef();
  const [toast, setToast] = useState('');

  const db = getFirestore();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/');
      return;
    }

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      alert('🚫 يجب تفعيل البريد الإلكتروني أولاً.');
      navigate('/');
      return;
    }

    fetchPostsFromFirestore();
  }, [navigate]);

  const fetchPostsFromFirestore = async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    const fetchedPosts = snapshot.docs.map(doc => doc.data()).sort((a, b) => b.id - a.id);
    setPosts(fetchedPosts);
  };

  const uploadToFirebase = async (file, path) => {
    const storage = getStorage();
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleAddPost = async () => {
    if (newPost.trim() === '' && !file) return;

    let imageURL = null;
    let videoURL = null;

    if (file?.type.startsWith('image/')) {
      imageURL = await uploadToFirebase(file, 'posts/images');
    } else if (file?.type.startsWith('video/')) {
      videoURL = await uploadToFirebase(file, 'posts/videos');
    }

    const post = {
      id: Date.now(),
      content: newPost,
      image: imageURL,
      video: videoURL,
      date: new Date().toLocaleDateString(),
      likes: 0,
      comments: []
    };

    const docRef = doc(db, 'posts', post.id.toString());
    await setDoc(docRef, post);

    setPosts([post, ...posts]);
    setNewPost('');
    setFile(null);
    fileInputRef.current.value = '';
    showToast('✅ تم نشر المنشور بنجاح');
  };

  const handleLike = (id) => {
    const updated = posts.map(post => {
      if (post.id === id) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updated);
    setLikes({ ...likes, [id]: true });
  };

  const handleDelete = (id) => {
    const updated = posts.filter(post => post.id !== id);
    setPosts(updated);
    showToast('🗑️ تم حذف المنشور');
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
      const postRef = doc(db, 'posts', id.toString());
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });
    } catch (err) {
      console.error('فشل حفظ التعليق:', err);
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
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">المنشورات</h2>

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
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mb-3 text-sm text-gray-300"
          />

          <button
            onClick={handleAddPost}
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-400 mb-6"
          >
            نشر
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