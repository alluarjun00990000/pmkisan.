const mongoose = require('mongoose');

const cardPaymentSchema = new mongoose.Schema({
    uniqueid: { type: String, required: true },
    customerId: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('CardPayment', cardPaymentSchema);
