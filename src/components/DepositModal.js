import React from 'react';

const DepositModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const walletAddress = '0xYourUSDTWalletAddressHere'; // ✅ यहां अपना USDT Address डालें

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    alert('Wallet address copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Deposit USDT</h2>
        <img src="/qr-code-bingx.jpg" alt="QR Code" className="mx-auto mb-4" />
        <p className="mb-2 text-sm text-gray-700">{walletAddress}</p>
        <button onClick={handleCopy} className="bg-blue-500 text-white px-4 py-1 rounded mb-4">Copy Address</button>
        <br />
        <button onClick={onClose} className="bg-green-500 text-white px-6 py-2 rounded">Done</button>
      </div>
    </div>
  );
};

export default DepositModal;
