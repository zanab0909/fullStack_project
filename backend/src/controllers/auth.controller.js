const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// POST /api/auth/register
const register = async (req, res) => {
  // 1. Extract fields from the request body
  const {
    full_name,
    email,
    password,
    phone,
    role,
    salon_name,
    salon_address,
  } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const safeRole = String(role || 'client').trim().toLowerCase();

  // 2. Validate required fields
  if (!full_name || !normalizedEmail || !password) {
    return res.status(400).json({
      success: false,
      message: 'full_name, email, and password are required.',
    });
  }

  // 3. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  if (!['client', 'salon'].includes(safeRole)) {
    return res.status(400).json({
      success: false,
      message: 'Choose either a client or salon account.',
    });
  }

  if (safeRole === 'salon' && (!salon_name?.trim() || !salon_address?.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Salon name and address are required for salon accounts.',
    });
  }

  // 4. Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  try {
    // 5. Check if the email is already registered
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered. Please use a different email.',
      });
    }

    // 6. Hash the password before saving it
    //    The number 10 is the "salt rounds" — higher = more secure but slower
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const connection = await db.getConnection();
    let result;
    let salonId = null;
    try {
      await connection.beginTransaction();
      [result] = await connection.query(
        `INSERT INTO users (full_name, email, password_hash, phone, role)
         VALUES (?, ?, ?, ?, ?)`,
        [full_name.trim(), normalizedEmail, password_hash, phone || null, safeRole]
      );

      if (safeRole === 'salon') {
        const [salonResult] = await connection.query(
          'INSERT INTO salons (name, address, phone, email) VALUES (?, ?, ?, ?)',
          [salon_name.trim(), salon_address.trim(), phone || null, normalizedEmail]
        );
        salonId = salonResult.insertId;
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    const token = jwt.sign(
      { id: result.insertId, role: safeRole },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 8. Return a success response (never return the password!)
    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      data: {
        id: result.insertId,
        full_name: full_name.trim(),
        email: normalizedEmail,
        phone: phone || null,
        role: safeRole,
        salon_id: salonId,
        salon_name: safeRole === 'salon' ? salon_name.trim() : null,
        salon_address: safeRole === 'salon' ? salon_address.trim() : null,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  // 1. Extract email and password from the request body
  const { email, password } = req.body;

  // 2. Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  try {
    // 3. Find the user by email in the database
    const [users] = await db.query(
      'SELECT id, full_name, email, password_hash, phone, role FROM users WHERE email = ?',
      [email]
    );

    // 4. If no user found, return an error
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const user = users[0];

    // 5. Compare the entered password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    let salonProfile = null;
    if (user.role === 'salon') {
      const [salons] = await db.query(
        'SELECT id, name, address FROM salons WHERE email = ? ORDER BY id DESC LIMIT 1',
        [user.email]
      );
      salonProfile = salons[0] || null;
    }

    // 6. Generate a JWT token
    //    The token contains the user's id and role (payload)
    //    It is signed with JWT_SECRET and expires in 7 days
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 7. Return the token and basic user info (never return password!)
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        salon_id: salonProfile?.id || null,
        salon_name: salonProfile?.name || null,
        salon_address: salonProfile?.address || null,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
      });
    }

    return res.status(200).json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Get profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Could not load your profile.',
    });
  }
};

module.exports = { register, login, getMe };
