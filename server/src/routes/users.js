const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const { createUser } = require('../../services/userService');

const router = express.Router();

// GET all users (excluding password)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    console.error('[User GET all error]', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('[User GET by ID error]', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// POST create new user (admin panel)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await createUser({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    console.error('[User POST error]', err);
    res.status(err.status || 500).json({ message: err.message || 'Failed to create user' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { email, password, ...rest } = req.body;

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    // Update password only if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    console.log('[User Update] Incoming data:', req.body);

    // Merge remaining fields (e.g., name, phone, role)
    Object.assign(user, rest);

    await user.save();

    const { password: _, ...safeUser } = user.toJSON();
    res.json(safeUser);
  } catch (err) {
    console.error('[User PUT error]', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.status(204).end();
  } catch (err) {
    console.error('[User DELETE error]', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
