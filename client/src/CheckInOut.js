import React, { useState, useEffect } from 'react';

const CheckInOut = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState(''); // Use user name instead of ID
  const [password, setPassword] = useState('');
  const [atoReason, setAtoReason] = useState(''); // ATO reason
  const [comments, setComments] = useState(''); // Comments for reduced time
  const [message, setMessage] = useState('');

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
        body: JSON.stringify({
          userName: selectedUserName, // Send user name instead of ID
          password,
          atoReason,
          comments,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setAtoReason('');
        setComments('');
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
          <select
            value={selectedUserName}
            onChange={(e) => setSelectedUserName(e.target.value)}
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user.name}>
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
        <label>
          ATO Reason (if applicable):
          <input
            type="text"
            value={atoReason}
            onChange={(e) => setAtoReason(e.target.value)}
          />
        </label>
        <br />
        <label>
          Comments (if applicable):
          <input
            type="text"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
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