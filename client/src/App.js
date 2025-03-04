import React, { useState } from 'react';
import Login from './Login';
import PunchInOut from './PunchInOut';

const App = () => {
  const [userId, setUserId] = useState(null);

  const handleLogin = (name, password) => {
    // Authenticate user (you can add this logic later)
    setUserId('someUserId'); // Replace with actual user ID from DB
  };

  return (
    <div>
      {!userId ? <Login onLogin={handleLogin} /> : <PunchInOut userId={userId} />}
    </div>
  );
};

export default App;