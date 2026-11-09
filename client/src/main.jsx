import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const systemFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
document.documentElement.style.fontFamily = systemFontFamily;
document.body.style.fontFamily = systemFontFamily;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
