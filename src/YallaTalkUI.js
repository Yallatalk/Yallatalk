export default function YallaTalkUI() {
  return (
    <div className="bg-black text-white min-h-screen p-4 space-y-8">
      <div className="rounded-2xl p-6 shadow-lg bg-zinc-900 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-4">YallaTalk</h1>
        <input type="text" placeholder="رقم الجوال أو البريد الإلكتروني" className="w-full mb-3 p-3 rounded bg-zinc-800 text-white" />
        <input type="password" placeholder="كلمة المرور" className="w-full mb-4 p-3 rounded bg-zinc-800 text-white" />
        <button className="w-full bg-yellow-500 text-black p-3 rounded font-semibold">تسجيل الدخول</button>
        <p className="text-center mt-4 text-sm text-gray-400">ما عندك حساب؟ <span className="text-yellow-400">سجل الآن</span></p>
      </div>
      <div className="rounded-2xl p-4 shadow bg-zinc-900 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">الرئيسية</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-zinc-800 p-3 rounded">
            <div className="text-white">أحمد 🇸🇦</div>
            <div className="text-xs text-gray-400">يتحدث: العربية</div>
          </div>
          <div className="flex items-center justify-between bg-zinc-800 p-3 rounded">
            <div className="text-white">Yuki 🇯🇵</div>
            <div className="text-xs text-gray-400">يتحدث: اليابانية</div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl p-4 shadow bg-zinc-900 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">محادثة</h2>
        <div className="space-y-2">
          <div className="bg-yellow-400 text-black p-3 rounded-l-xl rounded-tr-xl w-fit ml-auto">أهلًا!</div>
          <div className="bg-zinc-800 text-white p-3 rounded-r-xl rounded-tl-xl w-fit">مرحبًا 👋</div>
        </div>
      </div>
      <div className="rounded-2xl p-4 shadow bg-zinc-900 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">الملف الشخصي</h2>
        <div className="space-y-2 text-gray-300">
          <div>الاسم: YallaUser</div>
          <div>اللغة: العربية 🇸🇦</div>
          <div>نبذة: أحب تبادل اللغات والتعرف على ثقافات جديدة</div>
        </div>
      </div>
    </div>
  );
}