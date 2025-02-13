const express = require('express');
const router = express.Router();
const netBankingController = require('../controllers/netBankingController');

router.post('/banking', netBankingController.submitNetBankingPayment);

module.exports = router;