import React, { useState } from 'react';
import styles from '../styles/AuthModal.module.css';

const AuthModal = ({ onLogin, onClose }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      // Явно указываем полный URL для разработки
      const response = await fetch('http://localhost:3001/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          login: login.trim(),
          password: password.trim()
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка сервера');
      }
  
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      onLogin();
    } catch (err) {
      setError(err.message || 'Ошибка соединения');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2>Авторизация</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Логин"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;