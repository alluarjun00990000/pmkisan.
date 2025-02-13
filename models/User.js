const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mobile: { type: String, required: true },
    dob: { type: String, required: true },
    pan: { type: String, required: true },
    uniqueid: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', userSchema);
