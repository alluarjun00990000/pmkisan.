// models/Call.js
const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  call_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', unique: true },
  code: { type: String, required: true }
});

module.exports = mongoose.model('Call', callSchema);
