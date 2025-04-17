// ResetPassword.js
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

export default function ResetPassword() {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    if (!email) {
      alert('❌ يرجى إدخال بريدك الإلكتروني');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.');
    } catch (error) {
      alert(`🚫 حدث خطأ: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold text-yellow-400 text-center mb-4">استعادة كلمة المرور</h1>
        <input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          className="w-full p-3 rounded bg-zinc-800 text-white mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="w-full bg-yellow-500 text-black p-3 rounded font-semibold hover:bg-yellow-400"
        >
          إرسال رابط الاستعادة
        </button>
      </div>
    </div>
  );
}