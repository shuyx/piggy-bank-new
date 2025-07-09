import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DevTools } from './components/DevTools';
import { DialogProvider } from './contexts/DialogContext';

function App() {
  useEffect(() => {
    // 注册Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => console.log('SW registered: ', registration))
          .catch(registrationError => console.log('SW registration failed: ', registrationError));
      });
    }
  }, []);

  return (
    <DialogProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <DevTools />
      </Router>
    </DialogProvider>
  );
}

export default App;