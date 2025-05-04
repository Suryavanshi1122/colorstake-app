
// WithdrawPage.js - English & Japanese Version
import React, { useState, useEffect } from 'react';

function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');
  const [myWithdrawals, setMyWithdrawals] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const allWithdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    const userWithdrawals = allWithdrawals.filter(w => w.username === username);
    setMyWithdrawals(userWithdrawals);
  }, [username]);

  const handleWithdraw = () => {
    if (!amount || !wallet) {
      alert("Please enter amount and wallet address.\n金額とウォレットアドレスを入力してください。");
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const user = userData[username];
    if (!user || user.balance < Number(amount)) {
      alert("Insufficient balance.\n残高が不足しています。");
      return;
    }

    const newWithdrawal = {
      username,
      amount,
      wallet,
      date: new Date().toLocaleString(),
      approved: false
    };

    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    withdrawals.push(newWithdrawal);
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));

    user.balance -= Number(amount);
    userData[username] = user;
    localStorage.setItem('userData', JSON.stringify(userData));

    alert("✅ Withdrawal request submitted!\n出金リクエストが送信されました！");
    setAmount('');
    setWallet('');
    setMyWithdrawals([...myWithdrawals, newWithdrawal]);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>🏧 Withdraw Page / 出金ページ</h2>
      <input
        type="number"
        placeholder="Amount (USDT) / 金額"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: '8px', margin: '10px' }}
      />
      <br />
      <input
        type="text"
        placeholder="Wallet Address / ウォレットアドレス"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        style={{ padding: '8px', margin: '10px', width: '300px' }}
      />
      <br />
      <button onClick={handleWithdraw} style={{ padding: '10px 20px', backgroundColor: '#28A745', color: 'white' }}>
        Submit Withdrawal / 出金を送信
      </button>

      <h3 style={{ marginTop: '40px' }}>📋 Your Withdrawal History / 出金履歴</h3>
      {myWithdrawals.length === 0 ? (
        <p>No withdrawal records found. / 出金履歴が見つかりません。</p>
      ) : (
        <table style={{ margin: 'auto', marginTop: '10px', borderCollapse: 'collapse' }} border="1" cellPadding="8">
          <thead>
            <tr>
              <th>📅 Date / 日付</th>
              <th>💰 Amount / 金額</th>
              <th>🔗 Wallet / ウォレット</th>
              <th>📌 Status / ステータス</th>
            </tr>
          </thead>
          <tbody>
            {myWithdrawals.map((w, i) => (
              <tr key={i}>
                <td>{w.date}</td>
                <td>{w.amount}</td>
                <td>{w.wallet}</td>
                <td>{w.approved ? "✅ Approved / 承認済み" : "⏳ Pending / 保留中"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WithdrawPage;
