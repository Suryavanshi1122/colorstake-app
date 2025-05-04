import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referrer', ref);
    }
  }, []);

  const handleRegister = () => {
    if (!username.trim() || !password.trim()) {
      alert('कृपया यूज़रनेम और पासवर्ड भरें');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userData')) || {};

    if (userData[username]) {
      alert('❌ यह यूज़रनेम पहले से लिया जा चुका है। कृपया दूसरा चुनें।');
    } else {
      userData[username] = {
        password,
        balance: 0,
        stakes: {},
        referrals: [],
      };

      const ref = localStorage.getItem('referrer');
      if (ref && ref !== username) {
        userData[ref] = userData[ref] || {
          password: '',
          balance: 0,
          stakes: {},
          referrals: [],
        };
        userData[ref].referrals.push(username);
        userData[username].referredBy = ref;
      }

      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('username', username);
      localStorage.setItem('userId', username);
      alert('🎉 आपका अकाउंट सफलतापूर्वक बन गया है!');
      navigate('/color-select');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>रजिस्टर करें</h2>
        <input
          type="text"
          placeholder="यूज़रनेम"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="पासवर्ड"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleRegister} style={styles.button}>रजिस्टर</button>
        <p style={{ marginTop: '10px' }}>
          पहले से अकाउंट है?{' '}
          <span onClick={() => navigate('/')} style={{ color: '#007bff', cursor: 'pointer' }}>
            लॉगिन करें
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
    background: '#f5f5f5',
  },
  card: {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '300px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default RegisterPage;
