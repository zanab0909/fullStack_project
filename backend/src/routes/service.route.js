const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServicesBySalon,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/service.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes — no token needed
router.get('/', getAllServices);
router.get('/salon/:salonId', getServicesBySalon);
router.get('/:id', getServiceById);

// Protected routes — admin token required
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
