import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/fontawesome';
import './index.css';
import App from './App.tsx';
import { NotificationProvider } from './shared/notifications';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider accent="brand">
      <App />
    </NotificationProvider>
  </StrictMode>,
);
