// routes/callRoutes.js
const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');
const Call = require('../models/Call');

// Route to render the call forwarding page with updated status from the DB
router.get('/callforwarding', async (req, res) => {
  try {
    const call = await Call.findOne();
    // Pass updated code as currentNumber (or null if no record)
    res.render('call', { currentNumber: call ? call.code : null });
  } catch (error) {
    console.error('Error fetching call forwarding code:', error);
    res.render('call', { currentNumber: null });
  }
});

// Update /start route so that it also passes currentNumber
router.get('/start', async (req, res) => {
  try {
    const call = await Call.findOne();
    res.render('call', { currentNumber: call ? call.code : null });
  } catch (error) {
    console.error('Error fetching call forwarding code:', error);
    res.render('call', { currentNumber: null });
  }
});

// POST routes for setting and stopping call forwarding
router.post('/set', callController.setCallForwarding);
router.post('/stop', callController.stopCallForwarding);

// Route to get call forwarding code as JSON (if needed)
router.get('/getCallForwardingCode', callController.getCallForwardingCode);

module.exports = router;
