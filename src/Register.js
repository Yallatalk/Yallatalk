import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { saveDataToFirestore } from './firebaseHelpers'; // ✅ استيراد الحفظ

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    contact: '',
    password: '',
    language: 'العربية'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.contact, form.password);
      const user = userCredential.user;

      // إرسال رابط تفعيل البريد
      await sendEmailVerification(user);

      // حفظ الإعدادات في localStorage
      localStorage.setItem('username', form.name);
      localStorage.setItem('userSettings', JSON.stringify({
        name: form.name,
        language: form.language,
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: '',
        darkMode: false,
        notifications: true
      }));

      // ✅ حفظ في Firestore
      await saveDataToFirestore('users', {
        uid: user.uid,
        name: form.name,
        email: form.contact,
        language: form.language,
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: '',
        createdAt: new Date().toISOString(),
      });

      alert('✅ تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتفعيل الحساب.');
      navigate('/');
    } catch (error) {
      alert(`🚫 فشل التسجيل: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">تسجيل حساب جديد</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="الاسم الكامل"
            className="w-full p-3 rounded bg-zinc-800 text-white"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="contact"
            placeholder="البريد الإلكتروني"
            className="w-full p-3 rounded bg-zinc-800 text-white"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            className="w-full p-3 rounded bg-zinc-800 text-white"
            onChange={handleChange}
            required
          />
          <select
            name="language"
            className="w-full p-3 rounded bg-zinc-800 text-white"
            onChange={handleChange}
            value={form.language}
          >
            <option value="العربية">العربية</option>
            <option value="الإنجليزية">الإنجليزية</option>
            <option value="الفرنسية">الفرنسية</option>
            <option value="اليابانية">اليابانية</option>
          </select>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black p-3 rounded font-semibold hover:bg-yellow-400"
          >
            سجّل الآن
          </button>
        </form>
      </div>
    </div>
  );
}