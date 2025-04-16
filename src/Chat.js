import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import Navbar from './Navbar';

export default function Chat() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [
      { text: 'أهلًا!', sender: 'me', time: new Date().toLocaleTimeString() },
      { text: 'مرحبًا 👋', sender: 'them', time: new Date().toLocaleTimeString() },
    ];
  });
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('أنا');
  const [replyTo, setReplyTo] = useState(null);
  const [toast, setToast] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') navigate('/');

    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      alert('🚫 يجب تفعيل البريد الإلكتروني أولاً.');
      navigate('/');
    }

    const name = localStorage.getItem('username');
    if (name) setUsername(name);
  }, [navigate]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      text: replyTo ? `↪️ ${replyTo.text}\n${input}` : input,
      sender: 'me',
      time: new Date().toLocaleTimeString(),
    };

    let updated;
    if (editIndex !== null) {
      updated = [...messages];
      updated[editIndex] = newMsg;
      setEditIndex(null);
    } else {
      updated = [...messages, newMsg];
    }

    setMessages(updated);
    localStorage.setItem('chatMessages', JSON.stringify(updated));
    setInput('');
    setReplyTo(null);
    showToast(editIndex !== null ? '✏️ تم تعديل الرسالة' : '✅ تم إرسال الرسالة');
  };

  const handleDelete = (index) => {
    const updated = messages.filter((_, i) => i !== index);
    setMessages(updated);
    localStorage.setItem('chatMessages', JSON.stringify(updated));
    showToast('🗑️ تم حذف الرسالة');
  };

  const handleReply = (msg) => {
    setReplyTo(msg);
  };

  const handleEdit = (index) => {
    setInput(messages[index].text);
    setEditIndex(index);
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newMsg = {
        text: `<img src="${reader.result}" alt="صورة" class="max-w-xs rounded" />`,
        sender: 'me',
        time: new Date().toLocaleTimeString(),
      };
      const updated = [...messages, newMsg];
      setMessages(updated);
      localStorage.setItem('chatMessages', JSON.stringify(updated));
      showToast('📸 تم إرسال صورة');
    };
    reader.readAsDataURL(file);
  };

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-4 pt-24 relative">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">المحادثة</h2>

          <input
            type="text"
            placeholder="🔍 ابحث في الرسائل..."
            className="w-full mb-4 p-2 rounded bg-zinc-800 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-4 mb-6">
            {filteredMessages.map((msg, index) => (
              <div key={index} className="flex flex-col group relative">
                <div className={`text-sm mb-1 ${msg.sender === 'me' ? 'text-yellow-400 text-end' : 'text-gray-300'}`}>
                  {msg.sender === 'me' ? username : 'ضيف'} • {msg.time}
                </div>
                <div
                  className={`p-3 rounded-xl w-fit max-w-xs break-words ${
                    msg.sender === 'me'
                      ? 'bg-yellow-400 text-black ml-auto'
                      : 'bg-zinc-800 text-white'
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
                <div className="absolute top-0 ltr:right-0 rtl:left-0 text-xs space-x-2 hidden group-hover:flex">
                  <button onClick={() => handleReply(msg)} className="text-blue-400 hover:underline">رد</button>
                  <button onClick={() => handleEdit(index)} className="text-green-400 hover:underline">تعديل</button>
                  <button onClick={() => handleDelete(index)} className="text-red-400 hover:underline">حذف</button>
                </div>
              </div>
            ))}
          </div>

          {replyTo && (
            <div className="mb-2 p-2 bg-zinc-800 text-sm rounded">
              <span className="text-yellow-400">ردًا على:</span> {replyTo.text}
              <button onClick={() => setReplyTo(null)} className="ml-2 text-red-400 text-xs">إلغاء</button>
            </div>
          )}

          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="اكتب رسالتك..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow p-3 rounded bg-zinc-800 text-white"
            />
            <button
              onClick={handleSend}
              className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition"
            >
              {editIndex !== null ? 'تعديل' : 'إرسال'}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => fileInputRef.current.click()}
              className="text-sm text-yellow-400 underline hover:text-yellow-300"
            >
              📎 أرفق صورة
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadImage}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg text-sm animate-bounce">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}