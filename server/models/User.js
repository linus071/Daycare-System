const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }]
});

module.exports = mongoose.model('User', UserSchema);