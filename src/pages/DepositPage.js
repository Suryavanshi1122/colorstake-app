
import React, { useState } from 'react';

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const walletAddress = "0xfff0f337ac990168b3d5c351bab12f886aee32c3";
  const username = localStorage.getItem('username');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !screenshot) {
      alert('कृपया राशि और स्क्रीनशॉट अपलोड करें।');
      return;
    }

    const newDeposit = {
      username,
      amount: parseFloat(amount),
      screenshot: URL.createObjectURL(screenshot),
      date: new Date().toLocaleDateString(),  // ✅ तारीख जोड़ी गई
      approved: false                         // ✅ अप्रूवल स्टेटस
    };

    const existingDeposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    existingDeposits.push(newDeposit);
    localStorage.setItem('deposits', JSON.stringify(existingDeposits));

    alert('✅ डिपॉजिट रिक्वेस्ट सबमिट हो गई है। वेरिफिकेशन के बाद वॉलेट अपडेट होगा।');

    // फॉर्म क्लियर कर दो
    setAmount('');
    setScreenshot(null);

    // Optionally: यूज़र को दूसरी पेज पर भेज सकते हैं
    // window.location.href = "/color-select";
  };

  const referralLink = `${window.location.origin}/login?ref=${localStorage.getItem('userId')}`;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>💰 Deposit Page</h2>
        <p><strong>Step 1:</strong> नीचे दिए गए USDT (BEP20) एड्रेस पर कम से कम 5 USDT भेजें:</p>
        <div style={styles.addressBox}>{walletAddress}</div>
        <img src="/qr.png" alt="QR Code" style={styles.qr} />

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <input
            type="number"
            placeholder="Amount (min 5 USDT)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files[0])}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Submit</button>
        </form>

        <div style={{ marginTop: 20 }}>
          <p><strong>🔗 अपना Referral लिंक:</strong></p>
          <div style={styles.addressBox}>{referralLink}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#f5f5f5',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '500px',
    textAlign: 'center',
  },
  addressBox: {
    background: '#eee',
    padding: '10px',
    borderRadius: '6px',
    wordBreak: 'break-all',
    fontFamily: 'monospace',
    margin: '10px 0',
  },
  qr: {
    width: '150px',
    height: '150px',
    margin: '10px auto',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '6px',
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

export default DepositPage;