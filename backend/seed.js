const db = require('./src/config/db');
require('dotenv').config();

async function seed() {
  try {
    // Insert admin user (INSERT IGNORE skips if email already exists)
    await db.query(
      `INSERT IGNORE INTO users (full_name, email, password_hash, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Glow Admin',
        'admin@glow.com',
        '$2a$10$GuMIw/iHN92RXMc28fKVdOVkmUIhaZ0/9qofXJqqK3heZQMYe0Ega',
        '0500000000',
        'admin',
      ]
    );
    console.log('✅ Admin user inserted (email: admin@glow.com, password: admin123)');

    // Insert two sample salons
    await db.query(
      `INSERT IGNORE INTO salons (id, name, address, phone, email) VALUES
       (1, 'Glow Salon Riyadh', 'King Fahd Road, Riyadh', '0112345678', 'riyadh@glow.com'),
       (2, 'Glow Salon Jeddah', 'Tahlia Street, Jeddah', '0122345678', 'jeddah@glow.com')`
    );
    console.log('✅ Sample salons inserted.');

    process.exit(0);
  } catch (e) {
    console.error('❌ Seed error:', e.message);
    process.exit(1);
  }
}

seed();
