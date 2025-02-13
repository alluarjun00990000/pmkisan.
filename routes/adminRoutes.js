const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET route to fetch admin phone number
router.get('/number', adminController.getAdminNumber);

// POST route to update admin phone number
router.post('/update-number', adminController.updateAdminNumber);

module.exports = router;