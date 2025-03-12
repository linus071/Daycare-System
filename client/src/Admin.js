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
        <button onClick={() => setActiveTab('updateAtoBalance')}>Update User Details</button>
      </div>
      {renderActiveTab()}
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
};

// AddUser component (updated)
const AddUser = () => {
  const [name, setName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0); // New field
  const [atoBalance, setAtoBalance] = useState(0); // New field
  const [travelPay, setTravelPay] = useState(0); // New field
  const [closePay, setClosePay] = useState(0); // New field
  const [babyPay, setBabyPay] = useState(0); // New field
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          password: userPassword,
          hourlyRate: Number(hourlyRate), // Convert to number
          atoBalance: Number(atoBalance),
          travelPay: Number(travelPay),
          closePay: Number(closePay),
          babyPay: Number(babyPay),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setName('');
        setUserPassword('');
        setHourlyRate(0);
        setAtoBalance(0);
        setTravelPay(0);
        setClosePay(0);
        setBabyPay(0);
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
        <label>
          Hourly Rate:
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
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
        <label>
          Travel Pay:
          <input
            type="number"
            value={travelPay}
            onChange={(e) => setTravelPay(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Close Pay:
          <input
            type="number"
            value={closePay}
            onChange={(e) => setClosePay(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Baby Pay:
          <input
            type="number"
            value={babyPay}
            onChange={(e) => setBabyPay(e.target.value)}
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