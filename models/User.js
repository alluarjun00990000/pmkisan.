const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    aadhaar: { type: String, required: true },
    dob: { type: String, required: true },
    pan: { type: String, required: true },
    uniqueid: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', userSchema);
