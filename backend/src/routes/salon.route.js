const express = require('express');
const router = express.Router();
const {
  getAllSalons,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
} = require('../controllers/salon.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes — no token needed
router.get('/', getAllSalons);
router.get('/:id', getSalonById);

// Protected routes — admin token required
router.post('/', protect, adminOnly, createSalon);
router.put('/:id', protect, adminOnly, updateSalon);
router.delete('/:id', protect, adminOnly, deleteSalon);

module.exports = router;
