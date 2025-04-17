import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ResetPassword from './ResetPassword.jsx';
import Home from './Home.jsx';
import Chat from './Chat.jsx';
import Settings from './Settings.jsx';
import Profile from './Profile.jsx';
import Friends from './Friends.jsx';
import Explore from './Explore.jsx';
import VoiceRooms from './VoiceRooms.jsx';
import LiveStream from './LiveStream.jsx';
import Notifications from './Notifications.jsx';
import Followers from './Followers.jsx';
import Community from './Community.jsx';
import Favorites from './Favorites.jsx';
import Posts from './Posts.jsx';
import LanguageSettings from './LanguageSettings.jsx';
import About from './About.jsx';
import ProtectedRoute from './ProtectedRoute'; // ✅ حماية المسارات

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/register', '/reset-password'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <div className={shouldHideNavbar ? '' : 'pt-16'}>
        <Routes>
          {/* ✅ صفحات عامة */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ✅ صفحات محمية */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><VoiceRooms /></ProtectedRoute>} />
          <Route path="/live" element={<ProtectedRoute><LiveStream /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/followers" element={<ProtectedRoute><Followers /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
          <Route path="/language-settings" element={<ProtectedRoute><LanguageSettings /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
