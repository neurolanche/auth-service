
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.registerUser = async (fullname, email, password, profileImage) => {
    let user = await User.findOne({ email });
    if (user) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
        profileImage: profileImage || 'https://robohash.org/' + email,
        otp,
    });

    await newUser.save();

    await sendEmail(
        newUser.email,
        'Verify your email',
        `Your OTP is ${otp}`
    );

    return newUser;
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
        throw new Error('Please verify your email');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
};

exports.verifyOtp = async (email, otp) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isVerified) {
        throw new Error('User already verified');
    }
    if (user.otp === otp) {
        user.isVerified = true;
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    } else {
        throw new Error('Invalid OTP');
    }
};
