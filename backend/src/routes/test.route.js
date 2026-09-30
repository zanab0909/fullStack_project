const express = require('express');
const router = express.Router();

// GET /api/test
// A simple route to confirm the server is running
router.get('/test', (req, res) => {
  res.json({ message: 'Glow backend is working' });
});

module.exports = router;
