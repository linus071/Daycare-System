const express = require('express');
const User = require('../models/User');
const Shift = require('../models/Shift');
const router = express.Router();

// Punch In
router.post('/punch-in', async (req, res) => {
  const { userId } = req.body;
  const punchIn = new Date();
  const shift = new Shift({ userId, punchIn });
  await shift.save();
  res.status(201).json(shift);
});

// Punch Out
router.post('/punch-out', async (req, res) => {
  const { shiftId } = req.body;
  const punchOut = new Date();
  const shift = await Shift.findById(shiftId);
  shift.punchOut = punchOut;
  shift.hoursWorked = (punchOut - shift.punchIn) / (1000 * 60 * 60); // Calculate hours worked
  await shift.save();
  res.status(200).json(shift);
});

// Get Shifts for a User
router.get('/shifts/:userId', async (req, res) => {
  const shifts = await Shift.find({ userId: req.params.userId });
  res.status(200).json(shifts);
});

module.exports = router;