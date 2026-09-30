const db = require('../config/db');

// ─────────────────────────────────────────────
// GET /api/services
// Public — get all services (with salon name)
// ─────────────────────────────────────────────
const getAllServices = async (req, res) => {
  try {
    const [services] = await db.query(`
      SELECT
        sv.id,
        sv.salon_id,
        sl.name  AS salon_name,
        sv.name,
        sv.description,
        sv.duration_minutes,
        sv.price,
        sv.created_at
      FROM services sv
      INNER JOIN salons sl ON sv.salon_id = sl.id
      ORDER BY sv.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('getAllServices error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/services/salon/:salonId
// Public — get all services for a specific salon
// ─────────────────────────────────────────────
const getServicesBySalon = async (req, res) => {
  const { salonId } = req.params;

  try {
    // Check the salon exists first
    const [salons] = await db.query('SELECT id, name FROM salons WHERE id = ?', [salonId]);

    if (salons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found.',
      });
    }

    const [services] = await db.query(
      `SELECT id, salon_id, name, description, duration_minutes, price, created_at
       FROM services
       WHERE salon_id = ?
       ORDER BY name ASC`,
      [salonId]
    );

    return res.status(200).json({
      success: true,
      salon: salons[0].name,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('getServicesBySalon error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/services/:id
// Public — get a single service by its ID
// ─────────────────────────────────────────────
const getServiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const [services] = await db.query(`
      SELECT
        sv.id,
        sv.salon_id,
        sl.name  AS salon_name,
        sv.name,
        sv.description,
        sv.duration_minutes,
        sv.price,
        sv.created_at
      FROM services sv
      INNER JOIN salons sl ON sv.salon_id = sl.id
      WHERE sv.id = ?
    `, [id]);

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: services[0],
    });
  } catch (error) {
    console.error('getServiceById error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// POST /api/services
// Protected — admin only
// ─────────────────────────────────────────────
const createService = async (req, res) => {
  const { salon_id, name, description, duration_minutes, price } = req.body;

  // Validate required fields
  if (!salon_id || !name || !duration_minutes || !price) {
    return res.status(400).json({
      success: false,
      message: 'salon_id, name, duration_minutes, and price are required.',
    });
  }

  // Validate that duration and price are positive numbers
  if (Number(duration_minutes) <= 0 || Number(price) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'duration_minutes and price must be positive numbers.',
    });
  }

  try {
    // Check that the salon exists
    const [salons] = await db.query('SELECT id FROM salons WHERE id = ?', [salon_id]);

    if (salons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found. Cannot create a service for a non-existent salon.',
      });
    }

    const [result] = await db.query(
      `INSERT INTO services (salon_id, name, description, duration_minutes, price)
       VALUES (?, ?, ?, ?, ?)`,
      [salon_id, name, description || null, duration_minutes, price]
    );

    return res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: {
        id: result.insertId,
        salon_id: Number(salon_id),
        name,
        description: description || null,
        duration_minutes: Number(duration_minutes),
        price: Number(price),
      },
    });
  } catch (error) {
    console.error('createService error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// PUT /api/services/:id
// Protected — admin only
// ─────────────────────────────────────────────
const updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, duration_minutes, price } = req.body;

  // Validate required fields
  if (!name || !duration_minutes || !price) {
    return res.status(400).json({
      success: false,
      message: 'name, duration_minutes, and price are required.',
    });
  }

  // Validate that duration and price are positive numbers
  if (Number(duration_minutes) <= 0 || Number(price) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'duration_minutes and price must be positive numbers.',
    });
  }

  try {
    // Check the service exists
    const [existing] = await db.query('SELECT id FROM services WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    await db.query(
      `UPDATE services
       SET name = ?, description = ?, duration_minutes = ?, price = ?
       WHERE id = ?`,
      [name, description || null, duration_minutes, price, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: {
        id: Number(id),
        name,
        description: description || null,
        duration_minutes: Number(duration_minutes),
        price: Number(price),
      },
    });
  } catch (error) {
    console.error('updateService error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/services/:id
// Protected — admin only
// ─────────────────────────────────────────────
const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    // Check the service exists
    const [existing] = await db.query('SELECT id FROM services WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    await db.query('DELETE FROM services WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error) {
    console.error('deleteService error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

module.exports = {
  getAllServices,
  getServicesBySalon,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
