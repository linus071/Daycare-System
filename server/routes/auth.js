const express = require('express');
const User = require('../models/User');
const Shift = require('../models/Shift');
const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name _id'); // Only fetch name and _id
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a new user (Admin only)
router.post('/users', async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ name, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Check In/Out
router.post('/check', async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (user.isCheckedIn) {
      // User is checking out
      const shift = await Shift.findOne({ userId, punchOut: { $exists: false } });
      if (!shift) {
        return res.status(400).json({ message: 'No active shift found' });
      }

      const punchOut = new Date();
      shift.punchOut = punchOut;
      shift.hoursWorked = (punchOut - shift.punchIn) / (1000 * 60 * 60); // Calculate hours worked
      await shift.save();

      user.totalHours += shift.hoursWorked; // Update total hours
      user.isCheckedIn = false; // Mark user as checked out
      await user.save();

      res.status(200).json({ message: 'Checked out successfully', shift, totalHours: user.totalHours });
    } else {
      // User is checking in
      const shift = new Shift({ userId, punchIn: new Date() });
      await shift.save();

      user.shifts.push(shift._id); // Add shift to user's shifts
      user.isCheckedIn = true; // Mark user as checked in
      await user.save();

      res.status(200).json({ message: 'Checked in successfully', shift });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Shifts for a User
router.get('/shifts/:userId', async (req, res) => {
  const shifts = await Shift.find({ userId: req.params.userId });
  res.status(200).json(shifts);
});

module.exports = router;