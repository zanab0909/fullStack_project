const db = require('../config/db');

// ─────────────────────────────────────────────
// POST /api/bookings
// Protected — customer or admin
// Creates a new booking
// ─────────────────────────────────────────────
const createBooking = async (req, res) => {
  const { salon_id, service_id, booking_date, booking_time, notes } = req.body;

  // user_id comes from the JWT token — not from the request body
  const user_id = req.user.id;

  // 1. Validate required fields
  if (!salon_id || !service_id || !booking_date || !booking_time) {
    return res.status(400).json({
      success: false,
      message: 'salon_id, service_id, booking_date, and booking_time are required.',
    });
  }

  // 2. Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(booking_date)) {
    return res.status(400).json({
      success: false,
      message: 'booking_date must be in YYYY-MM-DD format (e.g. 2026-10-15).',
    });
  }

  // 3. Validate time format (HH:MM)
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(booking_time)) {
    return res.status(400).json({
      success: false,
      message: 'booking_time must be in HH:MM format (e.g. 14:30).',
    });
  }

  // 4. Prevent invalid or past booking date/time
  const selectedDateTime = new Date(`${booking_date}T${booking_time}`);
  if (isNaN(selectedDateTime.getTime()) || selectedDateTime < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Booking date and time must be a valid future date and time.',
    });
  }

  try {
    // 5. Check salon exists
    const [salons] = await db.query('SELECT id FROM salons WHERE id = ?', [salon_id]);
    if (salons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found.',
      });
    }

    // 6. Check service exists AND belongs to this salon
    const [services] = await db.query(
      'SELECT id, name, price FROM services WHERE id = ? AND salon_id = ?',
      [service_id, salon_id]
    );
    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or does not belong to the selected salon.',
      });
    }

    // 7. Insert the booking (status defaults to 'pending' from DB schema)
    const [result] = await db.query(
      `INSERT INTO bookings (user_id, salon_id, service_id, booking_date, booking_time, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, salon_id, service_id, booking_date, booking_time, notes || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully.',
      data: {
        id: result.insertId,
        user_id,
        salon_id: Number(salon_id),
        service_id: Number(service_id),
        booking_date,
        booking_time,
        status: 'pending',
        notes: notes || null,
      },
    });
  } catch (error) {
    console.error('createBooking error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/bookings/my
// Protected — customer sees only their bookings
// ─────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [bookings] = await db.query(
      `SELECT
         b.id,
         b.booking_date,
         b.booking_time,
         b.status,
         b.notes,
         b.created_at,
         sl.name  AS salon_name,
         sl.address AS salon_address,
         sv.name  AS service_name,
         sv.price AS service_price,
         sv.duration_minutes
       FROM bookings b
       INNER JOIN salons   sl ON b.salon_id   = sl.id
       INNER JOIN services sv ON b.service_id = sv.id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC, b.booking_time DESC`,
      [user_id]
    );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('getMyBookings error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/bookings/:id
// Protected — customer (own booking only) or admin
// ─────────────────────────────────────────────
const getBookingById = async (req, res) => {
  const { id } = req.params;
  const { id: tokenUserId, role } = req.user;

  try {
    const [bookings] = await db.query(
      `SELECT
         b.id,
         b.user_id,
         b.booking_date,
         b.booking_time,
         b.status,
         b.notes,
         b.created_at,
         u.full_name AS customer_name,
         u.email     AS customer_email,
         sl.name     AS salon_name,
         sl.address  AS salon_address,
         sv.name     AS service_name,
         sv.price    AS service_price,
         sv.duration_minutes
       FROM bookings b
       INNER JOIN users    u  ON b.user_id    = u.id
       INNER JOIN salons   sl ON b.salon_id   = sl.id
       INNER JOIN services sv ON b.service_id = sv.id
       WHERE b.id = ?`,
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const booking = bookings[0];

    // A customer can only view their OWN booking
    if (role === 'customer' && Number(booking.user_id) !== Number(tokenUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own bookings.',
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('getBookingById error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// PATCH /api/bookings/:id/cancel
// Protected — customer can cancel their OWN booking
//             only if status is 'pending'
// ─────────────────────────────────────────────
const cancelBooking = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const [bookings] = await db.query(
      'SELECT id, user_id, status FROM bookings WHERE id = ?',
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const booking = bookings[0];

    // Customer can only cancel their own booking
    if (Number(booking.user_id) !== Number(user_id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only cancel your own bookings.',
      });
    }

    // Can only cancel a pending booking
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking with status '${booking.status}'. Only pending bookings can be cancelled.`,
      });
    }

    await db.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
    });
  } catch (error) {
    console.error('cancelBooking error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// GET /api/bookings
// Protected — admin only — view ALL bookings
// ─────────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT
         b.id,
         b.booking_date,
         b.booking_time,
         b.status,
         b.notes,
         b.created_at,
         u.id        AS customer_id,
         u.full_name AS customer_name,
         u.email     AS customer_email,
         sl.id       AS salon_id,
         sl.name     AS salon_name,
         sv.id       AS service_id,
         sv.name     AS service_name,
         sv.price    AS service_price,
         sv.duration_minutes
       FROM bookings b
       INNER JOIN users    u  ON b.user_id    = u.id
       INNER JOIN salons   sl ON b.salon_id   = sl.id
       INNER JOIN services sv ON b.service_id = sv.id
       ORDER BY b.booking_date DESC, b.booking_time DESC`
    );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('getAllBookings error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─────────────────────────────────────────────
// PATCH /api/bookings/:id/status
// Protected — admin only — update booking status
// ─────────────────────────────────────────────
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'status is required.',
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${validStatuses.join(', ')}.`,
    });
  }

  try {
    const [bookings] = await db.query(
      'SELECT id, status FROM bookings WHERE id = ?',
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    return res.status(200).json({
      success: true,
      message: `Booking status updated to '${status}'.`,
      data: { id: Number(id), status },
    });
  } catch (error) {
    console.error('updateBookingStatus error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
};
