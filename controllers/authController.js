
const authService = require('../services/authService');

exports.registerUser = async (req, res) => {
    const { fullname, email, password, profileImage } = req.body;

    try {
        const newUser = await authService.registerUser(fullname, email, password, profileImage);
        res.status(201).json({ message: 'User registered. Please verify your email.' });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    console.log('login user controller called');
    const { email, password } = req.body;

    try {
        const token = await authService.loginUser(email, password);
        res.status(200).json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const token = await authService.verifyOtp(email, otp);
        res.status(200).json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
    }
};
