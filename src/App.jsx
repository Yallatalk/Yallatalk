import { Routes, Route } from 'react-router-dom';
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
import About from './About.jsx'; // صفحة من نحن

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
