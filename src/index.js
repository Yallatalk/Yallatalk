import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';
import Register from './Register';
import Home from './Home';
import Chat from './Chat';
import Settings from './Settings';
import Profile from './Profile';
import Friends from './Friends';
import Explore from './Explore';
import VoiceRooms from './VoiceRooms';
import LiveStream from './LiveStream';
import Notifications from './Notifications';
import Followers from './Followers';
import Community from './Community';
import Favorites from './Favorites';
import Posts from './Posts';
import LanguageSettings from './LanguageSettings';
import ResetPassword from './ResetPassword'; // ✅ استيراد صفحة الاستعادة
import About from './About'; // ✅ استيراد صفحة من نحن

import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/rooms" element={<VoiceRooms />} />
        <Route path="/live" element={<LiveStream />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/followers" element={<Followers />} />
        <Route path="/community" element={<Community />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/language-settings" element={<LanguageSettings />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} /> {/* ✅ صفحة من نحن */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);