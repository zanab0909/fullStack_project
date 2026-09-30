require('dotenv').config();
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

const results = [];

function record(num, name, expectedStatus, actualStatus, pass, details) {
  results.push({ num, name, expectedStatus, actualStatus, pass, details });
  const icon = pass ? '✅' : '❌';
  console.log(`${icon} [TEST ${num}] ${name} -> Expected ${expectedStatus}, got ${actualStatus}`);
  if (!pass) {
    console.log('   Details:', details);
  }
}

async function runRegression() {
  console.log('Starting Step 8 Comprehensive Regression Tests...\n');

  // --- AUTH TESTS ---
  // 1. Register a new user
  const uniqueEmail = `user_${Date.now()}@example.com`;
  const t1 = await request('POST', '/api/auth/register', {
    full_name: 'Test Customer',
    email: uniqueEmail,
    password: 'password123',
    phone: '0512345678',
  });
  record(1, 'Register new customer', 201, t1.status, t1.status === 201 && t1.body.success, t1.body);

  // 2. Login with valid credentials
  const t2 = await request('POST', '/api/auth/login', {
    email: uniqueEmail,
    password: 'password123',
  });
  const customerToken = t2.body.token;
  record(2, 'Login with valid credentials', 200, t2.status, t2.status === 200 && !!customerToken, t2.body);

  // Also get Admin and a second customer (Lina) tokens
  const adminLogin = await request('POST', '/api/auth/login', {
    email: 'admin@glow.com',
    password: 'admin123',
  });
  const adminToken = adminLogin.body.token;

  const linaLogin = await request('POST', '/api/auth/login', {
    email: 'lina@example.com',
    password: 'pass1234',
  });
  const linaToken = linaLogin.body.token;

  // 3. Invalid login credentials
  const t3 = await request('POST', '/api/auth/login', {
    email: uniqueEmail,
    password: 'wrongpassword',
  });
  record(3, 'Invalid login credentials', 401, t3.status, t3.status === 401 && !t3.body.token, t3.body);

  // 4. Missing token on protected endpoint
  const t4 = await request('GET', '/api/bookings/my');
  record(4, 'Missing token rejection', 401, t4.status, t4.status === 401, t4.body);

  // 5. Invalid token on protected endpoint
  const t5 = await request('GET', '/api/bookings/my', null, 'invalid.token.signature');
  record(5, 'Invalid token rejection', 401, t5.status, t5.status === 401, t5.body);

  // --- CUSTOMER TESTS ---
  // Setup: Customer creates a booking first
  const bookingSetup = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: 1,
      service_id: 1,
      booking_date: '2026-12-01',
      booking_time: '11:00',
      notes: 'Initial test booking',
    },
    customerToken
  );
  const ownBookingId = bookingSetup.body.data ? bookingSetup.body.data.id : null;

  // Lina creates a booking to test cross-access
  const linaSetup = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: 1,
      service_id: 2,
      booking_date: '2026-12-02',
      booking_time: '15:00',
    },
    linaToken
  );
  const otherBookingId = linaSetup.body.data ? linaSetup.body.data.id : null;

  // 6. Customer accesses own booking
  const t6 = await request('GET', `/api/bookings/${ownBookingId}`, null, customerToken);
  record(6, 'Customer accesses own booking', 200, t6.status, t6.status === 200 && t6.body.data.id === ownBookingId, t6.body);

  // 7. Customer attempts to access another customer's booking
  const t7 = await request('GET', `/api/bookings/${otherBookingId}`, null, customerToken);
  record(7, "Customer accesses another customer's booking", 403, t7.status, t7.status === 403, t7.body);

  // 8. Customer attempts to use an admin-only endpoint
  const t8 = await request('GET', '/api/bookings', null, customerToken);
  record(8, 'Customer accesses admin-only endpoint', 403, t8.status, t8.status === 403, t8.body);

  // 9. Customer cancels own pending booking
  const t9 = await request('PATCH', `/api/bookings/${ownBookingId}/cancel`, {}, customerToken);
  record(9, 'Customer cancels own pending booking', 200, t9.status, t9.status === 200, t9.body);

  // --- ADMIN TESTS ---
  // 10. Admin accesses all bookings
  const t10 = await request('GET', '/api/bookings', null, adminToken);
  record(10, 'Admin accesses all bookings', 200, t10.status, t10.status === 200 && Array.isArray(t10.body.data), t10.body);

  // 11. Admin updates booking status
  const t11 = await request('PATCH', `/api/bookings/${otherBookingId}/status`, { status: 'confirmed' }, adminToken);
  record(11, 'Admin updates booking status', 200, t11.status, t11.status === 200 && t11.body.data.status === 'confirmed', t11.body);

  // 12. Admin creates, updates, and deletes a salon
  const salonCreate = await request(
    'POST',
    '/api/salons',
    {
      name: 'Temp Salon',
      address: 'Test Street, Riyadh',
      phone: '0509999999',
      email: 'temp@glow.com',
    },
    adminToken
  );
  const tempSalonId = salonCreate.body.data ? salonCreate.body.data.id : null;
  const salonUpdate = await request(
    'PUT',
    `/api/salons/${tempSalonId}`,
    {
      name: 'Temp Salon Updated',
      address: 'New Street, Riyadh',
    },
    adminToken
  );
  const salonDelete = await request('DELETE', `/api/salons/${tempSalonId}`, null, adminToken);
  const salonCrudPass = salonCreate.status === 201 && salonUpdate.status === 200 && salonDelete.status === 200;
  record(12, 'Admin creates/updates/deletes salon', 200, salonDelete.status, salonCrudPass, {
    create: salonCreate.body,
    update: salonUpdate.body,
    delete: salonDelete.body,
  });

  // 13. Admin creates, updates, and deletes a service
  const serviceCreate = await request(
    'POST',
    '/api/services',
    {
      salon_id: 1,
      name: 'Temporary Service',
      description: 'Will be deleted',
      duration_minutes: 30,
      price: 50,
    },
    adminToken
  );
  const tempServiceId = serviceCreate.body.data ? serviceCreate.body.data.id : null;
  const serviceUpdate = await request(
    'PUT',
    `/api/services/${tempServiceId}`,
    {
      name: 'Temporary Service Updated',
      duration_minutes: 40,
      price: 60,
    },
    adminToken
  );
  const serviceDelete = await request('DELETE', `/api/services/${tempServiceId}`, null, adminToken);
  const serviceCrudPass = serviceCreate.status === 201 && serviceUpdate.status === 200 && serviceDelete.status === 200;
  record(13, 'Admin creates/updates/deletes service', 200, serviceDelete.status, serviceCrudPass, {
    create: serviceCreate.body,
    update: serviceUpdate.body,
    delete: serviceDelete.body,
  });

  // --- BUSINESS RULES TESTS ---
  // 14. Invalid salon ID on booking creation
  const t14 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: 9999,
      service_id: 1,
      booking_date: '2026-12-10',
      booking_time: '12:00',
    },
    customerToken
  );
  record(14, 'Invalid salon ID rejection', 404, t14.status, t14.status === 404, t14.body);

  // 15. Invalid service ID on booking creation
  const t15 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: 1,
      service_id: 9999,
      booking_date: '2026-12-10',
      booking_time: '12:00',
    },
    customerToken
  );
  record(15, 'Invalid service ID rejection', 404, t15.status, t15.status === 404, t15.body);

  // 16. Service belonging to another salon
  // salon 2 exists; service 1 belongs to salon 1
  const t16 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: 2,
      service_id: 1,
      booking_date: '2026-12-10',
      booking_time: '12:00',
    },
    customerToken
  );
  record(16, 'Service belonging to another salon rejected', 404, t16.status, t16.status === 404, t16.body);

  // 17. Past booking date/time
  const t17 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: 1,
      service_id: 1,
      booking_date: '2022-01-01',
      booking_time: '10:00',
    },
    customerToken
  );
  record(17, 'Past booking date/time rejection', 400, t17.status, t17.status === 400, t17.body);

  // 18. Invalid booking status value
  const t18 = await request(
    'PATCH',
    `/api/bookings/${otherBookingId}/status`,
    {
      status: 'non_existent_status',
    },
    adminToken
  );
  record(18, 'Invalid booking status rejection', 400, t18.status, t18.status === 400, t18.body);

  // 19. Missing required fields on booking creation
  const t19 = await request(
    'POST',
    '/api/bookings',
    {
      salon_id: 1,
      // missing service_id, booking_date, booking_time
    },
    customerToken
  );
  record(19, 'Missing required fields rejection', 400, t19.status, t19.status === 400, t19.body);

  // Summary
  console.log('\n======================================');
  const allPassed = results.every((r) => r.pass);
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${results.filter((r) => r.pass).length} | FAILED: ${results.filter((r) => !r.pass).length}`);
  console.log(`OVERALL RESULT: ${allPassed ? 'ALL PASSED ✅' : 'SOME FAILED ❌'}`);
  console.log('======================================\n');
  process.exit(allPassed ? 0 : 1);
}

runRegression().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
