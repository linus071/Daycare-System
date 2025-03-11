import React, { useState } from 'react';
import PayrollReport from './PayrollReport'; // Import the PayrollReport component
import UpdateAtoBalance from './UpdateAtoBalance'; // Import the UpdateAtoBalance component

const Admin = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('addUser'); // Track the active tab

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === '1212') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  // Render the appropriate component based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'addUser':
        return <AddUser />;
      case 'payrollReport':
        return <PayrollReport />;
      case 'updateAtoBalance':
        return <UpdateAtoBalance />;
      default:
        return <AddUser />;
    }
  };

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
        <button onClick={onBack}>Back to Home</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <button onClick={() => setActiveTab('addUser')}>Add User</button>
        <button onClick={() => setActiveTab('payrollReport')}>Generate Payroll Report</button>
        <button onClick={() => setActiveTab('updateAtoBalance')}>Update ATO Balance</button>
      </div>
      {renderActiveTab()}
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
};

// AddUser component (existing functionality)
const AddUser = () => {
  const [name, setName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password: userPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setName('');
        setUserPassword('');
      } else {
        setMessage(data.message || 'An error occurred');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add User</h2>
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
    </div>
  );
};

export default Admin;