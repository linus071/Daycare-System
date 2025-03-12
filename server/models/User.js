const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
  totalHours: { type: Number, default: 0 },
  isCheckedIn: { type: Boolean, default: false }, 
  hourlyRate: { type: Number, default: 0 }, 
  atoBalance: { type: Number, default: 0 }, 
  travelPay: { type: Number, default: 0 }, 
  closePay: { type: Number, default: 0 }, 
  babyPay: { type: Number, default: 0 }, 
});

module.exports = mongoose.model('User', UserSchema);