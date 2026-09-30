const express = require('express');
const dotenv = require('dotenv');
const db = require('./src/config/db');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
// Allows the server to read JSON from incoming requests
app.use(express.json());

// Enable CORS so the frontend (e.g. Vite on localhost:5173) can access the API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ── Routes ──────────────────────────────────────────────────
const testRoute     = require('./src/routes/test.route');
const authRoute     = require('./src/routes/auth.route');
const salonRoute    = require('./src/routes/salon.route');
const serviceRoute  = require('./src/routes/service.route');
const bookingRoute  = require('./src/routes/booking.route');

app.use('/api', testRoute);
app.use('/api/auth', authRoute);
app.use('/api/salons', salonRoute);
app.use('/api/services', serviceRoute);
app.use('/api/bookings', bookingRoute);

// ── Start Server ─────────────────────────────────────────────
// Test the database connection, then start listening
db.getConnection()
  .then((connection) => {
    console.log('✅ Connected to MySQL database (glow_db)');
    connection.release(); // Return the connection back to the pool

    app.listen(PORT, () => {
      console.log(`🚀 Glow server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to the database:', err.message);
    process.exit(1); // Stop the app if DB connection fails
  });
