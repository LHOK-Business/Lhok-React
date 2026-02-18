import React from 'react';
import ReactDOM from 'react-dom/client';

// Import global styles ONCE here. They apply to the whole app.
import './index.css';
import './typo.css';


import App from './App';

// potentially import functions that work globally like KPI tracking; import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
/*
  React.StrictMode is a development helper — it's invisible in production.
  It deliberately calls your components twice to help surface bugs.
  If you see effects running twice in development, this is why. Keep it. */

root.render(
  
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
