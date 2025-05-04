import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (userData[username]) {
      if (userData[username].password === password) {
        localStorage.setItem('username', username);
        localStorage.setItem('userId', username);
        navigate('/color-select');
      } else {
        alert('❌ Incorrect password. Please enter the correct password.\n❌ パスワードが間違っています。正しいパスワードを入力してください。');
      }
    } else {
      alert('❌ User does not exist. Please register first.\n❌ ユーザーが存在しません。最初に登録してください。');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px', fontSize: '28px', color: '#ff7e5f' }}>
          🎮 Color Battle <br />
          <small style={{ color: '#555', fontSize: '16px' }}>カラー・バトル</small>
        </h2>
        <input
          type="text"
          placeholder="Username / ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password / パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>
          Login<br /><small>ログイン</small>
        </button>
        <p style={{ marginTop: '15px' }}>
          New user?&nbsp;
          <span onClick={() => navigate('/register')} style={styles.link}>
            Register<br /><small>新規登録</small>
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #ffecd2, #fcb69f)',
  },
  card: {
    background: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    width: '340px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff7e5f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default LoginPage;
