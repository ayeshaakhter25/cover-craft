const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      
      res.status(201).json({
        message: 'User created',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for', email);
    const user = await User.findOne({ email });
    console.log('User found:', !!user, user?._id);

    if (user) {
      const match = await user.matchPassword(password);
      console.log('Password match:', match);
      if (match) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.json({
          message: 'Login successful',
          token,
          user: { id: user._id, name: user.name, email: user.email }
        });
      }
    }

    // If we reach here, authentication failed
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };

