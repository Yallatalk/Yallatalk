import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
    // ✅ إعادة تحميل المسار الحالي لتحديث الترجمة بدون فقدان الصفحة
    window.location.href = location.pathname;
  };

  return (
    <nav className="bg-zinc-900 text-yellow-400 py-3 px-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">YallaTalk</div>
        <div className="flex gap-4 text-sm items-center flex-wrap">
          <Link to="/home" className="hover:underline">{t('home')}</Link>
          <Link to="/friends" className="hover:underline">{t('friends')}</Link>
          <Link to="/explore" className="hover:underline">{t('exploreUsers')}</Link>
          <Link to="/rooms" className="hover:underline">{t('rooms')}</Link>
          <Link to="/live" className="hover:underline">{t('live')}</Link>
          <Link to="/notifications" className="hover:underline">{t('notifications')}</Link>
          <Link to="/profile" className="hover:underline">{t('profile')}</Link>
          <Link to="/about" className="hover:underline">{t('about')}</Link>

          <button
            onClick={toggleLanguage}
            className="text-xs bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-400 transition"
          >
            {i18n.language === 'ar' ? 'EN' : 'عربي'}
          </button>
        </div>
      </div>
    </nav>
  );
}
