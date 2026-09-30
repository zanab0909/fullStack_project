require('dotenv').config();
const db = require('./src/config/db');

const salonsData = [
  {
    id: 1,
    name: 'Luna Beauty Lounge',
    address: 'Al Ashar · Basra, Iraq',
    phone: '07801234567',
    email: 'luna@glow.com',
  },
  {
    id: 2,
    name: 'Glow Beauty Studio',
    address: 'Al Jubaila · Basra, Iraq',
    phone: '07802345678',
    email: 'glow.studio@glow.com',
  },
  {
    id: 3,
    name: 'Velvet Beauty House',
    address: 'Al Qibla · Basra, Iraq',
    phone: '07803456789',
    email: 'velvet@glow.com',
  },
  {
    id: 4,
    name: 'Maison de Beauté',
    address: 'Al Ashar · Basra, Iraq',
    phone: '07804567890',
    email: 'maison@glow.com',
  },
  {
    id: 5,
    name: 'Aura Hair & Spa',
    address: 'Al Jubaila · Basra, Iraq',
    phone: '07805678901',
    email: 'aura@glow.com',
  },
  {
    id: 6,
    name: 'Elysian Bridal & Beauty',
    address: 'Al Qibla · Basra, Iraq',
    phone: '07806789012',
    email: 'elysian@glow.com',
  },
  {
    id: 7,
    name: 'Opulence Glamour Lounge',
    address: 'Al Ashar · Basra, Iraq',
    phone: '07807890123',
    email: 'opulence@glow.com',
  },
  {
    id: 8,
    name: 'Silk & Stone Luxury Spa',
    address: 'Al Jubaila · Basra, Iraq',
    phone: '07808901234',
    email: 'silkstone@glow.com',
  },
];

const serviceTemplates = [
  // Makeup
  { name: 'Soft Glam Makeup', duration: 45, price: 45.00, desc: 'Natural glowing makeup look for daytime or light events' },
  { name: 'Full Glam Makeup', duration: 60, price: 65.00, desc: 'Dramatic eyes, flawless contour, and long-lasting finish' },
  { name: 'Bridal Makeup', duration: 90, price: 150.00, desc: 'Luxury bridal transformation with premium products and lash application' },
  { name: 'Henna Makeup', duration: 45, price: 40.00, desc: 'Traditional and modern henna styling with delicate detailing' },

  // Hair
  { name: 'Hair Styling', duration: 45, price: 35.00, desc: 'Wavy, sleek, or voluminous styling tailored to your event' },
  { name: 'Hair Cut', duration: 45, price: 25.00, desc: 'Precision haircut, layering, and split-end treatment with wash' },
  { name: 'Hair Coloring', duration: 90, price: 80.00, desc: 'Full coloring, balayage, or highlights using gentle formulas' },
  { name: 'Hair Treatment', duration: 60, price: 70.00, desc: 'Deep conditioning keratin, protein, or moisture repair therapy' },
  { name: 'Bridal Hair', duration: 90, price: 120.00, desc: 'Exquisite bridal updo or Hollywood waves with veil placement' },

  // Nails
  { name: 'Classic Manicure', duration: 40, price: 25.00, desc: 'Nail shaping, cuticle care, hand scrub, and classic polish' },
  { name: 'Classic Pedicure', duration: 45, price: 30.00, desc: 'Relaxing foot soak, exfoliation, cuticle care, and polish' },
  { name: 'Gel Nails', duration: 60, price: 45.00, desc: 'Long-lasting chip-resistant gel polish with UV curing' },
  { name: 'Nail Art', duration: 50, price: 40.00, desc: 'Custom hand-painted designs, chrome powder, or embellishments' },
  { name: 'Bridal Nails', duration: 60, price: 60.00, desc: 'Elegant French ombre, pearls, or soft shimmer bridal design' },

  // Beauty Care
  { name: 'Facial', duration: 60, price: 50.00, desc: 'Hydrating and revitalizing facial treatment for radiant skin' },
  { name: 'Deep Cleansing', duration: 75, price: 65.00, desc: 'Pore purifying extraction, ultrasonic peeling, and clay mask' },
  { name: 'Skin Care', duration: 60, price: 55.00, desc: 'Targeted skin therapy addressing texture, tone, and hydration' },
  { name: 'Beauty Treatment', duration: 90, price: 90.00, desc: 'Complete skin glow treatment with collagen boosting serum' },

  // Brows & Lashes
  { name: 'Eyebrow Shaping', duration: 20, price: 15.00, desc: 'Threading or waxing for clean, defined brow arches' },
  { name: 'Eyebrow Tint', duration: 25, price: 20.00, desc: 'Semi-permanent tinting to enhance fullness and depth' },
  { name: 'Lash Lift', duration: 45, price: 40.00, desc: 'Natural lash curling and keratin nourishment' },
  { name: 'Eyelash Extensions', duration: 75, price: 75.00, desc: 'Classic or volume individual lash extensions' },

  // Massage
  { name: 'Relaxing Massage', duration: 60, price: 60.00, desc: 'Aromatherapy Swedish massage to relieve tension and stress' },
  { name: 'Full Body Massage', duration: 90, price: 95.00, desc: 'Comprehensive full body therapeutic relaxation massage' },
  { name: 'Back Massage', duration: 45, price: 45.00, desc: 'Focused pressure point massage relieving upper and lower back strain' },
  { name: 'Head Massage', duration: 30, price: 30.00, desc: 'Calming scalp massage improving circulation and releasing headaches' },
];

async function seedAll() {
  try {
    console.log('--- Starting Seeding Salons and Services ---');

    for (const salon of salonsData) {
      await db.query(
        `INSERT INTO salons (id, name, address, phone, email)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           address = VALUES(address),
           phone = VALUES(phone),
           email = VALUES(email)`,
        [salon.id, salon.name, salon.address, salon.phone, salon.email]
      );
      console.log(`✅ Salon seeded/updated: ${salon.name}`);

      // Seed all services for this salon so that ALL services are available when booking!
      for (const s of serviceTemplates) {
        // Check if service already exists for this salon by name
        const [existing] = await db.query(
          'SELECT id FROM services WHERE salon_id = ? AND name = ?',
          [salon.id, s.name]
        );

        if (existing.length === 0) {
          await db.query(
            `INSERT INTO services (salon_id, name, description, duration_minutes, price)
             VALUES (?, ?, ?, ?, ?)`,
            [salon.id, s.name, s.desc, s.duration, s.price]
          );
        } else {
          await db.query(
            `UPDATE services SET description = ?, duration_minutes = ?, price = ? WHERE id = ?`,
            [s.desc, s.duration, s.price, existing[0].id]
          );
        }
      }
      console.log(`   👉 All ${serviceTemplates.length} services seeded for salon: ${salon.name}`);
    }

    console.log('\n🎉 ALL SALONS & SERVICES HAVE BEEN SUCCESSFULLY SEEDED!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedAll();
