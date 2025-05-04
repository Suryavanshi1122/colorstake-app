// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [colorStakes, setColorStakes] = useState({});
  const [lowestColor, setLowestColor] = useState('');
  const [stakeTableData, setStakeTableData] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const savedDeposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    setDeposits(savedDeposits);

    const savedWithdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    setWithdrawals(savedWithdrawals);

    const userSelections = JSON.parse(localStorage.getItem('userSelections') || '{}');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const today = new Date().toDateString();

    const stakeMap = {};
    const stakeTable = [];

    Object.entries(userSelections).forEach(([username, days]) => {
      const selections = days[today] || [];
      selections.forEach(color => {
        let stakeAmount = 0;
        if (userData[username] && userData[username].stakes && userData[username].stakes[today]) {
          const rawAmount = userData[username].stakes[today][color];
          stakeAmount = rawAmount ? parseFloat(rawAmount) : 0;
        }

        stakeMap[color] = (stakeMap[color] || 0) + stakeAmount;

        stakeTable.push({
          username,
          color,
          amount: stakeAmount
        });
      });
    });

    setColorStakes(stakeMap);
    setStakeTableData(stakeTable);

    let minColor = null;
    let minStake = Infinity;
    Object.entries(stakeMap).forEach(([color, stake]) => {
      if (stake < minStake) {
        minStake = stake;
        minColor = color;
      }
    });
    setLowestColor(minColor);
  }, []);

  const approveDeposit = (index) => {
    const updatedDeposits = [...deposits];
    const deposit = updatedDeposits[index];
    const { username, amount } = deposit;
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const currentBalance = userData[username]?.balance || 0;
    const newBalance = currentBalance + Number(amount);

    userData[username] = {
      ...userData[username],
      balance: newBalance
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    updatedDeposits.splice(index, 1);
    localStorage.setItem('deposits', JSON.stringify(updatedDeposits));
    setDeposits(updatedDeposits);

    alert(`${username} का डिपॉजिट सफलतापूर्वक वॉलेट में जोड़ा गया (${amount} USDT)`);
  };

  const approveWithdrawal = (index) => {
    const updatedWithdrawals = [...withdrawals];
    const { username, amount } = updatedWithdrawals[index];

    updatedWithdrawals.splice(index, 1);
    localStorage.setItem('withdrawals', JSON.stringify(updatedWithdrawals));
    setWithdrawals(updatedWithdrawals);

    alert(`${username} की ${amount} USDT withdrawal request को approve कर लिया गया।`);
  };

  const openSelectedColor = () => {
    if (!selectedColor) {
      alert('कृपया कोई रंग चुनें।');
      return;
    }

    const today = new Date().toDateString();
    const openedColorsData = JSON.parse(localStorage.getItem('openedColorsData') || '[]');
    openedColorsData.push({ date: today, color: selectedColor });
    localStorage.setItem('openedColorsData', JSON.stringify(openedColorsData));

    const winners = [];
    const userSelections = JSON.parse(localStorage.getItem('userSelections') || '{}');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    for (const username in userSelections) {
      const selectedToday = userSelections[username]?.[today] || [];
      if (selectedToday.includes(selectedColor)) {
        const stakeAmount = parseFloat(userData[username]?.stakes?.[today]?.[selectedColor]) || 0;
        const winAmount = stakeAmount * 2;
        userData[username].balance = (userData[username].balance || 0) + winAmount;
        winners.push({ date: today, username, amount: winAmount });
      }
    }
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('winnersData', JSON.stringify(winners));

    alert(`✅ आज का कलर '${selectedColor}' ओपन किया गया। विजेताओं को इनाम मिल गया।`);
  };

  const allColors = ['Blue', 'Orange', 'Black', 'Green', 'Red', 'Purple', 'Yellow'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧾 डिपॉज़िट रिक्वेस्ट</h2>
      <table border="1" cellPadding="8" style={{ marginBottom: '30px' }}>
        <thead>
          <tr>
            <th>यूज़रनेम</th>
            <th>राशि (USDT)</th>
            <th>प्रूफ इमेज</th>
            <th>स्वीकृति</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((d, i) => (
            <tr key={i}>
              <td>{d.username}</td>
              <td>{d.amount}</td>
              <td>
                <img
                  src={d.screenshot || d.proof || ''}
                  alt="proof"
                  style={{ width: '100px' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </td>
              <td><button onClick={() => approveDeposit(i)}>स्वीकारें</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>💸 विदड्रॉल रिक्वेस्ट</h2>
      <table border="1" cellPadding="8" style={{ marginBottom: '30px' }}>
        <thead>
          <tr>
            <th>यूज़रनेम</th>
            <th>वॉलेट</th>
            <th>राशि (USDT)</th>
            <th>स्वीकृति</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w, i) => (
            <tr key={i}>
              <td>{w.username}</td>
              <td>{w.wallet || 'N/A'}</td>
              <td>{w.amount}</td>
              <td><button onClick={() => approveWithdrawal(i)}>स्वीकारें</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>📊 आज का कलर स्टेक डेटा</h2>
      <table border="1" cellPadding="8" style={{ marginBottom: '30px' }}>
        <thead>
          <tr>
            <th>यूज़रनेम</th>
            <th>चुना गया रंग</th>
            <th>स्टेक राशि (USDT)</th>
          </tr>
        </thead>
        <tbody>
          {stakeTableData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.username}</td>
              <td>{entry.color}</td>
              <td>{entry.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px' }}>🎨 किसी भी रंग को आज के लिए खोलें (Manual)</h2>
      {lowestColor && (
        <p style={{ fontWeight: 'bold', fontSize: '18px', color: 'darkgreen' }}>
          📉 आज सबसे कम स्टेक वाला रंग: <span style={{ color: 'crimson' }}>{lowestColor}</span> ({colorStakes[lowestColor]?.toFixed(2) || '0.00'} USDT)
        </p>
      )}
      <table border="1" cellPadding="10" style={{ marginTop: '10px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>रंग</th>
            <th>कुल स्टेक (USDT)</th>
            <th>चुनें</th>
          </tr>
        </thead>
        <tbody>
          {allColors.map(color => (
            <tr key={color} style={{ backgroundColor: color === lowestColor ? '#e6ffe6' : 'white' }}>
              <td>{color}</td>
              <td>{colorStakes[color]?.toFixed(2) || '0.00'}</td>
              <td>
                <button
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: selectedColor === color ? '#007bff' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  {selectedColor === color ? 'चुना गया' : 'चुनें'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={openSelectedColor}
        style={{ marginTop: '20px', backgroundColor: 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px' }}
      >
        ✅ चुने गए रंग को खोलें ({selectedColor || 'कोई नहीं'})
      </button>
    </div>
  );
};

export default AdminPanel;
