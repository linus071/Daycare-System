import React, { useState, useEffect } from 'react';

const CheckInOut = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId, password }),
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
      <h1>Check In/Out</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select your name:
          <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CheckInOut;