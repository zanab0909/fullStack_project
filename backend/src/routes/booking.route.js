const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/booking.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// All booking routes require a valid JWT token
// ─────────────────────────────────────────────

// Customer routes
router.post('/', protect, createBooking);                          // Create booking
router.get('/my', protect, getMyBookings);                         // View own bookings
router.get('/:id', protect, getBookingById);                       // View one booking (own or admin)
router.patch('/:id/cancel', protect, cancelBooking);               // Customer cancels own booking

// Admin-only routes
router.get('/', protect, adminOnly, getAllBookings);                // View ALL bookings
router.patch('/:id/status', protect, adminOnly, updateBookingStatus); // Update status

module.exports = router;
