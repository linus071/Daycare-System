const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  punchIn: { type: Date, required: true },
  punchOut: { type: Date },
  hoursWorked: { type: Number }
});

module.exports = mongoose.model('Shift', ShiftSchema);