import React, { useState } from 'react';
import CheckInOut from './CheckInOut';
import Admin from './Admin';
import './App.css';

const App = () => {
  const [showAdmin, setShowAdmin] = useState(false); // Track whether to show the admin page

  const handleAdminClick = () => {
    setShowAdmin(true); // Show the admin page
  };

  const handleBackToHome = () => {
    setShowAdmin(false); // Go back to the CheckInOut page
  };

  return (
    <div>
      {/* Show the CheckInOut page by default */}
      {!showAdmin && (
        <div>
          <CheckInOut />
          <button onClick={handleAdminClick}>Admin</button>
        </div>
      )}

      {/* Show the Admin page when showAdmin is true */}
      {showAdmin && (
        <div>
          <Admin onBack={handleBackToHome} />
        </div>
      )}
    </div>
  );
};

export default App;