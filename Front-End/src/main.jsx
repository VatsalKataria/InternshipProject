import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const apiBaseURL = 'http://192.168.122.12:3000';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App apiBaseURL={apiBaseURL} />
  </React.StrictMode>,
);
