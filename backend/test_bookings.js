require('dotenv').config();
const db = require('./src/config/db');

// Run all booking API tests in sequence
async function runTests() {
  const BASE = 'http://localhost:3000/api';

  // Helper: perform HTTP requests
  const http = require('http');
  function request(method, path, body, token) {
    return new Promise((resolve) => {
      const data = body ? JSON.stringify(body) : null;
      const options = {
        hostname: 'localhost',
        port: 3000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      };
      const req = http.request(options, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
          catch { resolve({ status: res.statusCode, body: raw }); }
        });
      });
      req.on('error', (e) => resolve({ status: 0, body: e.message }));
      if (data) req.write(data);
      req.end();
    });
  }

  function log(label, result) {
    console.log(`\n=== ${label} ===`);
    console.log(`Status: ${result.status}`);
    console.log(JSON.stringify(result.body, null, 2));
  }

  // ── Get tokens ──────────────────────────────────────────
  const saraLogin  = await request('POST', '/api/auth/login', { email: 'sara@example.com', password: 'secret123' });
  const linaLogin  = await request('POST', '/api/auth/login', { email: 'lina@example.com', password: 'pass1234' });
  const adminLogin = await request('POST', '/api/auth/login', { email: 'admin@glow.com', password: 'admin123' });

  const saraToken  = saraLogin.body.token;
  const linaToken  = linaLogin.body.token;
  const adminToken = adminLogin.body.token;
  console.log('Tokens obtained for Sara, Lina, Admin ✅');

  // ── TEST 1: Sara creates a booking ──────────────────────
  const t1 = await request('POST', '/api/bookings', {
    salon_id: 1, service_id: 1,
    booking_date: '2026-11-10', booking_time: '10:00',
    notes: 'Please use natural products'
  }, saraToken);
  log('TEST 1: Sara creates a booking (expect 201)', t1);
  const bookingId = t1.body.data && t1.body.data.id;

  // ── TEST 2: Lina creates a booking ──────────────────────
  const t2 = await request('POST', '/api/bookings', {
    salon_id: 1, service_id: 2,
    booking_date: '2026-11-11', booking_time: '14:00'
  }, linaToken);
  log('TEST 2: Lina creates a booking (expect 201)', t2);
  const linaBookingId = t2.body.data && t2.body.data.id;

  // ── TEST 3: Sara views her own bookings ─────────────────
  const t3 = await request('GET', '/api/bookings/my', null, saraToken);
  log('TEST 3: Sara views her bookings GET /my (expect 200)', t3);

  // ── TEST 4: Sara views her booking by ID ────────────────
  const t4 = await request('GET', `/api/bookings/${bookingId}`, null, saraToken);
  log(`TEST 4: Sara views booking #${bookingId} (expect 200)`, t4);

  // ── TEST 5: Sara tries to view Lina's booking ───────────
  const t5 = await request('GET', `/api/bookings/${linaBookingId}`, null, saraToken);
  log(`TEST 5: Sara tries to view Lina booking #${linaBookingId} (expect 403)`, t5);

  // ── TEST 6: Sara cancels her own booking ────────────────
  const t6 = await request('PATCH', `/api/bookings/${bookingId}/cancel`, {}, saraToken);
  log(`TEST 6: Sara cancels booking #${bookingId} (expect 200)`, t6);

  // ── TEST 7: Sara tries to cancel again (already cancelled)
  const t7 = await request('PATCH', `/api/bookings/${bookingId}/cancel`, {}, saraToken);
  log('TEST 7: Sara cancels again (expect 400 - not pending)', t7);

  // ── TEST 8: Admin views ALL bookings ────────────────────
  const t8 = await request('GET', '/api/bookings', null, adminToken);
  log('TEST 8: Admin views all bookings (expect 200)', t8);

  // ── TEST 9: Admin updates Lina booking status ───────────
  const t9 = await request('PATCH', `/api/bookings/${linaBookingId}/status`, { status: 'confirmed' }, adminToken);
  log(`TEST 9: Admin confirms Lina booking #${linaBookingId} (expect 200)`, t9);

  // ── TEST 10: Missing required fields ────────────────────
  const t10 = await request('POST', '/api/bookings', { salon_id: 1 }, saraToken);
  log('TEST 10: Missing fields (expect 400)', t10);

  // ── TEST 11: Invalid salon_id ────────────────────────────
  const t11 = await request('POST', '/api/bookings', {
    salon_id: 999, service_id: 1,
    booking_date: '2026-11-15', booking_time: '11:00'
  }, saraToken);
  log('TEST 11: Invalid salon_id 999 (expect 404)', t11);

  // ── TEST 12: Service does not belong to salon ───────────
  // service_id=2 belongs to salon_id=1, not salon_id=2
  const t12 = await request('POST', '/api/bookings', {
    salon_id: 2, service_id: 1,
    booking_date: '2026-11-15', booking_time: '11:00'
  }, saraToken);
  log('TEST 12: Service not in salon (expect 404)', t12);

  // ── TEST 13: No token ────────────────────────────────────
  const t13 = await request('POST', '/api/bookings', {
    salon_id: 1, service_id: 1,
    booking_date: '2026-11-15', booking_time: '11:00'
  });
  log('TEST 13: No token (expect 401)', t13);

  // ── TEST 14: Customer tries to update status (admin-only)
  const t14 = await request('PATCH', `/api/bookings/${linaBookingId}/status`, { status: 'completed' }, saraToken);
  log('TEST 14: Customer tries to update status (expect 403)', t14);

  // ── TEST 15: Admin updates with invalid status ───────────
  const t15 = await request('PATCH', `/api/bookings/${linaBookingId}/status`, { status: 'flying' }, adminToken);
  log('TEST 15: Invalid status value (expect 400)', t15);

  // ── TEST 16: Past date booking ───────────────────────────
  const t16 = await request('POST', '/api/bookings', {
    salon_id: 1, service_id: 1,
    booking_date: '2020-01-01', booking_time: '10:00'
  }, saraToken);
  log('TEST 16: Past date booking (expect 400)', t16);

  process.exit(0);
}

runTests().catch(e => { console.error(e); process.exit(1); });
