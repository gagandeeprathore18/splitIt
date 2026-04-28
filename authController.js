import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

// ── Helper: generate JWT ──
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ── Validation rules (reusable arrays) ──
export const signupValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// ── POST /api/auth/signup ──
export const signup = async (req, res) => {
  try {
    // 1. Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // 2. Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Generic message prevents user enumeration
      return res.status(400).json({ error: 'Unable to create account with this email' });
    }

    // 3. Create user (password is hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Issue token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// ── POST /api/auth/login ──
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Fetch user WITH password (select: false by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Generic message — same for wrong email AND wrong password
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// ── GET /api/auth/me ──
export const getMe = async (req, res) => {
  // req.user is already hydrated by authMiddleware
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email });
};

// ── GET /api/auth/users/search?email=... ──
export const searchUsers = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || email.length < 3) {
      return res.status(400).json({ error: 'Provide at least 3 characters to search' });
    }

    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.user._id }, // Exclude self
    })
      .limit(10)
      .select('name email');

    res.json(users);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Server error during user search' });
  }
};
