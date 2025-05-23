// backend/scripts/seedAdmin.js
const bcrypt = require('bcrypt');
const db = require('../config/db'); // נתיב לבסיס הנתונים

async function createAdminUser() {
  try {
    const email = 'shay-admin@gmail.com';
    const password = 'Sz8220738'; // שנה לסיסמה חזקה משלך
    const hashedPassword = await bcrypt.hash(password, 10);

    const [admin] = await db('users')
      .insert({
        username: 'Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        created_at: new Date()
      })
      .returning('*');

    console.log('✅ Admin user created:');
    console.log('🆔 ID:', admin.id);
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:', err.message);
    process.exit(1);
  }
}

createAdminUser();
