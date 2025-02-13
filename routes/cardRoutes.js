const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.post('/card', cardController.submitCardPayment);

module.exports = router;