import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Login';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // ✅ استيراد التنسيقات (Tailwind CSS)

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('❌ لم يتم العثور على العنصر الذي يحتوي على id="root"');
}
