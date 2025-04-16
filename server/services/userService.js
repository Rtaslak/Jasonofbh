// server/services/userService.js

const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * Creates a new user after checking email uniqueness and hashing the password.
 * @param {Object} params - The user data.
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} [params.role='user']
 * @returns {Promise<Object>} - The created user object (without password).
 */
async function createUser({ name, email, password, role = 'user' }) {
  const normalizedEmail = email.toLowerCase(); // ✅ Normalize email

  // Check if user already exists
  const existing = await User.findOne({ where: { email: normalizedEmail } });
  if (existing) {
    const error = new Error('Email already in use');
    error.status = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    name,
    email: normalizedEmail, // ✅ Save as lowercase
    password: hashedPassword,
    role
  });

  // Return user data without password
  const { password: _, ...safeUser } = newUser.toJSON();
  return safeUser;
}

module.exports = {
  createUser
};
