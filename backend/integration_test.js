require('dotenv').config();
const http = require('http');
const db = require('./src/config/db');

// Helper to send HTTP requests to the backend server
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
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    if (data) req.write(data);
    req.end();
  });
}

const testResults = [];
function record(stepNumber, flow, description, expectedStatus, actualStatus, condition, extra) {
  const passed = condition && (expectedStatus ? actualStatus === expectedStatus : true);
  testResults.push({ stepNumber, flow, description, expectedStatus, actualStatus, passed, extra });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${flow} - Step ${stepNumber}] ${description} (Expected: ${expectedStatus}, Got: ${actualStatus})`);
  if (!passed) {
    console.error('   Failure details:', extra);
  }
}

async function runIntegration() {
  console.log('===============================================================');
  console.log('🚀 Glow Backend: Complete Integration & E2E Validation (Step 9)');
  console.log('===============================================================\n');

  // Verify server is listening
  const serverCheck = await request('GET', '/api/test');
  if (serverCheck.status !== 200) {
    console.error('❌ Server is not responding on http://localhost:3000/api/test. Aborting.');
    process.exit(1);
  }

  // Variables across steps
  const timestamp = Date.now();
  const customerEmail = `customer_${timestamp}@glowtest.com`;
  const customerPassword = 'Password123!';
  let customerToken = null;
  let customerUserId = null;
  let adminToken = null;
  let createdBookingId = null;
  let adminCreatedSalonId = null;
  let adminCreatedServiceId = null;

  // ─────────────────────────────────────────────────────────────
  // 1. CUSTOMER FLOW (Steps 1 - 11)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 1. CUSTOMER FLOW ---');

  // 1. Register a new customer
  const r1 = await request('POST', '/api/auth/register', {
    full_name: 'Integration Customer',
    email: customerEmail,
    password: customerPassword,
    phone: '0598765432',
  });
  customerUserId = r1.body.data ? r1.body.data.id : null;
  const noPasswordExposedR1 = !JSON.stringify(r1.body).includes('password_hash') && !JSON.stringify(r1.body).includes(customerPassword);
  record(1, 'CUSTOMER', 'Register new customer', 201, r1.status, r1.body.success && customerUserId && noPasswordExposedR1, r1.body);

  // 2. Login as the customer
  const r2 = await request('POST', '/api/auth/login', {
    email: customerEmail,
    password: customerPassword,
  });
  record(2, 'CUSTOMER', 'Login as the customer', 200, r2.status, r2.body.success, r2.body);

  // 3. Receive a JWT token
  customerToken = r2.body.token;
  const noPasswordExposedR2 = !JSON.stringify(r2.body).includes('password_hash');
  record(3, 'CUSTOMER', 'Receive valid JWT token with user info', 200, r2.status, !!customerToken && noPasswordExposedR2 && r2.body.data.role === 'customer', r2.body);

  // 4. Get all salons (public)
  const r4 = await request('GET', '/api/salons');
  record(4, 'CUSTOMER', 'Get all salons', 200, r4.status, r4.body.success && Array.isArray(r4.body.data) && r4.body.data.length > 0, r4.body);

  // 5. Get a specific salon
  const sampleSalonId = r4.body.data[0].id;
  const r5 = await request('GET', `/api/salons/${sampleSalonId}`);
  record(5, 'CUSTOMER', `Get a specific salon (ID: ${sampleSalonId})`, 200, r5.status, r5.body.success && r5.body.data.id === sampleSalonId, r5.body);

  // 6. Get all services (public)
  const r6 = await request('GET', '/api/services');
  record(6, 'CUSTOMER', 'Get all services', 200, r6.status, r6.body.success && Array.isArray(r6.body.data) && r6.body.data.length > 0, r6.body);

  // 7. Get services for a specific salon
  const r7 = await request('GET', `/api/services/salon/${sampleSalonId}`);
  record(7, 'CUSTOMER', `Get services for salon (ID: ${sampleSalonId})`, 200, r7.status, r7.body.success && Array.isArray(r7.body.data) && r7.body.data.length > 0, r7.body);

  // 8. Create a booking using a valid salon and service
  const sampleServiceId = r7.body.data[0].id;
  const r8 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: sampleSalonId,
      service_id: sampleServiceId,
      booking_date: '2026-11-25',
      booking_time: '14:30',
      notes: 'Customer integration test booking',
    },
    customerToken
  );
  createdBookingId = r8.body.data ? r8.body.data.id : null;
  record(8, 'CUSTOMER', 'Create a booking for valid salon and service', 201, r8.status, r8.body.success && createdBookingId && r8.body.data.status === 'pending', r8.body);

  // 9. View the customer bookings
  const r9 = await request('GET', '/api/bookings/my', null, customerToken);
  const foundBookingInList = r9.body.data && r9.body.data.some((b) => b.id === createdBookingId);
  record(9, 'CUSTOMER', 'View customer own bookings (/api/bookings/my)', 200, r9.status, r9.body.success && foundBookingInList, r9.body);

  // 10. View the booking details
  const r10 = await request('GET', `/api/bookings/${createdBookingId}`, null, customerToken);
  const noPasswordExposedR10 = !JSON.stringify(r10.body).includes('password_hash');
  record(10, 'CUSTOMER', `View booking details (ID: ${createdBookingId})`, 200, r10.status, r10.body.success && r10.body.data.id === createdBookingId && noPasswordExposedR10, r10.body);

  // 11. Cancel the booking when it is pending
  const r11 = await request('PATCH', `/api/bookings/${createdBookingId}/cancel`, {}, customerToken);
  record(11, 'CUSTOMER', `Cancel pending booking (ID: ${createdBookingId})`, 200, r11.status, r11.body.success && r11.body.message.includes('cancelled'), r11.body);

  // ─────────────────────────────────────────────────────────────
  // 2. ADMIN FLOW (Steps 12 - 21)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 2. ADMIN FLOW ---');

  // 12. Login as admin
  const r12 = await request('POST', '/api/auth/login', {
    email: 'admin@glow.com',
    password: 'admin123',
  });
  record(12, 'ADMIN', 'Login as admin', 200, r12.status, r12.body.success, r12.body);

  // 13. Receive an admin JWT token
  adminToken = r12.body.token;
  record(13, 'ADMIN', 'Receive valid admin JWT token', 200, r12.status, !!adminToken && r12.body.data.role === 'admin', r12.body);

  // 14. View all salons
  const r14 = await request('GET', '/api/salons');
  record(14, 'ADMIN', 'View all salons', 200, r14.status, r14.body.success && Array.isArray(r14.body.data), r14.body);

  // 15. Create a salon
  const r15 = await request(
    'POST',
    '/api/salons',
    {
      name: `Integration Salon ${timestamp}`,
      address: 'Olaya Street, Riyadh',
      phone: '0119998877',
      email: `salon_${timestamp}@glow.com`,
    },
    adminToken
  );
  adminCreatedSalonId = r15.body.data ? r15.body.data.id : null;
  record(15, 'ADMIN', 'Create a new salon', 201, r15.status, r15.body.success && adminCreatedSalonId, r15.body);

  // 16. Update the salon
  const r16 = await request(
    'PUT',
    `/api/salons/${adminCreatedSalonId}`,
    {
      name: `Integration Salon ${timestamp} (Updated)`,
      address: 'King Fahd Road, Riyadh',
      phone: '0119998877',
      email: `salon_updated_${timestamp}@glow.com`,
    },
    adminToken
  );
  record(16, 'ADMIN', `Update salon (ID: ${adminCreatedSalonId})`, 200, r16.status, r16.body.success && r16.body.data.name.includes('(Updated)'), r16.body);

  // 17. View all services
  const r17 = await request('GET', '/api/services');
  record(17, 'ADMIN', 'View all services', 200, r17.status, r17.body.success && Array.isArray(r17.body.data), r17.body);

  // 18. Create a service for the newly created salon
  const r18 = await request(
    'POST',
    '/api/services',
    {
      salon_id: adminCreatedSalonId,
      name: 'Signature Royal Glow',
      description: 'Exclusive hair and skin treatment',
      duration_minutes: 75,
      price: 250,
    },
    adminToken
  );
  adminCreatedServiceId = r18.body.data ? r18.body.data.id : null;
  record(18, 'ADMIN', `Create a service for salon (ID: ${adminCreatedSalonId})`, 201, r18.status, r18.body.success && adminCreatedServiceId, r18.body);

  // 19. Update the service
  const r19 = await request(
    'PUT',
    `/api/services/${adminCreatedServiceId}`,
    {
      name: 'Signature Royal Glow Deluxe',
      description: 'Enhanced exclusive treatment',
      duration_minutes: 90,
      price: 290,
    },
    adminToken
  );
  record(19, 'ADMIN', `Update service (ID: ${adminCreatedServiceId})`, 200, r19.status, r19.body.success && r19.body.data.price === 290, r19.body);

  // 20. View all bookings as admin
  const r20 = await request('GET', '/api/bookings', null, adminToken);
  record(20, 'ADMIN', 'View all bookings in the system', 200, r20.status, r20.body.success && Array.isArray(r20.body.data), r20.body);

  // Setup: create a fresh pending booking to test admin status update
  const freshBooking = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: adminCreatedSalonId,
      service_id: adminCreatedServiceId,
      booking_date: '2026-12-15',
      booking_time: '16:00',
    },
    customerToken
  );
  const freshBookingId = freshBooking.body.data ? freshBooking.body.data.id : null;

  // 21. Confirm/update a booking status
  const r21 = await request('PATCH', `/api/bookings/${freshBookingId}/status`, { status: 'confirmed' }, adminToken);
  record(21, 'ADMIN', `Confirm/update booking status (ID: ${freshBookingId})`, 200, r21.status, r21.body.success && r21.body.data.status === 'confirmed', r21.body);

  // ─────────────────────────────────────────────────────────────
  // 3. SECURITY FLOW (Steps 22 - 30)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 3. SECURITY & AUTHORIZATION FLOW ---');

  // 22. Customer attempts to access admin-only endpoints
  const r22 = await request('GET', '/api/bookings', null, customerToken);
  record(22, 'SECURITY', 'Customer attempts to access admin-only endpoint (GET /api/bookings)', 403, r22.status, r22.status === 403 && !r22.body.success, r22.body);

  // 23. Customer attempts to access another customer's booking
  // Lina's booking from previous tests
  const [linaBookings] = await db.query("SELECT b.id FROM bookings b INNER JOIN users u ON b.user_id = u.id WHERE u.email = 'lina@example.com' LIMIT 1");
  const linaBookingId = linaBookings.length > 0 ? linaBookings[0].id : 2;
  const r23 = await request('GET', `/api/bookings/${linaBookingId}`, null, customerToken);
  record(23, 'SECURITY', "Customer attempts to view another customer's booking", 403, r23.status, r23.status === 403 && !r23.body.success, r23.body);

  // 24. Request without JWT token to protected endpoint
  const r24 = await request('GET', '/api/bookings/my');
  record(24, 'SECURITY', 'Protected request without JWT token rejected', 401, r24.status, r24.status === 401 && !r24.body.success, r24.body);

  // 25. Request with invalid JWT token
  const r25 = await request('GET', '/api/bookings/my', null, 'malformed.or.tampered.token');
  record(25, 'SECURITY', 'Request with invalid/tampered JWT token rejected', 401, r25.status, r25.status === 401 && !r25.body.success, r25.body);

  // 26. Invalid salon ID on booking creation
  const r26 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: 888888,
      service_id: sampleServiceId,
      booking_date: '2026-11-20',
      booking_time: '12:00',
    },
    customerToken
  );
  record(26, 'SECURITY', 'Booking with invalid/non-existent salon ID rejected', 404, r26.status, r26.status === 404 && !r26.body.success, r26.body);

  // 27. Invalid service ID on booking creation
  const r27 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: sampleSalonId,
      service_id: 888888,
      booking_date: '2026-11-20',
      booking_time: '12:00',
    },
    customerToken
  );
  record(27, 'SECURITY', 'Booking with invalid/non-existent service ID rejected', 404, r27.status, r27.status === 404 && !r27.body.success, r27.body);

  // 28. Service does not belong to selected salon
  // adminCreatedServiceId belongs to adminCreatedSalonId, NOT to sampleSalonId
  const r28 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: sampleSalonId,
      service_id: adminCreatedServiceId,
      booking_date: '2026-11-20',
      booking_time: '12:00',
    },
    customerToken
  );
  record(28, 'SECURITY', 'Service not belonging to selected salon rejected', 404, r28.status, r28.status === 404 && !r28.body.success, r28.body);

  // 29. Invalid booking status value
  const r29 = await request(
    'PATCH',
    `/api/bookings/${freshBookingId}/status`,
    {
      status: 'invalid_status_enum',
    },
    adminToken
  );
  record(29, 'SECURITY', 'Invalid booking status enum rejected', 400, r29.status, r29.status === 400 && !r29.body.success, r29.body);

  // 30. Invalid/missing required data on booking
  const r30 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: sampleSalonId,
      // missing service_id, booking_date, booking_time
    },
    customerToken
  );
  record(30, 'SECURITY', 'Missing required fields on booking rejected', 400, r30.status, r30.status === 400 && !r30.body.success, r30.body);

  // ─────────────────────────────────────────────────────────────
  // 4. DATABASE INTEGRITY DIRECT CHECKS
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 4. DIRECT DATABASE INTEGRITY CHECKS ---');

  // DB Check 1: User correctly stored in MySQL
  const [dbUser] = await db.query('SELECT id, full_name, email, role, password_hash FROM users WHERE id = ?', [customerUserId]);
  const userValid = dbUser.length === 1 && dbUser[0].role === 'customer' && dbUser[0].password_hash.startsWith('$2a$');
  record('DB-1', 'DATABASE', 'User accurately persisted with bcrypt password hash and customer role', null, null, userValid, dbUser[0]);

  // DB Check 2: Created salon stored correctly
  const [dbSalon] = await db.query('SELECT * FROM salons WHERE id = ?', [adminCreatedSalonId]);
  const salonValid = dbSalon.length === 1 && dbSalon[0].name.includes('(Updated)');
  record('DB-2', 'DATABASE', 'Salon successfully stored and updated in MySQL', null, null, salonValid, dbSalon[0]);

  // DB Check 3: Created service linked to salon
  const [dbService] = await db.query('SELECT * FROM services WHERE id = ?', [adminCreatedServiceId]);
  const serviceValid = dbService.length === 1 && Number(dbService[0].salon_id) === Number(adminCreatedSalonId) && Number(dbService[0].price) === 290;
  record('DB-3', 'DATABASE', 'Service correctly linked via salon_id foreign key', null, null, serviceValid, dbService[0]);

  // DB Check 4: Bookings linked correctly
  const [dbBooking] = await db.query('SELECT * FROM bookings WHERE id = ?', [freshBookingId]);
  const bookingValid = dbBooking.length === 1 &&
    Number(dbBooking[0].user_id) === Number(customerUserId) &&
    Number(dbBooking[0].salon_id) === Number(adminCreatedSalonId) &&
    Number(dbBooking[0].service_id) === Number(adminCreatedServiceId) &&
    dbBooking[0].status === 'confirmed';
  record('DB-4', 'DATABASE', 'Booking correctly linked across user_id, salon_id, service_id with status updated', null, null, bookingValid, dbBooking[0]);

  // DB Check 5: Cancelled booking verified in DB
  const [dbCancelled] = await db.query('SELECT status FROM bookings WHERE id = ?', [createdBookingId]);
  const cancelValid = dbCancelled.length === 1 && dbCancelled[0].status === 'cancelled';
  record('DB-5', 'DATABASE', 'Cancelled booking persists status = "cancelled" in MySQL', null, null, cancelValid, dbCancelled[0]);

  // Clean up created test salon and service (cascade delete test)
  await db.query('DELETE FROM salons WHERE id = ?', [adminCreatedSalonId]);
  const [orphanedServices] = await db.query('SELECT id FROM services WHERE id = ?', [adminCreatedServiceId]);
  const cascadeValid = orphanedServices.length === 0;
  record('DB-6', 'DATABASE', 'ON DELETE CASCADE correctly cleans up child services and bookings', null, null, cascadeValid, { orphanedServices });

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log('\n===============================================================');
  const allPassed = testResults.every((t) => t.passed);
  const total = testResults.length;
  const passedCount = testResults.filter((t) => t.passed).length;
  const failedCount = total - passedCount;
  console.log(`TOTAL CHECKS: ${total} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log(`INTEGRATION STATUS: ${allPassed ? 'ALL 30+ TESTS PASSED SUCCESSFULLY! 🎯' : 'SOME TESTS FAILED ❌'}`);
  console.log('===============================================================\n');

  process.exit(allPassed ? 0 : 1);
}

runIntegration().catch((e) => {
  console.error('Fatal Integration Error:', e);
  process.exit(1);
});
