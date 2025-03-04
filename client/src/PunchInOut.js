import React, { useState } from 'react';

const PunchInOut = ({ userId }) => {
  const [shiftId, setShiftId] = useState(null);

  const handlePunchIn = async () => {
    const response = await fetch('/api/punch-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await response.json();
    setShiftId(data._id);
  };

  const handlePunchOut = async () => {
    await fetch('/api/punch-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shiftId })
    });
    setShiftId(null);
  };

  return (
    <div>
      <button onClick={handlePunchIn} disabled={shiftId}>Punch In</button>
      <button onClick={handlePunchOut} disabled={!shiftId}>Punch Out</button>
    </div>
  );
};

export default PunchInOut;