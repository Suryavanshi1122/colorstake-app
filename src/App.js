import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ColorSelectPage from './pages/ColorSelectPage';
import DepositPage from './pages/DepositPage';
import AdminPanel from './pages/AdminPanel';
import WithdrawPage from './pages/WithdrawPage';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/color-select" element={<ColorSelectPage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;