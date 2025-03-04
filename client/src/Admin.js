import React, { useState } from 'react';

const Admin = ({ onBack }) => {
  const [password, setPassword] = useState(''); // Password for admin access
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if the user is authenticated
  const [name, setName] = useState(''); // Name of the new user
  const [userPassword, setUserPassword] = useState(''); // Password of the new user
  const [message, setMessage] = useState(''); // Message to display to the user

  // Handle admin login
  const handleAuth = (e) => {
    e.preventDefault();

    // Check if the password is correct
    if (password === '1212') {
      setIsAuthenticated(true); // Grant access
      setMessage(''); // Clear any previous error messages
    } else {
      setMessage('Incorrect password'); // Show error message
    }
  };

  // Handle adding a new user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a request to the back end to add a new user
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password: userPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); // Success message
        setName(''); // Clear the form
        setUserPassword('');
      } else {
        setMessage(data.message || 'An error occurred'); // Error message
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.'); // Handle network errors
    }
  };

  // If the user is not authenticated, show the login form
  if (!isAuthenticated) {
    return (
      <div>
        <h1>Admin Login</h1>
        <form onSubmit={handleAuth}>
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
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
        <button onClick={onBack}>Back to Home</button>
      </div>
    );
  }

  // If the user is authenticated, show the admin page
  return (
    <div>
      <h1>Admin Page - Add User</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add User</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
};

export default Admin;