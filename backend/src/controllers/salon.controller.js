const db = require('../config/db');

// ─────────────────────────────────────────────
// GET /api/salons
// Public — anyone can view all salons
// ─────────────────────────────────────────────
const getAllSalons = async (req, res) => {
  try {
    const [salons] = await db.query(
      'SELECT id, name, address, phone, email, created_at FROM salons ORDER BY id ASC'
    );

    const [services] = await db.query(
      'SELECT id, salon_id, name, description, duration_minutes, price FROM services ORDER BY name ASC'
    );

    const salonsWithServices = salons.map((salon) => ({
      ...salon,
      services: services.filter((s) => s.salon_id === salon.id),
    }));

    return res.status(200).json({
      success: true,
      count: salonsWithServices.length,
      data: salonsWithServices,
    });
  } catch (error) {
    console.error('getAllSalons error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/salons/:id
// Public — anyone can view a single salon
// ─────────────────────────────────────────────
const getSalonById = async (req, res) => {
  const { id } = req.params;

  try {
    const [salons] = await db.query(
      'SELECT id, name, address, phone, email, created_at FROM salons WHERE id = ?',
      [id]
    );

    if (salons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found.',
      });
    }

    const [services] = await db.query(
      'SELECT id, salon_id, name, description, duration_minutes, price FROM services WHERE salon_id = ? ORDER BY name ASC',
      [id]
    );

    return res.status(200).json({
      success: true,
      data: {
        ...salons[0],
        services,
      },
    });
  } catch (error) {
    console.error('getSalonById error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// POST /api/salons
// Protected — admin only
// ─────────────────────────────────────────────
const createSalon = async (req, res) => {
  const { name, address, phone, email } = req.body;

  // Validate required fields
  if (!name || !address) {
    return res.status(400).json({
      success: false,
      message: 'name and address are required.',
    });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO salons (name, address, phone, email) VALUES (?, ?, ?, ?)',
      [name, address, phone || null, email || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Salon created successfully.',
      data: {
        id: result.insertId,
        name,
        address,
        phone: phone || null,
        email: email || null,
      },
    });
  } catch (error) {
    console.error('createSalon error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// PUT /api/salons/:id
// Protected — admin only
// ─────────────────────────────────────────────
const updateSalon = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email } = req.body;

  // Validate required fields
  if (!name || !address) {
    return res.status(400).json({
      success: false,
      message: 'name and address are required.',
    });
  }

  try {
    // Check if salon exists first
    const [existing] = await db.query('SELECT id FROM salons WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found.',
      });
    }

    await db.query(
      'UPDATE salons SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?',
      [name, address, phone || null, email || null, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Salon updated successfully.',
      data: { id: Number(id), name, address, phone: phone || null, email: email || null },
    });
  } catch (error) {
    console.error('updateSalon error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/salons/:id
// Protected — admin only
// ─────────────────────────────────────────────
const deleteSalon = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if salon exists first
    const [existing] = await db.query('SELECT id FROM salons WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found.',
      });
    }

    await db.query('DELETE FROM salons WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Salon deleted successfully.',
    });
  } catch (error) {
    console.error('deleteSalon error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

module.exports = {
  getAllSalons,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
};
