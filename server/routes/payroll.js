const express = require('express');
const User = require('../models/User');
const Shift = require('../models/Shift');
const XLSX = require('xlsx');
const router = express.Router();

// Get a single user by ID
router.get('/users/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

// Update user details
router.put('/users/:userId', async (req, res) => {
    const { hourlyRate, atoBalance, travelPay, closePay, babyPay } = req.body;
  
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user fields
      user.hourlyRate = hourlyRate;
      user.atoBalance = atoBalance;
      user.travelPay = travelPay;
      user.closePay = closePay;
      user.babyPay = babyPay;
  
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });


// Generate Payroll Report in Excel
router.post('/generate-excel-report', async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const users = await User.find({});
    const payrollData = [];

    // Get business days in the payroll cycle
    const businessDays = getBusinessDays(startDate, endDate);
    const lastThreeDays = businessDays.slice(-3); // Last 3 business days

    // Format data for Excel
    for (const user of users) {
      const shifts = await Shift.find({
        userId: user._id,
        punchIn: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });

      const teacherData = {
        Name: user.name,
        'Hourly Rate': user.hourlyRate,
        Travel: user.travelPay || 0,
        Close: user.closePay || 0,
        Baby: user.babyPay || 0,
      };

      // Add daily hours
      let totalHours = 0;
      businessDays.forEach((day) => {
        const shift = shifts.find((s) => s.punchIn.toDateString() === day.toDateString());
        const hoursWorked = shift ? shift.hoursWorked : 0;

        // Default to 7.5 hours for the last 3 days if no shift is recorded
        if (lastThreeDays.includes(day)) {
          teacherData[day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })] =
            hoursWorked || 7.5;
        } else {
          teacherData[day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })] =
            hoursWorked;
        }

        totalHours += hoursWorked || (lastThreeDays.includes(day) ? 7.5 : 0);
      });

      // Add total hours, ATO balance, notes, and adjustments
      teacherData['Total Hours'] = totalHours;
      teacherData['ATO Balance'] = user.atoBalance;
      teacherData['Notes'] = shifts.map((shift) => shift.comments).join(', ');
      teacherData['Adjustments'] = ''; // Placeholder for manual adjustments

      payrollData.push(teacherData);
    }

    // Create Excel workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(payrollData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payroll Report');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename="payroll_report.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the Excel file as a response
    res.send(excelBuffer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Helper function to get business days in a payroll cycle
function getBusinessDays(startDate, endDate) {
  const businessDays = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Exclude weekends
      businessDays.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDays;
}

module.exports = router;