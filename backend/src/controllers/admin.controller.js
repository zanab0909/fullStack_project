const bcrypt = require('bcryptjs');
const db = require('../config/db');

const normalizeRole = (role) => {
  const cleanRole = String(role || 'client').toLowerCase();
  return ['client', 'admin', 'salon'].includes(cleanRole) ? cleanRole : 'client';
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('getAllUsers error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const createUser = async (req, res) => {
  const { full_name, email, password, phone, role } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'full_name, email, and password are required.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered.',
      });
    }

    const normalizedRole = normalizeRole(role);
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, password_hash, phone || null, normalizedRole]
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: {
        id: result.insertId,
        full_name,
        email,
        phone: phone || null,
        role: normalizedRole,
      },
    });
  } catch (error) {
    console.error('createUser error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('deleteUser error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
};
