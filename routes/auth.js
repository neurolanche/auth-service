const express = require('express');
const { registerUser, loginUser, verifyOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);

module.exports = router;
