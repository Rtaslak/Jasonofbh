// server/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { createUser } = require('../../services/userService');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase(); // ✅ Normalize email
    const password = req.body.password;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userData } = user.toJSON();
    res.json({ user: userData, token });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email.toLowerCase(); // ✅ Normalize email
    const password = req.body.password;

    const user = await createUser({ name, email, password, role: 'Operator' });

    // Do NOT auto-sign in after registration
    res.status(201).json({ message: 'Registration successful. Please log in.' });
  } catch (err) {
    console.error('[Register Error]', err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { password: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
