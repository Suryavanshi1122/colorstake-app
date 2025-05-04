import React, { useEffect, useState } from "react";
import axios from "axios";

const WinnersPage = () => {
  const [openedColor, setOpenedColor] = useState("");
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/today-winners");
        setOpenedColor(res.data.openedColor);
        setWinners(res.data.winners); // [{ userId: 'user123', stake: 10, earned: 20 }, ...]
      } catch (err) {
        console.error("Error fetching winners data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f0f9ff", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "10px" }}>📢 आज का खुला रंग: <span style={{ color: openedColor }}>{openedColor.toUpperCase()}</span></h2>

      <h3>🎉 विजेताओं की सूची</h3>
      {winners.length === 0 ? (
        <p>कोई विजेता नहीं मिला।</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>यूज़र</th>
              <th style={thStyle}>स्टेक (USDT)</th>
              <th style={thStyle}>कमाई (USDT)</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner, index) => (
              <tr key={index}>
                <td style={tdStyle}>{winner.userId}</td>
                <td style={tdStyle}>{winner.stake}</td>
                <td style={tdStyle}>{winner.earned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#cceeff",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default WinnersPage;
