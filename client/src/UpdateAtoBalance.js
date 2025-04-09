import React, { useState, useEffect } from 'react';

const UpdateAtoBalance = () => {
  const [users, setUsers] = useState([]); // List of all users
  const [selectedUser, setSelectedUser] = useState(null); // Selected user details
  const [eceNumber, setEceNumber] = useState(0); // ECE Number
  const [hourlyRate, setHourlyRate] = useState(0); // Hourly rate
  const [atoBalance, setAtoBalance] = useState(0); // ATO balance
  const [travelPay, setTravelPay] = useState(0); // Travel pay
  const [travelUnpay, setTravelUnpay] = useState(0); // New field
  const [sickPay, setSickPay] = useState(0); // New field
  const [sickUnpay, setSickUnpay] = useState(0); // New field
  const [closePay, setClosePay] = useState(0); // Close pay
  const [babyPay, setBabyPay] = useState(0); // Baby pay
  const [shifts, setShifts] = useState([]); // Shifts for the selected user
  const [message, setMessage] = useState(''); // Success/error message

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // Fetch details of the selected user and their shifts
  const handleUserSelect = async (userId) => {
    try {
      // Fetch user details
      const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`);
      const userData = await userResponse.json();
      setSelectedUser(userData);
      setEceNumber(userData.eceNumber);
      setHourlyRate(userData.hourlyRate);
      setAtoBalance(userData.atoBalance);
      setTravelPay(userData.travelPay);
      setTravelUnpay(userData.travelUnpay);
      setSickPay(userData.sickPay);
      setSickUnpay(userData.sickUnpay);
      setClosePay(userData.closePay);
      setBabyPay(userData.babyPay);

      // Fetch shifts for the selected user
      const shiftsResponse = await fetch(`http://localhost:5000/api/shifts/user/${userId}`);
      const shiftsData = await shiftsResponse.json();
      setShifts(shiftsData);
    } catch (err) {
      setMessage('An error occurred while fetching user or shift data.');
    }
  };

  // Handle form submission to update user details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eceNumber: Number(eceNumber),
          hourlyRate: Number(hourlyRate),
          atoBalance: Number(atoBalance),
          travelPay: Number(travelPay),
          travelUnpay: Number(travelUnpay),
          sickPay: Number(sickPay),
          sickUnpay: Number(sickUnpay),
          closePay: Number(closePay),
          babyPay: Number(babyPay),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('User details updated successfully');
      } else {
        setMessage(data.message || 'An error occurred');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Update User Details</h2>
      <div>
        <label>
          Select a user:
          <select onChange={(e) => handleUserSelect(e.target.value)}>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedUser && (
        <div>
          <h3>Update Details for {selectedUser.name}</h3>
          <form onSubmit={handleSubmit}>
          <label>
              ECE Number:
              <input
                type="number"
                value={eceNumber}
                onChange={(e) => setEceNumber(e.target.value)}
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
              Vacation Paid:
              <input
                type="number"
                value={travelPay}
                onChange={(e) => setTravelPay(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Vacation Unpaid:
              <input
                type="number"
                value={travelUnpay}
                onChange={(e) => setTravelUnpay(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Paid Sick:
              <input
                type="number"
                value={sickPay}
                onChange={(e) => setSickPay(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Unpaid Sick:
              <input
                type="number"
                value={sickUnpay}
                onChange={(e) => setSickUnpay(e.target.value)}
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
            <button type="submit">Update User</button>
          </form>

          {/* Display shifts in a table */}
          <h3>Shifts</h3>
          {shifts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Punch In</th>
                  <th>Punch Out</th>
                  <th>Hours Worked</th>
                  <th>Comments</th>
                  <th>ATO Reason</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift._id}>
                    <td>{new Date(shift.punchIn).toLocaleDateString()}</td>
                    <td>{new Date(shift.punchIn).toLocaleTimeString()}</td>
                    <td>
                      {shift.punchOut
                        ? new Date(shift.punchOut).toLocaleTimeString()
                        : 'Not checked out'}
                    </td>
                    <td>{shift.hoursWorked?.toFixed(2) || 'N/A'}</td>
                    <td>{shift.comments || 'N/A'}</td>
                    <td>{shift.atoReason || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No shifts found for this user.</p>
          )}
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateAtoBalance;