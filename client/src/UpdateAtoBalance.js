import React, { useState } from 'react';

const UpdateAtoBalance = () => {
  const [userId, setUserId] = useState('');
  const [atoBalance, setAtoBalance] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/update-ato-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, atoBalance }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || 'An error occurred');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Update ATO Balance</h2>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          ATO Balance:
          <input
            type="number"
            value={atoBalance}
            onChange={(e) => setAtoBalance(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Update ATO Balance</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateAtoBalance;