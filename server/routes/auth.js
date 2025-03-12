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
  const { name, password, hourlyRate, atoBalance, travelPay, closePay, babyPay } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user with all required fields
    const user = new User({
      name,
      password,
      hourlyRate,
      atoBalance,
      travelPay,
      closePay,
      babyPay,
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Check In/Out
router.post('/check', async (req, res) => {
  const { userName, password } = req.body; // Use userName instead of userId

  try {
    // Find the user by name
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (user.isCheckedIn) {
      // User is checking out
      const shift = await Shift.findOne({ userId: user._id, punchOut: { $exists: false } });
      if (!shift) {
        return res.status(400).json({ message: 'No active shift found' });
      }

      const punchOut = new Date();
      shift.punchOut = punchOut;
      const hoursWorked = (punchOut - shift.punchIn) / (1000 * 60 * 60); // Calculate hours worked
      shift.hoursWorked = hoursWorked;

      // Check if hours worked exceed or fall below 7.5 hour
      if (hoursWorked > 7.5) {
        shift.additionalTime = hoursWorked - 7.5;
        shift.atoReason = req.body.atoReason; // Reason for additional time
        user.atoBalance += shift.additionalTime; // Update ATO balance
      } else if (hoursWorked < 7.5) {
        shift.comments = req.body.comments; // Reason for reduced time
      }

      await shift.save();
      user.totalHours += hoursWorked;
      user.isCheckedIn = false;
      await user.save();

      res.status(200).json({
        message: 'Checked out successfully',
        shift,
        totalHours: user.totalHours,
        atoBalance: user.atoBalance,
      });
    } else {
      // User is checking in
      const shift = new Shift({ userId: user._id, punchIn: new Date() });
      await shift.save();

      user.shifts.push(shift._id);
      user.isCheckedIn = true;
      await user.save();

      res.status(200).json({ message: 'Checked in successfully', shift });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get shifts for a user
router.get('/shifts/user/:userId', async (req, res) => {
  try {
    const shifts = await Shift.find({ userId: req.params.userId });
    res.status(200).json(shifts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;