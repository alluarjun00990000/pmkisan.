const express = require('express');
const router = express.Router();
// const detailController = require('../controllers/detailController');
// const paymentController = require('../controllers/paymentController');
const userController = require('../controllers/userController'); // Ensure this path is correct
// const { post } = require('./adminRoutes');

// POST route to save user data
router.post('/entry', userController.saveUserData);


module.exports = router;