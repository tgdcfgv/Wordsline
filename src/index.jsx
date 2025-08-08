import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainApp from './MainApp';
import { AppProvider } from './context/AppContext';
import i18n from './i18n'; // Import the i18n configuration
import { I18nextProvider } from 'react-i18next';

// Firebase配置 - 在生产环境中，这些值应该通过环境变量设置
window.__firebase_config = JSON.stringify({
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
});
window.__app_id = "rect-words-app";
window.__initial_auth_token = null;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <I18nextProvider i18n={i18n}>
        <MainApp />
      </I18nextProvider>
    </AppProvider>
  </React.StrictMode>
);
