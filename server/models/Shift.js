const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  punchIn: { type: Date, required: true },
  punchOut: { type: Date },
  hoursWorked: { type: Number },
  comments: { type: String }, // Reason for reduced time
  atoReason: { type: String }, // Reason for additional time
  additionalTime: { type: Number, default: 0 } // Additional time beyond 7.5 hours
});

module.exports = mongoose.model('Shift', ShiftSchema);