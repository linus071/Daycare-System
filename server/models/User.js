const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
  totalHours: { type: Number, default: 0 },
  isCheckedIn: { type: Boolean, default: false }, 
  hourlyRate: { type: Number, required: true }, // Hourly rate for payroll
  atoBalance: { type: Number, default: 0 }, // Accumulated Time Off
  travelPay: { type: Number, default: 0 }, // Additional pay for travel
  closePay: { type: Number, default: 0 }, // Additional pay for closing
  babyPay: { type: Number, default: 0 } // Additional pay for baby care
});

module.exports = mongoose.model('User', UserSchema);