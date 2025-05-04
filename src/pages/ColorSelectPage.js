
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple', 'Black'];

const ColorSelectPage = () => {
  const username = localStorage.getItem('username');
  const [balance, setBalance] = useState(0);
  const [winners, setWinners] = useState([]);
  const [openedColors, setOpenedColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userBalance = userData[username]?.balance || 0;
    setBalance(userBalance);
    localStorage.setItem('balance', userBalance);

    const winnersData = JSON.parse(localStorage.getItem('winnersData') || '[]');
    setWinners(winnersData.slice(-7).reverse());

    const openedColorsData = JSON.parse(localStorage.getItem('openedColorsData') || '[]');
    setOpenedColors(openedColorsData.slice(-7).reverse());

    const today = new Date().toDateString();
    const userSelections = JSON.parse(localStorage.getItem('userSelections') || '{}');
    const todaysSelections = userSelections[username]?.[today] || [];
    setSelectedColors(todaysSelections);

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const secondsUntilTomorrow = Math.floor((tomorrow - now) / 1000);
    setCountdown(secondsUntilTomorrow);

    const interval = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [username]);

  const handleColorClick = (color) => {
    if (selectedColors.includes(color)) {
      alert(`आपने पहले ही ${color} रंग चुना है।`);
      return;
    }
    setSelectedColor(color);
  };

  const confirmStake = () => {
    const amount = parseFloat(stakeAmount);
    if (!selectedColor) {
      alert("कोई रंग चयन करें।");
      return;
    }
    if (!amount || amount < 1) {
      alert("कम से कम 1 USDT डालना ज़रूरी है।");
      return;
    }
    if (amount > balance) {
      alert("आपके पास इतनी राशि नहीं है।");
      return;
    }

    const newBalance = balance - amount;
    setBalance(newBalance);

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData[username]) {
      userData[username].balance = newBalance;
      localStorage.setItem('userData', JSON.stringify(userData));
    }

    const today = new Date().toDateString();
    const userSelections = JSON.parse(localStorage.getItem('userSelections') || '{}');
    if (!userSelections[username]) userSelections[username] = {};
    if (!userSelections[username][today]) userSelections[username][today] = [];
    userSelections[username][today].push(selectedColor);
    localStorage.setItem('userSelections', JSON.stringify(userSelections));

    alert(`${selectedColor} रंग चुना गया है ✅ ${amount} USDT काटा गया।`);
    setSelectedColors([...selectedColors, selectedColor]);
    setSelectedColor(null);
    setStakeAmount('');
  };

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const goToDeposit = () => navigate('/deposit');
  const goToWithdraw = () => navigate('/withdraw');

  return (
    <div style={styles.page}>
      <div style={styles.sidePanel}>
        <h3>🏆 विजेता (7 दिन)</h3>
        {winners.map((win, index) => (
          <div key={index} style={styles.listItem}>
            {win.date} - <strong>{win.username}</strong> - {win.amount} USDT
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.balanceBox}>💰 आपकी शेष राशि: {balance.toFixed(2)} USDT</div>
        <h2 style={styles.heading}>🎨 Color Battle<br /><span style={{ fontSize: '16px' }}>カラー バトル</span></h2>
        <p>Welcome, <strong>{username}</strong></p>
        <p style={{ color: 'red' }}>⏳ Next result in: {formatTime(countdown)}</p>
        <div style={styles.colorContainer}>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              style={{
                ...styles.colorButton,
                backgroundColor: color.toLowerCase(),
                opacity: selectedColors.includes(color) ? 0.5 : 1,
                cursor: selectedColors.includes(color) ? 'not-allowed' : 'pointer',
              }}
            >
              {color}
            </button>
          ))}
        </div>
        {selectedColor && (
          <div style={{ marginTop: '20px' }}>
            <p>🎯 आपने चुना है: <strong>{selectedColor}</strong></p>
            <input
              type="number"
              placeholder="USDT amount"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              style={{ padding: '10px', width: '150px', marginRight: '10px' }}
            />
            <button onClick={confirmStake} style={styles.button}>Confirm Stake</button>
          </div>
        )}
        <div style={styles.actionButtons}>
          <button onClick={goToDeposit} style={styles.button}>Deposit</button>
          <button onClick={goToWithdraw} style={styles.button}>Withdraw</button>
        </div>
      </div>

      <div style={styles.sidePanel}>
        <h3>🎯 खुले रंग (7 दिन)</h3>
        {openedColors.map((entry, index) => (
          <div key={index} style={styles.listItem}>
            {entry.date} - <strong>{entry.color}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fef9f9, #dbe6f6, #c8d7f4)',
  },
  sidePanel: {
    width: '20%',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  card: {
    width: '50%',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
  },
  heading: {
    color: '#5b0888',
    fontWeight: 'bold',
    fontSize: '24px',
    marginBottom: '10px',
  },
  balanceBox: {
    backgroundColor: '#6a0572',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  colorContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  colorButton: {
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  listItem: {
    marginBottom: '10px',
    background: '#f1f1f1',
    padding: '8px',
    borderRadius: '5px',
  },
};

export default ColorSelectPage;
