import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './pages/public_pages/login_components/Login';
import Unauthorized from './Unauthorized';

const root = ReactDOM.createRoot(document.getElementById('root'));
let token = "";
let user;

const login = (e) => {
  window.location.reload();
}
let temp = document.cookie.split('; ').find(row => row.startsWith('token'))
root.render(
  <React.StrictMode>
    {
        document.cookie.length < 1 || 
        document.cookie.split('; ').find(row => row.startsWith('token')) == null || 
        document.cookie.split('; ').find(row => row.startsWith('token')).split("=")[1].length < 1 ? 
        <Unauthorized /> : <App />
    } 
  </React.StrictMode>
);
