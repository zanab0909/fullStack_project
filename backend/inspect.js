require('dotenv').config();
const db = require('./src/config/db');

async function inspectBookings() {
  try {
    // bookings table structure
    const [cols] = await db.query('DESCRIBE bookings');
    console.log('\n=== bookings table columns ===');
    cols.forEach(c =>
      console.log(` - ${c.Field} | ${c.Type} | NULL: ${c.Null} | Key: ${c.Key} | Default: ${c.Default}`)
    );

    // Foreign keys on bookings
    const [fks] = await db.query(`
      SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = 'glow_db'
        AND TABLE_NAME = 'bookings'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    console.log('\n=== bookings Foreign Keys ===');
    console.log(JSON.stringify(fks, null, 2));

    // Users table structure
    const [ucols] = await db.query('DESCRIBE users');
    console.log('\n=== users table columns ===');
    ucols.forEach(c =>
      console.log(` - ${c.Field} | ${c.Type} | NULL: ${c.Null} | Key: ${c.Key} | Default: ${c.Default}`)
    );

    // Existing users
    const [users] = await db.query('SELECT id, full_name, email, role FROM users');
    console.log('\n=== Existing Users ===');
    console.log(JSON.stringify(users, null, 2));

    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

inspectBookings();
